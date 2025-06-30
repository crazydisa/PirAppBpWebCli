const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack');
const packageJson = require('./package.json');
const isProduction = process.env.NODE_ENV === 'production';
module.exports = {
  publicPath: isProduction ? '/' : '/',
    configureWebpack: {
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    PACKAGE_VERSION: '"' + packageJson.version + '"'
                }
            })
        ],
        optimization: {
          splitChunks:{
            minSize: 10000,
            maxSize: 250000,
          }
        }
    },
    transpileDependencies: [
    'quasar'
  ],

  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  }
}



