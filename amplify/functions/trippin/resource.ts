import * as amplify from '@aws-amplify/backend';

export const trippin = amplify.defineFunction({
  name: 'trippin',
  entry: './handler.ts', // Lambda 実装ファイルへの相対パス
  runtime: amplify.FunctionRuntime.NODEJS_18_X,
});

