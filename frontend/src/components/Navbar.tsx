import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  
  console.log('Navbar render - isAuthenticated:', isAuthenticated());
  console.log('Navbar render - user:', user);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">Lost & Found</Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="hover:text-blue-200 transition">Home</Link>
            <Link to="/items" className="hover:text-blue-200 transition">Browse Items</Link>
            
            {isAuthenticated() ? (
              <>
                <Link to="/items/new" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition">Report Item</Link>
                <Link to="/my-items" className="hover:text-blue-200 transition">My Items</Link>
                
                {user?.role === 'admin' && (
                  <>
                    <Link to="/admin" className="hover:text-blue-200 transition">Admin Panel</Link>
                    <Link to="/admin/verification" className="hover:text-blue-200 transition">Verify Items</Link>
                  </>
                )}
                
                <span className="mr-4">Hello, {user?.name}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition">Login</Link>
                <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;