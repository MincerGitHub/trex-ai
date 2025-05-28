import path from 'path';
import { fileURLToPath } from 'url';
import prettierConfig from 'eslint-config-prettier';
import babelParser from '@babel/eslint-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        sourceType: 'module',
        requireConfigFile: false, // 如果你不需要 Babel 配置文件，可以添加此选项
        babelOptions: {
          presets: ['@babel/preset-env'] // 根据项目需要添加 Babel 预设
        }
      }
    },

    ...prettierConfig,
    rules: {
      'class-methods-use-this': 'off',
      'comma-dangle': 'off',
      'function-paren-newline': 'off',
      'global-require': 'off',
      'import/prefer-default-export': 'off',
      'max-len': 'warn',
      'no-loop-func': 'off',
      'no-mixed-operators': 'off',
      'no-param-reassign': 'off',
      'no-unused-vars': 'off',
      'no-use-before-define': 'off',
      'no-console': [
        'warn',
        {
          allow: [
            'info',
            'warn',
            'error'
          ]
        }
      ],
      'no-underscore-dangle': 'off',
      'prefer-destructuring': 'off'
    }
  }
];