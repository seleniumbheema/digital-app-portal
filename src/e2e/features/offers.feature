@Offers @ClickableLinks

Feature: Offers
  In order to buy additional products
  A user must be able to follow the links on the offers page

  Background:
    Given I am a logged in portal user
      | email           | password   |
      | one@esmock.com  | Customer1  |

  Scenario: User can follow Offers links to purchase additional products
    When I view the Offers page
    Then I can view the products on offer
    And I should see the offers page all customer portal ads
    And I can successfully follow the links on the page
