const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api", authRoutes);

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on", PORT);
});
