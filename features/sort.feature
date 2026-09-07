Feature: Product sort filter verification

  Background:
    Given user is on the Swag Labs login page
    When user logs in with username "standard_user" and password "secret_sauce"
    Then user should be navigated to the products page

  Scenario: Verify each sort option correctly reorders the products
    When the user opens the sort filter
    And the user selects the "Name (A to Z)" sort option
    Then the products should be sorted by "Name (A to Z)"
    When the user opens the sort filter
    And the user selects the "Name (Z to A)" sort option
    Then the products should be sorted by "Name (Z to A)"
    When the user opens the sort filter
    And the user selects the "Price (low to high)" sort option
    Then the products should be sorted by "Price (low to high)"
    When the user opens the sort filter
    And the user selects the "Price (high to low)" sort option
    Then the products should be sorted by "Price (high to low)"
