import { expect } from 'chai';
import { When, Then } from 'cucumber';
import * as moment from 'moment';

import { AddConvictionPage, AddDriverPage, MakeChangePage, ChangeCarPage, ChangeRegistrationPage } from '../po/policyAmendments.po';
import { PoliciesPage } from '../po/policies.po';
import { ProtractorUtils as utils } from '../po/app/utilities.po';

const makeChangePage = new MakeChangePage();
const addDriverPage = new AddDriverPage();
const changeRegistrationPage = new ChangeRegistrationPage();
const addConvictionPage = new AddConvictionPage();
const changeCarPage = new ChangeCarPage();
const policiesPage = new PoliciesPage();
const now: moment.Moment = moment.utc();

When('I attempt to add a Permanent licenced driver', async () => {
  await policiesPage.clickSpecifiedMakeChangesLink(0);
  await makeChangePage.clickAddDriverButton();
  await addDriverPage.chooseDriverType('permanent');
  await addDriverPage.moreThanTwoAdditionalDrivers('negative');
  await addDriverPage.chooseDeclaration('affirmative');
  await utils.waitForElementByIdAndClick('submitScreening');
  await addDriverPage.checkDriverDetailsFormShown();
  // const promises = [];
  await addDriverPage.enterTitle();
  await addDriverPage.enterForename('FirstName');
  await addDriverPage.enterSurname('Surname');
  await addDriverPage.enterMaritalStatus();
  await addDriverPage.chooseGenderType('affirmative');
  await addDriverPage.enterDateOfBirth('01-01-1960');
  await addDriverPage.employmentStatus();
  await addDriverPage.relationshipToYou();
  await addDriverPage.licenceType();
  await addDriverPage.yearsLicenceHeld();
  // await Promise.all(promises);
  await utils.waitForElementByIdAndClick('submit-button');
});

When('I attempt to add a Temporary licenced driver', async () => {
  await policiesPage.clickSpecifiedMakeChangesLink(0);
  await makeChangePage.clickAddDriverButton();
  await addDriverPage.chooseDriverType('temporary');
  await addDriverPage.enterTempDriverFromDate(now.clone().add(2, 'days').format('DD-MM-YYYY'));
  await addDriverPage.enterTempDriverUntilDate(now.clone().add(4, 'days').format('DD-MM-YYYY'));
  await addDriverPage.chooseDeclaration('affirmative');
  await utils.waitForElementByIdAndClick('submitScreening');
  await addDriverPage.checkDriverDetailsFormShown();
  // const promises = [];
  await addDriverPage.enterTitle();
  await addDriverPage.enterForename('FirstName');
  await addDriverPage.enterSurname('Surname');
  await addDriverPage.enterMaritalStatus();
  await addDriverPage.chooseGenderType('affirmative');
  await addDriverPage.enterDateOfBirth('01-01-1960');
  await addDriverPage.employmentStatus('Employed');
  await addDriverPage.relationshipToYou();
  await addDriverPage.licenceType();
  await addDriverPage.yearsLicenceHeld('2 Years');
  // await Promise.all(promises);
  await addDriverPage.enterOccupation('Chicken Chaser');
  await addDriverPage.enterIndustry('Farming');
  await addDriverPage.chooseSecondOccupationType('affirmative');
  await addDriverPage.enterSecondaryOccupation('Chicken Sexer');
  await addDriverPage.monthsLicenceHeld();
  await utils.waitForElementByIdAndClick('submit-button');
});

When('I attempt to add a Permanent driver', async () => {
  await policiesPage.clickSpecifiedMakeChangesLink(0);
  await makeChangePage.clickAddDriverButton();
  await addDriverPage.chooseDriverType('permanent');
});

When('I attempt to add a Temporary driver', async () => {
  await policiesPage.clickSpecifiedMakeChangesLink(0);
  await makeChangePage.clickAddDriverButton();
  await addDriverPage.chooseDriverType('temporary');
});

When('I already have 2 additional drivers on my policy', async () => {
  await addDriverPage.moreThanTwoAdditionalDrivers('affirmative');
});

When('I am unable to agree to the acceptance criteria questions', async () => {
  await addDriverPage.chooseDeclaration('negative');
});

When('the from date entered is today\'s date', async () => {
  await addDriverPage.enterTempDriverFromDate(now.format('DD-MM-YYYY'));
  await addDriverPage.enterTempDriverUntilDate(now.clone().add(4, 'days').format('DD-MM-YYYY'));
});

Then('I am displayed with an informative message', async () => {
  expect(await utils.waitForElementPresent('.date-input .help.is-danger')).to.be.true;
});

// Change Car Registration
When('I attempt to change my car registration', async () => {
  await policiesPage.clickSpecifiedMakeChangesLink(0);
  await makeChangePage.clickChangeRegistrationButton();
  await changeRegistrationPage.enterCarRegistration('LX04ZUT');
  await utils.waitForElementByIdAndClick('submit-button');
});

// Add conviction
When('I attempt to add a conviction', async () => {
  await policiesPage.clickSpecifiedMakeChangesLink(0);
  await makeChangePage.clickAddConvictionButton();
  await addConvictionPage.chooseRelatesTo('affirmative');
  await addConvictionPage.chooseLicenceSuspended('negative');
  await addConvictionPage.chooseNumConvictions('negative');
  await addConvictionPage.enterConvictionCode();
  await addConvictionPage.enterConvictionDate(now.clone().subtract(2, 'weeks').format('DD-MM-YYYY'));
  await addConvictionPage.enterPenaltyPoints(3);
  await utils.waitForElementByIdAndClick('submit-button');
});

// Change Car Type
When('I attempt to change my car type', async () => {
  await policiesPage.clickSpecifiedMakeChangesLink(0);
  await makeChangePage.clickChangeCarButton();
  await changeCarPage.chooseRegKnownType('affirmative');
  await changeCarPage.mtaOwnerType('affirmative');
  await changeCarPage.carModifiedType('negative');
  await utils.waitForElementByIdAndClick('submitScreening');
  await changeCarPage.checkChangeCarDetailsFormShown();
  await changeCarPage.enterCarRegistration('LX04ZUT');
  await changeCarPage.findCarLookUp();
  await changeCarPage.enterValuation('10000');
  await changeCarPage.carPurchasedOption('affirmative');
  await changeCarPage.enterPurchaseDate('01-01-1999');
  await utils.waitForElementByIdAndClick('submit-button');
});

/* Generic thens covering all the MTA forms */
Then('the form successfully submits the request', async () => {
  expect(await utils.waitForElementPresent('.mta-conf')).to.be.true;
});

Then('I am directed to phone for a quote', async () => {
  expect(await utils.waitForElementPresent('#call-msg')).to.be.true;
});
