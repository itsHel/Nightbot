const fs = require("fs");
const request = require("request");
const discord = require("discord.js");

// https://www.reddit.com/r/memes/top.json?t=week&limit=100

// https://www.reddit.com/r/memes/top.json?t=week&limit=33&after=t3_kkn7gi
// after = next page - generated in response(response.data.after)
// /top = all time

function picsDL(url, name, channel, minUps = 250) {
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

                    try {
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
                        let img;
                        let fileType = "img";

                        if (
                            data.children[i].data.is_video ||
                            (data.children[i].data.post_hint &&
                                data.children[i].data.post_hint.match("video"))
                        ) {
                            // Video
                            img = data.children[i].data.thumbnail;
                            fileType = "video";
                            console.log("video");
                        } else if (data.children[i].data.gallery_data) {
                            // Gallery
                            img = data.children[i].data.thumbnail;
                            fileType = "gallery";
                            console.log("gallery");
                        } else {
                            // Img/Gif
                            img = data.children[i].data.url.replace(
                                /amp;/g,
                                "",
                            );
                            console.log("img, url:");
                            console.log(data.children[i].data.url);
                            //if(img.match("imgur.com"))
                            if (
                                img
                                    .substring(img.lastIndexOf("/"))
                                    .match(".") == null
                            )
                                img += ".jpg";
                            // Discord wont show gifv
                            if (img.match(/\.gifv/)) {
                                img = data.children[i].data.thumbnail;
                                fileType = "gif";
                            }
                        }
                        let desc =
                            data.children[i].data.subreddit_name_prefixed; //data.children[i].data.selftext;
                        let ups = data.children[i].data.ups;
                        let time = new Date(
                            data.children[i].data.created * 1000,
                        );

                        let embed = new discord.MessageEmbed()
                            .setColor("#ff6600")
                            .setURL(url)
                            .setImage(img)
                            .setTitle(
                                title.substring(0, 200) +
                                    " (" +
                                    desc +
                                    ")" +
                                    (fileType != "img"
                                        ? " (" + fileType + ")"
                                        : ""),
                            )
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
                        // console.log((title.substring(0, 200) + " (" + desc + ")"));
                        // console.log("SEND, URL:");
                        // console.log(data.children[i].data.url.substring(8));
                        // console.log("OLD_HISTORY");
                        // console.log(history);

                        channel.send({ embeds: [embed] });
                    } catch (e) {
                        console.log("Reddit error:");
                        console.log(e);
                    }

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
                    "https://www.reddit.com/r/" +
                        reddits[i].reddit +
                        "/hot.json",
                    reddits[i].reddit,
                    redditTheatreChannel,
                    reddits[i].minUpvotes,
                );
        } else if (reddits[i].type.toLowerCase() == "nsfw") {
            if (redditNsfwChannel)
                picsDL(
                    "https://www.reddit.com/r/" +
                        reddits[i].reddit +
                        "/hot.json",
                    reddits[i].reddit,
                    redditNsfwChannel,
                    reddits[i].minUpvotes,
                );
        } else {
            if (redditTextChannel)
                textDL(
                    "https://www.reddit.com/r/" +
                        reddits[i].reddit +
                        "/hot.json",
                    reddits[i].reddit,
                    redditTextChannel,
                    reddits[i].minUpvotes,
                );
        }
    }
}

function getRooms(channels, reddits, channel, client) {
    if (channels.reddittheatre) {
        let imgChannel = client.channels.cache
            .get(channels.reddittheatre)
            .toString();

        let redditImg = reddits.filter((reddit) => reddit.type == "img");

        let reddit = { name: "Reddit", value: "", inline: true };
        let room = { name: "Room", value: "", inline: true };
        let upvotes = { name: "Min upvotes", value: "", inline: true };

        for (let i = 0; i < redditImg.length; i++) {
            reddit.value += redditImg[i].reddit + "\n";
            room.value += imgChannel + "\n";
            upvotes.value += redditImg[i].minUpvotes + "\n";
        }

        let imgEmbed = new discord.MessageEmbed({
            title: "Image Reddits",
            fields: [reddit, room, upvotes],
        }).setFooter({ text: "\u2800".repeat(50) });
        channel.send(imgEmbed);
    }

    if (channels.reddittext) {
        let textChannel = client.channels.cache
            .get(channels.reddittext)
            .toString();

        let reddittext = reddits.filter((reddit) => reddit.type == "text");

        let reddit = { name: "Reddit", value: "", inline: true };
        let room = { name: "Room", value: "", inline: true };
        let upvotes = { name: "Min upvotes", value: "", inline: true };

        for (let i = 0; i < reddittext.length; i++) {
            reddit.value += reddittext[i].reddit + "\n";
            room.value += textChannel + "\n";
            upvotes.value += reddittext[i].minUpvotes + "\n";
        }

        let textEmbed = new discord.MessageEmbed({
            title: "Text Reddits",
            fields: [reddit, room, upvotes],
        }).setFooter({ text: "\u2800".repeat(50) });
        channel.send(textEmbed);
    }

    if (channels.redditnsfw) {
        let nsfwChannel = client.channels.cache
            .get(channels.redditnsfw)
            .toString();

        let redditNsfw = reddits.filter((reddit) => reddit.type == "nsfw");

        let reddit = { name: "Reddit", value: "", inline: true };
        let room = { name: "Room", value: "", inline: true };
        let upvotes = { name: "Min upvotes", value: "", inline: true };

        for (let i = 0; i < redditNsfw.length; i++) {
            reddit.value += redditNsfw[i].reddit + "\n";
            room.value += nsfwChannel + "\n";
            upvotes.value += redditNsfw[i].minUpvotes + "\n";
        }

        let textEmbed = new discord.MessageEmbed({
            title: "Nsfw Reddits",
            fields: [reddit, room, upvotes],
        }).setFooter({ text: "\u2800".repeat(50) });
        channel.send(textEmbed);
    }

    if (
        !channels.reddittheatre &&
        !channels.reddittext &&
        !channels.redditnsfw
    ) {
        channel.send("```No reddits set```");
    }
}

module.exports = {
    redditAll,
    getRooms,
};
