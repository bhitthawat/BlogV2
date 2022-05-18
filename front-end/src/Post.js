import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
import { auth } from "./firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import Swal from "sweetalert2";

function Post(prop) {
  const [post, setPost] = React.useState([]);
  const [user, setUser] = React.useState(null);
  const navigate = useNavigate();
  const params = useParams();
  // const url = "http://localhost:4000/post/" + params.id;
  const url =
    "https://asia-southeast1-blog-website-react.cloudfunctions.net/app/post/" +
    params.id;
  React.useEffect(async () => {
    auth.onAuthStateChanged(async (userNew) => {
      if (!userNew) {
        navigate("/login");
      } else {
        setUser(userNew);
        await fetch(url + "/" + userNew.email)
          .then((res) => res.json())
          .then((data) => setPost(data));
      }
    });
  }, []);
  return (
    <div className="overflow-auto flex-grow-1 flex-shrink-1">
      <div className="col-lg-8 col-10 my-5 mx-auto">
        <div className="mb-5">
          <h1 className="text-primary display-2">{post.title}</h1>
          <h2 className="text-muted h4">{post.content}</h2>
        </div>
        <h3 className="text-danger h5">{post.user}</h3>
      </div>
    </div>
  );
}

export default Post;
