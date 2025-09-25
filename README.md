Prodexa - Product Management Application

Prodexa is a Product Management Application built using the MERN stack (MongoDB, Express.js, React, Node.js). It allows users to manage categories, sub-categories, products with multiple variants, and provides features like authentication, wishlist, search, filtering, and pagination.

The main features of this application are:

*User Authentication (Signup & Login)

*Add Category and Sub-category

*Add Products with multiple variants (RAM, Price, Quantity)

*Edit Products

*Wishlist functionality

*Search by Product Name

*Filter by Sub-category

*Pagination for Product Listing

*Image upload support with Cloudinary

The technology stack used includes:

*Frontend: React (Vite) and Tailwind CSS v3

*Backend: Node.js, Express.js, MongoDB Atlas, JWT Authentication, Cloudinary

Project Structure: The project is divided into two main folders, backend for the Node.js + Express + MongoDB API, and frontend for the React + Vite + Tailwind CSS client.

Prerequisites: To run this project locally, you need Node.js (version 18 or higher), a MongoDB Atlas account, and Git installed on your machine.

Installation and Setup:

1.Clone the repository using Git.

2.Navigate to the backend folder, run npm install, and create a .env file with environment variables for MongoDB URI, JWT secret, Cloudinary configuration, and file upload settings.

3.Navigate to the frontend folder, run npm install, and prepare the client.

4.Run the application with npm run dev. The backend will start on http://localhost:5000 and the frontend on http://localhost:5173.

Usage Instructions:

*Signup or Login as a user.

*Add categories and sub-categories.

*Add products with multiple variants including RAM, Price, and Quantity.

*View, Edit products.

*Add products to the Wishlist.

*Use Search, Filter, and Pagination to browse products effectively.

-----------------
API Documentation
------------------
*Authentication

POST /api/auth/register → Register a new user

POST /api/auth/login → Login with email and password, returns JWT token

Categories & Subcategories

GET /api/categories → Get all categories

POST /api/categories → Create a new category

GET /api/categories/with-subcategories → Get all categories with their sub-categories

GET /api/categories/subcategories/all → Get all sub-categories

GET /api/categories/:categoryId/subcategories → Get sub-categories of a specific category

POST /api/categories/subcategories → Create a new sub-category

*Products

(All routes require authentication)

GET /api/products → Get all products (supports search, filter, pagination)

GET /api/products/:id → Get a single product by ID

POST /api/products → Create a new product (with image upload and multiple variants)

PUT /api/products/:id → Update product details and images

*Wishlist

(All routes require authentication)

GET /api/wishlist → Get all wishlist items of the logged-in user

POST /api/wishlist/add → Add a product to wishlist

DELETE /api/wishlist/remove/:productId → Remove a product from wishlist

GET /api/wishlist/check/:productId → Check if a product exists in wishlist

Additional Information: The project is designed for educational and interview purposes only and is not licensed for production use. Real MongoDB Atlas and Cloudinary credentials should not be exposed in GitHub; instead, placeholders must be used in the .env file for security reasons.
