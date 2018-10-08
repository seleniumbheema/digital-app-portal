// Helper: root() is defined at the bottom
const path = require('path');
const webpack = require('webpack');
const moment = require('moment');

// Webpack Plugins
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const XMLWebpackPlugin = require('xml-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
const ENV = process.env.npm_lifecycle_event;
const isTestWatch = ENV === 'test-watch';
const isTest = ENV === 'test' || isTestWatch;
const isProd = ENV === 'build'; // This covers all the start scripts like build:es, build:fa etc
const isDev = !isTest && !isProd;
const isCiBuild = process.env.CI_BUILD === 'true';
const isEndToEndBuild = process.env.ENDTOEND === 'true';
const prodMoxProxyBasePath = '/my-account/';
const devBasePath = '/';
const loadingSpriteDelay = isEndToEndBuild ? 3000 : 250;
const noTags = process.env.NOTAGS === 'true';
const analyzeBuild = process.env.ANALYZE_BUILD === 'true';
const envUrls = {
  livechat: '//cdn.synthetix.com/penfield/get_synthetix.min.js?',
  iovation: '//ci-mpsnare.iovation.com/snare.js',
  optimizely: '//cdn.optimizely.com/js/',
  tagManager: '//nexus.ensighten.com/esure/customerportal-stg/Bootstrap.js'
};

const brandInfo = new Map()
  .set('esure', { siteCatAccount: 'esuredev', port: 4201, optimizelyAccount: 5369993155, liveChatApplicationkey: '3ea4141ea87348dbb912fb0da71ca70b', liveChatConsumerkey: '4c167aecf0453dea74659aadd46459df' })
  .set('sheilaswheels', { siteCatAccount: 'sheilasdev', port: 4202, optimizelyAccount: 5369993155, liveChatApplicationkey: '5195c62616d6e7db2d4ac1e860dfc995', liveChatConsumerkey: '4c167aecf0453dea74659aadd46459df' })
  .set('firstalternative', { siteCatAccount: 'firstalternativedev', port: 4203, optimizelyAccount: 5369993155, liveChatApplicationkey: '2ec1e480ed39a86a483affa164764f7a', liveChatConsumerkey: '4c167aecf0453dea74659aadd46459df' });

/**
 * The brand to build with, default to esure if not passed in.
 * @type {string}
 */
process.env.BRAND = process.env.BRAND || 'esure';

/**
 * The NODE_ENV, if not specified then default it to production.
 * @type {string}
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// eslint-disable-next-line no-console
console.info(`Building for:\nbrand: ${process.env.BRAND}\nisTest: ${isTest}\nisProd: ${isProd}
isDev: ${isDev}\nisCiBuild: ${isCiBuild}\nisEndToEndBuild: ${isEndToEndBuild}\nprocess.env.npm_lifecycle_event: ${ENV}
process.env.NODE_ENV: ${process.env.NODE_ENV}\nnoTags: ${noTags}`);

/**
 * Brand configuration JSON file, this will be created as a global variable under the name ESURE_GLOBALS.BRAND_CONFIG in the DefinePlugin.
 * @type {json}
 */
const brandConfig = require('./src/config/' + process.env.BRAND);

/**
 * Name of the output folder the production build of the app will go to.
 * @type {String}
 */
const distFolderName = 'dist';

module.exports = function makeWebpackConfig() {
  /**
   * Config
   * Reference: http://webpack.github.io/docs/configuration.html
   * This is the object where all configuration gets set
   */
  let config = {};

  /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  if (isProd) {
    config.devtool = 'source-map';
    // } else if (isTest) {
    // config.devtool = 'inline-source-map';
  } else {
    config.devtool = 'eval-source-map';
  }

  if (!isTest) {
    /**
     * Entry
     * Reference: http://webpack.github.io/docs/configuration.html#entry
     */
    config.entry = {
      'polyfills': './src/polyfills.ts',
      'main': './src/main.ts', // our angular app
      'css': './src/style/app_' + process.env.BRAND + '.scss' // our branded stylesheet
    };
  }

  /**
   * Output
   * Reference: http://webpack.github.io/docs/configuration.html#output
   */
  config.output = isTest ? {} : {
    path: root(distFolderName),
    publicPath: isCiBuild ?
      './' : '/',
    filename: isProd ?
      'js/[name].[hash].js' : 'js/[name].js',
    chunkFilename: isProd ?
      '[id].[hash].chunk.js' : '[id].chunk.js'
  };

  /**
   * Resolve
   * Reference: http://webpack.github.io/docs/configuration.html#resolve
   */
  config.resolve = {
    // only discover files that have those extensions
    extensions: [
      '.ts',
      '.js',
      '.json',
      '.css',
      '.scss',
      '.html'
    ]
  };

  const prodTypescriptLoader = {
    test: /\.ts$/,
    use: '@ngtools/webpack'
  };

  const devTypescriptLoader = {
    test: /\.ts$/,
    use: [
      'ng-router-loader',
      {
        loader: 'awesome-typescript-loader',
        query: {
          /**
           * Use inline sourcemaps for "karma-remap-coverage" reporter
           */
          sourceMap: false,
          inlineSourceMap: true,
          compilerOptions: {
            /**
             * Remove TypeScript helpers to be injected
             * below by DefinePlugin
             */
            removeComments: true
          }
        }
      },
      'angular2-template-loader'
    ],
    exclude: [/\.e2e\.ts$/]
  };

  /**
   * Loaders
   * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
   * List: http://webpack.github.io/docs/list-of-loaders.html
   * This handles most of the magic responsible for converting modules
   */
  config.module = {
    rules: [
      isProd ? prodTypescriptLoader : devTypescriptLoader,

      // copy those assets to output
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=fonts/[name].[hash].[ext]'
      },

      {
        test: /\.(png|jpe?g|gif|svg|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=images/[name].[hash].[ext]'
      },

      // Support for CSS as raw text
      // use 'null' loader in test mode (https://github.com/webpack/null-loader)
      // all css in src/style will be bundled in an external css file
      {
        test: /\.css$/,
        exclude: root('src', 'app'),
        use: [
          {
            loader: isTest ? 'null-loader' : MiniCssExtractPlugin.loader,
            // options: {
            //   // you can specify a publicPath here
            //   // by default it use publicPath in webpackOptions.output
            //   publicPath: '../'
            // }
          },
          'css-loader',
          'postcss-loader'
        ]
        // loader: isTest ?
        //   'null-loader' : MiniCssExtractPlugin.loader({
        //     fallback: 'style-loader',
        //     use: ['css-loader', 'postcss-loader']
        //   })
      },
      // all css required in src/app files will be merged in js files
      {
        test: /\.css$/,
        include: root('src', 'app'),
        loader: 'raw-loader!postcss-loader'
      },

      // support for .scss files
      // use 'null' loader in test mode (https://github.com/webpack/null-loader)
      // all css in src/style will be bundled in an external css file
      {
        test: /\.(scss|sass)$/,
        exclude: root('src', 'app'),
        use: [
          {
            loader: isTest ? 'null-loader' : MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: isCiBuild ? prodMoxProxyBasePath : devBasePath
            }
          },
          {
            loader: 'css-loader',
            options: {
              minimize: true,
              sourceMap: true,
              url: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: () => autoprefixer(),
            }
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      // all css required in src/app files will be merged in js files
      {
        test: /\.(scss|sass)$/,
        exclude: root('src', 'style'),
        loader: 'raw-loader!postcss-loader!sass-loader'
      },

      // support for .html as raw text
      // todo: change the loader to something that adds a hash to images
      {
        test: /\.html$/,
        loader: 'raw-loader',
        exclude: root('src', 'public')
      }
    ]
  };

  if (isTest && !isTestWatch) {
    // instrument only testing sources with Istanbul, covers ts files
    config.module.rules.push({
      test: /\.ts$/,
      enforce: 'post',
      include: path.resolve('src'),
      loader: 'istanbul-instrumenter-loader',
      exclude: [/\.spec\.ts$/, /\.e2e\.ts$/, /node_modules/]
    });
  }

  /**
   * Plugins
   * Reference: http://webpack.github.io/docs/configuration.html#plugins
   * List: http://webpack.github.io/docs/list-of-plugins.html
   */
  config.plugins = [

    // Define env variables to help with builds
    // Reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    new webpack.DefinePlugin({
      ESURE_GLOBALS: {
        ENDTOEND: isEndToEndBuild,
        BRAND: JSON.stringify(process.env.BRAND),
        BRAND_CONFIG: JSON.stringify(brandConfig),
        LOADING_SPRITE_DELAY: loadingSpriteDelay
      }
    }),

    /**
     * Description: Provides context to Angular's use of System.import
     *
     * See: https://webpack.js.org/plugins/context-replacement-plugin/
     * See: https://github.com/angular/angular/issues/11580
     */
    new ContextReplacementPlugin(
      /**
       * The (\\|\/) piece accounts for path separators in *nix and Windows
       */
      /@angular(\\|\/)core(\\|\/)esm5/, root('./src'), {
        /**
         * your Angular Async Route paths relative to this root directory
         */
      }),

    /**
     * Remove all moment locales apart from en.
     */
    new ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
  ];

  if (!isTest && !isTestWatch) {
    config.plugins.push(
      // Generate common chunks if necessary
      // Reference: https://webpack.github.io/docs/code-splitting.html
      // Reference: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
      // new CommonsChunkPlugin({
      //   name: ['vendor', 'polyfills']
      // }),

      // Inject script and link tags into html files
      // Reference: https://github.com/ampedandwired/html-webpack-plugin
      new HtmlWebpackPlugin({
        template: './src/public/common/index.ejs',
        // chunksSortMode: 'none',
        chunksSortMode: function (a, b) {
          const entryPoints = ['inline', 'polyfills', 'sw-register', 'styles', 'vendor', 'main', 'css'];
          return entryPoints.indexOf(a.names[0]) - entryPoints.indexOf(b.names[0]);
        },
        excludeAssets: [/js\/css.*.js/], // exclude js/css.chunkid.js
        indexPageTitle: 'My Account | ' + brandConfig.brandName,
        maskIconColor: brandConfig.maskIconColor,
        buildTime: moment.utc().toString(),
        brand: process.env.BRAND,
        companyCode: brandConfig.companyCode,
        baseHref: isCiBuild ? prodMoxProxyBasePath : devBasePath,
        themeColor: brandConfig.themeColor,
        minify: isProd ? {
          caseSensitive: true,
          collapseWhitespace: true,
          keepClosingSlash: true,
          removeComments: true,
          minifyJS: true,
          minifyCSS: true
        } : false
      }),

      new HtmlWebpackPlugin({
        template: './src/public/common/unsupported.ejs',
        filename: 'unsupported.html',
        inject: false,
        brand: process.env.BRAND,
        brandName: brandConfig.brandName,
        fontColor: brandConfig.fontColor,
        baseHref: isCiBuild ? prodMoxProxyBasePath : devBasePath,
        chunksSortMode: 'none',
        minify: isProd ? {
          caseSensitive: true,
          collapseWhitespace: true,
          keepClosingSlash: true
        } : false
      }),

      new HtmlWebpackExcludeAssetsPlugin(),

      new XMLWebpackPlugin({
        files: [{
          template: path.join(__dirname, 'src/public/common/browserconfig.ejs'),
          filename: 'browserconfig.xml',
          data: {
            brand: process.env.BRAND,
            tileColor: brandConfig.tileColor
          }
        },
        {
          template: path.join(__dirname, 'src/public/common/manifest.ejs'),
          filename: 'manifest.json',
          data: {
            brand: process.env.BRAND,
            themeColor: brandConfig.themeColor,
            backgroundColor: brandConfig.backgroundColor
          }
        },
        {
          template: path.join(__dirname, 'src/public/common/scripts/esure-env.ejs'),
          filename: 'scripts/esure-env.js',
          data: {
            siteCatAccount: brandInfo.get(process.env.BRAND).siteCatAccount,
            port: isProd ? 3000 : brandInfo.get(process.env.BRAND).port,
            optimizelyUrl: noTags ? '' : envUrls.optimizely + brandInfo.get(process.env.BRAND).optimizelyAccount + '.js',
            livechatUrl: noTags ? '' : envUrls.livechat + 'applicationkey=' + brandInfo.get(process.env.BRAND).liveChatApplicationkey + '&consumerkey=' + brandInfo.get(process.env.BRAND).liveChatConsumerkey,
            iovationUrl: noTags ? '' : envUrls.iovation,
            tagManagerUrl: noTags ? '' : envUrls.tagManager
          }
        }
        ]
      }),

      // Extract css files
      // Reference: https://github.com/webpack/extract-text-webpack-plugin
      // Disabled when in test mode or not in build mode
      new MiniCssExtractPlugin({
        filename: 'css/[name].[hash].css',
        disable: !isProd
      }),

      /**
       * Plugin: ScriptExtHtmlWebpackPlugin
       * Description: Enhances html-webpack-plugin functionality
       * with different deployment options for your scripts including:
       *
       * See: https://github.com/numical/script-ext-html-webpack-plugin
       */
      new ScriptExtHtmlWebpackPlugin({
        sync: /inline|polyfills|vendor/,
        defaultAttribute: 'async',
        preload: [/polyfills|vendor|main/],
        prefetch: [/chunk/]
      })
    );

    if (analyzeBuild) {
      config.plugins.push(
        new BundleAnalyzerPlugin()
      );
    }
  }

  // Add build specific plugins
  if (isProd) {
    config.optimization = {
      minimizer: [
        // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
        // Minify all javascript, switch loaders to minimizing mode
        new UglifyJsPlugin({
          sourceMap: true,
          parallel: true,
          uglifyOptions: {
            compress: {
              drop_console: false, // Ensure this is false, we will tell it which console methods to remove using the pure_funcs array
              warnings: false, // Don't output warnings in the console
              pure_funcs: ['console.log', 'console.debug', 'console.info', 'console.warn'], // Remove certain console lines apart from error
            },
            output: {
              comments: false
            }
          }
        })
      ],
      splitChunks: {
        chunks: 'all'
      },
      noEmitOnErrors: true
    };

    config.plugins.push(

      new AngularCompilerPlugin({
        tsConfigPath: root('tsconfig.json'),
        mainPath: root('src/main.ts'),
        sourceMap: false,
      }),

      // Copy assets from the public folder
      // Reference: https://github.com/kevlened/copy-webpack-plugin
      new CopyWebpackPlugin([{
        from: root('src/public/common'),
        ignore: '*.ejs',
      }, {
        from: root('src/public/brand/' + process.env.BRAND),
        to: process.env.BRAND
      }]));
  }

  /**
   * Dev server configuration
   * Reference: http://webpack.github.io/docs/configuration.html#devserver
   * Reference: http://webpack.github.io/docs/webpack-dev-server.html
   */
  config.devServer = {
    contentBase: [
      './src/public/common', './src/public/brand'
    ],
    historyApiFallback: true,
    quiet: true,

    // Get Virtual Box working
    compress: true,
    disableHostCheck: true,
    /*
    setup: function(app) {
      app.use('/*', (req, res) => res.status(404).json({ status: 'error', message: 'Page not found' }));
    },
    */
    stats: 'minimal' // none (or false), errors-only, minimal, normal (or true) and verbose
  };

  return config;
}();

// Helper functions
function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}
