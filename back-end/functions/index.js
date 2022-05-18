const functions = require("firebase-functions");
const express = require("express");
const app = express();
// const port = 4000;
const admin = require("firebase-admin");
const cors = require("cors");
const bodyParser = require("body-parser");
const request = require("request");
require("dotenv").config();

// var serviceAccount = require("./serviceAccountKey.json");
// const { log } = require("firebase-functions/logger");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

function notify(msg) {
  const requestOption = {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    auth: { bearer: process.env.TOKEN },
    url: "https://notify-api.line.me/api/notify",
    form: { message: msg },
  };
  request(requestOption, (err, httpResponse, body) => {
    if (err) {
      console.log(err);
    }
  });
}

admin.initializeApp();

// Initialize Firebase Authentication and get a reference to the service
const db = admin.firestore();
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

app.get("/notify", async function (req, res) {
  res.send("Notify");
  notify("\nขณะนี้มีผู้คนเข้าชมเว็บไซต์ของคุณ");
});

app.get("/:user", async function (req, res) {
  const blogArray = [];
  const snapshot = await db.collection("blog").orderBy("date").get();
  snapshot.forEach((doc) => {
    blogArray.push({
      id: doc.id,
      user: doc.data().user,
      title: doc.data().title,
      content: doc.data().content,
      date: doc.data().date,
    });
  });
  res.send(blogArray);
  notify(
    "\nขณะนี้คุณ\n" + req.params.user + "\nเข้าเว็บไซต์ของคุณ (หน้า blog)"
  );
});

app.get("/post/:id/:user", async function (req, res) {
  const snapshot = await db.collection("blog").doc(req.params.id).get();
  const post = {
    title: snapshot.data().title,
    content: snapshot.data().content,
    user: snapshot.data().user,
  };
  res.send(post);
  notify(
    "\nขณะนี้คุณ\n" + req.params.user + "\nเข้าเว็บไซต์ของคุณ (หน้า Post)"
  );
});
app.post("/", async function (req, res) {
  await db.collection("blog").add({
    user: req.body.user,
    title: req.body.title,
    content: req.body.content,
    date: new Date(),
  });
  res.send("success");
  notify(
    "\nคุณ " +
      req.body.user +
      "\nได้โพสต์ข้อความ\n" +
      "หัวข้อ: " +
      req.body.title +
      "\n" +
      "เนื้ิอหา: " +
      req.body.content
  );
});

app.delete("/", async function (req, res) {
  await db.collection("blog").doc(req.body.id).delete();
  res.send("success");
  notify("\nคุณ " + req.body.user + "\nได้ลบข้อความ");
});

// app.listen(port, () => {
//   console.log(`Listening at http://localhost:${port}`);
// });

exports.app = functions.region("asia-southeast1").https.onRequest(app);
