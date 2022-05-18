import React from "react";
import { auth } from "./firebase-config";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

function Verify() {
  const [user, setUser] = React.useState(null);
  let navigate = useNavigate();
  React.useEffect(async () => {
    fetch(
      "https://asia-southeast1-blog-website-react.cloudfunctions.net/app/notify"
    );
    auth.onAuthStateChanged(async (userNew) => {
      setUser(userNew);
      if (userNew && userNew.emailVerified) {
        navigate("/blog");
      } else if (!userNew) {
        navigate("/login");
      }
    });
  }, []);

  return (
    <div className="flex-grow-1 flex-shrink-1 d-flex flex-column justify-content-center align-items-center">
      {user && (
        <div>
          <h1 className="text-primary h2">{user.email}</h1>
          <h1 className="text-warning">Please verify your Email</h1>
        </div>
      )}
    </div>
  );
}

export default Verify;
