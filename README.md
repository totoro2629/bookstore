# bookstore

# Bookstore RESTful API

A RESTful API for a Bookstore application with user authentication, CRUD operations for books, and advanced filtering capabilities.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- JWT for authentication

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd bookstore
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`:

   ```
   cp .env.example .env
   ```

4. Edit the `.env` file with your MongoDB connection string and a secure JWT secret.

5. Start the server:
   ```
   node server,js
   ```

## API Endpoints

### Authentication

- **Register a new user**

  - `POST /api/auth/register`
  - Request Body: `{ "email": "user@example.com", "password": "password123" }`

- **Login**

  - `POST /api/auth/login`
  - Request Body: `{ "email": "user@example.com", "password": "password123" }`

- **Get Current User**
  - `GET /api/auth/me`
  - Headers: `Authorization: Bearer <token>`

### Books

- **Create a new book**

  - `POST /api/books`
  - Headers: `Authorization: Bearer <token>`
  - Request Body:
    ```json
    {
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "category": "Fiction",
      "price": 9.99,
      "rating": 4.5,
      "publishedDate": "1925-04-10"
    }
    ```

- **Get all books**

  - `GET /api/books`
  - Headers: `Authorization: Bearer <token>`
  - Query Parameters (all optional):
    - `title`: Search by title (partial match)
    - `author`: Filter by author
    - `category`: Filter by category
    - `rating`: Filter by minimum rating
    - `page`: Page number for pagination
    - `limit`: Items per page
    - `sort`: Sort fields (comma-separated, prefix with - for descending)

- **Get book by ID**

  - `GET /api/books/:id`
  - Headers: `Authorization: Bearer <token>`

- **Update book**

  - `PUT /api/books/:id`
  - Headers: `Authorization: Bearer <token>`
  - Request Body: (all fields optional)
    ```json
    {
      "title": "Updated Title",
      "price": 12.99
    }
    ```

- **Delete book**
  - `DELETE /api/books/:id`
  - Headers: `Authorization: Bearer <token>`

## Example Requests (for Postman)

### Register a User

```
POST http://localhost:4000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### Login

```
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### Create a Book

```
POST http://localhost:4000/api/books
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "title": "To Kill a Mockingbird",
  "author": "Harper Lee",
  "category": "Fiction",
  "price": 8.99,
  "rating": 4.8,
  "publishedDate": "1960-07-11"
}
```

### Get Books with Filtering

```
GET http://localhost:4000/api/books?category=Fiction&rating=4&page=1&limit=10&sort=-rating,price
Authorization: Bearer <your_token>
```

## Assumptions and Notes

1. All book routes are protected and require authentication
2. JWT token expires after 30 days
3. Passwords are hashed using bcrypt before being stored in the database
4. Error responses include meaningful messages to guide the client
5. The API includes pagination for the GET /books endpoint
6. Books can be filtered by multiple criteria simultaneously
