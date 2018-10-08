@Changes
Feature: Changes
  In order to keep their policies up to date
  A user must be able to make changes to their policies

  Background: User is logged in
    Given I am a logged in portal user with a home policy
      | email               | password  |
      | demoone@esmock.com  | demouser1 |

  Scenario: User can see all page elements
    When I click the Make changes link
    Then I can see all information including telephone number
