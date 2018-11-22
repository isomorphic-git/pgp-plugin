const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')

module.exports = [
  {
    target: 'web',
    entry: {
      'isomorphic-git-pgp-plugin': './src/index.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].min.js',
      library: 'IsomorphicPgpPlugin',
      libraryTarget: 'umd'
    },
    mode: 'production',
    devtool: 'source-map',
    plugins: [
      new BundleAnalyzerPlugin({
        openAnalyzer: false,
        analyzerMode: 'static',
        reportFilename: 'size_report.html',
        defaultSizes: 'gzip'
      }),
      new DuplicatePackageCheckerPlugin({
        strict: true
      })
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          // exclude: /node_modules/,    // We actually DO want to transpile our dependencies
          use: {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              plugins: [
                'babel-plugin-transform-object-rest-spread',
                'babel-plugin-transform-async-to-generator'
              ]
            }
          }
        }
      ]
    }
  }
]
