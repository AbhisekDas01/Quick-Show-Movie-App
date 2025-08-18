# � Frontend - Quick Show Movie App

React frontend for the Quick Show movie booking application.

## ✨ Features

- **Movie Discovery**: Browse movies and view details
- **Seat Selection**: Interactive seat booking
- **Payment**: Razorpay integration
- **User Dashboard**: Booking history and favorites
- **Admin Panel**: Manage shows and bookings

## 🛠️ Tech Stack

- **React 19** with Vite
- **Tailwind CSS 4** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Clerk** for authentication

## 🚀 Getting Started

1. **Install dependencies**
```bash
npm install
```

2. **Environment Setup**
Create `.env` file:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_SERVER_BASE_URL=http://localhost:3000
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

3. **Start development server**
```bash
npm run dev
```

## � Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

🔙 **[Back to Main Documentation](../README.md)**

## 📁 Project Structure

```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── admin/          # Admin-specific components
│   │   ├── BlurCircle.jsx  # Background blur effect
│   │   ├── DateSelect.jsx  # Date selection component
│   │   ├── FeaturedSection.jsx
│   │   ├── Footer.jsx      # Application footer
│   │   ├── HeroSection.jsx # Landing page hero
│   │   ├── Loading.jsx     # Loading spinner
│   │   ├── MovieCard.jsx   # Movie display card
│   │   ├── Navbar.jsx      # Navigation header
│   │   └── TrailerSection.jsx
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin panel pages
│   │   │   ├── AddShows.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── ListBookings.jsx
│   │   │   └── ListShows.jsx
│   │   ├── Favorite.jsx    # User favorites page
│   │   ├── Home.jsx        # Landing page
│   │   ├── MovieDetails.jsx # Movie information page
│   │   ├── Movies.jsx      # Movies listing page
│   │   ├── MyBookings.jsx  # User bookings page
│   │   └── SeatLayout.jsx  # Seat selection interface
│   ├── context/            # React context providers
│   │   └── AppContext.jsx  # Global application state
│   ├── lib/                # Utility functions
│   │   ├── dateFormat.js   # Date formatting utilities
│   │   ├── isoTimeFormat.js
│   │   ├── timeFormat.js
│   │   └── razorPaypayment.js # Payment processing
│   ├── assets/             # Static assets
│   │   └── assets.js       # Asset exports
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Public static files
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Navigate to client directory**
```bash
cd client
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create a `.env` file in the client directory:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key

# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# Razorpay Configuration
VITE_RAZORPAY_KEY=rzp_test_your_razorpay_key
VITE_RAZORPAY_URL=https://checkout.razorpay.com/v1/checkout.js

# Application Settings
VITE_CURRENCY=₹
```

4. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔧 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for authentication | Yes | `pk_test_...` |
| `VITE_API_BASE_URL` | Backend API base URL | Yes | `http://localhost:3000` |
| `VITE_RAZORPAY_KEY` | Razorpay key ID for payments | Yes | `rzp_test_...` |
| `VITE_RAZORPAY_URL` | Razorpay checkout script URL | No | CDN URL |
| `VITE_CURRENCY` | Currency symbol to display | No | `₹` |

## 📱 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload

# Production
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint for code quality checks
```

## 🎨 UI Components

### Core Components
- **MovieCard**: Displays movie information with poster, rating, and actions
- **Navbar**: Navigation with authentication and route links
- **Footer**: Application footer with links and information
- **Loading**: Reusable loading spinner component

### Admin Components
- **AdminNavbar**: Admin-specific navigation
- **AdminSidebar**: Sidebar navigation for admin panel
- **Title**: Reusable title component for admin pages

### Form Components
- **DateSelect**: Date picker for show scheduling
- **SeatLayout**: Interactive seat selection interface

## 🔐 Authentication Flow

The application uses Clerk for authentication:

1. **Public Routes**: Home, Movies, Movie Details (limited features)
2. **Protected Routes**: Booking, Favorites, My Bookings
3. **Admin Routes**: Dashboard, Add Shows, Manage Bookings
4. **Sign In/Up**: Integrated Clerk components

```jsx
// Protected route example
import { useUser } from '@clerk/clerk-react'

function ProtectedComponent() {
  const { isSignedIn, user } = useUser()
  
  if (!isSignedIn) {
    return <SignInPrompt />
  }
  
  return <AuthenticatedContent user={user} />
}
```

## 💳 Payment Integration

### Razorpay Integration
The frontend handles payment processing with Razorpay:

```javascript
// Payment flow
1. User selects seats and proceeds to payment
2. Frontend calls backend to create Razorpay order
3. Razorpay checkout opens with order details
4. Payment success/failure handled with callbacks
5. Backend verification and booking confirmation
```

### Payment Features
- **Secure Payment**: Razorpay's secure payment gateway
- **Multiple Payment Methods**: Cards, UPI, Wallets, Net Banking
- **Payment Verification**: Server-side signature verification
- **Booking Confirmation**: Email notifications on successful payment

## 📱 Responsive Design

### Breakpoints
- **Mobile**: `< 640px`
- **Tablet**: `640px - 1024px` 
- **Desktop**: `> 1024px`

### Mobile Optimizations
- Touch-friendly interface
- Optimized seat selection for mobile
- Responsive navigation
- Mobile-first component design

## 🎯 State Management

### AppContext
Global state management using React Context:

```jsx
// Context structure
{
  user: Object,              // Current user information
  favoriteMovies: Array,     // User's favorite movies
  isAdmin: Boolean,          // Admin status
  loading: Boolean,          // Global loading state
  currency: String,          // Currency symbol
  // ... other global state
}
```

### Context Usage
```jsx
import { useAppContext } from './context/AppContext'

function Component() {
  const { favoriteMovies, addToFavorites, removeFromFavorites } = useAppContext()
  
  // Use context state and actions
}
```

## 🔍 Error Handling

### Error Boundaries
- Component-level error boundaries
- Graceful fallback UI
- Error reporting and logging

### API Error Handling
- Network error handling
- Authentication error redirects
- User-friendly error messages
- Retry mechanisms for failed requests

## 🚀 Performance Optimizations

### React Optimizations
- Lazy loading for route components
- Memoization for expensive calculations
- Efficient re-rendering with proper dependencies

### Asset Optimizations
- Image optimization and lazy loading
- Code splitting with dynamic imports
- Tree shaking for unused code elimination

### Caching Strategies
- API response caching
- Static asset caching
- Service worker for offline functionality

## 🔧 Development Guidelines

### Code Style
- ESLint configuration for consistent code style
- Prettier for code formatting
- Component naming conventions
- File organization standards

### Component Guidelines
- Functional components with hooks
- PropTypes for type checking
- Reusable and composable design
- Proper component separation

### Best Practices
- Environment variable validation
- Error boundary implementation
- Accessibility considerations
- Performance monitoring

## 🚀 Deployment

### Build Process
```bash
npm run build
```

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Automatic deployment on push to main branch

### Environment Variables for Production
Set the following in your deployment platform:
- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_API_BASE_URL` (production API URL)
- `VITE_RAZORPAY_KEY`
- `VITE_CURRENCY`

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
- Check environment variables are set
- Ensure all dependencies are installed
- Verify import paths are correct

**Authentication Issues**
- Verify Clerk configuration
- Check CORS settings on backend
- Ensure environment variables are correct

**Payment Issues**
- Verify Razorpay configuration
- Check network connectivity
- Ensure backend payment verification is working

### Debug Mode
```bash
# Enable debug logging
VITE_DEBUG=true npm run dev
```

## 📞 Support

For frontend-specific issues:
1. Check the console for error messages
2. Verify environment configuration
3. Review component props and state
4. Check network requests in browser dev tools

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch
3. Make changes with proper testing
4. Submit pull request with description

### Code Standards
- Follow existing code style
- Add comments for complex logic
- Update documentation for new features
- Test on multiple screen sizes

---

🔙 **[Back to Main Documentation](../README.md)**
