# 🎬 Quick Show - Movie Booking App

A modern, full-stack movie booking application built with React, Node.js, and MongoDB. Book movie tickets seamlessly with real-time seat selection, secure payments, and email confirmations.

## 🌟 Overview

Quick Show is a comprehensive movie booking platform that allows users to discover movies, select seats interactively, make secure payments, and receive booking confirmations. The application features a modern React frontend, robust Node.js backend, and integrates with multiple external services for a complete movie booking experience.

### Key Highlights
- 🎭 **Seamless Booking Flow** - From movie discovery to payment confirmation
- 🔒 **Secure Payments** - Razorpay integration with signature verification
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Real-time Updates** - Live seat availability and booking status
- 👨‍💼 **Admin Dashboard** - Complete management interface
- 📧 **Email Notifications** - Beautiful booking confirmations

## 🏗️ Architecture

### Frontend (Client)
Located in `/client` - React application with modern UI/UX
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS for responsive design
- **Authentication**: Clerk integration
- **State Management**: React Context API
- **Routing**: React Router DOM

📖 **[View Frontend Documentation](./client/README.md)**

### Backend (Server)  
Located in `/server` - Node.js API with MongoDB
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Payment**: Razorpay integration
- **Jobs**: Inngest for background processing
- **Email**: Nodemailer with custom templates

📖 **[View Backend Documentation](./server/README.md)**

## � Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- TMDB API key
- Razorpay account  
- Clerk account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/AbhisekDas01/Quick-Show-Movie-App.git
cd Quick-Show-Movie-App
```

2. **Setup Backend**
```bash
cd server
npm install
# Copy .env.example to .env and configure
npm run dev
```

3. **Setup Frontend**
```bash
cd ../client  
npm install
# Copy .env.example to .env and configure
npm run dev
```

🔧 **For detailed setup instructions, see the respective README files in `/client` and `/server` folders.**

## 📁 Project Structure

```
Quick-Show-Movie-App/
├── client/                 # Frontend React application
│   ├── src/               # Source code
│   ├── public/            # Static assets
│   ├── README.md          # Frontend documentation
│   └── package.json       # Frontend dependencies
├── server/                # Backend Node.js application  
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── README.md         # Backend documentation
│   └── package.json      # Backend dependencies
└── README.md             # Project overview (this file)
```

## 🔧 Environment Setup

Both frontend and backend require environment configuration:

- **Client**: See `/client/README.md` for frontend environment variables
- **Server**: See `/server/README.md` for backend environment variables

## 🚀 Deployment

### Frontend (Vercel)
- Automatic deployment from GitHub
- Environment variables configured in Vercel dashboard
- See client documentation for details

### Backend (Vercel) 
- Serverless deployment with Vercel
- Environment variables in production
- See server documentation for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Abhisek Das**
- GitHub: [@AbhisekDas01](https://github.com/AbhisekDas01)

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for movie data
- [Razorpay](https://razorpay.com/) for payment processing
- [Clerk](https://clerk.com/) for authentication
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React](https://react.dev/) for the frontend framework

## 📞 Support

If you have any questions or run into issues, please create an issue in the GitHub repository.

---

⭐ Star this repository if you found it helpful!
