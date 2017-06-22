[![N|Solid](http://oscarexercises.azurewebsites.net/cashregister/img/cash_register_m.png)](https://nodesource.com/products/nsolid)

# What is CashRegister?
CashRegister is a simple application that simulates the functionality of a cash register machine. 

# Go live!
http://oscarexercises.azurewebsites.net/cashregister/

*Tested on Chrome
# What technologies are being used here? Why?
CashRegister uses the following technologies:
* Javascript - Because it was a requirement and because I love to work with simple Javascript!
* Bootstrap - Great UI boilerplate! So easy to use!

# How does it work??
Well, the application is pretty simple. It's divided on three sections:
  - Step 1: Where the user enters the initial cash.
  - Step 2: Where the user executes the payments.
  - Step 3: Where the user calls square and checks the status of all the money that is available.

On Step 1, the user is able to setup the initial state of the cash register by entering the amount of each coin denomination. Then, when the user moves to Step 2, the initial cash is already saved.
On Step 2, the user is able to make payments. Each payment has a price and a cash, and the process works as follows:
1. User enters the price of the product that want to pay for, on the respective input.
2. User enters the cash used to pay for the product, on the respective input.
3. User clicks on the Calculate button to check if change due is available. If not, a message saying "Insufficient Funds" is displayed. If the change due is available, it will appear a message saying the change due. 
4. If the user wants to see the details of the change due, he may click on the [View details] link.
5. The [View details] link will trigger a modal with all the amount denominations that come on the change due.
6. To complete the payment the user has to click on the 'Make Payment' button. Then a modal will appear notifying that the payment is complete.
7. After completing the payment the user can check the remaining amounts on the cash by clicking again on the Step 1 link. The user can also call square by clicking on the Step 3 link to check the status of the money during the day. And finally, the user can execute more payments by repeating again all the steps described here.
8. If the user changes manually any of the values on Step 1, then the initial cash variable will be updated based on the information of each amount that is there.

On Step 3, the user call square and check the initial cash that was originally entered on Step 1, the sold amount which is the sum of all the payments prices that were successfully executed by the user, and finally the total amount of money available which is the sum of the initial cash value plus the sold amount.

# Architecture
To start building the application, the first requirement was that all the logic had to be built with pure Javascript.
After assuming that, I decided to use MVC as the main pattern for 2 main reasons: avoid a mess on the code and bring consistency to the model.
Besides that, one of the things that I like from MVC is its easy conceptual way to understand it, you know... every change on the model is notified to the view, then when the user interacts with the view and requests an action, the view passes that action to the controller which may request a change in the model and so on. 

# Patterns
Some of the other patterns that were used for the implementation are:
- Observer: Used to allow the communication between each of the MVC layers.
- Revealing prototype pattern: Used to allow encapsulation with public and private members, and to facilitate future inheritance on the application.

# Todo
1. Implement more validations on the Step 2 inputs.
2. As an extra thing I would like to enter the payment cash detailed by each amount. For the moment, as it wasn't clear on the requirements, lets assume that the cash is represented by a check.
3. Include other Javascript libraries and frameworks such jQuery, ReactJS... to provide more maintainability and to reduce the code, specially with the DOM manipulation.


