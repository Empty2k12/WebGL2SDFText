const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const APP_DIR = path.resolve(__dirname, 'src');
const BUILD_DIR = path.resolve(__dirname, 'public');

const config = {
  entry: `${APP_DIR}/index.js`,
  output: {
    path: BUILD_DIR,
    filename: 'assets/js/bundle.js',
  },
  resolve: {
    extensions: ['.js', '.json'],
    modules: [APP_DIR, 'node_modules'],
    alias: {
      constants: `${APP_DIR}/constants`,
    },
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
        include: APP_DIR,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },
      {
        test: [/\.vert$/, /\.frag$/, /\.glsl$/],
        use: ['raw-loader'],
      },
    ],
  },
  devServer: {
    contentBase: BUILD_DIR,
    port: 8080,
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/font/', to: `${BUILD_DIR}/font/` },
    ]),
  ],
};

module.exports = config;
