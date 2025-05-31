import 'babel-polyfill';

import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../game/constants';
import { Runner } from '../game';
import NNModel from '../ai/models/nn/NNModel';

const T_REX_COUNT = 10;

let runner = null;

const training = {
  inputs: [],
  labels: []
};

function setup() {
  // Initialize the game Runner.
  runner = new Runner('.game', {
    T_REX_COUNT,
    onReset: handleReset,
    onCrash: handleCrash,
    onRunning: handleRunning
  });
  // Set runner as a global variable if you need runtime debugging.
  window.runner = runner;
  // Initialize everything in the game and start the game.
  runner.init();
}

let firstTime = true;
function handleReset({ tRexes }) {
  if (firstTime) {
    // Initialize all the tRexes for the very first time.
    firstTime = false;
    tRexes.forEach((tRex) => {
      tRex.model = new NNModel();
      tRex.model.init();
    });
  } else {
    // Train the model before restarting.
    console.info('Training');
    tRexes.forEach((tRex) => {
      tRex.model.fit(training.inputs, training.labels);
    });
  }
}

function handleRunning({ tRex, state }) {
  return new Promise((resolve) => {
    if (!tRex.jumping) {
      let action = 0;
      const prediction = tRex.model.predictSingle(convertStateToVector(state));
      prediction.data().then((result) => {
        const maxIndex = result.indexOf(Math.max(...result));
        if (maxIndex === 1) {
          // Jump
          action = 1;
        } else if (maxIndex === 2) {
          // Duck
          action = -1;
        }
        tRex.lastRunningState = state;
        resolve(action);
      });
    } else {
      resolve(0);
    }
  });
}

function handleCrash({ tRex }) {
  let input = null;
  let label = null;
  if (tRex.jumping) {
    // 不应该跳跃
    input = convertStateToVector(tRex.lastJumpingState);
    label = [1, 0, 1];
  } else if (tRex.ducking) {
    // 不应该下蹲
    input = convertStateToVector(tRex.lastDuckingState);
    label = [1, 1, 0];
  } else {
    // 不应该保持跑步
    input = convertStateToVector(tRex.lastRunningState);
    label = [0, 1, 1];
  }
  training.inputs.push(input);
  training.labels.push(label);
}

function convertStateToVector(state) {
  if (state) {
    return [
      state.obstacleX / CANVAS_WIDTH,
      state.obstacleY / CANVAS_HEIGHT,
      state.obstacleWidth / CANVAS_WIDTH,
      state.speed / 100
    ];
  }
  return [0, 0, 0, 0];
}

document.addEventListener('DOMContentLoaded', setup);
