import 'babel-polyfill';

import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../game/constants';
import { Runner } from '../game';
import DQNModel from '../ai/models/dqn/DQNModel';
import { tensor } from '../ai/utils';

const T_REX_COUNT = 10;

const epsilon = 1.0; // 初始探索率，在ε-greedy里用
const epsilonDecay = 0.995; // 探索率衰减
const epsilonMin = 0.01; // 最小探索率

const gamma = 0.95; // 折扣因子
const replayBuffer = []; // 经验池
const replayBufferSize = 1000; // 经验池大小
const batchSize = 32; // 每次训练的批量大小

const rewardWeight = 0.5; // 控制 reward 对优先级的影响程度

const priorities = []; // 存储每条经验的优先级（跟经验池并列啦）
const alpha = 0.6; // 优先级影响因子

let runner = null;
const dqnModel = new DQNModel({ inputSize: 4, outputSize: 3 }); // 所有小恐龙共享同一个模型
tRex.model.init();

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
            tRex.model = dqnModel;
            tRex.training = {
                lastState: null,
                lastAction: null
            };
            tRex.isCrashed = false;
        });
    } else {
        // Train the model before restarting.
        console.info('Training');
        if (training.inputs.length > 0 && training.labels.length > 0) {
            dqnModel.fit(training.inputs, training.labels);
        }
        training.inputs = [];
        training.labels = [];
        updateEpsilon(); // 更新探索率
    }
}

function handleRunning({ tRex, state }) {
    return new Promise((resolve) => {
        const stateVector = convertStateToVector(state);

        // ε-greedy 策略选择动作，用于在强化学习中平衡 探索（exploration） 和 利用（exploitation），防止陷入局部最优
        let action;
        if (Math.random() < epsilon) {
            action = Math.floor(Math.random() * 3); // 随机选择动作
        } else {
            const qValues = tRex.model.predict(stateVector).dataSync();
            action = qValues.indexOf(Math.max(...qValues)); // 选择 Q 值最大的动作
        }

        changeExp({ tRex, ifDone: false });

        tRex.training.lastState = stateVector;
        tRex.training.lastAction = action;

        resolve(action === 1 ? 1 : action === 2 ? -1 : 0); // 转换为游戏动作（遵循映射:2->-1, 1->1, 0->0）
    });
}



function handleCrash({ tRex }) {

    changeExp({ tRex, ifDone: true });

    tRex.isCrashed = true;

    const allCrashed = runner.tRexes.every(tRex => tRex.isCrashed);
    if (allCrashed) {
        // 采样 batchSize 条经验
        const sampledExperiences = [];
        const sampledIndices = [];
        const totalPriority = priorities.reduce((sum, p) => sum + Math.pow(p, alpha), 0);

        for (let i = 0; i < Math.min(batchSize, replayBuffer.length); i++) {
            const rand = Math.random() * totalPriority;
            let cumulative = 0;
            for (let j = 0; j < priorities.length; j++) {
                cumulative += Math.pow(priorities[j], alpha);
                if (rand <= cumulative) {
                    sampledExperiences.push(replayBuffer[j]);
                    sampledIndices.push(j);
                    break;
                }
            }
        }

        // 将采样的经验转换为训练数据
        sampledExperiences.forEach((experience) => {
            training.inputs.push(experience.state);
            const qValues = dqnModel.predict(experience.state).dataSync();
            if (experience.done) {
                qValues[experience.action] = experience.reward; // 如果是终止状态，Q 值等于奖励
            } else {
                const nextQ = dqnModel.predict(experience.nextState || [0, 0, 0, 0]).dataSync();
                qValues[experience.action] = experience.reward + gamma * Math.max(...nextQ); // Q-Learning 更新公式
            }
            training.labels.push(qValues);
        });

        // 更新优先级
        sampledIndices.forEach((index, i) => {
            const experience = replayBuffer[index];
            const qValues = dqnModel.predict(experience.state).dataSync();
            const target = experience.reward + (experience.done ? 0 : gamma * Math.max(...dqnModel.predict(experience.nextState || [0, 0, 0, 0]).dataSync()));
            priorities[index] = Math.abs(target - qValues[experience.action]);
        });
    }
}

function convertStateToVector(state) {
    if (state) {
        return [
            state.obstacleX / CANVAS_WIDTH,
            state.obstacleHeight / CANVAS_HEIGHT,
            state.obstacleWidth / CANVAS_WIDTH,
            state.speed / 100
        ];
    }
    return [0, 0, 0, 0];
}

function changeExp({ tRex, ifDone }) {
    const lastState = tRex.training.lastState;
    const lastAction = tRex.training.lastAction;
    const reward = tRex.reward

    // 计算 TD-Error 作为优先级
    const qValues = dqnModel.predict(lastState).dataSync();
    const target = reward;
    const tdError = Math.abs(target - qValues[lastAction]) + rewardWeight * Math.abs(reward);    // 我在 TD-Error 计算里额外加入了 reward 的权重

    // 存储经验和优先级
    replayBuffer.push({ state: lastState, action: lastAction, reward, nextState: lastState, done: ifDone });
    priorities.push(tdError);

    if (replayBuffer.length > replayBufferSize) {
        replayBuffer.shift(); // 移除最早的经验
        priorities.shift(); // 同时移除 对应的 优先级
    }
};

function updateEpsilon() {
    epsilon = Math.max(epsilonMin, epsilon * epsilonDecay);
    console.info(`Updated epsilon: ${epsilon}`);
}

document.addEventListener('DOMContentLoaded', setup);