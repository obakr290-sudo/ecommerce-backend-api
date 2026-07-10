# E-Commerce Backend API

A fully functional production-ready E-Commerce Backend API built using Node.js, Express.js, MongoDB, and Mongoose.

## Project Structure
This project follows the strict MVC (Model-View-Controller) architecture layout as required.

## Installation & Setup
1. Clone the repository to your local machine.
2. Run `npm install` to install all dependencies.
3. Create a `.env` file based on `.env.example`.
4. Run `npm run seed` to populate the database with initial categories and products.
5. Run `npm run dev` to launch the development server via nodemon.

## Key Core Features Built
- **Dynamic Product Filtering**: Filter products by category, stock status, search terms, and precise price ranges (`minPrice` / `maxPrice`).
- **Server-Side Calculated Cart**: Full shopping cart management where prices are fetched strictly from the database to prevent client tampering.
- **Secure Checkout System**: Automatic product stock deduction upon order creation with dynamic tracking status enums.
- **Security Protocols**: Implemented `express-mongo-sanitize` to actively prevent NoSQL Injection vulnerabilities.