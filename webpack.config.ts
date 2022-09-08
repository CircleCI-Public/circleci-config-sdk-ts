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
    filename: 'INDEX.js',
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
