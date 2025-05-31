import RandomModel from '../random/RandomModel';

export default class GeneticRandomModel extends RandomModel {
<<<<<<< HEAD
  getChromosome() {    // 将模型的内部参数（weights 和 biases）打包成一个数组，作为染色体的表示形式。
    return this.weights.concat(this.biases);
  }

  setChromosome(chromosome) {     // 将（交叉变异后的）染色体传回给模型，让下一代小恐龙个体用
=======
  getChromosome() {
    return this.weights.concat(this.biases);
  }

  setChromosome(chromosome) {
>>>>>>> 98b9200e99926ed43a46d9494de8a0e830781ab6
    this.weights[0] = chromosome[0];
    this.weights[1] = chromosome[1];
    this.weights[2] = chromosome[2];
    this.biases[0] = chromosome[3];
  }
}
