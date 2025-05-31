import 'babel-polyfill';

import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../game/constants';
import { Runner } from '../game';
import RandomModel from '../ai/models/random/RandomModel';

let runner = null;

function setup() {        // 做这个随机训练方法的作用：作为一个基准，用于评估其他更复杂的训练方法的性能（除了最牛逼的那个模型，其他的其实都没用）
  // Initialize the game Runner.
  runner = new Runner('.game', {
    T_REX_COUNT: 10,
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
function handleReset({ tRexes }) {        // 解构赋值语法，用于从传入的对象中提取 tRexes 属性的值。
  if (firstTime) {
    firstTime = false;
    tRexes.forEach((tRex) => {
      if (!tRex.model) {
        // Initialize all the tRexes with random models
        // for the very first time.
        tRex.model = new RandomModel();
        tRex.model.init();
      }
    });
  }
}

function handleRunning({ tRex, state }) {
  let action = 0;
  if (!tRex.jumping) {
    action = tRex.model.predictSingle(convertStateToVector(state));
  }
  return action;
}

function handleCrash({ tRex }) {
  tRex.model.train();
}

function convertStateToVector(state) {
  if (state) {
    return [
      state.obstacleX / CANVAS_WIDTH,
      state.obstacleWidth / CANVAS_WIDTH,
      state.speed / 100
    ];
  }
  return [0, 0, 0];
}

document.addEventListener('DOMContentLoaded', setup);
