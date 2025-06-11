import { tensor } from '../utils';

export default class Model {
  init() {
    throw new Error(
      'Abstract method must be implemented in the derived class.'
    );
  }

  predict(inputXs) {
    throw new Error(
      'Abstract method must be implemented in the derived class.'
    );
  }

  predictSingle(inputX) {
    return this.predict([inputX]);
  }

  train(inputXs, inputYs) {
    throw new Error(
      'Abstract method must be implemented in the derived class.'
    );
  }

  fit(inputXs, inputYs, iterationCount = 100) {    // 通过简单的循环调用 train 方法来进行多次训练迭代
    for (let i = 0; i < iterationCount; i += 1) {  // next：1. 小批次训练 2. 早停机制
      this.train(inputXs, inputYs);
    }
  }

  loss(predictedYs, labels) {                 // 鉴于加了下蹲后是多分类问题，我把均方误差改成交叉熵损失了（但不适用q值的优化）
    const epsilon = 1e-7; // 防止 log(0)
    const clippedPredictions = predictedYs.clipByValue(epsilon, 1 - epsilon); // 防止数值问题
    const crossEntropy = tensor(labels)
      .mul(clippedPredictions.log())
      .sum(1)
      .mean()
      .neg();
    return crossEntropy;
  }
}
