import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { ToastContainer } from 'react-toastify';
import CreatePost from './pages/CreatePost';
import './index.css';
import NavBar from './components/NavBar';
import Detail from './pages/Detail';

const App = () => {
  return (
  <>
  <ToastContainer />
    <Router>
  <NavBar />

      <Routes>
    <Route path="/posts" element={<Home />} />
    <Route path="/posts/:postId" element={<Detail />} /> {/* Add this line */}
    <Route path="/create-post" element={<CreatePost />} />
    <Route path="*" element={<NotFound />} />
</Routes>
    </Router>
    </>
  );
};

export default App;