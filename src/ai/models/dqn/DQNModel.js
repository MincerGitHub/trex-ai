import 'babel-polyfill';

import * as tf from '@tensorflow/tfjs';
import { tensor } from '../../utils';
import Model from '../Model';

/**
 * Deep Q-Network Model
 */
export default class DQNModel extends Model {
    constructor({
        inputSize = 4,
        hiddenLayerSize = inputSize * 2,
        outputSize = 3,
        learningRate = 0.001
    } = {}) {
        super();
        this.inputSize = inputSize;
        this.hiddenLayerSize = hiddenLayerSize;
        this.outputSize = outputSize;
        this.learningRate = learningRate;
    }
    init() {
        this.optimizer = tf.train.adam(this.learningRate);

        this.model = tf.sequential();  // 顺序模型
        this.model.add(tf.layers.dense({ units: this.hiddenLayerSize, inputShape: [this.inputSize], activation: 'relu' }));
        this.model.add(tf.layers.dense({ units: this.hiddenLayerSize, activation: 'relu' }));
        this.model.add(tf.layers.dense({ units: this.outputSize, activation: 'linear' })); // 输出 Q 值
        this.model.compile({ optimizer: this.optimizer, loss: 'categoricalCrossentropy' });
    }

    /**
     * 预测 Q 值
     * @param {Array} state 当前状态向量
     * @returns {Tensor} Q 值
     */
    predict(state) {
        return tf.tidy(() => this.model.predict(tensor([state])));
    }

    /**
     * 训练模型
     * @param {Array} states 状态集合
     * @param {Array} qValues Q 值集合
     */
    async train(states, qValues) {
        const xs = tf.tensor2d(states, [states.length, this.inputSize]);
        const ys = tf.tensor2d(qValues, [qValues.length, this.outputSize]);

        this.optimizer.minimize(() => {
            const predictions = this.model.predict(xs);
            const loss = this.loss(predictions, ys); // 使用 Model.js 中的 loss 方法
            return loss;
        });

        xs.dispose();
        ys.dispose();
    }
}
