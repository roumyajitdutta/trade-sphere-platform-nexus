# Welcome to my Ecommerce webapp development project

## Project info

The platform provides:

A Seller Portal to list products, manage stock, view orders, and update fulfillment statuses.

A Buyer Interface to search, browse, purchase products, manage profiles, and track orders.

Real-time communication between both sides using Supabase Realtime and scalable PostgreSQL structure.

Key Features:

Backend (PostgreSQL):
Authentication with role-based access (buyer/seller)

Product management system (CRUD for sellers)

Order management with status tracking

Secure row-level policies for user isolation

Payment method storage & checkout logic

Realtime updates for orders, stock, and notifications

Target Users:
Small to mid-sized online sellers needing a platform

Buyers seeking a clean, intuitive e-commerce experience

Admins (optional future role) for platform oversight and data insights


## Installation

Before you begin, make sure the following are installed on the system:

Node.js (LTS) – Required to run and build the project.

Git – To clone the repository.

```sh
node -v
npm -v
git --version
```

### 📁 Step 1: Clone the Repository

Open a terminal and run:
```sh
git clone https://github.com/your-username/trade-sphere-platform-nexus
cd trade-sphere-platform-nexus
```

### 📦 Step 2: Install Dependencies
Install all required packages listed in package.json:

```sh
npm install
```

This installs:

React

TypeScript

ShadCN UI components

Tailwind CSS

Other project dependencies

### 🧪 Step 3: Run the Development Server

```sh
npm run dev
```



## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS


To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

