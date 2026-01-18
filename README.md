# Blotter Management System - Web Frontend

A modern, responsive web application for the Blotter Management System built with vanilla HTML, CSS, and JavaScript.

## 🎨 Features

- **Modern UI Design**: Glassmorphism effects, smooth animations, and dark mode
- **Authentication**: Login, registration with email verification, and password reset
- **Dashboard**: Real-time statistics and recent activity
- **Reports Management**: Create, view, filter, and sort incident reports
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **No Build Tools Required**: Pure HTML/CSS/JS - just open and run!

## 📁 Project Structure

```
web-frontend/
├── css/
│   └── style.css          # Complete design system and components
├── js/
│   └── api.js             # API client and utilities
├── pages/
│   ├── dashboard.html     # Main dashboard
│   ├── register.html      # Multi-step registration
│   ├── reports.html       # Reports management
│   └── ...                # Other pages
├── assets/                # Images and media
└── login.html             # Login page (entry point)
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Backend API running (see `backend-elysia` folder)

### Installation

1. **No installation needed!** This is a static web application.

2. **Configure API URL** (if needed):
   - Open `js/api.js`
   - Update `API_BASE_URL` to point to your backend:
     ```javascript
     const API_BASE_URL = 'http://localhost:3000/api';
     ```

3. **Start your backend**:
   ```bash
   cd backend-elysia
   bun run dev
   ```

4. **Open the frontend**:
   - Simply open `login.html` in your web browser
   - Or use a local server (recommended):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using PHP
     php -S localhost:8000
     
     # Using Node.js (http-server)
     npx http-server -p 8000
     ```
   - Then visit: `http://localhost:8000/login.html`

## 🎯 Usage

### First Time Setup

1. **Register an Account**:
   - Click "Sign up" on the login page
   - Fill in username, email, and password
   - Verify your email with the 6-digit code sent to your inbox
   - Complete your profile with first and last name

2. **Login**:
   - Enter your username and password
   - Click "Sign In"

3. **Explore**:
   - View dashboard statistics
   - Browse and filter reports
   - Manage officers, hearings, and more

### Key Pages

- **`login.html`** - Login page (entry point)
- **`pages/register.html`** - Multi-step registration
- **`pages/dashboard.html`** - Main dashboard with stats
- **`pages/reports.html`** - Reports management
- **`pages/officers.html`** - Officers management (coming soon)
- **`pages/hearings.html`** - Hearings schedule (coming soon)

## 🔧 Configuration

### Backend URL

Update the API base URL in `js/api.js`:

```javascript
const API_BASE_URL = 'http://your-backend-url.com/api';
```

### CORS Setup

Make sure your backend allows requests from your frontend URL. Update `ALLOWED_ORIGINS` in your backend `.env`:

```env
ALLOWED_ORIGINS=http://localhost:8000,http://127.0.0.1:8000
```

## 🎨 Design System

The application uses a comprehensive design system defined in `css/style.css`:

- **CSS Variables**: Colors, spacing, typography
- **Dark Mode**: Default dark theme with light mode support
- **Components**: Buttons, inputs, cards, badges, modals, toasts
- **Utilities**: Flexbox, spacing, text, shadows
- **Animations**: Fade in, slide in, pulse, spin

### Color Palette

- **Primary**: `#6366f1` (Indigo)
- **Secondary**: `#8b5cf6` (Purple)
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Amber)
- **Error**: `#ef4444` (Red)

## 📱 Responsive Design

The application is fully responsive:

- **Desktop**: Full sidebar navigation
- **Tablet**: Collapsible sidebar
- **Mobile**: Bottom navigation (coming soon)

## 🔐 Security

- JWT token authentication
- Tokens stored in `localStorage`
- Automatic token injection in API requests
- Protected routes (redirect to login if not authenticated)

## 🚀 Deployment

### Deploy to Netlify/Vercel

1. Push your code to GitHub
2. Connect your repository to Netlify or Vercel
3. Set build command: (none - static site)
4. Set publish directory: `web-frontend`
5. Add environment variable:
   - `API_BASE_URL`: Your production backend URL

### Deploy to Render (Static Site)

1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Set publish directory: `web-frontend`
4. Deploy!

### Update Backend CORS

After deployment, update your backend's `ALLOWED_ORIGINS`:

```env
ALLOWED_ORIGINS=https://your-frontend-url.com
```

## 🛠️ Development

### Adding New Pages

1. Create a new HTML file in `pages/`
2. Include the CSS and JS:
   ```html
   <link rel="stylesheet" href="../css/style.css">
   <script src="../js/api.js"></script>
   ```
3. Add authentication check:
   ```javascript
   if (!requireAuth()) {
     // Will redirect to login
   }
   ```
4. Add navigation link in sidebar

### Using the API Client

```javascript
// Login
const response = await api.login(username, password);

// Get reports
const reports = await api.getReports();

// Create report
const newReport = await api.createReport(reportData);

// Upload file
const upload = await api.uploadFile(file);
```

### Showing Notifications

```javascript
showToast('Success message', 'success');
showToast('Error message', 'error');
showToast('Info message', 'info');
```

## 📝 API Endpoints

All endpoints are defined in `js/api.js`:

- **Auth**: `/auth/login`, `/auth/register`, `/auth/verify-email`, etc.
- **Reports**: `/reports`, `/reports/:id`
- **Officers**: `/officers`, `/officers/:id`
- **Dashboard**: `/dashboard/stats`
- **Hearings**: `/hearings`
- **Notifications**: `/notifications`
- **Upload**: `/upload`

## 🎯 Roadmap

- [x] Authentication (login, register, email verification)
- [x] Dashboard with statistics
- [x] Reports management
- [ ] Forgot password flow
- [ ] Create/Edit report forms
- [ ] Officers management
- [ ] Hearings schedule
- [ ] Notifications center
- [ ] User profile page
- [ ] Dark/Light mode toggle
- [ ] Mobile navigation
- [ ] PWA support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

**JherosjaY** - [GitHub](https://github.com/JherosjaY)

## 🙏 Acknowledgments

- Design inspired by modern SaaS dashboards
- Icons: Unicode emoji (no external dependencies!)
- Fonts: Google Fonts (Inter)

---

**Made with ❤️ for efficient blotter management**
