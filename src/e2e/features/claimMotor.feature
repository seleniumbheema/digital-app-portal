@ClaimMotor @Claim

Feature: Claim Motor
  In order to manage their policy
  A user
  Should be be able to access contact numbers to call in the event of a motor claim

  Background:  User is logged in
    Given I am a logged in portal user with a motor policy
      | email              | password  |
      | demotwo@esmock.com | demouser2 |


  Scenario: User can view all relevant claims information
    When I click the Make a claim link for a Motor policy
    Then I can see all Motor claim information including telephone numbers
    Then I can access the accident support page
