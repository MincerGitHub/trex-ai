import * as tf from '@tensorflow/tfjs';
import NNModel from '../nn/NNModel';

export default class GeneticNNModel extends NNModel {
  getChromosome() {
    const result = tf.concat([
      this.weights[0].flatten(),
      this.biases[0].flatten(),
      this.weights[1].flatten(),
      this.biases[1].flatten()
    ]);
    return result.dataSync();
  }

  setChromosome(chromosome) {                             // 增加下蹲功能，神经网络需要改成 4->8->3
    let weight = chromosome.slice(0, 4 * 8);
    let bias = chromosome.slice(4 * 8, 4 * 8 + 1);
    this.weights[0].assign(tf.tensor(weight, [4, 8]));
    this.biases[0].assign(tf.tensor(bias[0]));
    weight = chromosome.slice(4 * 8 + 1, 4 * 8 + 1 + 8 * 3);
    bias = chromosome.slice(4 * 8 + 1 + 8 * 3, 4 * 8 + 1 + 8 * 3 + 1);
    this.weights[1].assign(tf.tensor(weight, [8, 3]));
    this.biases[1].assign(tf.tensor(bias[0]));
  }
}
