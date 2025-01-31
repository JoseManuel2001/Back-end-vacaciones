// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'Server-sheetsprocess',
      script: 'src/index.cjs',
      exec_mode: 'fork',
      instances: 'max',
      autorestart: true,
      min_uptime: '60s',
      max_restarts: 10,
      watch: false,
      max_memory_restart: '1G',
      log_date_format: 'DD-MM-YYYY HH:mm:ss',
      node_args: '--trace-warnings',
      combine_logs: true,
      env: {
        NODE_ENV: 'production'
      },
      output: 'logs/out.log',
      error: 'logs/error.log'
    }
  ]
};
