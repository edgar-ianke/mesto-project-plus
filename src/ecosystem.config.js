module.exports = {
  apps: [
    {
      name: 'app',
      script: 'app.ts',
      interpreter: '/home/edgaryanke/.nvm/versions/node/v22.3.0/bin/ts-node',
      watch: true,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
