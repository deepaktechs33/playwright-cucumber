Feature: Footer verification

  Scenario: Verify footer content on the products page
    Given user is on the Swag Labs login page
    When user logs in with username "standard_user" and password "secret_sauce"
    Then user should be navigated to the products page
    When the user scrolls to the footer
    Then the footer should show the copyright and policy text
    And the social media links should be displayed
