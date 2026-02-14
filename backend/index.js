const express = require("express");
const cors = require("cors");
const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3005"],
  credentials: true
}));
app.use(express.json());

const issuer = "http://localhost:8081/realms/notes";

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri: `${issuer}/protocol/openid-connect/certs`,
  }),
  issuer,
  algorithms: ["RS256"],
});

// Public
app.get("/health", (req, res) => res.json({ ok: true }));

// Protect only /api/*
app.use("/api", checkJwt);

// API
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong", sub: req.auth?.sub });
});

const notesByUser = new Map();

app.get("/api/notes", (req, res) => {
  const userId = req.auth?.sub;
  res.json({ notes: notesByUser.get(userId) || [] });
});

app.post("/api/notes", (req, res) => {
  const userId = req.auth?.sub;
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: "text required" });

  const notes = notesByUser.get(userId) || [];
  const newNote = { id: Date.now(), text: text.trim() };
  notes.unshift(newNote);
  notesByUser.set(userId, notes);

  res.json({ created: newNote });
});

// Nice error message (so browser doesn't show stack trace)
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "missing_or_invalid_token" });
  }
  next(err);
});

app.listen(8080, () => console.log("Backend running on http://localhost:8080"));
