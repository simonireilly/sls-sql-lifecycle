import { expect as expectCDK, haveResourceLike } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Infra from '../lib/infra-stack';

test('Empty Stack', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Infra.InfraStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(haveResourceLike('AWS::RDS::DBInstance'));
});
