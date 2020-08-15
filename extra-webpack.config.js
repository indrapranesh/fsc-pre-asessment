module.exports = {
    module: {
      rules: [
        {
          test   : /\.less$/,
          loader: 'less-loader',
          options: {
            lessOptions: {
                modifyVars: { // modify theme variable
                     'primary-color': '#2e6745',
                     'processing-color': '#2e6745',
                     'success-color': '#2e6745',
                     'link-color': '#2e6745',
                     'border-radius-base': '2px'
                  },
                  javascriptEnabled: true
            }
          }
        }
      ]
    }
};