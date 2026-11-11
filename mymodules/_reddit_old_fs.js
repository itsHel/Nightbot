const fs = require("fs");
const request = require("request");
const discord = require("discord.js");
const mongo = require("./mymongo.js");
const help = require("./help.js");

const ignoredTitleKeywords = /MEMES MEME QUIZ/;

const roomTypes = [
    { name: "reddittheatre", type: "img" },
    { name: "reddittext", type: "text" },
    { name: "redditnsfw", type: "nsfw" },
];

// https://www.reddit.com/r/memes/top.json?t=week&limit=100

// https://www.reddit.com/r/memes/top.json?t=week&limit=33&after=t3_kkn7gi
// after = next page - generated in response(response.data.after)
// /top = all time
const decodeXml = (s) =>
    s
        .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(n))
        .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, "&");

function parseRedditFeed(xml) {
    const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];

    return entries.map((entry) => {
        const get = (regex) => {
            const match = entry.match(regex);
            return match ? decodeXml(match[1]) : null;
        };

        // <content> is escaped HTML, so its attributes need a second decode
        const content = get(/<content[^>]*>([\s\S]*?)<\/content>/) || "";
        const linkMatch = content.match(/<span><a href="([^"]+)">/); // first span = post target

        return {
            id: get(/<id>([^<]+)<\/id>/),
            title: get(/<title>([\s\S]*?)<\/title>/) || "",
            permalink: get(/<link href="([^"]+)"/),
            published: get(/<published>([^<]+)<\/published>/),
            subreddit: get(/<category [^>]*label="([^"]+)"/) || "",
            thumbnail: get(/<media:thumbnail url="([^"]+)"/),
            link: linkMatch ? decodeXml(linkMatch[1]) : null,
        };
    });
}

function picsDL(
    url = "https://www.reddit.com/r/nonpoliticaltwitter/top/.rss?t=day&limit=15",
    name,
    channel,
) {
    try {
        console.log(url)
        const maxPosts = 8;

        let history;
        try {
            history = JSON.parse(
                fs.readFileSync("temp/" + name + "history.txt", "utf8"),
            );
        } catch (err) {
            history = [];
        }
   
        let count = 0;
        fs.readFile(url, "utf8", (err, xml) => {
            if (err) return console.error(err);

            const posts = parseRedditFeed(xml);

            // Don't wipe the history (and repost everything) on an odd response
            if (posts.length === 0) {
                return console.error(name + " reddit: no entries in feed");
            }

            const newHistory = [];

            for (const post of posts) {
                    newHistory.push(post.id);

                    if (history.includes(post.id)) continue;

                    try {
                        // A text post links to itself
                        if (!post.link || post.link === post.permalink) continue;
                        if (post.title.match(ignoredTitleKeywords)) continue;

                        let img = post.thumbnail;
                        let fileType;

                        if (post.link.includes("v.redd.it")) {
                            fileType = "video";
                            continue;
                        } else if (post.link.includes("/gallery/")) {
                            fileType = "gallery";
                            continue;
                        } else if (/\.gifv(\?|$)/i.test(post.link)) {
                            // Discord wont show gifv
                            fileType = "gif";
                        } else if (/\.(jpe?g|png|gif|webp)(\?|$)/i.test(post.link)) {
                            img = post.link;
                            fileType = "img";
                        } else {
                            fileType = "link";
                            continue;
                        }

                        if (!img) continue;

                        count++
                        if (count > maxPosts) {
                            process.stdout.write(`\x1b[92m${maxPosts}\x1b[0m posts; `);
                            break;
                        }

                        const embed = new discord.MessageEmbed()
                            .setColor("#ff6600")
                            .setURL(post.permalink)
                            .setImage(img)
                            .setTitle(
                                post.title.substring(0, 200) +
                                    " (" +
                                    post.subreddit +
                                    ")" +
                                    (fileType != "img"
                                        ? " (" + fileType + ")"
                                        : ""),
                            )
                            .setFooter({
                                text: new Date(post.published)
                                    .toISOString()
                                    .replace(/[A-Z]/, " ")
                                    .slice(0, -8),
                            });

                        channel.send({ embeds: [embed] });
                    } catch (e) {
                        console.log("Reddit error:");
                        console.log(e);
                    }
                }

                fs.writeFileSync(
                    "temp/" + name + "history.txt",
                    JSON.stringify(newHistory),
                );
                console.log(name + " reddit refreshed");
            },
        );
    } catch (err) {
        console.log(err);
    }
}

function textDL(url, name, channel, minUps = 250) {
    try {
        let history;
        try {
            history = JSON.parse(
                fs.readFileSync("temp/" + name + "history.txt", "utf8"),
            );
        } catch (err) {
            history = [];
        }

        request(
            {
                method: "GET",
                json: true,
                url: url,
            },
            (err, resp, data) => {
                if (err) return console.error(err);

                data = data.data;
                let same = false;
                let newHistory = [];

                for (let i = 0; i < data.children.length; i++) {
                    for (let o = 0; o < history.length; o++) {
                        if (
                            data.children[i].data.url.substring(8) == history[o]
                        ) {
                            newHistory.push(history[o]);
                            same = true;
                            break;
                        }
                    }

                    let title = data.children[i].data.title;
                    if (
                        same ||
                        data.children[i].data.ups < minUps ||
                        data.children[i].data.thumbnail == "self"
                    ) {
                        //self = nopic
                        same = false;
                        continue;
                    }

                    let url =
                        "https://www.reddit.com" +
                        data.children[i].data.permalink;
                    let desc = data.children[i].data.subreddit_name_prefixed; //data.children[i].data.selftext;
                    let ups = data.children[i].data.ups;
                    let text = data.children[i].data.selftext;
                    let time = new Date(data.children[i].data.created * 1000);
                    let embed = new discord.MessageEmbed()
                        .setColor("#ff6600")
                        .setURL(url)
                        .setDescription(text.substring(0, 2048))
                        .setTitle(title.substring(0, 200) + " (" + desc + ")")
                        .setFooter({
                            text:
                                time
                                    .toISOString()
                                    .replace(/[A-Z]/, " ")
                                    .slice(0, -8) +
                                "   " +
                                ups +
                                " upvotes",
                        });
                    channel.send({ embeds: [embed] });
                    console.log("TITLE:");
                    newHistory.push(data.children[i].data.url.substring(8));
                }
                fs.writeFileSync(
                    "temp/" + name + "history.txt",
                    JSON.stringify(newHistory),
                    function (e) {
                        console.log(e);
                    },
                );
                console.log(name + " reddit refreshed");
            },
        );
    } catch (err) {
        console.log(err);
    }
}

async function redditAll(
    redditTheatreChannel,
    redditTextChannel,
    redditNsfwChannel,
    reddits,
) {
    // Reddits format - reddit: reddit, minUpvotes: minUpvotes, type: text/img
    if (!reddits) return;
    
    for (let i = 0; i < reddits.length; i++) {
        if (reddits[i].type.toLowerCase() == "img") {
            if (redditTheatreChannel)
                picsDL(
                    `./redditScrapper/reddits/${reddits[i].reddit}.rss`,
                    reddits[i].reddit,
                    redditTheatreChannel,
                    reddits[i].minUpvotes,
                );
        } else if (reddits[i].type.toLowerCase() == "nsfw") {
            if (redditNsfwChannel)
                picsDL(
                    `./redditScrapper/reddits/${reddits[i].reddit}.rss`,
                    reddits[i].reddit,
                    redditNsfwChannel,
                    reddits[i].minUpvotes,
                );
        } else {
            if (redditTextChannel)
                textDL(
                    `./redditScrapper/reddits/${reddits[i].reddit}.rss`,
                    reddits[i].reddit,
                    redditTextChannel,
                    reddits[i].minUpvotes,
                );
        }
    }
}

function getRooms(channels, reddits, channel, client) {
    if (channel.type == "DM") return;

    if (!reddits?.length) {
        channel.send("```No reddits set```");
        return;
    }

    for (let i = 0; i < roomTypes.length; i++) {
        if (channels[roomTypes[i].name]) {
            if (client.channels.cache.get(channels[roomTypes[i].name])) {
                let channelName = client.channels.cache.get(channels[roomTypes[i].name]).toString();

                let currentReddits = reddits.filter((reddit) => reddit.type == roomTypes[i].type);
                if (!currentReddits.length) return;

                let reddit = { name: "Reddit", value: "", inline: true };
                let room = { name: "Room", value: "", inline: true };
                let upvotes = { name: "Min upvotes", value: "", inline: true };

                for (let i = 0; i < currentReddits.length; i++) {
                    reddit.value += currentReddits[i].reddit + "\n";
                    room.value += channelName + "\n";
                    upvotes.value += currentReddits[i].minupvotes + "\n";
                }

                let embed = new discord.MessageEmbed({
                    title: capitalize(roomTypes[i].type) + " Reddits",
                    fields: [reddit, room, upvotes],
                }).setFooter({ text: "\u2800".repeat(50) });
                channel.send({ embeds: [embed] });
            } else {
                channel.send("```" + capitalize(roomTypes[i].type) + " room does not exist```");
            }
        }
    }

    // Check if if each reddit has channel
    for (let i = 0; i < reddits.length; i++) {
        for (let j = 0; j < roomTypes.length; j++) {
            if (roomTypes[j].type == reddits[i].type) {
                if (!channels[roomTypes[j].name]) {
                    channel.send(
                        "```Reddit '" +
                            reddits[i].reddit +
                            "' cannot work without '" +
                            roomTypes[j].name +
                            "' room being set```"
                    );
                }

                break;
            }
        }
    }
}

function addRedditToGuild(reddits, args, message) {
    args = args.toLowerCase().split(" ");
    if (args.length < 3) {
        help.commandHelp("reddit", message.channel);
        return;
    }

    let addNew = true;
    let redditObj = {
        reddit: args[0],
        minupvotes: args[1],
        type: args[2].toLowerCase(),
        ignorevidsandgifs: args[3] || true,
    };

    reddits.forEach((reddit) => {
        if (reddit.reddit.toLowerCase() == redditObj.reddit.toLowerCase()) {
            reddit.minupvotes = redditObj.minupvotes;
            reddit.type = redditObj.type;
            reddit.ignorevidsandgifs = redditObj.ignorevidsandgifs;
            addNew = false;
        }
    });

    if (addNew) {
        reddits.push(redditObj);
    }

    mongo.updateSchema(redditObj, "reddit", message.guild.id);
    message.channel.send("```Reddit " + args[0] + " set, minimum " + args[1] + " upvotes```");
}

function removeRedditFromGuild(reddits, args, message) {
    args = args.toLowerCase().split(" ");

    if (args.length != 1) {
        help.commandHelp("reddit", message.channel);
        return;
    }

    for (let i = 0; i < reddits.length; i++) {
        if (reddits[i].reddit == args[0]) {
            reddits.splice(i, 1);
            let values = { reddit: args[0], guildid: message.guild.id };

            mongo.deleteReddit(values);
            message.channel.send("```Reddit " + args[0] + " removed```");
            return;
        }
    }

    message.channel.send("```Reddit " + args[0] + " not found```");
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
    redditAll,
    getRooms,
    addRedditToGuild,
    removeRedditFromGuild,
};
