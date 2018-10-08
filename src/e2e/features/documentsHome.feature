@Documents @DocumentsHome

Feature: Documents Home
  In order to view their policy documents
  A user must be able to access home documents for both current and old policies

  Background:  User is logged in
    Given I am a logged in portal user with a home policy with previous policy years
      | email                 | password   |
      | documents@esmock.com  | documents1 |

  Scenario: User can access documents for current policy
    When I click the view Documents link for a current home policy
    Then I can access the home Documents page

  Scenario: User can access documents for old policy
    When I click the view Documents link for a old home policy
    Then I can access the home Documents page

  Scenario: All expected elements are correct
    When I view Documents for a current home policy
    Then I should see all relevant home documents elements

#  TODO - fix some flakiness
#  Scenario: All expected elements are correct for current and past years
#    When I view Documents for a current home policy with multiple past policy years
#    Then I should see all relevant home documents elements for all years

  Scenario: Account with no documents fails gracefully
    When I view Documents for a policy with no documents
    Then The page loads with the no policies banner
