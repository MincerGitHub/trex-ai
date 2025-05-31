module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    browsers: ['last 2 versions', 'not dead']
                },
                modules: false // 保持 ES 模块语法
            }
        ]
    ]
};