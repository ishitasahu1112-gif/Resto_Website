# Product Requirements Document (PRD) - The Jhopdi

## 1. Product Overview
"The Jhopdi" is a modern, responsive web application for a restaurant in Prayagraj. It allows users to browse an extensive menu, add items to a cart, place orders via a manual payment flow, and track their order history. The design emphasizes a "boho" and "rustic" aesthetic using a specific color palette (Terracotta, Charcoal, Cream).

## 2. User Personas
-   **The Hungry Customer**: Wants to quickly find specific dishes (e.g., "Paneer Tikka"), add them to a cart, and place an order without technical friction.
-   **The Regular**: Wants to access their past orders and re-order favorites easily.

## 3. Core Features

### 3.1 Authentication
-   **Method**: Mobile Number Login via OTP (One-Time Password).
-   **Provider**: Firebase Authentication.
-   **Security**: reCAPTCHA protection for login requests.
-   **Persistence**: Users remain logged in across sessions using Firebase Auth persistence.

### 3.2 Home Page
-   **Hero Section**: Immersive background image with a "Welcome" animation and call-to-action to explore the menu.
-   **Promo Banner**: Carousel of active offers/coupon codes (e.g., "SAVE20"), styled to match the site theme.
-   **Highlights**: "Curated Flavors" section displaying top 3 signature dishes.
-   **About Section**: Brief introduction to the restaurant's philosophy.

### 3.3 Menu System
-   **Categorization**: Dishes organized into:
    -   **Indian**: Starters, Main Course, Breads.
    -   **Chinese**: Noodles, Starters.
    -   **Fast Food**: Burgers, Sandwiches, Pasta, Sides.
    -   **Beverages**: Tea, Coffee, Soups.
-   **Interactivity**:
    -   Filter by Category (Indian, Chinese, etc.).
    -   "Add to Cart" button with instant feedback.
-   **Data Source**: Static data file (`menuData.js`) populated with real items from "The Jhopdi Prayagraj".

### 3.4 Cart & Checkout
-   **Cart Sidebar**: Slide-out cart accessable from anywhere. Shows items, quantities, and subtotal.
-   **Checkout Page**:
    -   User details (Name, Phone).
    -   Delivery Address input.
    -   Order Summary.
-   **Payment Flow**:
    -   **Method**: Manual UPI / QRCode Upload (Simulated).
    -   **Process**: User enters details -> Confirm -> Upload Payment Check -> Order Saved to Database.

### 3.5 User Profile & History
-   **Profile Page**: Displays user's name and phone number.
-   **Order History**: "Past Orders" section showing:
    -   Date of order.
    -   Items ordered.
    -   Total amount.
    -   Order status (e.g., "Placed").

### 3.6 Themes & UI
-   **Design System**:
    -   **Colors**: Primary (`#E07A5F`), Secondary (`#81B29A`), Text (`#3D405B`), Background (`#F4F1DE`).
    -   **Typography**: 'Cinzel Decorative' (Headings), 'Inter' (Body).
-   **Animations**: Smooth page transitions and component entries using `framer-motion`.
-   **Responsive**: Fully mobile-optimized layout.

## 4. Technical Stack
-   **Frontend**: React.js (Vite), JavaScript.
-   **Styling**: Tailwind CSS, CSS Variables for theming.
-   **State Management**: React Context API (`AuthContext`, `CartContext`).
-   **Backend / BaaS**: Firebase.
    -   **Auth**: Phone Provider.
    -   **Database**: Cloud Firestore (Stores `users`, `orders`).
    -   **Hosting**: Firebase Hosting.
-   **Libraries**: `framer-motion` (animations), `lucide-react` (icons), `react-router-dom` (routing), `react-confetti` (celebrations).

## 5. Future Roadmap
-   **Live Payment Gateway**: Integrate Razorpay/Stripe for automated payments.
-   **Admin Dashboard**: Interface for restaurant staff to manage menu items and view live orders.
-   **Order Status Compatibility**: Real-time updates on order status (Cooking, Out for Delivery) via Firestore listeners.
-   **AI Recommendations**: "Chef's AI" to suggest dishes based on user preferences.
