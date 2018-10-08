const reporter = require('cucumber-html-reporter');

const options = {
  theme: 'bootstrap',
  jsonFile: './test-reports/cucumber/cucumber-summary.json',
  output: './test-reports/cucumber/cucumber-summary.html',
  reportSuiteAsScenarios: true,
  screenshotsDirectory: './test-reports/cucumber/screenshots/',
  storeScreenshots: true,
  launchReport: false,
  brandTitle: 'End To End Tests Report',
  metadata: {
    'Test Environment': 'Localhost',
    'Browser': 'Latest Chrome',
  }
};

reporter.generate(options);
