import 'babel-polyfill';

import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../game/constants';
import { Runner } from '../game';
import NNModel from '../ai/models/nn/NNModel';

let runner = null;

function setup() {
  // Initialize the game Runner.
  runner = new Runner('.game', {
    T_REX_COUNT: 1,
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
  const tRex = tRexes[0];
  if (firstTime) {
    firstTime = false;
    tRex.model = new NNModel();
    tRex.model.init();
    tRex.training = {
      inputs: [],
      labels: []
    };
  } else {
    // Train the model before restarting.
    console.info('Training');
    tRex.model.fit(tRex.training.inputs, tRex.training.labels);
  }
}

function handleRunning({ tRex, state }) {
  return new Promise((resolve) => {
    if (!tRex.jumping) {
      let action = 0;    // let 和 const 的区别在于 let 可以重新赋值，而 const 不可以
      const prediction = tRex.model.predictSingle(convertStateToVector(state));
      prediction.data().then((result) => {
        const maxIndex = result.indexOf(Math.max(...result));    // 找出最大值的索引，以此确定行动
        if (maxIndex === 1) {
          // Jump
          action = 1;
          tRex.lastJumpingState = state;
        } else if (maxIndex === 2) {
          // Duck
          action = -1;
          tRex.lastDuckingState = state;
        } else {
          // Do nothing
          tRex.lastRunningState = state;
        }
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
  tRex.training.inputs.push(input);
  tRex.training.labels.push(label);
}

function convertStateToVector(state) {                // state是TrexGroup.js里checkForCollision函数中传给onRunning和onCrash的
  if (state) {
    return [
      state.obstacleX / CANVAS_WIDTH,
      state.obstacleY / CANVAS_HEIGHT,                 // 增加障碍物的高度
      state.obstacleWidth / CANVAS_WIDTH,
      state.speed / 100
    ];
  }
  return [0, 0, 0, 0];
}

document.addEventListener('DOMContentLoaded', setup);
