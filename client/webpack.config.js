// @flow

/**
 * Configuration file for webpack.
 *
 * Webpack bundles several JavaScript files into a single file
 * for easier script embedding in an index.html file.
 */

const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.tsx', // Initial file to bundle
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  output: {
    // Output file: ./public/bundle.js
    publicPath: '/',
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
  },
  // Makes original source code available to the browser for easier identification of error causes.
  devtool: 'source-map',
  devServer: {
    // Serve files from the public directory
    static: { directory: path.join(__dirname, 'public') },
    compress: true,
    port: 3000,
    historyApiFallback: true,
  },
  plugins: [
    // Load environment variables from .env file
    new Dotenv(),
  ],
  module: {
    rules: [
      {
        // Use babel to parse .tsx files in the src folder
        test: /\.(tsx|ts)$/,
        include: path.resolve(__dirname, 'src'),
        use: ['babel-loader'],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};

