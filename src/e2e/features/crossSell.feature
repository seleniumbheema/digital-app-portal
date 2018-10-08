@CrossSell

 Feature:  Cross Sell
   In order to purchase more products
   A user must be able to follow Cross Sell links

  Scenario: Login page
    Given I navigate to the login page
    When I view the login cross sell section
    Then I should see the login cross sell portal ads
    And I can follow the login cross sell links

  Scenario: Logout page
    Given I navigate to the logout page
    When I view the logout cross sell section
    Then I can follow the logout cross sell links
    And I should see the logout page cross sell portal ad

  Scenario: Timeout page
    Given I am on the timeout page
    When I view the timeout cross sell section
    Then I can follow the timeout cross sell links
    And I should see the timeout cross sell portal ads

  Scenario: Policies summary page
    Given I am a logged in portal user
      | email              | password  |
      | one@esmock.com     | Customer1 |

    When I view the policies page cross sell section
    Then I should see the policies page cross sell portal ads
    And I can follow the policies page cross sell links
