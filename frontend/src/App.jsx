import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar';
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

import PrivateRoutes from './utils/PrivateRoutes';
import { AuthProvider } from './utils/authContext';

const App = () => {

  return (
    <AuthProvider>
    <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoutes><Dashboard /></PrivateRoutes>} />
        </Routes>
    </Router>
    </AuthProvider>
  );
};

export default App
