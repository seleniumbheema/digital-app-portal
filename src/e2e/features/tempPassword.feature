@TempPassword

Feature: TempPassword
  In order to continue to access the portal
  A new user must be able to change their temporary password

  Background: User is logged in
    Given I am a logged in portal user with a temporary password
      | email                 | password      |
      | newpass1@esmock.com    | newpassword1  |

  Scenario: User can change temporary password and login with changed password
    When I update my password and logout
      Then I am able to login with my new password
