require("dotenv").config();

const discord = require("discord.js"); // 13.12.0
const reminder = require("./mymodules/reminder.js");
const reddit = require("./mymodules/reddit.js");
const mine = require("./mymodules/misc.js");
const help = require("./mymodules/help.js");
const rolesModule = require("./mymodules/roles.js");
const quotes = require("./mymodules/quotes.js");
const apis = require("./mymodules/APIs.js");
const picapis = require("./mymodules/picAPIs.js");
const list = require("./mymodules/lists.js");
const duel = require("./mymodules/duel.js");
const settings = require("./settings.js");
const cah = require("./mymodules/cah.js");
const mongo = require("./mymodules/mymongo.js");

mongo.mongoDb();

const roomList = [
    "generalroom",
    "pinroom",
    "rolesroom",
    "pollroom",
    "confessroom",
    "delroom",
    "welcomeroom",
    "announceroom",
    "reddittheatre",
    "reddittext",
    "redditnsfw",
    "rateroom",
];
const wrongCommandMessage = "```Wrong command syntax, try " + settings.prefix + "help command```";

// Globals
var reddits = {};
var channels = {}; // Example: {"guildid": { pinroom: "roomId", confessroom: "otherRoomId" }}
var guildSettings = {};
var lastList = "mymovies";
var cahGames = [];
var guilds;

const allIntents = new discord.Intents(32767);
const client = new discord.Client({
    intents: allIntents,
    partials: ["CHANNEL"],
});

// v14
// const client = new discord.Client({intents: [3276799], partials: [discord.Partials.Message, discord.Partials.Channel, discord.Partials.Reaction]});

// Init
client.on("ready", async () => {
    client.user.setActivity("in the Dark");
    client.user.setUsername("Nightbot");

    guilds = client.guilds.cache.map((guild) => guild.id);

    await loadSettings(guilds);
    loadBans();
    reminder.loadReminders(client);

    console.log("connected " + client.user.tag);
    console.log("\nChannels:");
    console.log(channels);

    // Refresh reddits and send quote
    for (let i = 0; i < guilds.length; i++) {
        if (reddits[guilds[i]]) {
            try {
                reddit.redditAll(
                    client.channels.cache.get(channels[guilds[i]]?.reddittheatre),
                    client.channels.cache.get(channels[guilds[i]]?.reddittext),
                    client.channels.cache.get(channels[guilds[i]]?.redditnsfw),
                    reddits[guilds[i]],
                    guilds[i]
                );
            } catch (err) {
                console.log(err);
            }
        }
    }

    // if(channels[settings.defaultGuild]){
    //     quotes.simpsons(client.channels.cache.get(channels[settings.defaultGuild].generalroom));
    // }

    setIntervalsAll(guilds);
});

client.login(process.env.DISCORD_TOKEN);

client.on("messageCreate", async (message) => {
    let guildId;

    if (message.guild) {
        guildId = message.guild.id;
    } else {
        guildId = settings.defaultGuild;
        // guildId = 0;
    }

    if (message.channel.type != "DM") {
        mine.reactions(message);
        mine.emotesCount(message, guildSettings[guildId]?.emoteshistory); // Modifies guildSettings[guildId].emoteshistory array
    }

    try {
        if (message.type == "PINS_ADD" && guildSettings[guildId].pinning && channels[guildId]?.pinroom) {
            mine.autoPin(message.channel, client.channels.cache.get(channels[guildId]?.pinroom), guildId);
        }
        if (
            message.content.slice(0, settings.prefix.length) == settings.prefix &&
            message.content.slice(0, 3) != "_ _"
        ) {
            console.log(message.content);
        } else {
            return;
        }

        let cmd = message.content.toLowerCase().split(" ")[0].substring(settings.prefix.length);
        let args = message.content.substring(cmd.length + settings.prefix.length + 1); // String

        // Cah ending
        if (message.author == client.user && message.embeds.length && message.embeds[0].title == "Game ended") {
            console.log("Cah ended, games left:");

            cahGames = cahGames.filter((game) => {
                return game.channel != message.channel;
            });

            for (let i = 0; i < cahGames.length; i++) console.log(cahGames[i].channel);
        }

        switch (cmd) {
            case "stealemote":
            case "addemoji":
            case "stealemoji":
            case "addemote":
                if (mine.isAdmin(message, guildSettings[guildId].modroles)) {
                    mine.addEmojis(args, message.channel, message.guild);
                }
                break;
            case "poll":
                if (channels[guildId]?.pollroom) {
                    mine.polls(client.channels.cache.get(channels[guildId]?.pollroom), args, message.author);
                } else {
                    message.channel.send("```Poll room not set```");
                }
                break;
            case "remind":
                if (args.length == 0) {
                    help.commandHelp("remind", message.channel);
                    break;
                }

                reminder.remind(message);
                break;
            case "cah":
                if (args == "help" || args == "guide" || args == "") {
                    cah.help(message.channel);
                    return;
                }

                if (args == "set" || args == "settings") {
                    cah.settingsHelp(message.channel);
                    return;
                }

                let gameIndex = 0;
                if (
                    !cahGames.filter((game, index) => {
                        if (game.channel == message.channel) {
                            gameIndex = index;
                            return true;
                        } else {
                            return false;
                        }
                    }).length
                ) {
                    // Game doesnt exist in this channel - start new
                    cahGames.push({
                        game: new cah.cardsAgainstHumanity(message.channel, guildSettings[guildId].modroles),
                        channel: message.channel,
                    });

                    cahGames[cahGames.length - 1].game.cahSwitch(args, message);
                } else if (args.substr(0, 4).toLowerCase() == "end") {
                    if (cahGames[gameIndex].game.cahSwitch(args, message)) {
                        cahGames.splice(gameIndex, 1);
                    } else {
                        console.log("Cah error");
                    }

                    return;
                } else {
                    // Command
                    cahGames[gameIndex].game.cahSwitch(args, message);
                }
                break;
            case "emote":
            case "emoji":
                help.commandHelp("emotes", message.channel);
                break;
            case "emotes":
            case "emotelist":
            case "emotestats":
                if (message.channel.type != "DM")
                    mine.emotesShow(guildSettings[guildId].emoteshistory, message, client);
                break;
            case "glados":
                message.channel.send(
                    "```" + settings.gladosCheers[Math.floor(Math.random() * settings.gladosCheers.length)] + "```"
                );
                break;
            case "list":
            case "ls":
                list.listAll(message.channel);
                break;
            case "l":
                if (args.length == 0) {
                    list.showList(lastList, message.channel);
                } else {
                    lastList = list.listFunctions(cmd, args, message, guildSettings[guildId]);
                }
                break;
            case "gif":
            case "gifa":
                picapis.gifs(cmd, args, message.channel);
                break;
            case "confess":
            case "c":
                if (!args) break;
                mine.sendToChannel(args, client.channels.cache.get(channels[guildId]?.confessroom), message.channel);
                break;
            case "announce":
                mine.sendToChannel(args, client.channels.cache.get(channels[guildId]?.announceroom), message.channel);
                break;
            case "say":
                mine.sendToChannel(args, client.channels.cache.get(channels[guildId]?.generalroom), message.channel);
                break;
            case "countdown":
            case "cd":
                mine.countDown(3, 1000, message.channel);
                if (message.channel.type != "DM") {
                    setTimeout(() => message.delete().catch(() => {}), settings.autoDelDelay * 10);
                }
                break;
            case "quote":
            case "q":
                quotes.quote(message.channel);
                break;
            case "cn":
                quotes.chuckNorris(message.channel);
                break;
            case "simpsons":
            case "s":
                quotes.simpsons(message.channel);
                break;
            case "tr":
            case "translate":
                if (args.length == 0) {
                    help.commandHelp("translate", message.channel);
                    return;
                }

                apis.googleTranslate(message, args);
                break;
            case "ytr": // Old translate - Yandex
                apis.yandexTranslate(message, args);
                break;
            case "trlist": // Supported translation languages list
                apis.sendLangs(message);
                break;
            case "movie":
            case "movief":
            case "movies":
                if (args.length == 0) {
                    help.commandHelp("movie", message.channel);
                    return;
                }

                apis.imdb(cmd, args, message.channel);
                break;
            case "search":
                if (args.length == 0) {
                    help.commandHelp("movie", message.channel);
                    return;
                }

                apis.imdbSearch(args, message.channel);
                break;
            case "vocabulary":
            case "word":
            case "words":
            case "definition":
            case "def": // Definition of word
                if (args.length == 0) {
                    help.commandHelp("words", message.channel);
                    return;
                }

                apis.vocabulary(args, message.channel, message.author);
                break;
            case "syn": // Synonyms
                if (args.length == 0) {
                    help.commandHelp("words", message.channel);
                    return;
                }

                apis.words("words?rel_syn=", 10, args, message.channel);
                break;
            case "rhyme": // Rhyme words
                if (args.length == 0) {
                    help.commandHelp("words", message.channel);
                    return;
                }

                apis.words("words?rel_rhy=", 8, args, message.channel);
                break;
            case "sug": // Suggestions for typos
                if (args.length == 0) {
                    help.commandHelp("words", message.channel);
                    return;
                }

                apis.words("sug?s=", 6, args, message.channel);
                break;
            case "duel":
                if (args.length == 0) {
                    help.commandHelp("duels", message.channel);
                    return;
                }

                duel.duel(args, message.guild, message.author, message.channel, client);
                break;
            case "rate":
                mine.rate(
                    args,
                    client.channels.cache.get(channels[guildId]?.rateroom),
                    message.author.toString(),
                    message.channel,
                    guildSettings[guildId].ratepeoplecount
                );
                break;
            case "rdr": // Refreshes reddits
                reddit.redditAll(
                    client.channels.cache.get(channels[guildId]?.reddittheatre),
                    client.channels.cache.get(channels[guildId]?.reddittext),
                    client.channels.cache.get(channels[guildId]?.redditnsfw),
                    reddits[guildId],
                    guildId
                );
                if (message.channel.type != "DM") {
                    setTimeout(() => message.delete().catch(() => {}), 500);
                }
                break;
            case "random":
                let multiply = args ? args : 2;
                message.channel.send(Math.floor(Math.random() * multiply) + 1);
                break;
            case "toss":
                message.channel.send(Math.floor(Math.random() * 2) == 0 ? "Heads" : "Tails");
                break;
            case "del":
            case "delete":
                if (mine.isAdmin(message, guildSettings[guildId].modroles)) {
                    mine.delMessages(args, message.channel);
                }
                break;
            case "setban":
                if (mine.isAdmin(message, guildSettings[guildId].modroles)) {
                    if (isNaN(parseInt(args))) {
                        message.channel.send("```Not a number```");
                        return;
                    }

                    if (args > 24) {
                        message.channel.send("```24 days is maximum```");
                        return;
                    }

                    guildSettings[guildId].leavebandays = args;
                    mongo.updateSchema({ leavebandays: args }, "settings", guildId);
                    message.channel.send("```Leave ban set to " + args + " days```");
                }
                break;
            case "setrate":
            case "rateset":
                if (mine.isAdmin(message, guildSettings[guildId].modroles)) {
                    if (isNaN(parseInt(args))) {
                        message.channel.send("```Not a number```");
                        return;
                    }

                    guildSettings[guildId].ratepeoplecount = args;
                    mongo.updateSchema({ ratepeoplecount: args }, "settings", guildId);
                    message.channel.send("```Rate people count set to " + args + " humans```");
                }

                console.log(guildSettings[guildId].ratepeoplecount);
                break;
            case "pinstoggle":
                if (mine.isAdmin(message, guildSettings[guildId].modroles)) {
                    guildSettings[guildId].pinning = !guildSettings[guildId].pinning;
                    message.channel.send("```Pinning is " + (guildSettings[guildId].pinning ? "On" : "Off") + "```");
                }
                break;
            case "pin":
            case "pins":
            case "nopins":
                // Format: _nopins #round-table
                if (mine.isAdmin(message, guildSettings[guildId].modroles)) {
                    if (args.length == 0) {
                        help.commandHelp("pins", message.channel);
                        return;
                    }

                    let channel = message.guild.channels.cache.find((channel) => channel.id == args.match(/\d+/));
                    if (channel == undefined) {
                        message.channel
                            .send("```Room not found```")
                            .then((mess) => setTimeout(() => mess.delete().catch(() => {}), settings.autoDelDelay));
                        return;
                    }

                    guildSettings[guildId].nopinsrooms.push(channel.id);
                    mongo.updateSchema({ nopinsrooms: guildSettings[guildId].nopinsrooms }, "settings", guildId);

                    message.channel
                        .send("```Added```")
                        .then((mess) => setTimeout(() => mess.delete().catch(() => {}), settings.autoDelDelay));
                }
                break;
            case "nopinslist":
            case "nopinsrooms":
                let rooms = guildSettings[guildId].nopinsrooms
                    .map((room) => client.channels.cache.get(room).name)
                    .join(", ");
                if (rooms.length == 0) rooms = "empty";

                message.channel.send("```" + rooms + "```");
                break;
            case "baserole":
            case "defaultrole":
                // Format: _baserole peasant
                if (mine.isAdmin(message, guildSettings[guildId].modroles)) {
                    rolesModule.setDefaultRole(guildSettings[guildId], args, message); // Modifies guildSettings[guildId] obj
                }
                break;
            case "role":
            case "roles":
                help.commandHelp("roles", message.channel);
                break;
            case "newrole":
            case "addrole":
                if (mine.isAdmin(message, guildSettings[guildId].modroles)) {
                    rolesModule.newRole(message.member, client.channels.cache.get(channels[guildId]?.rolesroom));
                }
                break;
            case "kickrole":
                if (args.length == 0) {
                    help.commandHelp("kickrole", message.channel);
                    break;
                }

                if (mine.isAdmin(message, guildSettings[guildId].modroles)) {
                    mine.kickOnlyRole(message); //client.channels.cache.get(channels[guildId]?.rolesroom));
                }
                break;
            case "reddit":
            case "editreddit":
            case "addreddit":
            case "setreddit":
                // Format: _addreddit jokes 750 text/img
                if (mine.isAdmin(message, guildSettings[guildId].modroles)) {
                    if (!reddits[guildId]) reddits[guildId] = [];

                    reddit.addRedditToGuild(reddits[guildId], args, message); // Modifies reddits[guildId] array
                }
                break;
            case "removereddit":
            case "deletereddit":
                // Format: _removereddit jokes
                if (mine.isAdmin(message, guildSettings[guildId].modroles) && reddits[guildId]) {
                    reddit.removeRedditFromGuild(reddits[guildId], args, message); // Modifies reddits[guildId] array
                }
                break;
            case "reddits":
            case "redditlist":
            case "redditslist":
                if (mine.isAdmin(message, guildSettings[guildId].modroles)) {
                    reddit.getRooms(channels[guildId], reddits[guildId], message.channel, client);
                }
                break;
            case "removeroom":
            case "deleteroom":
                // Format: _removeroom confessChannel
                if (mine.isAdmin(message, guildSettings[guildId].modroles)) {
                    args = args.toLowerCase().split(" ");

                    if (args.length != 1) {
                        help.commandHelp("room", message.channel);
                        return;
                    }

                    if (channels[guildId][args[0]]) {
                        delete channels[guildId][args[0]];
                        let values = { [args[0]]: "" };

                        mongo.updateSchema(values, "room", guildId);
                        message.channel.send("```Room " + args[0] + " removed" + "```");
                    } else {
                        message.channel.send("```Room " + args[0] + " not found" + "```");
                    }
                }
                break;
            case "addroom":
            case "editroom":
            case "setroom":
            case "changeroom":
            case "room":
            case "setup":
                // Format: _addroom general #the-dungeon
                if (mine.isAdmin(message, guildSettings[guildId].modroles)) {
                    args = args.toLowerCase().split(" ");

                    if (args.length != 2) {
                        help.commandHelp("room", message.channel);
                        break;
                    }

                    if (!roomList.filter((room) => room == args[0]).length) {
                        message.channel.send("```Room " + args[0] + " not found```");
                        break;
                    }

                    let newChannel = client.channels.cache.get(args[1].replace("<#", "").replace(">", ""));
                    if (newChannel) {
                        if (!channels[guildId]) channels[guildId] = {};

                        channels[guildId][args[0]] = newChannel.id;
                        let values = { [args[0]]: newChannel.id };

                        mongo.updateSchema(values, "room", guildId);

                        let embed = new discord.MessageEmbed().setDescription(
                            args[0] + " set to " + newChannel.toString()
                        );
                        message.channel.send({ embeds: [embed] });
                    } else {
                        message.channel.send("```Room " + args[1] + " not found```");
                    }
                }
                break;
            case "roomlist":
            case "roomslist":
            case "rooms":
                if (mine.isAdmin(message, guildSettings[guildId].modroles)) {
                    let name = { name: "Name", value: "", inline: true };
                    let channelObj = { name: "Room", value: "", inline: true };

                    for (let [channel, id] of Object.entries(channels[guildId])) {
                        try {
                            if (client.channels.cache.get(id)) {
                                name.value += channel + "\n";
                                channelObj.value += client.channels.cache.get(id).toString() + "\n";
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    }

                    if (!name.value || !channelObj.value) {
                        message.channel.send("```No rooms set```");
                        break;
                    }

                    let embed = new discord.MessageEmbed({
                        fields: [name, channelObj],
                    }).setFooter({ text: "\u2800".repeat(50) }); // Embed sizing     \u2800 = empty space
                    message.channel.send({ embeds: [embed] });
                }
                break;
            case "addmod":
            case "addmods":
            case "addmodrole":
                // Format: _addmod paladin
                if (mine.isAdmin(message, guildSettings[guildId].modroles)) {
                    if (args.length) {
                        let newRole = args;
                        let modRole = message.guild.roles.cache.find(
                            (role) => role.name.toLowerCase() === newRole.toLowerCase()
                        );
                        if (!modRole) {
                            message.channel
                                .send("```Role '" + newRole + "' not found```")
                                .then((mess) => setTimeout(() => mess.delete().catch(() => {}), settings.autoDelDelay));
                            break;
                        }

                        guildSettings[guildId].modroles.push(modRole.name);
                        mongo.updateSchema({ modroles: modRole.name }, "settings", guildId);
                    }

                    let embed = new discord.MessageEmbed().setDescription(
                        "**Mod roles:** " + guildSettings[guildId].modroles.join(", ")
                    );
                    message.channel.send({ embeds: [embed] });
                }
                break;
            case "removemod":
            case "removemods":
            case "removemodrole":
                if (mine.isAdmin(message, guildSettings[guildId].modroles)) {
                    if (args.length) {
                        let newRole = args;
                        let modRole = message.guild.roles.cache.find(
                            (role) => role.name.toLowerCase() === newRole.toLowerCase()
                        );
                        if (!modRole) {
                            message.channel
                                .send("```Role '" + newRole + "' not found```")
                                .then((mess) => setTimeout(() => mess.delete().catch(() => {}), settings.autoDelDelay));
                            break;
                        }

                        guildSettings[guildId].modroles = guildSettings[guildId].modroles.filter(
                            (role) => role != modRole.name
                        );
                        mongo.updateSchema({ modroles: guildSettings[guildId].modroles }, "settings", guildId, true);
                    }

                    let embed = new discord.MessageEmbed().setDescription(
                        "**Mod roles:** " + guildSettings[guildId].modroles.join(", ")
                    );
                    message.channel.send({ embeds: [embed] });
                }
                break;
            case "dm":
            case "senddm":
                // Format: _dm "John Smith" i have a fridge
                mine.sendDm(args, message, client);
                break;
            case "russianroulette":
            case "rr":
                if (args.length == 0) {
                    help.commandHelp("russianroulette", message.channel);
                    return;
                }
                mine.russianRoulette(args, message, guildSettings[guildId].modroles);
                break;
            case "save":
                if (mine.isAdmin(message, guildSettings[guildId].modroles)) {
                    mine.saveImages(message);
                }
                break;
            case "help":
                help.help(message.channel);
                return;
            // Lewds
            case "p":
            case "pf": // f means Gif
                picapis.danbooru(cmd, args, message.channel);
                break;
            case "hentai":
            case "anime": // anime means sfw
                picapis.hentaiAkaneko(cmd, args, message.channel);
                break;
            case "butt":
                picapis.getBooty("http://api.obutts.ru/butts/0/1/random", message.channel);
                break;
            case "boobs":
                picapis.getBooty("http://api.oboobs.ru/boobs/0/1/random", message.channel);
                break;
            case "test":
                // Only for testing
                console.log(guildSettings);
                console.log("---------author---------");
                console.log(message.author);
                console.log("---------member---------");
                console.log(message.member);
                break;
            default:
                message.channel
                    .send(wrongCommandMessage)
                    .then((mess) => setTimeout(() => mess.delete().catch(() => {}), settings.autoDelDelay));
                break;
        }
    } catch (err) {
        commandError(message, err);
    }
});

client.on("messageDelete", async (message) => {
    // Deleted messages log
    try {
        if (
            message.channel.type == "DM" ||
            message.author == client.user ||
            message.author.bot ||
            !channels[message.guild.id]?.delroom ||
            message.content.match(/^n$|^\.|^_/i)
        )
            return;

        const fetchedLog = await message.guild.fetchAuditLogs({
            limit: 1,
            type: "MESSAGE_DELETE",
        });

        let deleteLog = fetchedLog.entries.first();
        let footer = "";

        // If deleteLog doesnt exist assume it was deleted by message author
        if (deleteLog) {
            if (deleteLog.createdTimestamp > Date.now() - 500) {
                footer = "deleted by " + deleteLog.executor.username;
            } else {
                footer = "deleted by " + message.author.username;
            }
        }

        let pfp = message.author.avatarURL();
        let nick = message.author.username;
        let color = message.author.displayHexColor;
        let files = [...message.attachments.values()];
        let img = files.length ? files[0].url : "";
        let hasImg = "";

        if (img) {
            hasImg = "\n*IMG*";
        }

        let embed = new discord.MessageEmbed()
            .setColor(color)
            .setTitle(message.channel.name)
            .setAuthor(nick, pfp)
            .setFooter({ text: footer })
            .setDescription(message.content + hasImg);
        if (img) {
            embed.setImage(img);
        }

        client.channels.cache.get(channels[message.guild.id].delroom).send({ embeds: [embed] });
    } catch (err) {
        listenerError(err);
    }
});

client.on("guildMemberRemove", (member) => {
    try {
        if (member.user.bot) return;

        // Goodbye quotes
        if (channels[member.guild.id].welcomeroom) {
            let quoteIndex;

            do {
                quoteIndex = Math.floor(Math.random() * settings.leaveQuotes.length);
            } while (quoteIndex == guildSettings[member.guild.id].leaveQuoteLastIndex);

            guildSettings[member.guild.id].leaveQuoteLastIndex = quoteIndex;

            let quote = settings.getLeaveQuote(quoteIndex);
            client.channels.cache
                .get(channels[member.guild.id].welcomeroom)
                .send(quote[0] + "**" + member.user.username + "**" + quote[1]);
        }

        // Bans
        if (guildSettings[member.guild.id].leavebandays != 0) {
            member
                .ban("leaving server temporary ban: " + guildSettings[member.guild.id].leavebandays + " days")
                .then(() => console.log(`Banned ${member.displayName}`))
                .catch((err) => {
                    console.log(err);
                    mine.log("Ban error:\n" + err.message);
                });

            let date = new Date();
            date.setDate(date.getDate() + parseFloat(guildSettings[member.guild.id].leavebandays));

            let banData = member.id + ";;" + date;
            mongo.updateSchema({ bans: banData }, "settings", member.guild.id);

            setTimeout(function () {
                member.guild
                    .unban(member.id)
                    .then((user) => console.log(`Unbanned "${user.username}" from ${guild}`))
                    .catch((err) => {
                        console.log(err);
                        mine.log("Ban error:\n" + err.message);
                    });
            }, guildSettings[member.guild.id].leavebandays * 86400_000);
        }
    } catch (err) {
        listenerError(err);
    }
});

client.on("guildMemberAdd", (member) => {
    try {
        let role = member.guild.roles.cache.find(
            (role) => role.name.toLowerCase() === guildSettings[member.guild.id].defaultrole.toLowerCase()
        );

        if (role) {
            member.roles.add(role);
        }
    } catch (err) {
        console.log(err);
        mine.log("Add role error:\n" + err.message);
    }
});

async function loadSettings(guilds) {
    guildSettings = await mongo.getSettings(guilds);

    try {
        channels = await mongo.getRooms();
    } catch (err) {
        channels = {};
    }

    try {
        reddits = await mongo.getReddits();
    } catch (err) {
        reddits = {};
    }

    try {
        rolesModule.setupRoleMessages(client);
    } catch (err) {
        console.log(err);
        mine.log("Setup roles error:\n" + err.message);
    }
}

function setIntervalsAll(guilds) {
    // Every 60 minutes save collected emotes for statistics
    setInterval(function () {
        for (let i = 0; i < guilds.length; i++) {
            mongo.updateSchema(
                {
                    emoteshistory: JSON.stringify(guildSettings[guilds[i]].emoteshistory),
                },
                "settings",
                guilds[i]
            );
        }
    }, 3600_000); // 1 hour

    // Refresh reddits every 6 hours
    setInterval(function () {
        for (let i = 0; i < guilds.length; i++) {
            if (reddits[guilds[i]])
                try {
                    reddit.redditAll(
                        client.channels.cache.get(channels[guilds[i]].reddittheatre),
                        client.channels.cache.get(channels[guilds[i]].reddittext),
                        client.channels.cache.get(channels[guilds[i]].redditnsfw),
                        reddits[guilds[i]],
                        guilds[i]
                    );
                } catch (err) {
                    console.log(err);
                }
        }
    }, 6 * 3600_000); // 6 hours

    // Every 68 - 76 hours send quote to main channel
    (function autoSend() {
        setTimeout(function () {
            if (channels[settings.defaultGuild]) {
                quotes.simpsons(client.channels.cache.get(channels[settings.defaultGuild].generalroom));
            }

            autoSend();
        }, (Math.floor(Math.random() * 9) + 68) * 3600_000);
    })();
}

async function loadBans() {
    let bans = await mongo.getBans();

    for (const prop in bans) {
        let newBans = [];

        for (let i = 0; i < bans[prop].length; i++) {
            let temp = bans[prop][i].split(";;");
            let guild = client.guilds.cache.get(prop);
            let dateNow = new Date();
            let dateUnban = new Date(temp[1]);
            let timer = dateUnban - dateNow;

            if (timer < 0) continue;

            newBans.push(bans[prop][i]);

            setTimeout(function () {
                guild.members
                    .unban(temp[0])
                    .then((user) => console.log(`Unbanned ${user.username} from ${guild.name}`))
                    .catch((err) => {
                        console.log(err);
                        mine.log("Ban error:\n" + err.message);
                    });
            }, timer);

            console.log("Unban in " + timer / 1000 + " s");
        }

        mongo.updateSchema({ bans: newBans }, "settings", prop, true);
    }
}

function listenerError(err) {
    console.log("****************** On listener error ******************");
    console.log(err);
    console.log("****************** ******************");

    mine.log("On listener error:\n" + err.message);
}

function commandError(message, err) {
    message.channel
        .send(wrongCommandMessage)
        .then((mess) => setTimeout(() => mess.delete().catch(() => {}), settings.autoDelDelay));

    console.log("****************** On message error ******************");
    console.log(err);
    console.log("****************** ******************");

    mine.log("On message error:\n" + err.message);
}

// * = italic, ** = bold
// DM - only message.author exists
// "_ _" = empty line

// user.toString()          - mention
// <@!530704313581043713>   - mention
// https://dict.emojiall.com/cs/emoji/🇵###     https://emojipedia.org/regional-indicator-symbol-letter-m/ - emojis

/*      
MEMBER                                      USER
    Properties                                  Properties
        bannable                                    avatar
        client                                      bot
        deleted                                     client
        displayColor                                createdAt
        displayHexColor                             createdTimestamp
        displayName                                 defaultAvatarURL
        guild                                       discriminator
        id                                          dmChannel
        joinedAt                                    id
        joinedTimestamp                             lastMessage
        kickable                                    lastMessageChannelID
        lastMessage                                 lastMessageID
        lastMessageChannelID                        locale
        lastMessageID                               partial
        manageable                                  presence
        nickname                                    system
        partial                                     tag
        permissions                                 username
        premiumSince                            Methods
        premiumSinceTimestamp                       avatarURL
        presence                                    createDM
        roles                                       deleteDM
        user                                        displayAvatarURL
        voice                                       equals
    Methods                                         fetch
        ban                                         fetchFlags
        createDM                                    send
        deleteDM                                    toString
        edit                                        typingDurationIn
        fetch                                       typingIn
        hasPermission                               typingSinceIn
        kick                                  
        permissionsIn                                  
        send                                  
        setNickname                                  
        toString                                  
*/
