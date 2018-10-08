@NCD
Feature: NCD
  In order to ensure their policy is accurate
  A user must have the ability to upload their proof of NCD

  Background: User is logged in
    Given I am a logged in Portal user with a Motor policy with outstanding NCD proof
      | email               | password  |
      | renewal@esmock.com  | renewal1  |

  Scenario: User uploads from Cover Details page
    When I view Cover Details
    Then I am able to upload my proof of NCD

  Scenario: User uploads from Policy Summary page
    When I view Policy Summary
    Then I am able to upload my proof of NCD

