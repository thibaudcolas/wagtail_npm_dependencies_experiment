const webpack = require('webpack');
const base = require('./base.config');
const configs = base('development');

module.exports = configs.map((config) => {
  return Object.assign({}, config, {
    watch: true,
    // add poll-options for in vagrant development
    // See http://andrewhfarmer.com/webpack-watch-in-vagrant-docker/
    watchOptions: {
      poll: 1000,
      aggregateTimeout: 300,
    },
    // See http://webpack.github.io/docs/configuration.html#devtool
    devtool: 'inline-source-map',
    // Turn off performance hints during development because we don't do any
    // splitting or minification in interest of speed. These warnings become
    // cumbersome.
    performance: {
      hints: false,
    },
  });
});
