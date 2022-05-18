import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { auth } from "./firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import Swal from "sweetalert2";
function Login(prop) {
  let navigate = useNavigate();
  const [getuser, setGetUser] = React.useState(false);
  React.useEffect(() => {
    fetch(
      "https://asia-southeast1-blog-website-react.cloudfunctions.net/app/notify"
    );
    auth.onAuthStateChanged((userNew) => {
      if (userNew && userNew.emailVerified) {
        navigate("/blog");
      } else if (userNew && !userNew.emailVerified) {
        navigate("/verify");
      }
      setGetUser(true);
    });
  }, []);

  function login() {
    signInWithEmailAndPassword(auth, username, password)
      .then(
        (user) =>
          user &&
          Swal.fire({
            title: "Login Success",
            icon: "success",
            heightAuto: false,
          })
      )
      // .then(() => navigate("/blog"))
      .catch((error) => {
        if (error) {
          Swal.fire({
            title: "Login Failed",
            text: "Your email or password is not valid",
            icon: "error",
            heightAuto: false,
          });
        }
      });
  }
  function handleChangeUsername(event) {
    setUsername(event.target.value);
  }

  function handleChangePassword(event) {
    setPassword(event.target.value);
  }
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <div className="flex-grow-1 d-flex flex-column justify-content-center">
      {getuser && (
        <div className="d-flex flex-column justify-content-center align-items-center">
          <h1 className="text-center text-warning mb-3">Login</h1>
          <div className="col-10 col-lg-5 mb-5">
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="text"
                class="form-control"
                onChange={handleChangeUsername}
              ></input>
            </div>
            <div className="mb-3">
              <label class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                onChange={handleChangePassword}
              ></input>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <button class="btn btn-primary col-lg-2 col-4" onClick={login}>
                Submit
              </button>

              <Link
                to="/register"
                className="text-decoration-none text-primary h5 m-0"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
