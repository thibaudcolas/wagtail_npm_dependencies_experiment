const path = require('path');
const webpack = require('webpack');
const pkg = require('../package.json');

// Some libraries import Node modules but don't use them in the browser.
// Tell Webpack to provide empty mocks for them so importing them works.
const node = {
  fs: 'empty',
  net: 'empty',
  tls: 'empty',
};

const stats = {
  // Add chunk information (setting this to `false` allows for a less verbose output)
  chunks: false,
  // Add the hash of the compilation
  hash: false,
  // `webpack --colors` equivalent
  colors: true,
  // Add information about the reasons why modules are included
  reasons: false,
  // Add webpack version information
  version: false,
};

// Generates a path to an entry file to be compiled by Webpack.
const getEntryPath = (app, filename) => path.resolve('wagtail', app, 'static_src', app, 'app', filename);
// Generates a path to the output bundle to be loaded in the browser.
const getOutputPath = (app, filename) => path.join('wagtail', app, 'static', app, 'js', filename);

const isVendorModule = (module) => {
  const res = module.resource;
  return res && res.indexOf('node_modules') >= 0 && res.match(/\.js$/);
};

/**
 * This is a multi-compiler Webpack build. There are two compilers:
 * - Vendor dependencies. The admin UI's dependencies, as well as its components.
 * - Admin-only code, using those components.
 * See https://github.com/webpack/webpack/tree/master/examples/multi-compiler
 */
const config = (environment) => {
  const baseCompiler = {
    output: {
      path: path.resolve('.'),
      filename: '[name].js',
      publicPath: '/static/js/'
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(environment),
        },
      }),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          use: ['babel-loader'],
          exclude: [/node_modules/],
        },
      ],
    },
    stats: stats,
    node: node,
  };

  // Generate a bundle name based on the Wagtail version number.
  // TODO Do we want breaks on every version? probably not.
  const vendorBundle = `${pkg.name}_[name]_${pkg.version.replace(/[\.\-]/g, '_')}`;
  const vendorContext = path.resolve('.', 'client');
  const vendorManifest = path.join(__dirname, `${vendorBundle.replace('[name]', 'vendor')}_manifest.json`);

  const vendorCompiler = Object.assign({}, baseCompiler, {
    name: 'vendor',
    entry: {
      // Create a vendor chunk that will contain polyfills, and all third-party dependencies.
      vendor: [
        './client/src/utils/polyfills.js',
        './client/src/index.js',
      ],
    },
    output: Object.assign({}, baseCompiler.output, {
      library: vendorBundle,
    }),
    plugins: baseCompiler.plugins.slice().concat([
      new webpack.DllPlugin({
        context: vendorContext,
        name: vendorBundle,
        path: vendorManifest,
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: getOutputPath('wagtailadmin', '[name].js'),
        minChunks: isVendorModule,
      }),
    ]),
  });

  const adminEntry = {};
  adminEntry[getOutputPath('wagtailadmin', 'wagtailadmin')] = getEntryPath('wagtailadmin', 'wagtailadmin.entry.js');

  const adminCompiler = Object.assign({}, baseCompiler, {
    name: 'admin',
    entry: adminEntry,
    plugins: baseCompiler.plugins.slice().concat([
      new webpack.DllReferencePlugin({
        context: vendorContext,
        manifest: vendorManifest,
      }),
    ]),
    resolve: {
      alias: {
        wagtail: vendorContext,
      },
    },
  });

  return [
    vendorCompiler,
    adminCompiler,
  ];
};

module.exports = config;
