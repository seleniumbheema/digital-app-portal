@Documents @DocumentsMotor

Feature: Documents Motor
  In order to view their policy documents
  A user must be able to access motor documents for both current and old policies

  Background:  User is logged in
    Given I am a logged in portal user with a motor policy with previous policy years
      | email                 | password   |
      | documents@esmock.com  | documents1 |

  Scenario: User can access documents for old policy
    When I click the view Documents link for a current motor policy
    Then I can access the motor Documents page

#  TODO - fix some flakiness
#  Scenario: All expected elements are correct for current and past years
#    When I view Documents for an old motor policy with multiple past policy years
#    Then I should see all relevant motor documents elements for all years

