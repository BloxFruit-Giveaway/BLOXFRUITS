async function getUserId(username) {
    const res = await fetch("https://users.roblox.com/v1/usernames/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernames: [username] })
    });

    const data = await res.json();

    if (!data?.data?.length) {
        throw new Error("User not found");
    }

    return data.data[0].id;
}

async function getAvatar(userId) {
    const res = await fetch(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`
    );

    const data = await res.json();

    return data?.data?.[0]?.imageUrl || null;
}

function buildEmbed({ username, userId, stats, avatarUrl }) {
    return {
        title: "Account Info",
        fields: [
            { name: "Username", value: `\`\`\`${username}\`\`\`` },
            { name: "UserID", value: `\`\`\`${userId}\`\`\`` },
            { name: "Robux", value: `\`\`\`${stats.robux}\`\`\`` },
            { name: "Friends", value: `\`\`\`${stats.friends}\`\`\`` },
            { name: "Followers", value: `\`\`\`${stats.followers}\`\`\`` },
            { name: "Following", value: `\`\`\`${stats.following}\`\`\`` }
        ],
        thumbnail: avatarUrl ? { url: avatarUrl } : undefined
    };
}

module.exports = {
    getUserId,
    getAvatar,
    buildEmbed
};