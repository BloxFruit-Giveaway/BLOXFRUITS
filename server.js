const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");

const app = express();
const PORT = process.env.PORT || 3000;

/* CORS FIRST */
app.use(cors({
    origin: "https://bloxfruit-giveaway.github.io",
    methods: ["GET", "POST"],
    credentials: true
}));

/* JSON BODY PARSER */
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://bloxfruit-giveaway.github.io");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    next();
});

/* ROUTES */
app.use("/api", authRoutes);

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on", PORT);
});
