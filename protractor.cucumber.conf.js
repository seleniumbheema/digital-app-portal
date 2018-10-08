/**
 * Examples of passing tags:
 * NOTE: quotation marks are needed if you need to use spaces in your tag configuration
 * npm run cucumber                     (Will run all tags)
 * npm run cucumber -- "@MTA or @Login" (Will run all tags with @MTA or @Login)
 * npm run cucumber -- @MTA             (Will run only @MTA tags)
 * npm run cucumber -- "not @Login"     (Will run all tags that are not @Login)
 */
exports.config = {
  baseUrl: 'http://localhost:3000/',

  specs: [
    './src/e2e/features/*.feature'
  ],
  exclude: [],

  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),

  // cucumber command line options
  cucumberOpts: {
    // require step definition files before executing features
    require: ['./src/e2e/step_definitions/*.ts', './src/e2e/support/*.ts'],
    // <string[]> (expression) only execute the features or scenarios with tags matching the expression
    tags: process.env.npm_config_cucumberTags || '',
    // <boolean> fail if there are any undefined or pending steps
    strict: true,
    // <string[]> (type[:path]) specify the output format, optionally supply PATH to redirect formatter output (repeatable)
    format: [
      'node_modules/cucumber-pretty',
      'json:test-reports/cucumber/cucumber-summary.json'
    ],
    formatOptions: [
      { colorsEnabled: true }
    ],
    // <boolean> invoke formatters without executing steps
    dryRun: false,
  },

  // https://github.com/angular/protractor/blob/master/docs/async-await.md
  SELENIUM_PROMISE_MANAGER: false,

  allScriptsTimeout: 110000,

  directConnect: true,

  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': ['incognito', 'start-maximized', 'auto-open-devtools-for-tabs']
    }
  },

  onPrepare: () => {
    const fs = require('fs-extra');
    // Create all required folders, and make sure empty if already existed
    fs.emptyDirSync('test-reports/cucumber');
    require('ts-node').register({
      project: './tsconfig.e2e.json'
    });

    browser.ignoreSynchronization = true;
    const dashes = '-----------------------------------------------------';

    return browser.getProcessedConfig().then(function (config) {
      // eslint-disable-next-line no-console
      console.info(dashes + '\nE2E tests animations are: ' + config.params.animations +
        '\nCucumber tags are: ' + (config.cucumberOpts.tags || 'Unspecified (So running all)') + '\n' + dashes);
    });

  },

  // HTMLReport called once tests are finished
  onComplete: () => {
    require('./src/e2e/support/cucumber-html-report-generator');
  },

  params: {
    animations: true
  },

  /**
   * Angular 2 configuration
   *
   * useAllAngular2AppRoots: tells Protractor to wait for any angular2 apps on the page instead of just the one matching
   * `rootEl`
   *
   */
  useAllAngular2AppRoots: true
};
