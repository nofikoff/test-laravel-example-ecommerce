# Simple E-commerce Shopping Cart

## Project Overview
A Laravel-based e-commerce application demonstrating a full-stack shopping cart implementation using **Laravel**, **Inertia.js (React)**, and **Tailwind CSS**. The project focuses on backend architecture, database-driven cart management, background job processing, and scheduled reporting.

## 🛠 Tech Stack
- **Backend:** Laravel 11
- **Frontend:** React (via Inertia.js)
- **Styling:** Tailwind CSS
- **Database:** MySQL 8.0
- **Queue & Cache:** Redis
- **Local Environment:** Laravel Sail (Docker)
- **Mail Testing:** Mailpit
- **Database Management:** phpMyAdmin (included in Docker)

---

## 📋 Technical Specification

### 1. Functional Requirements
* **Authentication:** Users must register/login to shop (Laravel Breeze).
* **Product Catalog:** Browse products with Name, Price, and Stock Quantity.
* **Shopping Cart:**
    * Database-driven (persisted across devices, linked to User model).
    * Add items, update quantities, remove items.
    * Validation: Cannot add more items than available in stock.
* **Checkout Process:**
    * Converts Cart items into an Order.
    * Atomically decrements product stock.
    * Clears the cart.
* **Background Jobs:**
    * **Low Stock Notification:** Triggers an email to the admin when product stock falls below 5 units after a purchase.
    * **Daily Sales Report:** A scheduled task (CRON) runs daily at 23:00 to email the admin a summary of all products sold that day.

### 2. Database Schema
* `users`: Standard Laravel auth table.
* `products`: `id`, `name`, `price (decimal)`, `stock_quantity (int)`.
* `carts`: `id`, `user_id`.
* `cart_items`: `id`, `cart_id`, `product_id`, `quantity`.
* `orders`: `id`, `user_id`, `total_amount`, `created_at`.
* `order_items`: `id`, `order_id`, `product_id`, `quantity`, `price`.

---

## 🚀 Setup & Installation

### Prerequisites
* Docker Desktop installed and running.

### Initialization Steps

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <project-folder>
    ```

2.  **Install Dependencies & Start Docker:**
    ```bash
    # Install PHP dependencies
    docker run --rm \
        -u "$(id -u):$(id -g)" \
        -v "$(pwd):/var/www/html" \
        -w /var/www/html \
        laravelsail/php83-composer:latest \
        composer install --ignore-platform-reqs

    # Copy environment file
    cp .env.example .env
    
    # Start Sail (background mode)
    ./vendor/bin/sail up -d
    ```

3.  **Frontend Setup:**
    ```bash
    ./vendor/bin/sail npm install
    ./vendor/bin/sail npm run build
    ```

4.  **Database & Seeding:**
    ```bash
    ./vendor/bin/sail artisan migrate --seed
    ```
    *This will create a test user (`test@example.com` / `password`) and populate products.*

5.  **Running Workers:**
    To process background emails (Low Stock) and Schedule:
    ```bash
    # Open a new terminal tab
    ./vendor/bin/sail artisan queue:work
    
    # For the scheduled task (or run manually for demo)
    ./vendor/bin/sail artisan schedule:work
    ```

### Access Points
* **Application:** [http://localhost](http://localhost)
* **Mailpit (Emails):** [http://localhost:8025](http://localhost:8025)
* **phpMyAdmin:** [http://localhost:8080](http://localhost:8080)

---

## 🧪 Testing

To run the feature tests:
```bash
./vendor/bin/sail artisan test