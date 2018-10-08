@ProofNCD @ClickableLinks

Feature: Proof of NCD
  In order to submit proof of no claim discount
  A user should be able to select the 'Get proof of No Claim Discount' link from the login page
  So they can navigate to the old NCD upload page


  Scenario: User can select Get proof of No Claim Discount link
    Given I am a user that is not logged in
    When I click the get proof of ncd link
    Then I can successfully follow the proof of NCD link on the page
