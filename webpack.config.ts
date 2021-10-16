import path from 'path';
import webpack from 'webpack';

export const config: webpack.Configuration = {
  mode: 'production',
  entry: './src/index.ts',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  target: 'node',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'circleci-config-sdk.js',
    library: {
      name: 'CircleCI',
      type: 'umd',
    },
  },
  optimization: {
    minimize: true,
  },
};

export default config;
