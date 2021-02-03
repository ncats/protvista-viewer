const path = require('path');

const missingDependencies = ['./node_modules/protvista-utils/dist/protvista-utils.js'];

module.exports = {
    mode: "production",
    entry: ['./src/index.js', ...missingDependencies],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    }
};
