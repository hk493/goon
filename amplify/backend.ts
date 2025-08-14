import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { myFirstFunction } from './my-first-function/resource';
import { trippin } from './functions/trippin/resource'; // ← 追加

defineBackend({
  auth,
  data,
  myFirstFunction,
  trippin, // ← 追加
});
