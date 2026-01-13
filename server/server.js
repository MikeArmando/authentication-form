import express, { raw } from "express";
import pg from "pg";
import bcrypt from "bcrypt";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;

const SALT_ROUNDS = 10;

app.use(express.static("client"));
app.use(express.json());

const { Pool } = pg;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// -------------------------- Sign Up --------------------------
app.post("/api/signup", async (request, response) => {
  const {
    "first-name": rawFirstName,
    "last-name": rawLastName,
    email: rawEmail,
    password,
    "confirm-password": confirmPassword,
  } = request.body;

  const firstName = rawFirstName?.trim();
  const lastName = rawLastName?.trim();
  const email = rawEmail?.toLowerCase().trim();

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return response.status(400).json({
      field: "general",
      message: "All fields are required.",
    });
  }

  if (firstName.length > 100) {
    return response.status(400).json({
      field: "first-name",
      message: "Name cannot be more than 100 characters.",
    });
  }

  if (lastName.length > 100) {
    return response.status(400).json({
      field: "last-name",
      message: "Name cannot be more than 100 characters.",
    });
  }

  if (email.length > 255) {
    return response.status(400).json({
      field: "email",
      message: "email cannot be more than 255 characters.",
    });
  }

  if (password !== confirmPassword) {
    return response.status(400).json({
      field: "confirm-password",
      message: "Passwords don't match.",
    });
  }

  if (password.length < 12) {
    return response.status(400).json({
      field: "password",
      message: "Password must be at least 12 characters.",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return response.status(400).json({
      field: "email",
      message: "Invalid email format.",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const queryText = `
      INSERT INTO users (first_name, last_name, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING first_name AS "firstName", last_name AS "lastName", email;
    `;
    const values = [firstName, lastName, email, hashedPassword];

    const result = await pool.query(queryText, values);

    console.log("User saved to DB:", result.rows[0]);

    response.status(201).json({
      message: "User created successfully!",
      firstName: result.rows[0].firstName,
      lastName: result.rows[0].lastName,
      email: result.rows[0].email,
    });
  } catch (error) {
    console.error("Database Error:", error);

    if (error.code === "23505") {
      return response.status(400).json({
        field: "email",
        message: "This email is already registered.",
      });
    }

    response.status(500).json({
      field: "general",
      message: "An internal error occurred. Please try again later.",
    });
  }
});

// -------------------------- Log In --------------------------
app.post("/api/login", async (request, response) => {
  const rawEmail = request.body.email;
  const password = request.body.password;

  const email = rawEmail?.toLowerCase().trim();

  if (!email || !password) {
    return response.status(400).json({
      field: "general",
      message: "Enter both email and password.",
    });
  }

  try {
    const queryText = "SELECT * FROM users WHERE email = $1;";
    const result = await pool.query(queryText, [email]);

    if (result.rows.length === 0) {
      return response.status(401).json({
        field: "general",
        message: "Invalid email or password.",
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return response.status(401).json({
        field: "general",
        message: "Invalid email or password.",
      });
    }

    response.status(200).json({
      message: "Login successful!",
      user: { email: user.email, firstName: user.first_name },
    });
  } catch (error) {
    console.error("Database Error:", error);
    response.status(500).json({
      field: "general",
      message: "An internal error occurred. Please try again later.",
    });
  }
});

// -----------------------------------------------------------
app.listen(PORT, () =>
  console.log(`Server listening at: http://localhost:${PORT}`)
);
