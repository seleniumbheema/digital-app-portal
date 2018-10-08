@RetrieveQuote @ClickableLinks

Feature: Retrieve Quote
  In order to retrieve a saved quote
  A user should be able to select the 'Retrieve quote' link from the login page
  So they can navigate to the old quote and buy page


  Scenario: User can select Retrieve Quote link
    Given I am a user that is not logged in
    When I click the retrieve quote link
    Then I can successfully follow the retrieve quote link on the page

