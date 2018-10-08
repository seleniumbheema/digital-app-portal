# DAI-44
@Skip
@ChangeEmail
Feature: Change Email
  A user logged into the portal
  should be able to change their email

  Background: User is logged in
    Given I am a logged in portal user
      | email          | password  |
      | two@esmock.com | Customer2 |
    And navigates to 'My details' page from Menu
    And selects 'Change Email' option

  Scenario: Customer enters an email already in use
    And enters "one@esmock.com" as the new email address
    And confirms "one@esmock.com" as the new email address
    And verifies their current password as "Customer2"
    When the change email form is submitted
    Then an error message is displayed
    And an inline error message is displayed on the new email field

  Scenario: Customer enters their current password incorrectly
    And enters "new@esmock.com" as the new email address
    And confirms "new@esmock.com" as the new email address
    And verifies their current password incorrectly
    When the change email form is submitted
    Then an error message is displayed
    And an inline error message is displayed on the verify password field

  Scenario: Customer enters their current password incorrectly and an email in use
    And enters "one@esmock.com" as the new email address
    And confirms "one@esmock.com" as the new email address
    And verifies their current password incorrectly
    When the change email form is submitted
    Then an error message is displayed
    And an inline error message is displayed on the verify password field
    And an inline error message is displayed on the new email field

  Scenario: Customer successfully changes their email
    And enters "new@esmock.com" as the new email address
    And confirms "new@esmock.com" as the new email address
    And verifies their current password as "Customer2"
    When the change email form is submitted
    Then the email is successfully updated
    And the user is automatically logged out
    And shown the change email success screen prompting them to login again
    And an acknowledgment email is sent to the user
