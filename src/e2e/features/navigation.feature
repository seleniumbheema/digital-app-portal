@Navigation

Feature: Navigation
  In order to get value from the portal
  A user must be able to navigate the site

  Background: User is logged in
    Given I am a logged in Portal user with both Motor and Home policies
      | email                 | password   |
      | demothree@esmock.com  | demouser3  |

  Scenario: Cover details page tabs
    When I am on the Cover details page
    Then I can successfully navigate to other tabbed pages using tabs

  Scenario: My documents page tabs
    When I am on the My documents page
    Then I can successfully navigate to other tabbed pages using tabs

  Scenario: Make changes page tabs
    When I am on the Make changes page
    Then I can successfully navigate to other tabbed pages using tabs

  Scenario: Make a claim page tabs
    When I am on the Make a claim page
    Then I can successfully navigate to other tabbed pages using tabs

  Scenario: My policies page sidebar
    When I am on the My policies page
    Then I can navigate to My policies, Offers, Sign out using the sidebar navigation

  Scenario: Offers page sidebar
    When I am on the Offers page
    Then I can navigate to My policies, Offers, Sign out using the sidebar navigation

  Scenario: My Cover details page sidebar
    When I am on the Cover details page
    Then I can navigate to My policies, Offers, Sign out using the sidebar navigation

  Scenario: My documents page sidebar
    When I am on the My documents page
    Then I can navigate to My policies, Offers, Sign out using the sidebar navigation

  Scenario: Make changes page sidebar
    When I am on the Make changes page
    Then I can navigate to My policies, Offers, Sign out using the sidebar navigation

  Scenario: Make a claim page sidebar
    When I am on the Make a claim page
    Then I can navigate to My policies, Offers, Sign out using the sidebar navigation

