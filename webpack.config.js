const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 1. Entry: точка входа
  entry: './src/index.tsx',

  // 2. Output: куда собирать
  output: {
    filename: '[name].[contenthash].js', // code splitting
    path: path.resolve(__dirname, 'dist'),
    clean: true, // очищать dist перед сборкой
  },

  // 3. Mode: режим
  mode: 'development', // можно переопределить через CLI

  // 4. Loaders: обработка файлов
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-typescript',
              '@babel/preset-react',
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },

  // 5. Plugins: расширения
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],

  // 6. DevServer: сервер для разработки
  devServer: {
    static: './dist',
    hot: true,
    open: true,
  },

  // 7. Resolve/Alias: алиасы для удобства
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },

  // 8. Code Splitting: динамический импорт
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
