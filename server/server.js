import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./DB/connectDB.js";
import employeeRoute from "./routes/employee.route.js";
import systemRoutes from "./routes/system.route.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:5173",
      "https://atofon-admin.onrender.com",
      "https://atofon.vercel.app",
    ],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/employee", employeeRoute);
app.use("/api/systems", systemRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to atofon server!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
