# Simple E-commerce Shopping Cart

## Project Overview

This is a monolithic web application built with **Laravel 11** and **Inertia.js (React)**. It functions as a simplified e-commerce platform where authenticated users can browse products, manage a persistent shopping cart, and place orders. The system emphasizes backend reliability through **database transactions**, **asynchronous queue processing** for notifications, and **scheduled tasks** for reporting.

## Tech Stack

- **Backend:** Laravel 11
- **Frontend:** React (via Inertia.js)
- **Styling:** Tailwind CSS
- **Database:** MySQL 8.0
- **Queue & Cache:** Redis
- **Local Environment:** Laravel Sail (Docker)
- **Mail Testing:** Mailpit
- **Database Management:** phpMyAdmin (included in Docker)

---

## Business Logic & Technical Specification

### 1. Actors & Roles

1. **Guest:** A visitor who can view the product catalog but cannot modify the cart or purchase items without logging in.
2. **Authenticated User (Customer):** A registered user who has a persistent shopping cart stored in the database and can place orders.
3. **System Admin (Dummy):** A recipient (email address) for system notifications (Low Stock Alerts and Daily Reports). There is no specific Admin Panel interface; this is purely for email notification targets.

---

### 2. Detailed Modules & Logic

#### A. Product Catalog

* **Data Source:** `products` table.
* **Display:** A grid view of available products showing: Name, Price, and Current Stock.
* **UI Logic:**
  * If `stock_quantity > 0`: Show "Add to Cart" button.
  * If `stock_quantity === 0`: Show "Out of Stock" badge; disable interaction.

#### B. Persistent Shopping Cart

* **Storage Mechanism:** Database (`carts` and `cart_items` tables).
  * *Constraint:* Do **not** use PHP Sessions or Browser LocalStorage for cart data. The cart must persist across devices for the logged-in user.

* **Relationship:** A User has one Cart. A Cart has many CartItems.
* **Operations:**
  1. **Add Item:**
     * If the product exists in the cart: Increment quantity.
     * If new: Create a new row in `cart_items`.
     * *Validation:* Requested quantity cannot exceed `product.stock_quantity`.

  2. **Update Quantity:** User can increase/decrease quantity in the cart view.
  3. **Remove Item:** Delete the row from `cart_items`.

#### C. Checkout & Order Processing (The Core Logic)

This is the most critical part of the application involving **Atomicity** to prevent race conditions.

* **Trigger:** User clicks "Place Order" in the Cart view.
* **Process (Wrapped in a DB Transaction):**
  1. **Validate Stock Again:** Before finalizing, check if the requested quantities are *still* available in the `products` table. If not, rollback and inform the user.
  2. **Create Order:** Insert a record into `orders` (User ID, Total Price, Timestamp).
  3. **Migrate Items:** Copy data from `cart_items` to `order_items` (snapshotting the price at the time of purchase).
  4. **Deduct Stock:** Decrement the `stock_quantity` of the specific products in the `products` table.
  5. **Clear Cart:** Delete the user's cart items.
  6. **Commit Transaction:** Save changes permanently.

* **Post-Process (Event):**
  * Fire an event (e.g., `OrderPlaced`).
  * Listeners will check for "Low Stock" scenarios.

#### D. Background Job: Low Stock Notification

* **Trigger:** Executed asynchronously via **Laravel Queues (Redis)** immediately after a successful order.
* **Logic:**
  * Iterate through the products involved in the recent order.
  * Check: `if (product.stock_quantity < 5)`.
  * Action: Send an email using a Mailable class (`LowStockAlert`) to the admin email address.
  * *Optimization:* Ideally, this runs on a worker (`php artisan queue:work`).

#### E. Scheduled Task: Daily Sales Report

* **Trigger:** A Cron job running automatically at **23:00 (11 PM)** every day.
* **Logic:**
  1. Query the `orders` table.
  2. Filter records where `created_at` matches today's date.
  3. Aggregate data: Total revenue, list of products sold, total quantity sold.
  4. Generate an email (`DailySalesReport`) containing this summary.
  5. Send to the admin email address.

* **Infrastructure:** Defined in `routes/console.php` using the Scheduler.

---

### 3. Database Schema Design

* **users:** `id`, `name`, `email`, `password`, `created_at`...
* **products:**
  * `id` (PK)
  * `name` (string)
  * `price` (decimal 10,2)
  * `stock_quantity` (integer) - *Crucial for logic*

* **carts:**
  * `id` (PK)
  * `user_id` (FK -> users)

* **cart_items:**
  * `id` (PK)
  * `cart_id` (FK -> carts)
  * `product_id` (FK -> products)
  * `quantity` (integer)

* **orders:**
  * `id` (PK)
  * `user_id` (FK -> users)
  * `total_amount` (decimal 10,2)
  * `created_at` (timestamp)

* **order_items:**
  * `id` (PK)
  * `order_id` (FK -> orders)
  * `product_id` (FK -> products)
  * `quantity` (integer)
  * `price` (decimal 10,2) - *Price snapshot to preserve historical data if product price changes later.*

---

### 4. API / Routes Structure (Inertia)

| Method   | Route          | Controller              | Description          |
|----------|----------------|-------------------------|----------------------|
| `GET`    | `/`            | ProductController@index | Catalog              |
| `GET`    | `/cart`        | CartController@index    | View Cart            |
| `POST`   | `/cart`        | CartController@store    | Add item             |
| `PATCH`  | `/cart/{item}` | CartController@update   | Update quantity      |
| `DELETE` | `/cart/{item}` | CartController@destroy  | Remove item          |
| `POST`   | `/checkout`    | CheckoutController@store| Place Order          |

---

### 5. Technical Constraints & Setup

* **Environment:** Docker (Laravel Sail).
* **Mail Driver:** SMTP (Mailpit host: `mailpit`, port: `1025`).
* **Queue Driver:** Redis (host: `redis`).
* **Frontend:** React components located in `resources/js/Pages`.
* **Styling:** Tailwind CSS utility classes.

---

## Setup & Installation

### Prerequisites
* Docker Desktop installed and running.

### Initialization Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. **Install Dependencies & Start Docker:**
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

3. **Frontend Setup:**
   ```bash
   ./vendor/bin/sail npm install
   ./vendor/bin/sail npm run build
   ```

4. **Database & Seeding:**
   ```bash
   ./vendor/bin/sail artisan migrate --seed
   ```
   *This will create a test user (`test@example.com` / `password`) and populate products.*

5. **Running Workers:**
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

## Testing

To run the feature tests:
```bash
./vendor/bin/sail artisan test
```
