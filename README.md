Ecommerce Website with Effective Distributed Database Management System  

The rise of internet access and smartphones have made e-commerce a crucial part of the global economy. For businesses, engaging in e-commerce can lead to lower overhead costs, improved inventory management, and deeper insights into customer behavior through data analytics.
Consequently, e-commerce is an excellent topic for a final project as it is closely linked to database management. In this project, we learned valuable lessons and gained experiences that will be beneficial for our future careers, particularly in practicing load balancing, which is vital for maintaining an efficient e-commerce site.

Planned Implementation:
In this project, we developed a comprehensive e-commerce website featuring essential functionalities such as user registration and product purchasing, alongside database management tools for administrators. Users have the ability to sign up, log in, browse in-stock products, and add them to their shopping cart for purchase. Administrators can register with enhanced privileges, update product details, and manage inventory levels, marking items as in or out of stock as needed.
The project's source code was crafted in JavaScript, utilizing the Next.js framework to structure the entire site. For data storage, we employed MongoDB to house details like product names, prices, descriptions, and more. User credentials, including emails and passwords, were also stored in this database. We implemented distributed databases to manage data storage, using a hash function based on user ip to distribute the storage efficiently. Additionally, Firebase was used specifically for storing product images. These components were integrated to create a fully operational e-commerce platform.
DSCI 551 Project: E-Commerce Website with
 
Architecture Design

Entry Point: Users begin at the E-commerce Website homepage where they can choose to log in. The login page provides options to either log into an existing account or create a new account. New account creation is split into two user types: Administrator or User.
Post-Login Navigation:
- Administrators are directed to a database management page where they can add, update, or
remove products.
- Users are directed to a merchandise view page where they can browse products and add
them to their cart.
Shopping Cart and Checkout: Products added to the cart can be reviewed and processed through the checkout page.
Database Interaction: All user activities interact with data stored in MongoDB, ensuring that user data and product information are consistently updated across the platform.
Implementation/Functionalities/Tech Stack
User Registration Page

1. Imports and Global State Management:

The component begins by importing necessary React hooks (useState, useEffect, useContext), components (InputComponent, SelectComponent, ComponentLevelLoader, Notification), utilities, and services. The GlobalContext is used to manage global states like authentication status and loader visibility.
2. Initial Form Data and State Setup:
initialFormData object is defined to hold the initial state of form fields (name, email, password, role).
Local state variables (formData, isRegistered) are initialized using useState. These control the form data and the registration status.
3. Form Validation Logic:
isFormValid function checks whether the required fields are not empty. This ensures that the form data is complete before submission.
4. Form Submission Handling:
handleRegisterOnSubmit asynchronously submits the form data via registerNewUser service if the form is valid. It updates the UI based on the response, showing success or resetting the form as needed.
5. Component Layout and UI:
The form UI is structured with InputComponent and SelectComponent for interactive elements. These components dynamically update the formData state as the user types or selects options. A conditional rendering technique displays a message or redirects the user based on the isRegistered state.
The ComponentLevelLoader indicates processing during the registration request. 6. Effect Hooks:
An useEffect hook is utilized to redirect an authenticated user away from the registration page to prevent registered users from re-accessing the registration form.

Functionalities and Features:
Context API Usage: This demonstrates effective state management across different components of the application, particularly useful in handling user authentication states and global loading states.
Responsive UI Design: Tailwind CSS is used extensively for styling, ensuring that the form is visually appealing and functional across various devices.


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

