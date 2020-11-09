const pack = require('./package.json');
const path = require('path');
const webpack = require('webpack');

module.exports = () => ({
  entry: './src/mojs.babel.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: 'mojs',
    libraryExport: 'default',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  resolve: {
    extensions: [
      '.js',
      '.babel.js',
      '.coffee',
    ],
    alias: {
      root: __dirname,
      src: 'root/src/',
      delta: 'src/delta',
      easing: 'src/easing',
      polyfills: 'src/polyfills',
      shapes: 'src/shapes',
      tween: 'src/tween',
      vendor: 'src/vendor',
    },
  },
  module: {
    rules: [{
      test: /\.(babel.js)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      },
    }, {
      test: /\.coffee$/,
      use: {
        loader: 'coffee-loader',
        options: {
          bare: true,
        },
      },
    }],
  },
  plugins: [
    new webpack.DefinePlugin({
      build: {
        revision: `"${pack.version}"`,
      },
    }),
  ],
});