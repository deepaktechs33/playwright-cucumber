Feature: Swag Labs Login
  As a Swag Labs user
  I want to log in to the application
  So that I can access the products page

  Background:
    Given user is on the Swag Labs login page

  # ---------- POSITIVE ----------

  @smoke @sanity @positive
  Scenario: Successful login with valid standard user credentials
    When user logs in with username "standard_user" and password "secret_sauce"
    Then user should be navigated to the products page
    And the page title should be "Products"


  @regression
  Scenario Outline: Successful login with different valid users
    When user logs in with username "<username>" and password "secret_sauce"
    Then user should be navigated to the products page

    Examples:
      | username                |
      | standard_user           |
      | problem_user            |
      | performance_glitch_user |
      | visual_user             |
      | error_user              |

  # ---------- NEGATIVE ----------


  @regression @negative
  Scenario: Login attempt with locked out user
    When user logs in with username "locked_out_user" and password "secret_sauce"
    Then user should see an error message "Sorry, this user has been locked out."


  @regression @negative
  Scenario Outline: Login attempt with invalid credentials
    When user logs in with username "<username>" and password "<password>"
    Then user should see an error message "<errorMessage>"

    Examples:
      | username      | password        | errorMessage                                                 |
      | invalid_user  | secret_sauce    | Username and password do not match any user in this service  |
      | standard_user | wrong_password  | Username and password do not match any user in this service  |
      | standard_user |                 | Password is required                                         |
      |               | secret_sauce    | Username is required                                         |
      |               |                 | Username is required                                         |
