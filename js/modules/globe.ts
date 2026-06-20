import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import type { Topology } from 'topojson-specification';

let worldDataPromise: Promise<Topology> | null = null;

export const globeController = {
  initializedContainers: new Set<string>(),

  async init(containerSelector: string) {
    if (this.initializedContainers.has(containerSelector)) return;
    
    const container = document.querySelector(containerSelector);
    if (!container) return;

    this.initializedContainers.add(containerSelector);
    container.innerHTML = ''; // Clear previous if any

    const width = 320;
    const height = 320;
    
    const canvas = d3.select(container)
      .append('canvas')
      .attr('width', width * 2)
      .attr('height', height * 2)
      .style('width', `${width}px`)
      .style('height', `${height}px`)
      .style('display', 'block')
      .style('margin', '0 auto');

    const context = (canvas.node() as HTMLCanvasElement).getContext('2d');
    if (!context) return;
    
    context.scale(2, 2);

    const projection = d3.geoOrthographic()
      .scale((width / 2) - 5)
      .translate([width / 2, height / 2])
      .clipAngle(90)
      .precision(0.6);

    const path = d3.geoPath()
      .projection(projection)
      .context(context);

    try {
      if (!worldDataPromise) {
        worldDataPromise = fetch('https://unpkg.com/world-atlas@2.0.2/countries-110m.json')
          .then(res => res.json() as Promise<Topology>);
      }
      const worldData = await worldDataPromise;

      const land = topojson.feature(worldData, worldData.objects.countries as any);
      const graticule = d3.geoGraticule10();

      let rotation: [number, number, number] = [0, -10, 0];

      // Match the "premium motion" look
      const render = () => {
        rotation[0] += 0.3; // Speed of rotation
        projection.rotate(rotation);

        context.clearRect(0, 0, width, height);
        
        // 1. Sphere Outline
        context.beginPath();
        path({ type: "Sphere" });
        context.strokeStyle = "rgba(0, 0, 0, 0.1)";
        context.lineWidth = 1;
        context.stroke();

        // 2. Graticule
        context.beginPath();
        path(graticule);
        context.strokeStyle = "rgba(0, 0, 0, 0.05)";
        context.lineWidth = 1;
        context.stroke();

        // 3. Land Wireframe
        context.beginPath();
        path(land as any);
        context.strokeStyle = "rgba(0, 0, 0, 0.4)";
        context.lineWidth = 1;
        context.stroke();

        requestAnimationFrame(render);
      };

      // Start animation loop
      requestAnimationFrame(render);
      
    } catch (err) {
      console.error("Globe Wireframe Error:", err);
    }
  }
};
