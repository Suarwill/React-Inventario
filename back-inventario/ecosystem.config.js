module.exports = {
  apps: [
    {
      name: 'react-backend',
      script: 'index.js',
      watch: false,
      autorestart: true, // Desactivar autorestart explícitamente
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};