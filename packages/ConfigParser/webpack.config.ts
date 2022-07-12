import path from 'path';
import webpack from 'webpack';

export const config: webpack.Configuration = {
  mode: 'production',
  entry: './index.ts',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: (modulePath) => {
          return modulePath.endsWith('.ts') && !modulePath.endsWith('test.ts');
        },
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
    filename: 'index.js',
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
