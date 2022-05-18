import React from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "./firebase-config";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Register() {
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
  const [isEmpty, setIsEmpty] = React.useState(true);
  const [bool, setBool] = React.useState(true);
  const [isEmail, setIsEmaiI] = React.useState(true);
  const [isLength, setIsLength] = React.useState(true);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConfirm, setPasswordConfirm] = React.useState(true);
  const validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  function handleChangeUsername(event) {
    setUsername(event.target.value);
    setIsEmaiI(validRegex.test(event.target.value));
    setIsEmpty(false);
  }

  function handleChangePassword(event) {
    setPassword(event.target.value);
    event.target.value.length >= 8 ? setIsLength(true) : setIsLength(false);
    event.target.value === passwordConfirm ? setBool(true) : setBool(false);
    setIsEmpty(false);
  }
  function handleChangePasswordConfirm(event) {
    setPasswordConfirm(event.target.value);
    password === event.target.value ? setBool(true) : setBool(false);
    setIsEmpty(false);
  }
  function register() {
    const userCredential = createUserWithEmailAndPassword(
      auth,
      username,
      password
    )
      .then((user) => {
        user &&
          Swal.fire({
            title: "Register success",
            text: "Please verify your Email ",
            icon: "success",
            heightAuto: false,
          });
        sendEmailVerification(user.user);
      })
      .catch((error) => {
        Swal.fire({
          title: "Invalid Email",
          text: "Please check your input Email ",
          icon: "error",
          heightAuto: false,
        });
      });
  }

  return (
    <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
      {getuser && (
        <div className="col-10 col-lg-5 mb-3">
          <h1 className="text-center text-primary mb-lg-3 mb-3">Register</h1>
          <div className="mb-3">
            <label class="form-label">Email</label>
            <input
              type="text"
              class="form-control"
              onChange={handleChangeUsername}
            ></input>
          </div>
          <div className="mb-2">
            <label class="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              onChange={handleChangePassword}
            ></input>
          </div>
          <div className="mb-2">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              onChange={handleChangePasswordConfirm}
            ></input>
            <ul className="mt-2 px-4">
              {!isEmail && (
                <li>
                  <span className="text-danger">Invalid Email Format!</span>
                </li>
              )}
              {!bool && (
                <li>
                  <span className="text-danger">password not Match!</span>
                </li>
              )}

              {!isLength && (
                <li>
                  <span className="text-danger">
                    password least 8 character!
                  </span>
                </li>
              )}
            </ul>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <button
              onClick={register}
              class={
                "btn btn-primary col-lg-2 col-4 " +
                (bool && isLength && isEmail && !isEmpty ? "" : "disabled")
              }
            >
              Submit
            </button>

            <Link
              to="/login"
              className="text-decoration-none text-warning h5 m-0"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
