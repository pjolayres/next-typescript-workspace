const withTypescript = require('@zeit/next-typescript');

module.exports = withTypescript({
  distDir: '../dist/next',
  webpack: config => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty'
    };

    return config;
  }
});
