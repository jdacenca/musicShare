import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Homepage from './pages/Homepage';
import UserPage from './pages/UserPage';
import ResetPassword from './pages/ResetPassword';
import Settings from './pages/Settings';  // 添加这行
import SearchPopup from './components/SearchPopup'; 
import PostPopup from './components/PostPopup';
import ChangePassword from './pages/ChangePassword';
import Genre from './components/Genre';
import PostPage from './pages/PostPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/userpage" element={<UserPage />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/search" element={<SearchPopup />} />
        <Route path="/create" element={<PostPopup />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/genre" element={<Genre/>} />
        <Route path="/post" element={<PostPage/>} />
      </Routes>
    </Router>
  );
};

export default App;

