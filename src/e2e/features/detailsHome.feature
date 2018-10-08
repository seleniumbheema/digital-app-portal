@Details @DetailsHome

Feature: Details Home
  In order to view their policies
  A user must be able to access cover details for both current and old policies

  Background:  User is logged in
    Given I am a logged in portal user with both a current and old home policy
      | email              | password  |
      | one@esmock.com     | Customer1 |

  Scenario: User can access details for current policy
    When I click the view Cover details link for a current home policy
    Then I can access the home Cover details page

  Scenario: User can access details for old policy
    When I click the view Cover details link for a old home policy
    Then I can access the home Cover details page

  Scenario: User can view all relevant cover details
    When I view Cover details for a current home policy
    Then I should see all relevant home policy information

  Scenario: Buildings only policy does not show contents elements
    When I view cover details for a buildings only policy
    Then contents related fields do not appear
