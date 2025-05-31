import 'babel-polyfill';

import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../game/constants';
import { Runner } from '../game';
import GeneticModel from '../ai/models/genetic/GeneticModel';        // GeneticModel：负责整个种群的进化，是遗传算法的核心逻辑。
import GeneticRandomModel from '../ai/models/genetic/RandomModel';   // GeneticRandomModel：负责单个 T-Rex 的基因表示和操作，是个体层面的模型。

const T_REX_COUNT = 10;

let runner = null;

const rankList = [];
const geneticModel = new GeneticModel();    // 所有小恐龙共享一个模型，以根据它们的表现进行排序

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
    // Initialize all the tRexes with random models for the very first time.
    firstTime = false;
    tRexes.forEach((tRex) => {
      tRex.model = new GeneticRandomModel();
      tRex.model.init();
    });
  } else {
    // Train the model before restarting.
    console.info('Training');
    const chromosomes = rankList.map((tRex) => tRex.model.getChromosome());    // 从rankList里依次提取染色体
    // Clear rankList
    rankList.splice(0);
    geneticModel.fit(chromosomes);
    tRexes.forEach((tRex, i) => {
      tRex.model.setChromosome(chromosomes[i]);
    });
  }
}

function handleRunning({ tRex, state }) {
  let action = 0;
  if (!tRex.jumping) {
    action = tRex.model.predictSingle(convertStateToVector(state));    // 这里用的Random模型里定义的predict()，简单粗暴
  }
  return action;
}

function handleCrash({ tRex }) {
  if (!rankList.includes(tRex)) {
    rankList.unshift(tRex);
  }
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
