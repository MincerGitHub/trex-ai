import Runner from './Runner';
import Trex, { checkForCollision } from './Trex';

export default class TrexGroup {        // TrexGroup 类的作用：用于管理多个 Trex 实例，提供统一的接口来更新、绘制和处理碰撞等操作。
  // 类字段语法：用于直接在类中定义实例属性，而不需要在构造函数中显式声明。这里等价于：
  //constructor() {
  //  this.onReset = noop;
  //  this.onRunning = noop;
  //  this.onCrash = noop;
  //}
  onReset = noop;
  onRunning = noop;
  onCrash = noop;                       // onReset、onRunning 和 onCrash 这三个属性可以被看作是一个 模板 或 接口，它们为不同的训练方法提供了一个统一的代码结构和规范。

  constructor(count, canvas, spriteDef) {
    this.tRexes = [];
    for (let i = 0; i < count; i += 1) {
      const tRex = new Trex(canvas, spriteDef);
      tRex.id = i;
      this.tRexes.push(tRex);
    }
  }

  update(deltaTime, status) {
    this.tRexes.forEach((tRex) => {
      if (!tRex.crashed) {
        tRex.update(deltaTime, status);
      }
    });
  }

  draw(x, y) {
    this.tRexes.forEach((tRex) => {
      if (!tRex.crashed) {
        tRex.draw(x, y);
      }
    });
  }

  updateJump(deltaTime, speed) {
    this.tRexes.forEach((tRex) => {
      if (tRex.jumping) {
        tRex.updateJump(deltaTime, speed);
      }
    });
  }

  reset() {
    this.tRexes.forEach((tRex) => {
      tRex.reset();
      this.onReset({ tRex });
    });
  }

  lives() {
    return this.tRexes.reduce((count, tRex) => tRex.crashed ? count : count + 1, 0);
  }

  checkForCollision(obstacle) {
    let crashes = 0;
    const state = {
      obstacleX: obstacle.xPos,
      obstacleY: obstacle.yPos,
      obstacleWidth: obstacle.width,
      speed: Runner.instance_.currentSpeed
    };
    this.tRexes.forEach(async (tRex) => {
      if (!tRex.crashed) {
        const result = checkForCollision(obstacle, tRex);
        if (result) {
          crashes += 1;
          tRex.crashed = true;

          tRex.reward -= 100;                            // 1. 撞到障碍物的惩罚

          this.onCrash({ tRex, state });
        } else {
          const action = await this.onRunning({ tRex, state });
          // 使用 await 可以暂停代码执行，直到预测结果返回，从而确保动作决策的准确性。
          // this.tRexes.forEach(async (tRex) => { ... }) 中的 async 确保每只小恐龙的逻辑是独立的。
          if (action === 1) {
            tRex.startJump();
            tRex.reward -= 15;                           // 2. 跳跃的惩罚
          } else if (action === -1) {
            if (tRex.jumping) {
              tRex.setSpeedDrop();
              tRex.setDuck(true);
            } else if (!tRex.jumping && !tRex.ducking) {
              tRex.setDuck(true);
              tRex.reward += 10;                         // ex. 下蹲甚至设置的是奖励而不是惩罚，破恐龙怎么还是不会蹲！？
            }
          }
          tRex.reward += 1;                              // 3. 存活时间的奖励
        }

        if (obstacle.xPos + obstacle.width < tRex.xPos) {// 检查是否成功跳过障碍物
          tRex.reward += 5;                              // 4. 成功跳过障碍物的奖励（（（ 以上四条是调参地狱QAQ（（（reward只对DQNModel生效，是我新加的
        }

      } else {
        crashes += 1;
      }
    });
    return crashes === this.tRexes.length;
  }
}

function noop() { }
