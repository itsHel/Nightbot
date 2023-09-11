const request = require("request");
const discord = require("discord.js");
const mongo = require("./mymongo.js");
const help = require("./help.js");

const ignoredTitleKeywords = /MEMES MEME QUIZ/;
const ignorePinned = true;
const baseUrl = "https://www.reddit.com/r/";
const headers = {
    "User-Agent": process.env.REDDIT_USER_AGENT,
***REMOVED***

const roomTypes = [
    { name: "reddittheatre", type: "img" ***REMOVED***,
    { name: "reddittext", type: "text" ***REMOVED***,
    { name: "redditnsfw", type: "nsfw" ***REMOVED***,
***REMOVED***

// Url examples
// https://www.reddit.com/r/memes/top.json?t=week&limit=100
// https://www.reddit.com/r/memes/top.json?t=week&limit=33&after=t3_kkn7gi

// after = next page - generated in response(response.data.after)
// /top = all time

async function picsDL(name, channel, minUps = 250, guideid, type = "img", ignoreVidsandGifs = true) {
    try {
        let url = baseUrl + name + "/hot.json";
        let history = (await mongo.getRedditHistory(guideid, name, type)) || [***REMOVED***

        request(
            {
                method: "GET",
                headers: headers,
                json: true,
                url: url,
            ***REMOVED***,
            (err, resp, data) => {
                if (err) return console.error(err);

                data = data.data;
                if (!data) return;

                let same = false;
                let newHistory = [***REMOVED***

                for (let i = 0; i < data.children.length; i++) {
                    if (ignorePinned && data.children[i].data.pinned) {
                        continue;
                    ***REMOVED***

                    for (let o = 0; o < history.length; o++) {
                        if (data.children[i].data.url.substring(8) == history[o]) {
                            newHistory.push(history[o]);
                            same = true;
                            break;
                        ***REMOVED***
                    ***REMOVED***

                    try {
                        if (same || data.children[i].data.ups < minUps || data.children[i].data.thumbnail == "self") {
                            // self = nopic
                            same = false;
                            continue;
                        ***REMOVED***

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
                        ***REMOVED*** else if (data.children[i].data.gallery_data) {
                            // Gallery
                            img = data.children[i].data.thumbnail;
                            fileType = "gallery";
                        ***REMOVED*** else {
                            // Img/Gif
                            img = data.children[i].data.url.replace(/amp;/g, "");
                            if (!img) continue;

                            if (img.substring(img.lastIndexOf("/")).match(".") == null) img += ".jpg";

                            // Discord wont show gifv
                            if (img.match(/\.gifv/)) {
                                if (ignoreVidsandGifs) continue;

                                img = data.children[i].data.thumbnail;
                                fileType = "gif";
                            ***REMOVED***
                        ***REMOVED***

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
                        ***REMOVED***
                        // console.log((title.substring(0, 200) + " (" + desc + ")"));
                        // console.log("SEND, URL:");
                        // console.log(data.children[i].data.url.substring(8));
                        // console.log("IMG:");
                        // console.log(img);
                        // console.log("OLD_HISTORY");
                        // console.log(history);

                        channel.send({ embeds: [embed] ***REMOVED***);
                    ***REMOVED*** catch (e) {
                        console.log("Reddit error:");
                        console.log(e);
                    ***REMOVED***

                    newHistory.push(data.children[i].data.url.substring(8));
                ***REMOVED***

                mongo.updateSchema({ reddit: name, type: type, history: newHistory ***REMOVED***, "reddit", guideid);
                console.log(name + " reddit refreshed");
            ***REMOVED***
        );
    ***REMOVED*** catch (err) {
        console.log(err);
    ***REMOVED***
***REMOVED***

async function textDL(name, channel, minUps = 250, guideid) {
    try {
        let url = baseUrl + name + "/hot.json";
        let history = (await mongo.getRedditHistory(guideid, name, "text")) || [***REMOVED***
        // console.log(history);

        request(
            {
                method: "GET",
                headers: headers,
                json: true,
                url: url,
            ***REMOVED***,
            (err, resp, data) => {
                if (err) return console.error(err);

                data = data.data;
                if (!data) return;

                let same = false;
                let newHistory = [***REMOVED***

                for (let i = 0; i < data.children.length; i++) {
                    if (ignorePinned && data.children[i].data.pinned) {
                        continue;
                    ***REMOVED***

                    for (let o = 0; o < history.length; o++) {
                        if (data.children[i].data.url.substring(8) == history[o]) {
                            newHistory.push(history[o]);
                            same = true;
                            break;
                        ***REMOVED***
                    ***REMOVED***

                    let title = data.children[i].data.title;
                    if (same || data.children[i].data.ups < minUps || data.children[i].data.thumbnail == "self") {
                        //self = nopic
                        same = false;
                        continue;
                    ***REMOVED***

                    let url = "https://www.reddit.com" + data.children[i].data.permalink;
                    let desc = data.children[i].data.subreddit_name_prefixed;
                    let ups = data.children[i].data.ups;
                    let text = data.children[i].data.selftext;

                    if (text.length > 1500) {
                        text =
                            "**Text was cut for being too long, click on link to continue**\n\n" +
                            text.substring(0, 500) +
                            "...";
                    ***REMOVED***

                    let time = new Date(data.children[i].data.created * 1000);

                    let embed = new discord.MessageEmbed()
                        .setColor("#ff6600")
                        .setURL(url)
                        .setDescription(text)
                        .setTitle(title.substring(0, 200) + " (" + desc + ")")
                        .setFooter({
                            text: time.toISOString().replace(/[A-Z]/, " ").slice(0, -8) + "   " + ups + " upvotes",
                    ***REMOVED***

                    channel.send({ embeds: [embed] ***REMOVED***);
                    newHistory.push(data.children[i].data.url.substring(8));
                ***REMOVED***

                mongo.updateSchema({ reddit: name, type: "text", history: newHistory ***REMOVED***, "reddit", guideid);
                console.log(name + " reddit refreshed");
            ***REMOVED***
        );
    ***REMOVED*** catch (err) {
        console.log(err);
    ***REMOVED***
***REMOVED***

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
        ***REMOVED*** else if (reddits[i].type.toLowerCase() == "nsfw") {
            if (redditNsfwChannel)
                picsDL(reddits[i].reddit, redditNsfwChannel, reddits[i].minupvotes, guildId, "nsfw", ignoreVidsandGifs);
        ***REMOVED*** else {
            if (redditTextChannel) textDL(reddits[i].reddit, redditTextChannel, reddits[i].minupvotes, guildId);
        ***REMOVED***
    ***REMOVED***
***REMOVED***

function getRooms(channels, reddits, channel, client) {
    if (channel.type == "DM") return;

    if (!reddits?.length) {
        channel.send("```No reddits set```");
        return;
    ***REMOVED***

    for (let i = 0; i < roomTypes.length; i++) {
        if (channels[roomTypes[i].name]) {
            if (client.channels.cache.get(channels[roomTypes[i].name])) {
                let channelName = client.channels.cache.get(channels[roomTypes[i].name]).toString();

                let currentReddits = reddits.filter((reddit) => reddit.type == roomTypes[i].type);
                if (!currentReddits.length) return;

                let reddit = { name: "Reddit", value: "", inline: true ***REMOVED***
                let room = { name: "Room", value: "", inline: true ***REMOVED***
                let upvotes = { name: "Min upvotes", value: "", inline: true ***REMOVED***

                for (let i = 0; i < currentReddits.length; i++) {
                    reddit.value += currentReddits[i].reddit + "\n";
                    room.value += channelName + "\n";
                    upvotes.value += currentReddits[i].minupvotes + "\n";
                ***REMOVED***

                let embed = new discord.MessageEmbed({
                    title: capitalize(roomTypes[i].type) + " Reddits",
                    fields: [reddit, room, upvotes],
                ***REMOVED***).setFooter({ text: "\u2800".repeat(50) ***REMOVED***);
                channel.send({ embeds: [embed] ***REMOVED***);
            ***REMOVED*** else {
                channel.send("```" + capitalize(roomTypes[i].type) + " room does not exist```");
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***

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
                ***REMOVED***

                break;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
***REMOVED***

function addRedditToGuild(reddits, args, message) {
    args = args.toLowerCase().split(" ");
    if (args.length < 3) {
        help.commandHelp("reddit", message.channel);
        return;
    ***REMOVED***

    let addNew = true;
    let redditObj = {
        reddit: args[0],
        minupvotes: args[1],
        type: args[2].toLowerCase(),
        ignorevidsandgifs: args[3] || true,
    ***REMOVED***

    reddits.forEach((reddit) => {
        if (reddit.reddit.toLowerCase() == redditObj.reddit.toLowerCase()) {
            reddit.minupvotes = redditObj.minupvotes;
            reddit.type = redditObj.type;
            reddit.ignorevidsandgifs = redditObj.ignorevidsandgifs;
            addNew = false;
        ***REMOVED***
***REMOVED***

    if (addNew) {
        reddits.push(redditObj);
    ***REMOVED***

    mongo.updateSchema(redditObj, "reddit", message.guild.id);
    message.channel.send("```Reddit " + args[0] + " set, minimum " + args[1] + " upvotes```");
***REMOVED***

function removeRedditFromGuild(reddits, args, message) {
    args = args.toLowerCase().split(" ");

    if (args.length != 1) {
        help.commandHelp("reddit", message.channel);
        return;
    ***REMOVED***

    for (let i = 0; i < reddits.length; i++) {
        if (reddits[i].reddit == args[0]) {
            reddits.splice(i, 1);
            let values = { reddit: args[0], guildid: message.guild.id ***REMOVED***

            mongo.deleteReddit(values);
            message.channel.send("```Reddit " + args[0] + " removed```");
            return;
        ***REMOVED***
    ***REMOVED***

    message.channel.send("```Reddit " + args[0] + " not found```");
***REMOVED***

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
***REMOVED***

***REMOVED***
    redditAll,
    getRooms,
    addRedditToGuild,
    removeRedditFromGuild,
***REMOVED***
