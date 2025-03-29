# BlightDetect Frontend

A modern React frontend for the BlightDetect crop disease detection system. This application allows farmers to upload potato leaf images and get instant predictions about potential diseases, while administrators can manage users and monitor predictions.

## Features

### User (Farmer) Module
- User registration and authentication
- Image upload for disease detection
- Real-time disease prediction with confidence scores
- Prediction history with filtering and deletion
- Profile management
- Mobile-responsive design

### Admin Module
- Secure admin authentication
- Dashboard with system statistics
- User management
- Prediction management
- Disease distribution analytics

## Tech Stack

- React 18
- Vite
- Redux Toolkit for state management
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
- Headless UI for accessible components
- React Hot Toast for notifications

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on `http://localhost:5000`

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd blightdetect/frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

## Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The build output will be in the `dist` directory.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── layout/
│   │       ├── Navbar.jsx
│   │       └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   └── AdminLogin.jsx
│   │   │   ├── user/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── PredictionHistory.jsx
│   │   │   │   └── Profile.jsx
│   │   │   └── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── UserManagement.jsx
│   │   │   │   └── PredictionManagement.jsx
│   │   │   ├── store/
│   │   │   │   ├── store.js
│   │   │   │   └── slices/
│   │   │   │   │   ├── authSlice.js
│   │   │   │   │   └── predictionSlice.js
│   │   │   │   ├── services/
│   │   │   │   │   └── api.js
│   │   │   │   ├── App.jsx
│   │   │   │   ├── main.jsx
│   │   │   │   └── index.css
│   │   │   └── public/
│   │   └── index.html
│   └── package.json
└── vite.config.js
└── tailwind.config.js
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 