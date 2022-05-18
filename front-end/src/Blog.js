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
import Swal from "sweetalert2";

function Blog(prop) {
  // const url = "http://localhost:4000/";
  const url =
    "https://asia-southeast1-blog-website-react.cloudfunctions.net/app/";
  const [blog, setBlog] = React.useState([]);
  const [user, setUser] = React.useState(null);
  let navigate = useNavigate();
  React.useEffect(() => {
    auth.onAuthStateChanged((userNew) => {
      setUser(userNew);
      if (userNew && userNew.emailVerified) {
        getData(userNew);
      } else if (userNew && !userNew.emailVerified) {
        navigate("/verify");
      } else {
        navigate("/login");
      }
    });
  }, []);

  function getData(user) {
    fetch(url + user.email)
      .then((res) => res.json())
      .then((data) => setBlog(data));
  }

  async function deleteBlog(id, e) {
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        user: user.email,
      }),
    }).then(async (response) => {
      if (response.ok) {
        await Swal.fire({
          title: "Delete Post Success",
          icon: "success",
          heightAuto: false,
        });
      }
      await getData(user);
    });
  }

  function seePost(id) {
    navigate("/post/" + id);
  }

  return (
    <div class="overflow-auto flex-grow-1 flex-shrink-1">
      {user && blog.length != 0 && (
        <div className="my-4">
          <div className="col-lg-7 col-10 mx-auto">
            <h1 className="text-end h6 m-0 p-0 text-secondary">My Account</h1>
            <p className="text-end text-info m-0 p-0">{user.email}</p>
          </div>
          <div className="d-flex flex-column align-items-center gap-4">
            <div className="col-lg-7 col-10 row align-items-start">
              <h1 className="col-lg-7 col-4 m-0 p-0">Home</h1>
            </div>

            {blog.map((x) => (
              <div className="col-lg-7 col-10">
                <div
                  className="d-flex align-items-start justify-content-between gap-2 py-2"
                  role="button"
                  onClick={() => seePost(x.id)}
                >
                  <div className="col-lg-9 col-8 m-0">
                    <p className="h1 m-0 text-primary">{x.title}</p>
                    <p className="text-truncate m-0">{x.content}</p>
                  </div>
                  <div className="col-lg-2 col-4 m-0 p-0 mt-1 text-end">
                    <p className="text-muted h6 text-truncate m-0">{x.user}</p>
                    {user.email === x.user && (
                      <button
                        className="col-lg-12 col-12 btn btn-danger h6 m-0 p-0"
                        onClickCapture={() => deleteBlog(x.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Blog;
