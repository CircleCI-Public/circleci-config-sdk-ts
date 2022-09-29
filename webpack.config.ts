import path from 'path';
import webpack from 'webpack';

export const config: webpack.Configuration = {
  mode: 'production',
  entry: './src/index.ts',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: (modulePath: string): boolean => {
          return modulePath.endsWith('.ts') && !modulePath.endsWith('test.ts');
        },
        use: [
          {
            loader: 'ts-loader',
            options: { configFile: 'tsconfig.webpack.json' },
          },
        ],
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
    library: 'CircleCI',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  optimization: {
    minimize: true,
  },
};

export default config;
