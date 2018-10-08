# Digital Apps: Customer Portal App

This repository contains the esure, Shelias' Wheels and First Alternative customer portal application built using [Angular](https://angular.io/).

[![Build Status](https://travis-ci.com/esure-dev/digital-app-portal.svg?token=57UneSUqzvH7s7ApyZYv&branch=master)](https://travis-ci.com/esure-dev/digital-app-portal)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployments](#deployments)
for instances of the project deployed to our AWS servers.

### Prerequisites

You will need to install the following:

* Node 8.11.2+: [https://nodejs.org/en/](https://nodejs.org/en/)
* NPM 6.1.0+: [https://docs.npmjs.com/getting-started/installing-node](https://docs.npmjs.com/getting-started/installing-node)
* (Mac Only) xCode: [https://developer.apple.com/xcode/](https://developer.apple.com/xcode/)
* (Windows Only) windows-build-tools: npm install --global windows-build-tools
* xAPI (Experience API) Digital App: [https://github.com/esure-dev/digital-app-xapi](https://github.com/esure-dev/digital-app-xapi)
* mAPI (Mock API) Digital App: [https://github.com/esure-dev/digital-app-mapi](https://github.com/esure-dev/digital-app-mapi)

### Install

The following instructions will download the Customer Portal from our GIT repository, install it locally.

> The Customer Portal Digital App requires the xAPI Digital App and the mAPI Digital to be running locally first.

```bash
# clone our repository
$ git clone git@github.com:esure-dev/digital-app-portal.git digital-app-portal

# change directory to your app
$ cd digital-app-portal

# install the global and project dependencies with npm
$ npm install -g npm@6.1.0
$ npm install
```

### Build

To build the site for a particular brand into the `/dist/` folder, please use one of the following:

```bash
# esure
npm run build:es

# Sheilas' Wheels
npm run build:sw

# First Alternative
npm run build:fa
```

> Note: `npm run build` will default to npm run build:es

### Run locally

To run the site locally, please use one of the following:

```bash
# esure -> http://localhost:4201
$ npm run start:es

# Sheilas Wheels -> http://localhost:4202
$ npm run start:sw

# First Alternative -> http://localhost:4203
$ npm run start:fa
```

### Execute the tests

```bash
# Typescript, Javascript, Sass and Markdown code lint tests
npm run lint

# Unit Tests (single run including HTML coverage report)
npm test

# Unit Tests (live mode)
npm run test-watch
```

#### End to End Tests

Currently we have both [Jasmine](https://jasmine.github.io/) and [Cucumber](https://cucumber.io/) frameworks for running end to end tests.
The plan will be to only use Cucumber, but for now we have a mixture of both.

To launch the original set of Jasmine tests, execute the following:

```bash
npm run e2e
```

To launch the newer Cucumber tests, see some examples below.

```bash
# NOTE: quotation marks are needed if you need to use spaces in your tag configuration

# Will run all tags
npm run cucumber

# Will run all tags with @MTA or @Login
npm run cucumber -- "@MTA or @Login"

# Will run only @MTA tags
npm run cucumber -- @MTA

# Will run all tags that are not @Login
npm run cucumber -- "not @Login"
```

If you want to skip some scenarios or whole feature file from running, you can tag it with **@Skip**

```gherkin
@Skip
Feature: Name of feature

@Skip
Scenario: Name of scenario
```

This project includes a patch for selenium-webdriver which hopefully fixes any EPIPE errors that sometimes occur during the running of the e2e tests.

This patch is run automatically as part of the postinstall npm lifecycle. It can likely be removed once Protractor is updated to have a dependency on selenium-webdriver 4.

## Generating Technical Documentation

Technical documentation can be generated automatically using [Compodoc](https://compodoc.github.io/website/) and placed into a `/documenation/` folder, using the following command:

```bash
npm run build:docs
```

> Please ensure that the site has been build and tested before generating the documentation.

## Continuous Integration

The git repository is 'pinned' to Travis CI, which will automatically build, test and deploy the codebase.

The following reports are generated:

* [Technical Overview](https://s3-eu-west-1.amazonaws.com/s3-ec-ext-dev-all-digital-app-docs/digital-app-portal/compodoc/overview.html)
* [Code Quality Anaylysis (SonarCloud)](https://sonarcloud.io/dashboard?id=com.digital_apps%3Adigital-app-portal)
* [Unit Test Report](https://s3-eu-west-1.amazonaws.com/s3-ec-ext-dev-all-digital-app-docs/digital-app-portal/test-reports/unit/status_report.html)
* [Unit Test Coverage](https://s3-eu-west-1.amazonaws.com/s3-ec-ext-dev-all-digital-app-docs/digital-app-portal/test-reports/unit/coverage/html/index.html)
* E2E Test Report - coming soon
* [Vulnerability Report (Snyk)](https://app.snyk.io/org/steve-martin-at-esure/project/9c8cf731-6d94-42cd-8ba5-8aedb4be5562)
* [CI Pipeline Status (Travis)](https://travis-ci.com/esure-dev/digital-app-portal/branches/)

## Deployments

* [Development - esure](https://edevh1.es-dte.co.uk/my-account)
* [Development - Sheilas Wheels](https://ldevh1.es-dte.co.uk/my-account)
* [Development - First Alternative](https://fdevh1.es-dte.co.uk/my-account)
* [Test - esure](https://etstm.es-dte.co.uk/my-account)
* [Test - Sheilas Wheels](https://ltstm.es-dte.co.uk/my-account)
* [Test - First Alternative](https://ftstm.es-dte.co.uk/my-account)

### Local Docker Containers

The code is built inside a Docker Container before it's deployed onto an AWS server.
To locally test the Docker Container (for each of the 3 brands) please use the following script:

```bash
npm run ci:local
# http://localhost:8010 - esure
# http://localhost:8020 - Sheilas' Wheels
# http://localhost:8030 - First Alternative
```

### Deploying a new base Nginx image

This project pulls down a custom built Nginx image from our internal AWS ECR repository. To get a new image deployed
you need to use the [Digital App Base Docker Container repository](https://github.com/esure-dev/digital-app-base-docker-containers)

### Environment Variables

The table below lists the environment variables being used by the app. Example values have been provided for
DEV and PROD environments.

| NAME                   | DEV                                                         | PROD                   |
|------------------------|-------------------------------------------------------------|------------------------|
| ACCESS_LOG_DIR         |                                                             | /var/log/nginx/healthd |
| XAPI_URL               | `http://localhost:4000`                                     |                        |
| TAG_MANAGER_URL        | //nexus.ensighten.com/esure/customerportal-stg/Bootstrap.js | //nexus.ensighten.com/esure/customerportal/Bootstrap.js |
| OPTIMIZELY_URL         | //cdn.optimizely.com/js/5369993155.js                       |                        |
| SITE_CAT_ACCOUNT       | esuredev                                                    | esureprod              |
| VERSION                | 'Only available when the build is done through Travis'      |                        |
| BRAND_URL              | 'localhost'                                                 | esure.com              |
| LIVECHAT_URL           | //cdn.synthetix.com/penfield/get_synthetix.min.js?applicationkey=3ea4141ea87348dbb912fb0da71ca70b&consumerkey=4c167aecf0453dea74659aadd46459df | As dev |
| IOVATION_URL           | //ci-mpsnare.iovation.com/snare.js                          |                        |
| RECAPTCHA_SITEKEY      | 6LdB7VYUAAAAAHX8Gh5MavUxxzRiWClu6UApHSfq                    |                        |

## Contributing

Please refer to the esure [Digital Apps Developer page](https://myesure.atlassian.net/wiki/spaces/BPDADEV/overview) for information on how to contribute to this project.
The GitHub repository is available [here](https://github.com/esure-dev/digital-app-portal).

## Release Notes

Full release notes for this Digital App can be found on GitHub [here](https://github.com/esure-dev/digital-app-portal/releases).
