@ClaimHome @Claim

  Feature: Claim Home
    In order to manage their policy
    A user
    Should be be able to access contact numbers to call in the event of a home claim

  Background:  User is logged in
    Given I am a logged in portal user with a home policy
      | email              | password  |
      | demoone@esmock.com | demouser1 |


  Scenario: User can view all relevant claims information
    When I click the Make a claim link for a Home policy
    Then I can see all Home claim information including telephone numbers


