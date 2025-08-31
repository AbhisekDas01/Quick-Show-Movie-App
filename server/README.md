# 🚀 Backend - Quick Show Movie API

Node.js backend API for the Quick Show movie booking application.

## ✨ Features

- **Movie Management**: TMDB API integration
- **Booking System**: Seat reservation and payment
- **Authentication**: Clerk integration
- **Email Notifications**: Booking confirmations
- **Background Jobs**: Payment cleanup with Inngest

## 🛠️ Tech Stack

- **Node.js** & **Express.js**
- **MongoDB** with **Mongoose**
- **Clerk** for authentication
- **Razorpay** for payments
- **Nodemailer** for emails
- **Inngest** for background jobs

## � Getting Started

1. **Install dependencies**
```bash
npm install
```

2. **Environment Setup**
Create `.env` file:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/quickshow
TMDB_API_KEY=your_tmdb_api_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET_KEY=your_razorpay_secret
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
CLERK_SECRET_KEY=your_clerk_secret
CLIENT_BASE_URL=http://localhost:5173
```

3. **Start development server**
```bash
npm run dev
```

## �️ API Routes

### Public Routes
- `GET /api/show` - Get all shows
- `GET /api/show/:id` - Get show details

### Protected Routes
- `POST /api/booking/create` - Create booking
- `POST /api/booking/verify-payment` - Verify payment
- `GET /api/user/bookings` - Get user bookings

### Admin Routes
- `POST /api/admin/add-shows` - Add shows
- `GET /api/admin/bookings` - Get all bookings

## 📱 Available Scripts

```bash
npm run dev          # Start development server
npm start            # Start production server
```

---

🔙 **[Back to Main Documentation](../README.md)**

## 📁 Project Structure

```
server/
├── config/                 # Configuration files
│   ├── db.js              # MongoDB connection
│   └── env.js             # Environment variables
├── controllers/           # Route controllers
│   ├── booking.controller.js   # Booking management
│   ├── show.controller.js      # Show management
│   ├── user.controller.js      # User operations
│   └── admin.controller.js     # Admin operations
├── models/                # MongoDB schemas
│   ├── Booking.model.js   # Booking schema
│   ├── Show.model.js      # Show schema
│   └── Movie.model.js     # Movie schema
├── routes/                # API routes
│   ├── booking.route.js   # Booking endpoints
│   ├── show.route.js      # Show endpoints
│   ├── user.route.js      # User endpoints
│   └── admin.route.js     # Admin endpoints
├── middleware/            # Custom middleware
│   └── auth.middleware.js # Authentication middleware
├── utils/                 # Utility functions
│   ├── emailTemplate.js   # Email HTML templates
│   ├── formatDateTime.js  # Date formatting
│   └── nodeMailer.js      # Email configuration
├── inngest/               # Background jobs
│   └── index.js           # Job definitions
├── server.js              # Application entry point
├── package.json           # Dependencies and scripts
├── vercel.json            # Vercel deployment config
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database (local or Atlas)
- TMDB API account
- Razorpay account
- Clerk account
- Email service (Gmail/SMTP)

### Installation

1. **Navigate to server directory**
```bash
cd server
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=3000
MONGODB_URI=mongodb://localhost:27017/quickshow
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/quickshow

# TMDB API Configuration
TMDB_API_KEY=your_tmdb_api_key
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_SECRET_KEY=your_razorpay_secret_key

# Email Configuration (Gmail example)
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SENDER_EMAIL=your_email@gmail.com

# Clerk Configuration
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key

# Application URLs
CLIENT_BASE_URL=http://localhost:5173

# Inngest Configuration (optional)
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

4. **Start development server**
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## 🔧 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `PORT` | Server port number | No | `3000` |
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb://localhost:27017/quickshow` |
| `TMDB_API_KEY` | The Movie Database API key | Yes | `your_api_key` |
| `RAZORPAY_KEY_ID` | Razorpay key ID | Yes | `rzp_test_...` |
| `RAZORPAY_SECRET_KEY` | Razorpay secret key | Yes | `your_secret` |
| `SMTP_USER` | Email SMTP username | Yes | `email@gmail.com` |
| `SMTP_PASS` | Email SMTP password | Yes | `app_password` |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes | `sk_test_...` |
| `CLIENT_BASE_URL` | Frontend URL for CORS | Yes | `http://localhost:5173` |

## 📱 Available Scripts

```bash
# Development
npm run dev          # Start with nodemon for auto-restart

# Production
npm start            # Start production server

# Utilities
npm test             # Run tests (if configured)
```

## 🗄️ Database Models

### Movie Model
```javascript
{
  id: Number,           // TMDB movie ID
  title: String,        // Movie title
  overview: String,     // Movie description
  poster_path: String,  // Poster image path
  backdrop_path: String,// Backdrop image path
  release_date: String, // Release date
  vote_average: Number, // Rating
  vote_count: Number,   // Vote count
  genres: Array,        // Genre information
  runtime: Number,      // Duration in minutes
  cast: Array          // Cast information
}
```

### Show Model
```javascript
{
  movie: ObjectId,         // Reference to Movie
  showDateTime: Date,      // Show date and time
  showPrice: Number,       // Ticket price
  theaterName: String,     // Theater name
  occupiedSeats: Object,   // Seat booking status
  totalSeats: Number,      // Total available seats
  dateTime: Object         // Show timings by date
}
```

### Booking Model
```javascript
{
  user: String,            // User ID from Clerk
  show: ObjectId,          // Reference to Show
  bookedSeats: Array,      // Array of seat numbers
  amount: Number,          // Total amount
  isPaid: Boolean,         // Payment status
  order: Object,           // Razorpay order details
  paymentExpiresAt: Date,  // Payment expiry time
  createdAt: Date,         // Booking creation time
  updatedAt: Date          // Last update time
}
```

## 🛣️ API Routes

### Public Routes

#### Shows
```http
GET /api/show                    # Get all upcoming shows
GET /api/show/:id               # Get specific show details
GET /api/show/occupied/:showId  # Get occupied seats for show
```

### Protected Routes (Require Authentication)

#### User Routes
```http
GET /api/user/bookings          # Get user's bookings
POST /api/user/update-favorite  # Add/remove movie from favorites
GET /api/user/favorites         # Get user's favorite movies
```

#### Booking Routes
```http
POST /api/booking/create        # Create new booking
POST /api/booking/verify-payment # Verify Razorpay payment
```

### Admin Routes (Require Admin Role)

#### Admin Management
```http
POST /api/admin/add-shows       # Add new movie shows
GET /api/admin/bookings         # Get all bookings
GET /api/admin/shows            # Get all shows for management
DELETE /api/admin/show/:id      # Delete a show
PUT /api/admin/show/:id         # Update show details
```

## 💳 Payment Processing

### Razorpay Integration

#### Order Creation
```javascript
// Create Razorpay order
const order = await razorpay.orders.create({
  amount: booking.amount * 100,  // Amount in paise
  currency: "INR",
  expire_by: Math.floor(Date.now()/1000) + 900, // 15 minutes
  notes: {
    bookingId: booking._id.toString()
  }
});
```

#### Payment Verification
```javascript
// Verify payment signature
const body = `${razorpay_order_id}|${razorpay_payment_id}`;
const expectedSignature = crypto
  .createHmac('sha256', RAZORPAY_SECRET_KEY)
  .update(body)
  .digest('hex');

const isValid = crypto.timingSafeEqual(
  Buffer.from(expectedSignature, 'hex'),
  Buffer.from(razorpay_signature, 'hex')
);
```

### Payment Flow
1. User selects seats and proceeds to payment
2. Backend creates booking and Razorpay order
3. Frontend opens Razorpay checkout
4. User completes payment
5. Razorpay sends payment details to frontend
6. Frontend sends details to backend for verification
7. Backend verifies signature and updates booking
8. Email confirmation sent to user

## 📧 Email System

### Email Templates
Responsive HTML email templates for:
- Booking confirmations
- Payment receipts
- Booking cancellations

### Email Configuration
```javascript
// Nodemailer setup
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
```

### Sending Emails
```javascript
// Send booking confirmation
await sendEmail({
  to: user.email,
  subject: `Booking Confirmation: ${movie.title}`,
  html: bookingConfirmationTemplate({
    userName: user.firstName,
    movieTitle: movie.title,
    showDateTime: formatDateTime(show.showDateTime),
    seats: booking.bookedSeats.join(', '),
    amount: booking.amount
  })
});
```

## ⚡ Background Jobs (Inngest)

### Job Functions

#### Payment Cleanup
```javascript
// Clean up expired bookings
const releaseSeatsDeleteBooking = inngest.createFunction(
  { id: 'release-seats-delete-booking' },
  { event: 'app/checkpayment' },
  async ({ event, step }) => {
    await step.sleep('wait-10-min', '10m');
    
    await step.run('cleanup', async () => {
      // Release seats and delete unpaid booking
    });
  }
);
```

#### Email Notifications
```javascript
// Send booking confirmation email
const sendBookingConfirmationEmail = inngest.createFunction(
  { id: 'send-booking-confirmation-email' },
  { event: 'app/show.booked' },
  async ({ event }) => {
    // Send email notification
  }
);
```

### Job Triggers
- **Payment Created**: Start cleanup timer
- **Booking Confirmed**: Send confirmation email
- **Payment Failed**: Clean up booking and release seats

## 🔐 Authentication & Authorization

### Clerk Integration
```javascript
import { clerkMiddleware, requireAuth, getAuth } from '@clerk/express';

// Apply Clerk middleware
app.use(clerkMiddleware());

// Protect routes
router.post('/bookings', requireAuth(), createBooking);

// Get user info
const { userId } = getAuth(req);
```

### Admin Middleware
```javascript
export const protectAdmin = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const user = await clerkClient.users.getUser(userId);
    
    if (user?.privateMetadata?.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
    }
    
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied' 
    });
  }
};
```

## 🔍 Error Handling

### Global Error Handler
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
```

### Validation Middleware
```javascript
const validateBooking = (req, res, next) => {
  const { showId, selectedSeats } = req.body;
  
  if (!showId || !selectedSeats || !selectedSeats.length) {
    return res.status(400).json({
      success: false,
      message: 'Missing required booking information'
    });
  }
  
  next();
};
```

## 🚀 Performance Optimizations

### Database Optimizations
- Indexed fields for faster queries
- Population strategies for related data
- Connection pooling for MongoDB

### Caching Strategies
- Movie data caching from TMDB
- Session-based caching for frequently accessed data
- Redis integration for production scaling

### API Optimizations
- Response compression
- Request rate limiting
- Efficient data serialization

## 🔧 Development Guidelines

### Code Structure
- Controller-based route handling
- Service layer for business logic
- Utility functions for common operations
- Middleware for cross-cutting concerns

### Database Best Practices
- Proper schema design with references
- Validation at model level
- Efficient query patterns
- Transaction support for critical operations

### Security Best Practices
- Input validation and sanitization
- CORS configuration
- Rate limiting on sensitive endpoints
- Secure environment variable handling

## 🚀 Deployment

### Vercel Configuration
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

### Environment Variables for Production
Set the following in your deployment platform:
- All variables from `.env` example
- Use production URLs and credentials
- Enable SMTP for email functionality

### Database Setup
1. Create MongoDB Atlas cluster
2. Configure network access
3. Create database user
4. Update `MONGODB_URI` with connection string

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection**
```bash
# Check connection string format
mongodb+srv://username:password@cluster.mongodb.net/database

# Verify network access in MongoDB Atlas
# Check database user permissions
```

**Payment Issues**
```bash
# Verify Razorpay keys
# Check webhook URL configuration
# Ensure CORS allows frontend domain
```

**Email Delivery**
```bash
# For Gmail, use App Password
# Check SMTP settings
# Verify sender email authentication
```

### Debug Mode
```bash
# Enable detailed logging
DEBUG=* npm run dev

# MongoDB query logging
MONGODB_DEBUG=true npm run dev
```

## 📊 Monitoring & Logging

### Logging Strategy
- Request/response logging
- Error tracking and reporting
- Performance monitoring
- Database query logging

### Health Checks
```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});
```

## 📞 Support

For backend-specific issues:
1. Check server logs for error messages
2. Verify environment variables
3. Test database connectivity
4. Check external service integrations

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Set up local environment
3. Create feature branch
4. Add tests for new features
5. Submit pull request

### Code Standards
- Follow existing code patterns
- Add JSDoc comments for functions
- Handle errors appropriately
- Write unit tests for new features

---

🔙 **[Back to Main Documentation](../README.md)**
