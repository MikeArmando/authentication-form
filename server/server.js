import express from "express";

const app = express();
const PORT = 3000;

app.use(express.static("client"));
app.use(express.json());

app.post("/api/signup", (request, response) => {
  const userData = request.body;

  response.send(JSON.stringify("User created successfully!"));

  console.log(userData);
});

app.listen(PORT, () =>
  console.log("Server listening at: http://localhost:3000/")
);
