# NovaCart - MERN E-Commerce Web Application

A complete, production-style e-commerce web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 📋 Project Overview

NovaCart is a full-featured e-commerce platform that enables customers to browse products, manage shopping carts, place orders, and track their purchases. Administrators can manage products, categories, orders, and monitor business metrics through a comprehensive dashboard.

## ✨ Features

### Customer Features
- **Product Browsing**: View all products with search and category filtering
- **Product Details**: Detailed product information with images, ratings, and stock status
- **Shopping Cart**: Add/remove products, adjust quantities with stock validation
- **Cart Persistence**: Cart data persists across browser sessions
- **Checkout**: Complete order placement with customer and shipping information
- **Order Tracking**: View order history and track order status
- **Category Navigation**: Browse products by category
- **Responsive Design**: Fully responsive on desktop, tablet, and mobile

### Admin Features
- **Dashboard**: View key business metrics (total products, orders, revenue)
- **Product Management**: Full CRUD operations for products
- **Category Management**: Create, edit, and delete categories
- **Order Management**: View all orders and update order status
- **Low Stock Alerts**: Monitor products with low inventory
- **Recent Orders**: Quick view of latest orders

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Toastify** - Toast notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 📁 Project Structure

```
NOVACART-ECOMMERCE/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── api/          # API service layer
│   │   ├── components/   # Reusable components
│   │   ├── features/     # Redux slices
│   │   ├── layouts/      # Layout components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux store
│   │   ├── utils/        # Utility functions
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   ├── public/
│   └── package.json
├── backend/               # Express backend API
│   ├── config/           # Database configuration
│   ├── controllers/      # Request handlers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Error handling middleware
│   ├── utils/            # Utility functions
│   ├── dataset/          # Seed data
│   ├── scripts/          # Database seed scripts
│   ├── server.js         # Server entry point
│   └── package.json
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ECOMMERCE-MERN
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/novacart?retryWrites=true&w=majority
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Replace `<username>` and `<password>` with your MongoDB Atlas credentials.

### 3. Seed Database

```bash
npm run seed
```

This will populate the database with 18 sample products across 5 categories.

### 4. Start Backend Server

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 5. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

The frontend `.env` file is already created:
```env
VITE_API_URL=http://localhost:5000
```

### 6. Start Frontend Development Server

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📡 API Endpoints

### Products
- `GET /api/products` - Get all products (supports `?search=` and `?category=`)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 📊 Data Models

### Product
```javascript
{
  name: String (required),
  description: String (required),
  price: Number (required),
  quantity: Number (required),
  rating: Number (0-5),
  category: String (required),
  image: String,
  brand: String,
  sku: String (unique),
  discount: Number (0-100),
  createdAt: Date,
  updatedAt: Date
}
```

### Category
```javascript
{
  name: String (required, unique),
  description: String,
  image: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  orderNumber: String (unique, auto-generated),
  customer: {
    name: String (required),
    email: String (required),
    phone: String (required)
  },
  items: [{
    product: ObjectId (ref: Product),
    name: String (snapshot),
    price: Number (snapshot),
    quantity: Number,
    subtotal: Number
  }],
  totalAmount: Number,
  paymentMethod: String,
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  status: String (Pending/Confirmed/Shipped/Delivered/Cancelled),
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Design System

- **Color Scheme**: Indigo primary, clean whites and grays
- **Typography**: Inter font family, clear hierarchy
- **Components**: Card-based layouts with rounded corners and subtle shadows
- **Responsive Breakpoints**: 375px, 425px, 768px, 1024px, 1440px
- **Icons**: Lucide React icon library

## 🔐 Security Features

- Environment variables for sensitive data
- CORS configuration
- Input validation on frontend and backend
- MongoDB ObjectId validation
- Centralized error handling
- `.env` files in `.gitignore`

## 🧪 Testing Checklist

- [x] Backend starts successfully
- [x] MongoDB connects successfully
- [x] Frontend starts successfully
- [x] Products load from database
- [x] Search functionality works
- [x] Category filtering works
- [x] Product details page works
- [x] Add to cart works with stock validation
- [x] Cart persists after page refresh
- [x] Checkout creates orders in MongoDB
- [x] Product stock decrements after order
- [x] Order history displays correctly
- [x] Admin dashboard shows statistics
- [x] Admin product CRUD operations work
- [x] Admin category management works
- [x] Admin order status updates work
- [x] Responsive design works on all breakpoints
- [x] No console errors
- [x] No CORS errors

## 📱 Routes

### Customer Routes
- `/` - Home page
- `/products` - Product listing with search/filter
- `/products/:id` - Product details
- `/categories` - Category listing
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/orders` - Order history
- `/orders/:id` - Order details

### Admin Routes
- `/admin` - Admin dashboard
- `/admin/products` - Product management
- `/admin/products/new` - Add new product
- `/admin/products/:id/edit` - Edit product
- `/admin/categories` - Category management
- `/admin/orders` - Order management

## 🎯 Key Implementation Details

### Cart Persistence
Cart data is stored in Redux and synchronized with `localStorage` under the key `novacart_cart`. The cart automatically restores on page load and handles corrupted data gracefully.

### Stock Management
- Stock validation occurs both on add-to-cart and during checkout
- Orders use MongoDB transactions to ensure atomic stock updates
- Product quantity never goes below zero

### Order Snapshots
When an order is created, product names and prices are copied into the order document, ensuring historical accuracy even if product details change later.

### Search & Filtering
Products support case-insensitive search on name and description, with category filtering. Both can be combined for precise results.

## 👨‍💻 Development Commands

### Backend
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run seed     # Seed database with sample data
```

### Frontend
```bash
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=<your-mongodb-atlas-uri>
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB URI is correct
- Ensure `.env` file exists in backend directory
- Verify port 5000 is not in use

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Check CORS configuration in `backend/server.js`

### Cart not persisting
- Check browser localStorage is enabled
- Clear browser cache and try again

## 🚢 Deployment

### Backend
1. Set environment variables on hosting platform
2. Set `NODE_ENV=production`
3. Update `FRONTEND_URL` to production domain
4. Deploy to Heroku, Railway, or similar

### Frontend
1. Update `VITE_API_URL` to production backend URL
2. Run `npm run build`
3. Deploy `dist` folder to Vercel, Netlify, or similar

## 📄 License

This project is for educational purposes as part of an internship evaluation.

## 👤 Author

**NOVEXA TECH Internship Project**

---

**Note**: Payment processing is simulated for demonstration purposes only. No real payment gateway is integrated.
