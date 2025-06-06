已放在 <https://mincergithub.github.io/trex-ai/> ，线上玩

## 本地如何运行：

1. 环境
- node v20.19.1
- npm 10.8.2
建议用nvm管理node版本
2. 
```bash
npm install
```
3. 
```bash
npm start
```
4. 访问 <https://localhost:8080/trex-ai/assets/index.html>

---


## 更改日志

#### 跑原项目

包都过期了，换包

#### 盘源码逻辑

从apps入手，细细捋模型和游戏代码

#### 修改 NNModel（练手）

1. 添加下蹲预测状态
2. 修改Model的损失函数：均方误差->交叉熵损失，更适应多选项预测

#### 新建 DQNModel（Deep Q-Learning Network）

1. 优化reward（为了方便，我直接把reward写在小恐龙的代码而不是Ai的代码里，对性能可能有一丢丢影响？）
2. 引入优先级经验回放机制，根据TD-Error优先采样对模型改进潜力更大的经验（后续又在 tdError 中加入 reward 的权重）
3. 将实时状态得出的经验加入经验池，训练效率大大提升（（（其实本来就该这样？我一直在模仿别的模型，只把小恐龙死亡那一刻的数据用来训练


---


## 进一步的可能方案：

1. 优化dqn.js：
- 在changeExp()设置的是“nextState: null”，导致并没用到下一刻的状态，所以其实用的是伪TD方法
- Q 值更新仅在 handleCrash 中进行，而不是在每个时间步（handleRunning）中实时更新
2. 加个面板，监控模型的训练情况并做可视化（之前Mnist手写识别实验的那种）
3. 在TrexGroup.js里调参：reward的影响因素
4. 新建PPO、Dueling Q-Learning……别的类型的模型
5. 包装：美化界面/串联成一个教学项目

