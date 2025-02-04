const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.output.publicPath = 'https://movies-child-app.vercel.app/';

      webpackConfig.plugins.push(
        new ModuleFederationPlugin({
          name: 'MoviesApp',
          filename: 'remoteEntry.js',
          exposes: {
            './MoviesApp': './src/App',
          },
          shared: {
            react: { eager: true },
            'react-dom': { eager: true },
            'tailwindcss': { eager: true }
          },
        })
      );
      return webpackConfig;
    },
  },
};
