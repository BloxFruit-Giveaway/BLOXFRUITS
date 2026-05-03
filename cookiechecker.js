async function getRobloxStats(cookie) {
  async function fetchJSON(url) {
    const res = await fetch(url, {
      headers: {
        "Cookie": `.ROBLOSECURITY=${cookie}`,
        "User-Agent": "Mozilla/5.0"
      }
    });

    if (!res.ok) throw new Error(`Request failed: ${url}`);
    return res.json();
  }

  // 1. User info
  const user = await fetchJSON(
    "https://users.roblox.com/v1/users/authenticated"
  );

  const userId = user.id;

  // 2. Parallel requests (faster)
  const [
    friendsRes,
    followersRes,
    followingRes,
    robuxRes
  ] = await Promise.all([
    fetchJSON(`https://friends.roblox.com/v1/users/${userId}/friends/count`),
    fetchJSON(`https://friends.roblox.com/v1/users/${userId}/followers/count`),
    fetchJSON(`https://friends.roblox.com/v1/users/${userId}/followings/count`),
    fetchJSON("https://economy.roblox.com/v1/user/currency")
  ]);

  return {
    username: user.name,
    userId: user.id,
    friends: friendsRes.count,
    followers: followersRes.count,
    following: followingRes.count,
    robux: robuxRes.robux
  };
}

module.exports = getRobloxStats;