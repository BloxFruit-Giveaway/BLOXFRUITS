const express = require("express");
const path = require("path");

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api", authRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running");
});