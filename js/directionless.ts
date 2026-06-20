// @ts-nocheck
import { AnimationController } from './modules/animation.ts';
import { audioController } from './modules/audio.ts';
import { quizController } from './modules/quiz.ts';
import { matrixController } from './modules/matrix.ts';
import { companionController } from './modules/companion.ts';
import { contactController } from './modules/contact.ts';
import { globeController } from './modules/globe.ts';

const animationController = new AnimationController();
animationController.init();
audioController.init();
quizController.init();
matrixController.init();
companionController.init();
contactController.init();
globeController.init('#footer-globe-container');
globeController.init('#features-globe-container');
