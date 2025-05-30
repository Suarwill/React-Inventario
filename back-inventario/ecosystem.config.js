module.exports = {
  apps: [
    {
      name: 'react-backend',
      script: 'index.js',
      watch: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};