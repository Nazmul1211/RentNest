# RenTNest - Rental Property Marketplace Backend

RenTNest is a modern, modular rental property marketplace backend API designed to simplify and streamline the rental search, leasing, and payment workflow. Built with **Express**, **TypeScript**, **Prisma**, and **PostgreSQL**, it features a secure role-based system supporting Tenants, Landlords, and Administrators, with integrated **Stripe** payments for checkout security and real-time webhook updates.

---

## Key Features

- **Robust Authentication**: JWT access and refresh token authentication, secure password hashing using `bcrypt`, and user profile endpoints.
- **Role-Based Access Control**:
  - **TENANT**: Browses properties, submits rental requests, processes secure Stripe payments upon approval, and writes reviews for completed rentals.
  - **LANDLORD**: Manages property listings (CRUD), views tenant rental requests, and handles approvals/rejections.
  - **ADMIN**: Accesses site-wide user directories, bans/unbans users, views all rental transactions, and manages property categories.
- **Dynamic Property Listing & Browsing**: Comprehensive search and multi-criteria filters (city, category, rental range, available dates).
- **Automated Rental Requests & Payment Processing**: State-machine-based rental tracking from `PENDING` request submission to landlord approval, Stripe session generation, and final payment.
- **Stripe Webhook Integration**: Reliable, server-to-server confirmation of successful transactions that auto-updates rental status, payment history, and tenant records.
- **Feedback Loop**: Post-lease review system allowing tenants to rate and comment on properties.

---

## Technology Stack

| Component | Technology |
|---|---|
| **Runtime Environment** | Node.js |
| **Language** | TypeScript |
| **Framework** | Express |
| **ORM** | Prisma |
| **Database** | PostgreSQL |
| **Authentication** | JWT (JSON Web Tokens) & `bcrypt` |
| **Payment Gateway** | Stripe (Checkout Session & Webhooks) |

---

## Database Architecture & Relationships

RenTNest is designed around a relational database schema structured into 6 core models:

```mermaid
erDiagram
    User ||--o{ Property : "hosts (as Landlord)"
    User ||--o{ RentalRequest : "submits (as Tenant)"
    User ||--o{ Payment : "makes (as Payer)"
    User ||--o{ Review : "writes (as Tenant)"
    Category ||--o{ Property : "classifies"
    Property ||--o{ RentalRequest : "has"
    Property ||--o{ Review : "receives"
    RentalRequest ||--o{ Payment : "triggers"
    RentalRequest ||--o| Review : "has"

    User {
        string id PK
        string name
        string email UK
        string password
        string phone
        string profilePhoto
        UserRole role
        UserStatus status
        string stripeCustomerId UK
        boolean hasCompletedPayment
        dateTime createdAt
        dateTime updatedAt
    }

    Property {
        string id PK
        string landlordId FK
        string categoryId FK
        string title
        string slug UK
        string description
        decimal rentAmount
        decimal securityDeposit
        string address
        string city
        string area
        string country
        string postalCode
        int bedrooms
        int bathrooms
        PropertyType type
        decimal sizeSqft
        string[] images
        string[] amenities
        PropertyStatus status
        boolean isAvailable
        dateTime availableFrom
        dateTime createdAt
        dateTime updatedAt
    }

    Category {
        string id PK
        string name
        string slug
        string description
        boolean isActive
        dateTime createdAt
        dateTime updatedAt
    }

    RentalRequest {
        string id PK
        string propertyId FK
        string tenantId FK
        RentalStatus status
        dateTime moveInDate
        dateTime moveOutDate
        int totalMonths
        decimal monthlyRent
        decimal totalAmount
        string tenantMessage
        string landlordNote
        dateTime approvedAt
        dateTime rejectedAt
        dateTime paidAt
        dateTime completedAt
        dateTime createdAt
        dateTime updatedAt
    }

    Payment {
        string id PK
        string rentalRequestId FK
        string payerId FK
        decimal amount
        string currency
        PaymentStatus status
        string transactionId UK
        string stripeCheckoutSessionId UK
        string stripePaymentIntentId UK
        string stripeCustomerId
        dateTime paidAt
        dateTime createdAt
        dateTime updatedAt
    }

    Review {
        string id PK
        string tenantId FK
        string rentalRequestId FK "UK"
        string propertyId FK
        int rating
        string comment
        ReviewStatus status
        dateTime createdAt
        dateTime updatedAt
    }
```

---

## Environment Variables Setup

Create a `.env` file in the root directory based on the following template:

```env
# Application Settings
NODE_ENV=development
PORT=4000
APP_URL=http://localhost:3000

# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/rentnest"

# Security & Cryptography
BCRYPT_SALT_ROUNDS=10
JWT_SECRET="your-jwt-access-secret"
JWT_REFRESH_SECRET="your-jwt-refresh-secret"
JWT_ACCESS_EXPIRATION="1d"
JWT_REFRESH_EXPIRATION="7d"

# Stripe Integration
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"
```

---

## API Endpoints Reference

### Authentication
| Method | Route | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new user (`TENANT` or `LANDLORD`) | Public |
| **POST** | `/api/auth/login` | Login user and retrieve JWT tokens | Public |
| **GET** | `/api/auth/me` | Fetch active user credentials and profile state | Authenticated |
| **POST** | `/api/auth/logout` | Log out the authenticated user by invalidating the token | Authenticated |

### Categories
| Method | Route | Description | Access |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/categories` | Retrieve all active categories | Public |
| **POST** | `/api/categories` | Create a new property category | Admin |

### Properties
| Method | Route | Description | Access |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/properties` | Fetch list of properties with search and filters | Public |
| **GET** | `/api/properties/:id` | Fetch specific property details | Public |
| **POST** | `/api/landlord/properties` | Post a new property listing | Landlord |
| **PUT** | `/api/landlord/properties/:id` | Modify an existing property listing | Owner Landlord |
| **DELETE** | `/api/landlord/properties/:id` | Delete a property listing | Owner Landlord |

### Rental Requests
| Method | Route | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/rentals` | Submit a rental request for a property | Tenant |
| **GET** | `/api/rentals` | Retrieve active user's rental history | Tenant |
| **GET** | `/api/rentals/:id` | View detailed rental request status | Tenant/Landlord/Admin |
| **GET** | `/api/landlord/requests` | Retrieve rental requests received for landlord's properties | Landlord |
| **PATCH** | `/api/landlord/requests/:id` | Approve (`APPROVED`) or reject (`REJECTED`) a request | Owner Landlord |

### Payments
| Method | Route | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/payments/create` | Create a Stripe Checkout Session for approved rentals | Tenant |
| **POST** | `/api/payments/confirm` / `/webhook` | Stripe Webhook handler to confirm checkout event | Stripe Webhook |
| **GET** | `/api/payments` | Get payment transaction history | Tenant |
| **GET** | `/api/payments/:id` | View single payment invoice details | Tenant/Admin |

### Reviews
| Method | Route | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/reviews` | Submit a review for a property after a completed rental | Tenant |
| **GET** | `/api/reviews` | Retrieve all reviews (admins see all, public sees published) | Public / Admin |
| **GET** | `/api/reviews/:id` | Retrieve detailed information of a single review | Public |
| **PATCH** | `/api/reviews/:id` | Update an existing review | Tenant Creator |
| **DELETE** | `/api/reviews/:id` | Delete a review by its ID | Tenant Creator / Admin |

### Administrative Controls
| Method | Route | Description | Access |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/admin/users` | List all system users | Admin |
| **PATCH** | `/api/admin/users/:id` | Suspend, Ban, or Activate a user profile | Admin |
| **GET** | `/api/admin/properties` | List all system properties | Admin |
| **GET** | `/api/admin/rentals` | List all platform rental agreements | Admin |

---

## Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **PostgreSQL** instance running locally or hosted
- **Stripe Account** (in Developer/Test mode)

### Installation & Setup

1. **Clone & Navigate**
   ```bash
   git clone <repository-url>
   cd RentNest
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   - Copy `.env.example` (or create `.env`) and input database URLs, JWT keys, and Stripe test secrets.

4. **Initialize Database and Schema**
   - Apply migrations to setup the PostgreSQL tables:
     ```bash
     npx prisma migrate dev
     ```

5. **Launch Application**
   - **Development server**:
     ```bash
     npm run dev
     ```
   - **Production build**:
     ```bash
     npm run build
     npm start
     ```

---

## Testing the API Flow

A Postman collection is included in the project root: [RentNest.postman_collection.json](file:///Users/nazmulhasan/level2/RentNest/RentNest.postman_collection.json). Import it into Postman or Thunder Client to run the API testing workflow:

1. **Setup Admin**: Seed database with Admin credentials (e.g. `admin@rentnest.com` / `admin123`) and categories.
2. **Category Creation**: Log in as Admin and create active property categories (`Apartment`, `House`, etc.).
3. **Register Accounts**: Register a `LANDLORD` and a `TENANT`.
4. **Post Listing**: Log in as Landlord, and create a Property listing (`POST /api/landlord/properties`).
5. **Request Property**: Log in as Tenant, find property listings, and submit a rental request (`POST /api/rentals`).
6. **Approve Request**: Log in as Landlord, navigate to received requests, and update request status to `APPROVED`.
7. **Initiate Payment**: Tenant requests a checkout session (`POST /api/payments/create`) and navigates to the returned Stripe Checkout URL.
8. **Stripe Test Card**: Use card number `4242 4242 4242 4242` to complete payment.
9. **Webhook / Completion**: Stripe triggers the webhook endpoint to update state. Landlord or Admin marks rental as `COMPLETED` post-lease completion.
10. **Review Listings**: Tenant leaves a review (`POST /api/reviews`) rating the property.


