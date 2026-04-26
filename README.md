# 🛒 ShopEase — Full Stack E-Commerce Application

A complete e-commerce web application built with **Java Spring Boot**, **React**, and **MySQL**.

![Java](https://img.shields.io/badge/Java-17-orange) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green) ![React](https://img.shields.io/badge/React-18-blue) ![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)

---

## ✨ Features

- 🛍️ Browse and search products by name or category
- 🔍 Product detail page with stock tracking
- 🛒 Add to cart with quantity management
- 👤 User registration and login
- 📦 Place orders with shipping address
- 📋 View order history with status tracking
- ❌ Cancel pending/confirmed orders
- ⚠️ Input validation and error handling

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.2, Spring MVC, Spring Data JPA |
| ORM | Hibernate, JPA |
| Database | MySQL 8.0 |
| Frontend | React 18, React Router, Axios |
| Tools | Maven, Git, Postman, IntelliJ IDEA |
| API | RESTful APIs (JSON) |

---

## 📁 Project Structure

```
shopease/
├── backend/                        # Spring Boot Application
│   ├── src/main/java/com/shopease/
│   │   ├── ShopEaseApplication.java
│   │   ├── config/CorsConfig.java
│   │   ├── controller/             # REST API Controllers
│   │   │   ├── ProductController.java
│   │   │   ├── CategoryController.java
│   │   │   ├── UserController.java
│   │   │   └── OrderController.java
│   │   ├── service/                # Business Logic
│   │   ├── repository/             # JPA Repositories
│   │   ├── model/                  # JPA Entities
│   │   └── exception/              # Global Error Handling
│   └── src/main/resources/
│       └── application.properties
│
└── frontend/                       # React Application
    └── src/
        ├── App.js                  # Main app + routing
        ├── components/
        │   ├── Navbar.js
        │   └── ProductCard.js
        ├── pages/
        │   ├── HomePage.js
        │   ├── ProductDetailPage.js
        │   ├── CartPage.js
        │   ├── LoginPage.js
        │   ├── RegisterPage.js
        │   └── OrdersPage.js
        └── services/
            └── api.js              # All API calls
```

---

## 🚀 How to Run

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven

### 1. Setup Database
```sql
CREATE DATABASE shopease;
```
MySQL will auto-create tables on first run.

### 2. Run Backend
```bash
cd backend

# Update MySQL password in:
# src/main/resources/application.properties

mvn spring-boot:run
```
Backend runs at: **http://localhost:8080**

### 3. Run Frontend
```bash
cd frontend
npm install
npm start
```
Frontend runs at: **http://localhost:3000**

---

## 📡 API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Get all products |
| GET | /api/products/{id} | Get product by ID |
| GET | /api/products/category/{id} | Get by category |
| GET | /api/products/search?keyword= | Search products |
| POST | /api/products | Create product |
| PUT | /api/products/{id} | Update product |
| DELETE | /api/products/{id} | Delete product |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/users/register | Register |
| POST | /api/users/login | Login |
| GET | /api/users/{id} | Get user |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/orders/place | Place order |
| GET | /api/orders/user/{userId} | Get user orders |
| GET | /api/orders/{id} | Get order by ID |
| PUT | /api/orders/{id}/status | Update status |
| DELETE | /api/orders/{id}/cancel | Cancel order |

---

## 🧪 Test with Postman

**Create a category:**
```json
POST /api/categories
{
  "name": "Electronics",
  "description": "Electronic gadgets and devices"
}
```

**Create a product:**
```json
POST /api/products
{
  "name": "iPhone 15",
  "description": "Latest Apple smartphone",
  "price": 79999.00,
  "stockQuantity": 50,
  "category": { "id": 1 }
}
```

**Place an order:**
```json
POST /api/orders/place
{
  "userId": 1,
  "shippingAddress": "123 Main St, Bengaluru, Karnataka",
  "items": [
    { "productId": 1, "quantity": 2 }
  ]
}
```

---

## 👨‍💻 Developer

**Yuvraj Ghatekari**
- 📧 ghatekariyuvraj540@gmail.com
- 💼 [LinkedIn](https://linkedin.com/in/yuvraj-ghatekari-8867018357)
- 🐙 [GitHub](https://github.com/YUVI540)
