import { Handler } from 'aws-lambda';

export const handler: Handler = async () => {
  return {
    status: 'success',
  };
};