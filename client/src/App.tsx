import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { ToastContainer } from 'react-toastify';
import CreatePost from './pages/CreatePost';
import './index.css';
import NavBar from './components/NavBar';

const App = () => {
  return (
  <>
  <ToastContainer />
    <Router>
  <NavBar />

      <Routes>
        <Route element={<Home />}>

        <Route path="/create-post" element={<CreatePost />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
    </>
  );
};

export default App;