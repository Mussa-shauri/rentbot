const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // Vite frontend
  credentials: true,
}));
app.use(express.json());
app.use(morgan("dev"));

/* ✅ TEST ROUTE FIRST */
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working 🚀" });
});


/* Routes */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/properties", require("./routes/propertyRoutes"));
app.use("/api/tenants", require("./routes/tenantRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));

/* Root */
app.get("/", (req, res) => {
  res.send("RentBot API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});