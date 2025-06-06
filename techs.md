## 技术点
1. 开发中应用最新的 webpack5 打包工具（凑数的，不要也行）
2. 多决策功能的曙光：添加下蹲状态预测功能
3. 修改Model的损失函数：均方误差->交叉熵损失，更适应多选项预测
4. 新模型 —— Deep Q-Learning Network
    1. 强化学习框架
    - DQN (Deep Q-Network):
    	- 使用深度神经网络近似 Q 函数，指导智能体选择最优动作。
    	- Q 值通过 dqnModel.predict() 计算，并使用 Q-Learning 更新公式进行训练。
    - Q-Learning 更新公式:
    	- Q(s, a) = reward + gamma * max(Q(s', a'))。
    	- 如果是终止状态，Q 值直接等于奖励。
    2. 优先经验回放 (Prioritized Experience Replay)
    - 经验池 (Replay Buffer):
    	- 存储智能体的状态、动作、奖励等经验，用于训练模型。
    	- 通过 replayBuffer 和 priorities 实现。
    - 优先级计算:
    	- 使用 TD-Error（时间差分误差）作为优先级，公式为：
    - 加权随机采样:
    	- 按优先级进行加权随机采样，确保高优先级经验被更多地用于训练。
    3. ε-greedy 策略
    - 探索与利用平衡:
        - 随机选择动作（探索）或选择 Q 值最大的动作（利用）。
        - 通过 epsilon 和 epsilonDecay 控制探索率逐渐减少。
    - 动态调整探索率:
        - 每次训练后通过 updateEpsilon() 减少探索率，公式为：
    4. 游戏状态处理
    - 状态向量化:
        - 将游戏状态（如障碍物位置、速度等）转换为神经网络的输入向量。
        - 通过 convertStateToVector() 方法实现，特征归一化确保输入范围适合神经网络。
    - 动作映射:
        - 将神经网络输出的动作（0, 1, 2）映射到游戏动作（0, -1, 1）。
    5. 批量训练
    - 经验采样:
        - 从经验池中采样 batchSize 条经验，用于训练模型。
    - 训练数据生成:
        - 将采样的经验转换为训练数据（training.inputs 和 training.labels）。
    - 模型训练:
        - 使用 dqnModel.fit() 方法对模型进行训练。
    6. 折扣因子 (Gamma)
    - 未来奖励权重:
        - 控制未来奖励对当前决策的影响。
        - gamma = 0.95 表示未来奖励的权重逐渐减小。
    7. 事件驱动机制
    - 游戏事件监听:
        - 使用 DOMContentLoaded 事件初始化游戏。
        - 通过 handleReset、handleRunning 和 handleCrash 方法处理游戏中的关键事件（如重置、运行、碰撞）。
    8. 神经网络模型
    - 共享模型:
        - 所有小恐龙共享同一个 DQN 模型 (dqnModel)，减少计算开销。
    - 模型初始化:
        - 在游戏启动时为每个恐龙分配模型，并初始化训练状态。
    9. 性能优化
    - 经验池大小限制:
        - 通过 replayBufferSize 限制经验池大小，避免内存占用过高。
    - 优先级更新:
        - 仅更新采样经验的优先级，减少计算开销。
    10. 模块化设计
    - 游戏逻辑与强化学习逻辑分离:
        - 游戏运行由 Runner 类管理，强化学习由 DQNModel 类管理。
    - 事件处理函数:
        - handleReset、handleRunning 和 handleCrash 分别处理游戏的重置、运行和碰撞事件。



---


## 前瞻
1. 监控模型的训练情况并做可视化
2. 参数优化：reward的影响因素、batchsize性能测试……
3. 应用新模型：PPO、Dueling Q-Learning……
4. 包装成教学项目：“从0训练小恐龙GOGOGO：在实践与比较中学习模型”