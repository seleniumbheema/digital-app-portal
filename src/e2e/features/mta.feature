@MTA
Feature: MTA
  In order to keep their policy up to date
  A user
  Should be able to complete MTA changes forms

  Background: User is logged in
    Given I am a logged in portal user with a motor policy
      | email            | password  |
      | three@esmock.com | Customer3 |

  Scenario: Happy flow permanent driver
    When I attempt to add a Permanent licenced driver
    Then the form successfully submits the request

  Scenario: Happy flow temporary driver
    When I attempt to add a Temporary licenced driver
    Then the form successfully submits the request

  Scenario: Add driver to policy with 2 existing additional drivers
    When I attempt to add a Permanent driver
    And I already have 2 additional drivers on my policy
    Then I am directed to phone for a quote

  Scenario: Add driver to policy who does not meet criteria
    When I attempt to add a Temporary driver
    And I am unable to agree to the acceptance criteria questions
    Then I am directed to phone for a quote

  Scenario: Add driver to policy starting today
    When I attempt to add a Temporary driver
    And the from date entered is today's date
    Then I am displayed with an informative message
  # And I am directed to phone for a quote

  Scenario: Happy flow change car registration
    When I attempt to change my car registration
    Then the form successfully submits the request

  Scenario: Happy flow add conviction
    When I attempt to add a conviction
    Then the form successfully submits the request


  Scenario: Happy flow change car
    When I attempt to change my car type
    Then the form successfully submits the request

