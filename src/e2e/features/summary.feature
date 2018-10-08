@Summary

Feature: Summary
  In order to get visibility of all of their policies
  A user must have the ability to view high level summary information from the policy summary page

  Background: User is logged in
    Given I am a logged in Portal user with both Motor and Home policies
      | email                 | password   |
      | demothree@esmock.com  | demouser3  |

  Scenario: User with both home and motor policies views policy summary
    When I view the Policy Summary page
    Then I should see Policy summary details for my Motor policy
    Then I should see policy summary details for my Home policy

  Scenario: Ordering of policies
    When I view the Policy Summary page
    Then the policies are ordered in reverse chronological order

  Scenario: Links for old policies
    When I view the Policy Summary page
    Then only Cover details and My documents links are visible on old policies
