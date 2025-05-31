import Model from '../Model';

export default class GeneticModel extends Model {
  train(chromosomes) {
    const parents = this.select(chromosomes);    // 选择最优染色体
    const offspring = this.crossOver(parents, chromosomes);    // 交叉
    this.mutate(offspring);    // 变异
  }

  fit(chromosomes) {    // 跟nn相比，重写了fit()，以适应遗传训练
    this.train(chromosomes);
  }

  select(chromosomes) {
    const parents = [chromosomes[0], chromosomes[1]];
    return parents;
  }

  crossOver(parents, chromosomes) {
    // Clone from parents
    const offspring1 = parents[0].slice();
    const offspring2 = parents[1].slice();
    // Select a random crossover point
    const crossOverPoint = Math.floor(Math.random() * chromosomes.length);    // 使用 Math.random() 生成一个随机的交叉点（crossOverPoint），表示从染色体的前 crossOverPoint 个基因进行交换。
    // Swap values among parents
    for (let i = 0; i < crossOverPoint; i += 1) {
      const temp = offspring1[i];
      offspring1[i] = offspring2[i];
      offspring2[i] = temp;
    }
    const offspring = [offspring1, offspring2];
    // Replace the last 2 with the new offspring
    for (let i = 0; i < 2; i += 1) {
      chromosomes[chromosomes.length - i - 1] = offspring[i];
    }
    return offspring;
  }

  mutate(chromosomes) {
    chromosomes.forEach(chromosome => {
      const mutationPoint = Math.floor(Math.random() * chromosomes.length);    // 使用 Math.random() 随机选择一个基因位置（mutationPoint）作为变异点。
      chromosome[mutationPoint] = Math.random();
    });
  }
}
