async function getUserId(username) {
    const res = await fetch("https://users.roblox.com/v1/usernames/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernames: [username] })
    });

    const data = await res.json();
    return data.data[0].id;
}

async function getAvatar(userId) {
    const res = await fetch(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png`
    );

    const data = await res.json();
    return data.data[0].imageUrl;
}

function buildEmbed({ username, userId, stats, avatar }) {
    return {
        title: "Account Info",
        fields: [
            { name: "Username", value: username },
            { name: "UserID", value: String(userId) },
            { name: "Robux", value: String(stats.robux) },
            { name: "Friends", value: String(stats.friends) }
        ],
        thumbnail: avatar ? { url: avatar } : undefined
    };
}

module.exports = { getUserId, getAvatar, buildEmbed };