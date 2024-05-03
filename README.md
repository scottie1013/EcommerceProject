Ecommerce Project 

Mongodb local installation: https://www.mongodb.com/docs/manual/installation/

Mongodb GUI: https://www.mongodb.com/products/tools/compass 


### README for E-commerce Project

This README provides an overview of the E-commerce project repository, including instructions on how to run the program and a description of the file structure.

#### How to Run the Program

1. **Clone the Repository:**
   ```
   git clone <repository-url>
   ```

2. **Navigate to the Project Directory:**
   ```
   cd EcommerceProject
   ```

3. **Install Dependencies:**
   ```
   npm install
   ```

4. **Run the Application:**
   ```
   npm start
   ```
   This command will start the development server, typically accessible via `http://localhost:3000` in your web browser.

#### Project Structure

- **`/app`**
  - Contains core application configuration and hooks.

- **`/components`**
  - **Common Components:**
    - `CommonCart.js`: Manages the display and interactions within the shopping cart.
    - `CommonModal.js`: Provides a reusable modal component used across the application.
  - **Form Elements:**
    - `InputComponent.js`, `SelectComponent.js`: Reusable input and select components for forms.
  - `Navbar.js`: The navigation bar component, handling user navigation and authentication state display.

- **`/context`**
  - `GlobalContext.js`: Manages global state using React Context, providing a state management solution across the app.

- **`/database`**
  - Contains scripts or configuration files for database connections.

- **`/models`**
  - `user.js`: Defines the user model for the application's database.
  - `cart.js`: Schema for shopping cart items.
  - `product.js`: Product schema used in product management.

- **`/services`**
  - Includes service files for handling backend logic such as:
    - `login.js`, `register.js`: Services for user authentication.
    - `cart.js`: Manages cart interactions like add, delete, and fetch cart items.
    - `product.js`: Services related to product operations.

- **`/utils`**
  - `index.js`: Contains utility functions and constants used across the application.

- **`/admin-view`**, **`/api`**, **`/cart`**, **`/login`**, **`/register`**, **`/product`**
  - These directories contain specific components or scripts related to their respective functionalities like admin interfaces, API routes, product listings, etc.

### Description of Directories and Key Files

- **Components Directory**: Holds all reusable components that construct the user interface.
- **Services Directory**: Contains all the business logic, interfacing between the front end and the database.
- **Models Directory**: Defines the data structures for database documents.
- **Utils Directory**: Stores utility functions and constants which are reused across different parts of the application.

