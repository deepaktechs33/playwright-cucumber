Feature: Add and remove products from the cart

  Background:
    Given user is on the Swag Labs login page
    When user logs in with username "standard_user" and password "secret_sauce"
    Then user should be navigated to the products page

  @regression
  Scenario: Add a product to the cart
    When the user adds "Sauce Labs Backpack" to the cart
    And the user navigates to the cart page
    Then the cart should contain "Sauce Labs Backpack"

  @regression
  Scenario: Remove a product from the cart
    Given the user has added "Sauce Labs Backpack" to the cart
    When the user navigates to the cart page
    And the user removes "Sauce Labs Backpack" from the cart
    Then the cart should not contain "Sauce Labs Backpack"

  @regression
  Scenario: Add multiple products and remove only one
    When the user adds the following products to the cart:
      | Sauce Labs Backpack   |
      | Sauce Labs Bike Light |
    And the user navigates to the cart page
    And the user removes "Sauce Labs Bike Light" from the cart
    Then the cart should contain "Sauce Labs Backpack"
    And the cart should not contain "Sauce Labs Bike Light"
    And the cart item count should be 1
