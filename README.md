# Private Chef App

A full-stack web application for a private chef to display food items and pastries, and allow local residents to place orders.

## Features

- 🍽️ **Menu Display**: Beautiful gallery of food items and pastries with images, descriptions, and prices
- 🛒 **Shopping Cart**: Add items to cart and manage quantities
- 📝 **Order Management**: Customers can place orders with delivery information
- 👨‍🍳 **Admin Panel**: Manage menu items (add, edit, delete)
- 📊 **Order Tracking**: View and manage all customer orders with status updates

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: SQLite (better-sqlite3)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install all dependencies:
```bash
npm run install-all
```

Or install manually:
```bash
npm install
cd server && npm install
cd ../client && npm install
```

### Running the Application

Start both frontend and backend simultaneously:
```bash
npm run dev
```

Or run them separately:

**Backend (Terminal 1):**
```bash
cd server
npm run dev
```

**Frontend (Terminal 2):**
```bash
cd client
npm run dev
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Usage

1. **Adding Menu Items**: 
   - Navigate to the Admin page
   - Click "Add New Item"
   - Fill in the form with item details and upload an image
   - Click "Add Item"

2. **Placing Orders**:
   - Browse items on the home page
   - Add items to cart
   - Click "Checkout" when ready
   - Fill in customer information and delivery address
   - Submit order

3. **Managing Orders**:
   - Go to the Orders page
   - View all orders with customer details
   - Update order status using the dropdown

## Project Structure

```
private-chef-app/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   └── package.json
├── server/          # Express backend
│   ├── index.js     # Main server file
│   ├── uploads/     # Image uploads directory
│   └── package.json
└── package.json     # Root package.json
```

## API Endpoints

- `GET /api/items` - Get all available items
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item (admin)
- `PUT /api/items/:id` - Update item (admin)
- `DELETE /api/items/:id` - Delete item (admin)
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (admin)
- `PUT /api/orders/:id/status` - Update order status (admin)

## Notes

- Images are stored in `server/uploads/` directory
- Database file (`database.sqlite`) is created automatically on first run
- The app uses SQLite for simplicity - can be easily migrated to PostgreSQL or MySQL for production


