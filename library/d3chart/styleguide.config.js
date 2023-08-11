const pkg = require('./package.json');
const path = require('path');

module.exports = {
  title: `Chart Component v${pkg.version}`,
  components: ['./src/chart/**/*.tsx'],
  getComponentPathLine(componentPath) {
    const name = path.basename(componentPath, '.tsx');
    return `import { ${name} } from '${pkg.name}';`;
  },
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', 'js']
    }
  },
};