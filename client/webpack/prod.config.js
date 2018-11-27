const webpack = require('webpack');
const base = require('./base.config');

const configs = base('production');

module.exports = configs.map((config) => {
  return Object.assign({}, config, {
    plugins: config.plugins.concat([
      // See https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/config/webpack.config.prod.js.
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true,
          warnings: false
        },
        mangle: {
          screw_ie8: true
        },
        output: {
          comments: false,
          screw_ie8: true
        },
      }),
    ]),
  });
});
