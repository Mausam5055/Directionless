import audioUrl from '../../assets/audio/calm.mp3';

export const audioController = {
  init() {
    const audio = new Audio(audioUrl);
    audio.loop = true;

    const toggleBtn = document.getElementById('audio-toggle');

    if (!toggleBtn) return;

    let isPlaying = false;

    const updateIcons = () => {
      if (isPlaying) {
        toggleBtn.classList.add('is-playing');
      } else {
        toggleBtn.classList.remove('is-playing');
      }
    };

    const playAudio = async () => {
      try {
        await audio.play();
        isPlaying = true;
        updateIcons();
      } catch (err) {
        // Autoplay blocked
        isPlaying = false;
        updateIcons();
      }
    };

    const pauseAudio = () => {
      audio.pause();
      isPlaying = false;
      updateIcons();
    };

    toggleBtn.addEventListener('click', () => {
      if (isPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    });

    // Autoplay fallback: start on first user interaction anywhere
    const onFirstInteraction = () => {
      if (!isPlaying) {
        playAudio();
      }
      // Remove listeners after first interaction
      document.removeEventListener('click', onFirstInteraction);
      document.removeEventListener('keydown', onFirstInteraction);
      document.removeEventListener('touchstart', onFirstInteraction);
    };

    document.addEventListener('click', onFirstInteraction);
    document.addEventListener('keydown', onFirstInteraction);
    document.addEventListener('touchstart', onFirstInteraction);

    // Attempt autoplay right away
    playAudio();
  }
};
