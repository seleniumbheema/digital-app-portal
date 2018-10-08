# DAI-44
@Skip
@ChangePassword
Feature: Change Password
  A user logged into the portal
  should be able to change their password

  Background: User is logged in
    Given I am a logged in portal user
      | email          | password   |
      | ten@esmock.com | Customer10 |
    And navigates to 'My details' page from Menu
    And selects 'Change Password' option

  Scenario: Customer enters their current password incorrectly
    And enters their current password incorrectly
    And completes all other fields correctly
    When the form is submitted
    Then an error message is displayed

  Scenario: Customer successfully changes password and logs back in
    And enters their current password of "Customer10"
    When the user enters a new password of "NewPassword1"
    And confirms the new password of "NewPassword1"
    And both the entries match
    And they conform to standard input validation
    And the form is submitted
    Then the password is successfully updated
    And the user is automatically logged out
    And shown the change password success screen prompting them to login again
    And an acknowledgment email is sent to the user
    And the user can sign in using their existing email address and new password
      | email          | password     |
      | ten@esmock.com | NewPassword1 |
