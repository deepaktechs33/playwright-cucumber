Feature: Add product to cart

  Scenario Outline: Add a product to the cart and complete checkout
    Given user is on the Swag Labs login page
    When user logs in with username "standard_user" and password "secret_sauce"
    Then user should be navigated to the products page
    When the user adds "Sauce Labs Backpack" to the cart
    When the user goes to the cart
    Then the product "Sauce Labs Backpack" should be present in the cart
    When the user clicks on the checkout button
    When the user enters "<firstName>" "<lastName>" "<zip>" as checkout details
    And the user clicks the continue button
    Then the user should be navigated to the checkout overview page
    When the user clicks the finish button
    Then the order confirmation should be displayed
    When the user clicks on back to home button
    Then the user should be back on the products page

    Examples:
      | firstName | lastName | zip |
      | Deepak    | Kumar    | 123 |
