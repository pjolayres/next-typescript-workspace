const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const withTypescript = require('@zeit/next-typescript');
const withSass = require('@zeit/next-sass');

const config = {
  distDir: '../dist/next',
  webpack: config => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty'
    };

    return config;
  },
  analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../../bundles/server.html',
      openAnalyzer: false
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../bundles/client.html',
      openAnalyzer: false
    }
  }
};

module.exports = withBundleAnalyzer(withTypescript(withSass(config)));
