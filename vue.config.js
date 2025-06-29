const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack');
const packageJson = require('./package.json');
const isProduction = process.env.NODE_ENV === 'production';
module.exports = defineConfig({
  publicPath: isProduction ? '/' : '/',
    configureWebpack: {
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    PACKAGE_VERSION: '"' + packageJson.version + '"'
                }
            })
        ]
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
})



