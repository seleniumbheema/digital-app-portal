exports.config = {
  baseUrl: 'http://localhost:3000/',

  specs: [
    'src/e2e/lib/**/*.e2e.js'
  ],
  exclude: [],

  framework: 'jasmine2',

  // https://github.com/angular/protractor/blob/master/docs/async-await.md
  SELENIUM_PROMISE_MANAGER: false,

  allScriptsTimeout: 110000,

  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: false,
    includeStackTrace: false,
    defaultTimeoutInterval: 400000
  },
  directConnect: true,

  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': ['--disable-web-security']
    }
  },

  onPrepare: function () {
    require('jasmine-expect');
    const fs = require('fs-extra');
    // Create all required folders
    fs.ensureDirSync('test-reports/e2e/screenshots');
    let SpecReporter = require('jasmine-spec-reporter').SpecReporter;
    // add jasmine spec reporter
    jasmine.getEnv().addReporter(new SpecReporter({
      displayStacktrace: true
    }));

    browser.ignoreSynchronization = true;


    let jasmineReporters = require('jasmine-reporters');
    jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
      consolidateAll: true,
      savePath: './test-reports/e2e/',
      filePrefix: 'xmlresults'
    }));

    jasmine.getEnv().addReporter({
      specDone: function (result) {
        if (result.status == 'failed') {
          browser.getCapabilities().then(function (caps) {
            let browserName = caps.get('browserName');
            browser.takeScreenshot().then(function (png) {
              // TODO: Filenames have spaces in them which wont work on Windows
              // const fileName = result.fullName.replace(/\s/g, '-');
              const fileName = result.fullName;

              // TODO: Work out how to align the result.fullName with the screenshot name used in the report.
              let stream = fs.createWriteStream('test-reports/e2e/screenshots/' + browserName + '-' + fileName + '.png');
              stream.write(new Buffer(png, 'base64'));
              stream.end();
            });
          });
        }
      }
    });

    return browser.getProcessedConfig().then(function(config) {
      // eslint-disable-next-line no-console
      console.info('---------------------------------\nE2E tests animations are: ' + config.params.animations + '\n---------------------------------');
    });

  },

  // HTMLReport called once tests are finished
  onComplete: () => {
    let browserName, browserVersion;
    let capsPromise = browser.getCapabilities();

    capsPromise.then(function (caps) {
      browserName = caps.get('browserName');
      browserVersion = caps.get('version');

      let HTMLReport = require('protractor-html-reporter');

      let testConfig = {
        reportTitle: 'End-2-End Status Report',
        outputPath: './test-reports/e2e/',
        screenshotPath: 'screenshots',
        testBrowser: browserName,
        browserVersion: browserVersion,
        modifiedSuiteName: true,
        screenshotsOnlyOnFailure: true
      };
      new HTMLReport().from('test-reports/e2e/xmlresults.xml', testConfig);
    });
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
