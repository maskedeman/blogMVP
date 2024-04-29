import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { ToastContainer } from 'react-toastify';
import CreatePost from './pages/CreatePost';
import './index.css';
import NavBar from './components/NavBar';
import Detail from './pages/Detail';
import Login from './auth/Login';
import Signup from './auth/Signup';
import  PublicRoute  from '../src/routes/Public'
import  PrivateRoute  from '../src/routes/Private'

const App = () => {
  return (
    <>
    <ToastContainer />
    <Router>
      <NavBar />
  
      <Routes>
        <Route path="/posts" element={<PublicRoute><Home /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/create" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
        <Route path="/posts/:postId" element={<PrivateRoute><Detail /></PrivateRoute>} />
        <Route path="*" element={<PrivateRoute><NotFound /></PrivateRoute>} />
      </Routes>
    </Router>
  </>
  );
};

export default App;