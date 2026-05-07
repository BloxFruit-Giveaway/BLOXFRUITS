const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors({
    origin: "https://bloxfruit-giveaway.github.io",
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true
}));

app.options("/*", cors());

app.use(express.json());

app.use("/api", authRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running");
});
