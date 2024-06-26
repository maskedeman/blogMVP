import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import UpdateUser from "./pages/UpdateUser";
import MyPosts from "./pages/MyPosts";
import UpdatePost from "./pages/UpdatePost";
import NotFound from "./pages/NotFound";
import { ToastContainer } from 'react-toastify';
import CreatePost from './pages/CreatePost';
import './index.css';
import NavBar from './components/NavBar';
import Detail from './pages/Detail';
import Login from './auth/Login';
import Signup from './auth/Signup';
import PublicRoute from '../src/routes/Public'
import PrivateRoute from '../src/routes/Private'
import AuthProvider from './auth/AuthProvider';


const App = () => {
  return (
    <AuthProvider>
      <ToastContainer />
      <Router>
        <NavBar />
        <Routes>
          <Route path="/posts" element={<Home />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/create" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
          <Route path="/update-user" element={<PrivateRoute><UpdateUser /></PrivateRoute>} />
          <Route path="/my-posts" element={<PrivateRoute><MyPosts /></PrivateRoute>} />
          <Route path="/update-post/:postId" element={<PrivateRoute><UpdatePost /></PrivateRoute>} />
          <Route path="/posts/:postId" element={<Detail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};
export default App;