async function getUserId(username) {
    const res = await fetch(
        "https://users.roblox.com/v1/usernames/users",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usernames: [username]
            })
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch user");
    }

    const data = await res.json();

    if (
        !data.data ||
        !Array.isArray(data.data) ||
        !data.data[0]
    ) {
        throw new Error("User not found");
    }

    return data.data[0].id;
}

async function getAvatar(userId) {
    const res = await fetch(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png`
    );

    if (!res.ok) {
        throw new Error("Failed to fetch avatar");
    }

    const data = await res.json();

    return data?.data?.[0]?.imageUrl || null;
}

function buildEmbed({ username, userId, stats, avatar }) {
    return {
        title: "Account Info",
        fields: [
            {
                name: "Username",
                value: String(username || "Unknown")
            },
            {
                name: "UserID",
                value: String(userId || "Unknown")
            },
            {
                name: "Robux",
                value: String(stats?.robux || 0)
            },
            {
                name: "Friends",
                value: String(stats?.friends || 0)
            }
        ],
        thumbnail: avatar
            ? { url: avatar }
            : undefined
    };
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

module.exports = {
    getUserId,
    getAvatar,
    buildEmbed
};