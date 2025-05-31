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

<<<<<<< HEAD
  setChromosome(chromosome) {                             // 增加下蹲功能，神经网络需要改成 4->8->3
    let weight = chromosome.slice(0, 4 * 8);
    let bias = chromosome.slice(4 * 8, 4 * 8 + 1);
    this.weights[0].assign(tf.tensor(weight, [4, 8]));
    this.biases[0].assign(tf.tensor(bias[0]));
    weight = chromosome.slice(4 * 8 + 1, 4 * 8 + 1 + 8 * 3);
    bias = chromosome.slice(4 * 8 + 1 + 8 * 3, 4 * 8 + 1 + 8 * 3 + 1);
    this.weights[1].assign(tf.tensor(weight, [8, 3]));
=======
  setChromosome(chromosome) {
    let weight = chromosome.slice(0, 3 * 6);
    let bias = chromosome.slice(3 * 6, 3 * 6 + 1);
    this.weights[0].assign(tf.tensor(weight, [3, 6]));
    this.biases[0].assign(tf.tensor(bias[0]));
    weight = chromosome.slice(3 * 6 + 1, 3 * 6 + 1 + 6 * 2);
    bias = chromosome.slice(3 * 6 + 1 + 6 * 2, 3 * 6 + 1 + 6 * 2 + 1);
    this.weights[1].assign(tf.tensor(weight, [6, 2]));
>>>>>>> 98b9200e99926ed43a46d9494de8a0e830781ab6
    this.biases[1].assign(tf.tensor(bias[0]));
  }
}
