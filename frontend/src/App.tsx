import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ItemList from './pages/ItemList';
import ItemForm from './pages/ItemForm';
import ItemDetail from './pages/ItemDetail';
import MyItems from './pages/MyItems';
import AdminPanel from './pages/AdminPanel';
import AdminVerification from './pages/AdminVerification';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <main className="container mx-auto py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/items" element={<ItemList />} />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route path="/items/new" element={
              <PrivateRoute>
                <ItemForm />
              </PrivateRoute>
            } />
            <Route path="/items/:id/edit" element={
              <PrivateRoute>
                <ItemForm />
              </PrivateRoute>
            } />
            <Route path="/my-items" element={
              <PrivateRoute>
                <MyItems />
              </PrivateRoute>
            } />
            <Route path="/admin" element={
              <PrivateRoute adminOnly={true}>
                <AdminPanel />
              </PrivateRoute>
            } />
            <Route path="/admin/verification" element={
              <PrivateRoute adminOnly={true}>
                <AdminVerification />
              </PrivateRoute>
            } />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;