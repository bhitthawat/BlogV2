import React from "react";
import { auth } from "./firebase-config";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

// const url = "http://localhost:4000/";
const url =
  "https://asia-southeast1-blog-website-react.cloudfunctions.net/app/";
function Create() {
  let navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");

  React.useEffect(async () => {
    auth.onAuthStateChanged((userNew) => {
      setUser(userNew);
      if (!userNew.emailVerified) {
        navigate("/verify");
      } else if (!userNew) {
        navigate("/login");
      }
    });
  }, []);

  function handleChangeTitle(event) {
    setTitle(event.target.value);
  }

  function handleChangeContent(event) {
    setContent(event.target.value);
  }

  function submit() {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user.email,
        title: title,
        content: content,
      }),
    }).then(async (response) => {
      if (response.ok) {
        await Swal.fire({
          title: "Create Post Success",
          icon: "success",
          heightAuto: false,
        });
        navigate("/blog");
      }
    });
  }

  return (
    <div className="flex-grow-1 d-flex flex-column justify-content-center">
      {user && user.emailVerified && (
        <div className="d-flex flex-column align-items-center">
          <div className="col-lg-6 col-10 mb-3">
            <label className="mb-2">Title</label>
            <input
              type="text"
              class="form-control"
              placeholder="Please fill a title"
              onChange={handleChangeTitle}
              maxLength="50"
            ></input>
          </div>

          <div className="col-lg-6 col-10 mb-4">
            <label className="mb-2">Content</label>
            <textarea
              class="form-control"
              placeholder="Please fill a content"
              rows="10"
              style={{ resize: "none" }}
              onChange={handleChangeContent}
            ></textarea>
          </div>
          <button className="btn btn-primary col-lg-6 col-10 " onClick={submit}>
            submit
          </button>
        </div>
      )}
    </div>
  );
}

export default Create;
