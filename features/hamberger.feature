Feature: Hamburger menu navigation

  Background:
    Given user is on the Swag Labs login page
    When user logs in with username "standard_user" and password "secret_sauce"
    Then user should be navigated to the products page

  Scenario: Verify hamburger menu options and navigate through About and Logout
    When the user opens the hamburger menu
    Then the menu should display the following options:
      | All Items       |
      | About           |
      | Logout          |
      | Reset App State |
    When the user clicks on the "About" menu option
    And the user navigates back to the previous page
    Then user should be navigated to the products page
    When the user opens the hamburger menu
    And the user clicks on the "Logout" menu option
    Then the user should be redirected to the login page

  

  Scenario: Reset App State empties the cart
    When the user adds "Sauce Labs Backpack" to the cart
    Then the cart badge should show "1"
    When the user opens the hamburger menu
    And the user clicks on the "Reset App State" menu option
    Then the cart badge should not be displayed
