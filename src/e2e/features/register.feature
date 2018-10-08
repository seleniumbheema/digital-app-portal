@Register
Feature: Register
  In order to use the portal as a current customer
  A user
  Should be able to use the register form to access portal

  Background: User is not logged in
    Given I am a user that is not logged in

  Scenario: Registering for portal account with no existing account
    When I attempt to register for a portal account without prior registration
    Then the register form successfully submits the request
    And navigates to the "/confirmation/create" page

  Scenario: Registering for portal account with an existing account
    When I attempt to register for a portal account with prior registration
    Then the register form successfully submits the request
    And navigates to the "/confirmation" page


