import React from "react";
import Login from "./Login";
import NavCreate from "./NavCreate";
import Nav from "./Nav";
import Footer from "./Footer";
import Register from "./Register";
import Blog from "./Blog";
import Create from "./Create";
import Post from "./Post";
import { auth } from "./firebase-config";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  Redirect,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Verify from "./Verify";
import NavVerify from "./NavVerify";
function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    auth.onAuthStateChanged((userNew) => {
      setUser(userNew);
    });
  }, []);

  return (
    <div className="full-vh d-flex flex-column">
      {!user && <Nav />}
      <Router>
        {user && !user.emailVerified && <NavVerify />}
        {user && user.emailVerified && <NavCreate />}
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route exact path="/register" element={<Register />}></Route>
          <Route exact path="/login" element={<Login />}></Route>
          <Route exact path="/verify" element={<Verify />}></Route>
          <Route exact path="/blog" element={<Blog />}></Route>
          <Route exact path="/create" element={<Create />}></Route>
          <Route path="post/:id" element={<Post />}></Route>
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
