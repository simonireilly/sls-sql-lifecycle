import { Handler } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import Knex from 'knex';
import { config } from 'process';
const secretsmanager = new AWS.SecretsManager();

export interface RDSClusterSecret {
  dbClusterIdentifier: string;
  password: string;
  engine: string;
  port: number;
  host: string;
  username: string;
  dbname: string;
}

export const handler: Handler = async () => {
  const secret = await secretsmanager
    .getSecretValue({
      SecretId: String(process.env.RDS_SECRET_ID),
    })
    .promise();

  const configuration: RDSClusterSecret = JSON.parse(
    secret.SecretString || '{}'
  );

  const { dbClusterIdentifier, ...rest } = configuration;

  console.info('Configuring database');

  const db = Knex({
    client: 'pg',
    connection: {
      port: configuration.port,
      userName: configuration.username,
      password: configuration.password,
      host: configuration.host,
      database: configuration.dbname,
    },
    pool: { min: 1, max: 10 },
    searchPath: ['public'],
    log: console,
  });

  console.info('Calling database');

  return db
    .raw('SELECT 1;')
    .then(() => {
      console.info('PostgreSQL connected');
      return {
        status: 'success',
      };
    })
    .catch((e) => {
      console.log('PostgreSQL not connected');
      console.error(e);
      return {
        status: 'failure',
      };
    });
};
