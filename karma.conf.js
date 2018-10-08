const path = require('path');
const webpackConfig = require('./webpack.config');

const ENV = process.env.npm_lifecycle_event;
const isTestWatch = ENV === 'test-watch';

module.exports = function (config) {
  let _config = {

    client: {
      captureConsole: process.env.TESTS_CONSOLE_LOGGING ? true : false,
    },

    browserConsoleLogOptions: {
      level: 'warn'
    },

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'jasmine-matchers'],

    // list of files / patterns to load in the browser
    files: [{
      pattern: './karma-shim.js',
      watched: false
    },
    {
      pattern: './src/public/common/**/*',
      watched: false,
      included: false,
      served: true,
      nocache: false
    },
    {
      pattern: './src/public/brand/**/*',
      watched: false,
      included: false,
      served: true,
      nocache: false
    }
    ],

    /*
     * By default all assets are served at http://localhost:[PORT]/base/
     */
    proxies: {
      '/img/': '/base/src/public/common/img/',
      '/esure/': '/base/src/public/brand/esure/',
      '/scripts/': '/base/src/public/common/scripts/'
    },

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './karma-shim.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i. e.
      stats: 'errors-only'
    },

    webpackServer: {
      noInfo: true // please don't spam the console when running in karma!
    },

    // test results reporter to use
    // possible values: 'dots', 'progress', 'mocha'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'kjhtml'],

    // Config for the karma-mocha-reporter
    // https://www.npmjs.com/package/karma-mocha-reporter
    mochaReporter: {
      // Ignore skipped from the output, very useful when using fdescribe and only want the one test/class showing up
      ignoreSkipped: true,
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome_no_sandbox'],
    customLaunchers: {
      Chrome_no_sandbox: {
        base: 'Chrome',
        // flags: ['--no-sandbox']
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    coverageIstanbulReporter: {
      // reports can be any that are listed here: https://github.com/istanbuljs/istanbuljs/tree/aae256fb8b9a3d19414dcf069c592e88712c32c6/packages/istanbul-reports/lib
      reports: ['html', 'lcovonly', 'text-summary'],

      // base output directory. If you include %browser% in the path it will be replaced with the karma browser name
      dir: path.join(__dirname, 'test-reports/unit/coverage'),

      // Combines coverage information from multiple browsers into one report rather than outputting a report
      // for each browser.
      combineBrowserReports: true,

      // if using webpack and pre-loaders, work around webpack breaking the source path
      fixWebpackSourcePaths: true,

      // stop istanbul outputting messages like `File [${filename}] ignored, nothing could be mapped`
      skipFilesWithNoCoverage: false,

      // Most reporters accept additional config options. You can pass these through the `report-config` option
      'report-config': {
        // all options available at: https://github.com/istanbuljs/istanbuljs/blob/aae256fb8b9a3d19414dcf069c592e88712c32c6/packages/istanbul-reports/lib/html/index.js#L135-L137
        html: {
          // outputs the report in ./coverage/html
          subdir: 'html'
        }
      },

      // enforce percentage thresholds
      // anything under these percentages will cause karma to fail with an exit code of 1 if not running in watch mode
      thresholds: {
        emitWarning: false, // set to `true` to not fail the test command when thresholds are not met
        // thresholds for all files
        global: {
          statements: 95,
          lines: 95,
          branches: 95,
          functions: 95
        },
        // thresholds per file
        each: {
          statements: 25,
          lines: 25,
          branches: 25,
          functions: 25,
        }
      },

      verbose: false // output config used by istanbul for debugging
    },

    htmlReporter: {
      outputFile: 'test-reports/unit/status_report.html',

      // Optional
      pageTitle: 'Unit Test Status Report',
      subPageTitle: '',
      groupSuites: true,
      useCompactStyle: false,
      useLegacyStyle: false
    }
  };

  if (!isTestWatch) {
    // Add the reporters required to generate the coverage and html reports.
    _config.reporters.push('html', 'coverage-istanbul');
  }

  config.set(_config);
};
