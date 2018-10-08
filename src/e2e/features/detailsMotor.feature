@Details @DetailsMotor

Feature: Details Motor
  In order to view their policies
  A user must be able to access cover details for both current and old policies

  Background:  User is logged in
    Given I am a logged in portal user with both a current and old motor policy
      | email              | password  |
      | five@esmock.com    | Customer5 |

  Scenario: User can access details for current policy
    When I click the view Cover details link for a current motor policy
    Then I can access the motor Cover details page

  Scenario: User can access details for old policy
    When I click the view Cover details link for an old motor policy
    Then I can access the motor Cover details page

  Scenario: User can view all relevant cover details
    When I view Cover details for a current motor policy
    Then I should see all relevant motor policy information
