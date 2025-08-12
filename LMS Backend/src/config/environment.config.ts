import configuration from './configuration';

const config = configuration();

export const environmentConfig = {
  mongodb: {
    uri: config.mongodb.uri,
  },
  jwt: {
    secret: config.jwt.secret,
    expiresIn: config.jwt.expiresIn,
    refreshExpiresIn: config.jwt.refreshExpiresIn,
  },
  app: {
    port: config.app.port,
    nodeEnv: config.app.nodeEnv,
  },
};
