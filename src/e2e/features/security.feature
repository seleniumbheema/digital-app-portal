@Security

Feature: Security
  In order to prevent misuse
  The site must have security measures in place

  Background: User is logged in
    Given I am a logged in portal user
      | email                 | password   |
      | demothree@esmock.com  | demouser3  |

  Scenario: User cannot view policy they don't own
    When I attempt to view a policy that is not mine
    Then I am prevented from viewing the policy

