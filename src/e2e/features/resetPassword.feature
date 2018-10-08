@ResetPassword
Feature: Reset forgotten Password
  In order to log into MyAccount
  A user must be able to reset their password if they have forgotten it


  Background: User is not logged in
    Given I am a user that is not logged in

  Scenario: Successful reset password
    When I attempt to reset my forgotten password
    And I enter new reset password credentials
    Then the reset password form successfully submits the request
    And I am able to login with my reset password
