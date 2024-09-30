const request = require("request");
const discord = require("discord.js");
const mongo = require("./mymongo.js");
const help = require("./help.js");

const ignoredTitleKeywords = /MEMES MEME QUIZ/;
const ignorePinned = true;
const baseUrl = "https://www.reddit.com/r/";
const headers = {
    "User-Agent": process.env.REDDIT_USER_AGENT,
};

const roomTypes = [
    { name: "reddittheatre", type: "img" },
    { name: "reddittext", type: "text" },
    { name: "redditnsfw", type: "nsfw" },
];

// Url examples
// https://www.reddit.com/r/memes/top.json?t=week&limit=100
// https://www.reddit.com/r/memes/top.json?t=week&limit=33&after=t3_kkn7gi

// after = next page - generated in response(response.data.after)
// /top = all time

async function picsDL(name, channel, minUpvotes = 250, guideid, type = "img", ignoreVidsandGifs = true) {
    try {
        let url = baseUrl + name + "/hot.json";
        let history = (await mongo.getRedditHistory(guideid, name, type)) || [];

        request(
            {
                method: "GET",
                headers: headers,
                json: true,
                url: url,
            },
            (err, resp, data) => {
                if (err) return console.error(err);

                data = data.data;
                if (!data) return;

                let same = false;
                let newHistory = [];

                for (let i = 0; i < data.children.length; i++) {
                    if (ignorePinned && data.children[i].data.pinned) {
                        continue;
                    }

                    for (let o = 0; o < history.length; o++) {
                        if (data.children[i].data.url.substring(8) == history[o]) {
                            newHistory.push(history[o]);
                            same = true;
                            break;
                        }
                    }

                    try {
                        if (
                            same ||
                            data.children[i].data.ups < minUpvotes ||
                            data.children[i].data.thumbnail == "self"
                        ) {
                            // self = nopic
                            same = false;
                            continue;
                        }

                        let title = data.children[i].data.title;
                        if (title.match(ignoredTitleKeywords)) continue;

                        let url = "https://www.reddit.com" + data.children[i].data.permalink;
                        let img;
                        let fileType = "img";

                        if (
                            data.children[i].data.is_video ||
                            (data.children[i].data.post_hint && data.children[i].data.post_hint.match("video"))
                        ) {
                            // Video
                            if (ignoreVidsandGifs) continue;

                            img = data.children[i].data.thumbnail;
                            fileType = "video";
                            // console.log("video");
                        } else if (data.children[i].data.gallery_data) {
                            // Gallery, needs 4x more upvotes
                            if (data.children[i].data.ups < minUpvotes * 4) continue;
                            img = data.children[i].data.thumbnail;
                            fileType = "gallery";
                        } else {
                            // Img/Gif
                            img = data.children[i].data.url.replace(/amp;/g, "");
                            if (!img) continue;

                            if (img.substring(img.lastIndexOf("/")).match(".") == null) img += ".jpg";

                            // Discord wont show gifv
                            if (img.match(/\.gifv/)) {
                                if (ignoreVidsandGifs) continue;

                                img = data.children[i].data.thumbnail;
                                fileType = "gif";
                            }
                        }

                        if (img == "nsfw") continue;

                        let desc = data.children[i].data.subreddit_name_prefixed; //data.children[i].data.selftext;
                        let ups = data.children[i].data.ups;
                        let time = new Date(data.children[i].data.created * 1000);

                        let embed = new discord.MessageEmbed()
                            .setColor("#ff6600")
                            .setURL(url)
                            .setImage(img)
                            .setTitle(
                                title.substring(0, 200) +
                                    " (" +
                                    desc +
                                    ")" +
                                    (fileType != "img" ? " (" + fileType + ")" : "")
                            )
                            .setFooter({
                                text: time.toISOString().replace(/[A-Z]/, " ").slice(0, -8) + "   " + ups + " upvotes",
                            });
                        // console.log((title.substring(0, 200) + " (" + desc + ")"));
                        // console.log("SEND, URL:");
                        // console.log(data.children[i].data.url.substring(8));
                        // console.log("IMG:");
                        // console.log(img);
                        // console.log("OLD_HISTORY");
                        // console.log(history);

                        channel.send({ embeds: [embed] });
                    } catch (e) {
                        console.log("Reddit error:");
                        console.log(e);
                    }

                    newHistory.push(data.children[i].data.url.substring(8));
                }

                mongo.updateSchema({ reddit: name, type: type, history: newHistory }, "reddit", guideid);
                console.log(name + " reddit refreshed");
            }
        );
    } catch (err) {
        console.log(err);
    }
}

async function textDL(name, channel, minUpvotes = 250, guideid) {
    try {
        let url = baseUrl + name + "/hot.json";
        let history = (await mongo.getRedditHistory(guideid, name, "text")) || [];
        // console.log(history);

        request(
            {
                method: "GET",
                headers: headers,
                json: true,
                url: url,
            },
            (err, resp, data) => {
                if (err) return console.error(err);

                data = data.data;
                if (!data) return;

                let same = false;
                let newHistory = [];

                for (let i = 0; i < data.children.length; i++) {
                    if (ignorePinned && data.children[i].data.pinned) {
                        continue;
                    }

                    for (let o = 0; o < history.length; o++) {
                        if (data.children[i].data.url.substring(8) == history[o]) {
                            newHistory.push(history[o]);
                            same = true;
                            break;
                        }
                    }

                    let title = data.children[i].data.title;
                    if (same || data.children[i].data.ups < minUpvotes || data.children[i].data.thumbnail == "self") {
                        //self = nopic
                        same = false;
                        continue;
                    }

                    let url = "https://www.reddit.com" + data.children[i].data.permalink;
                    let desc = data.children[i].data.subreddit_name_prefixed;
                    let ups = data.children[i].data.ups;
                    let text = data.children[i].data.selftext;

                    if (text.length > 1500) {
                        text =
                            "**Text was cut for being too long, click on link to continue**\n\n" +
                            text.substring(0, 500) +
                            "...";
                    }

                    let time = new Date(data.children[i].data.created * 1000);

                    let embed = new discord.MessageEmbed()
                        .setColor("#ff6600")
                        .setURL(url)
                        .setDescription(text)
                        .setTitle(title.substring(0, 200) + " (" + desc + ")")
                        .setFooter({
                            text: time.toISOString().replace(/[A-Z]/, " ").slice(0, -8) + "   " + ups + " upvotes",
                        });

                    channel.send({ embeds: [embed] });
                    newHistory.push(data.children[i].data.url.substring(8));
                }

                mongo.updateSchema({ reddit: name, type: "text", history: newHistory }, "reddit", guideid);
                console.log(name + " reddit refreshed");
            }
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
    guildId,
    ignoreVidsandGifs
) {
    // Reddits format - reddit: reddit, minUpvotes: minUpvotes, type: text/img
    if (!reddits) return;

    for (let i = 0; i < reddits.length; i++) {
        if (reddits[i].type == "img") {
            if (redditTheatreChannel)
                picsDL(
                    reddits[i].reddit,
                    redditTheatreChannel,
                    reddits[i].minupvotes,
                    guildId,
                    "img",
                    ignoreVidsandGifs
                );
        } else if (reddits[i].type.toLowerCase() == "nsfw") {
            if (redditNsfwChannel)
                picsDL(reddits[i].reddit, redditNsfwChannel, reddits[i].minupvotes, guildId, "nsfw", ignoreVidsandGifs);
        } else {
            if (redditTextChannel) textDL(reddits[i].reddit, redditTextChannel, reddits[i].minupvotes, guildId);
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
