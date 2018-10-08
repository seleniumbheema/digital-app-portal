@Login
Feature: Login
  As a customer
  I need to login to My Account
  So that I can keep up to date with all the goings on

  Scenario Outline: Failed login
    Given I am on the login page
    When I type '<email>' into the email field and '<password>' into the password field
    Then I should see error message about failed login

    Examples:
      | email          | password   |
      | one@esmock.com | Password99 |
      | on@esmock.com  | Customer1  |

  Scenario Outline: Successful login
    Given I am on the login page
    When I type '<email>' into the email field and '<password>' into the password field
    Then I should successfully login and see my policies page

    Examples:
      | email          | password  |
      | one@esmock.com | Customer1 |
      | two@esmock.com | Customer2 |

  Scenario: User login with fraudelent device
    Given I am on the login page
    When I type "fraud@esmock.com" into the email field and "userfraud1" into the password field
    Then I should be navigated to the "/auth/login/unavailable" page

  Scenario: User login who is barred
    Given I am on the login page
    When I type "barred@esmock.com" into the email field and "userbarred1" into the password field
    Then I should be navigated to the "/auth/login/unavailable" page

  Scenario: User login who is locked
    Given I am on the login page
    When I type "locked@esmock.com" into the email field and "userlocked1" into the password field
    Then I should be navigated to the "/auth/login/suspended" page

  Scenario: User login who is disabled
    Given I am on the login page
    When I type "disabled@esmock.com" into the email field and "userdisabled1" into the password field
    Then I should be navigated to the "/auth/login/unavailable" page

  Scenario: User login with temporary password
    Given I am on the login page
    When I type "newpass@esmock.com" into the email field and "newpassword1" into the password field
    And I fill out the set password page with new password of "Newpassword2"
    Then I should be navigated to the "/portal/policies/welcome" page
