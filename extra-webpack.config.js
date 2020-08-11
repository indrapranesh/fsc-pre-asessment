module.exports = {
    module: {
      rules: [
        {
          test   : /\.less$/,
          loader: 'less-loader',
          options: {
            lessOptions: {
                modifyVars: { // modify theme variable
                    // 'primary-color': '#285c4d',
                    // 'link-color': '#1DA57A',
                    // 'border-radius-base': '2px'
                  },
                  javascriptEnabled: true
            }
          }
        }
      ]
    }
};