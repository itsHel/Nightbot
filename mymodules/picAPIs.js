const request = require("request");
const discord = require("discord.js");
const settings = require("../settings.js");
const apis = require("./APIs.js");
const akaneko = require("akaneko");

const tenorUrlBase = "https://api.tenor.com/v1/random?q=";
const booruUrlBase = "https://danbooru.donmai.us/posts.json?";
//https://danbooru.donmai.us/posts.json?limit=1&tags=sex&random=true
const limit = "&limit=1";

function gifs(cmd, args, channel) {
    let splitNick = args.split(" <@");
    let temp = splitNick[0].split(" ");

    if (cmd.length == 4) {
        //gifA = anime option
        temp.push("anime");
    }

    let words = temp
        .map((word) => {
            return word;
        })
        .join("+");

    let url = tenorUrlBase + words + "&key=" + process.env.TENOR_KEY + limit;
    request.get(url, { json: true }, (err, res, resp) => {
        if (err) return console.error(err);

        if (!resp.results?.length) {
            channel
                .send("```not found```")
                .then((mess) => setTimeout(() => mess.delete().catch(() => {}), settings.autoDelDelay));
            return;
        }

        let imageUrl = resp.results[0].media[0].gif.url;
        let embed = new discord.MessageEmbed().setImage(imageUrl);
        //.setFooter({text: "Score: " + resp.score});
        channel.send({ embeds: [embed] });
    });
}

// _pf
function danbooru(cmd, args, channel) {
    //https://danbooru.donmai.us/posts.json?tags=fuck&random=true&limit=100
    args = args.replace(/<@.+>/, "");
    let splitted = args.split(";");
    let minScore = splitted[1];

    if (minScore == undefined) minScore = 5;

    let temp = splitted[0].trim().split(" ");

    if (cmd.length == 2) {
        //gifA = anime option
        temp.push("gif");
    }

    console.log(temp);

    if (temp.length > 2) {
        channel.send("```You cannot search for more than 2 tags at a time```");
        return;
    }

    let words = temp
        .map((word) => {
            return word;
        })
        .join("+");

    let url = booruUrlBase + "tags=" + words + "&random=true&limit=100";

    request.get(url, { json: true }, (err, res, resp) => {
        if (err) return console.error(err);

        if (!resp.length) {
            channel
                .send("```not found```")
                .then((mess) => setTimeout(() => mess.delete().catch(() => {}), settings.autoDelDelay));
            return;
        }

        let imageUrl, embed;
        for (let i = 0; i < resp.length; i++) {
            if (resp[i].score > minScore && resp[i].file_url != undefined) {
                imageUrl = resp[i].file_url;

                embed = new discord.MessageEmbed().setImage(imageUrl).setFooter({ text: "Score: " + resp[i].score });
                break;
            }
        }

        channel.send({ embeds: [embed] });
    });
}

function getBooty(url, channel) {
    if (!channel.nsfw) {
        channel.send("nsfw room only you pervert");
        return;
    }

    request(
        {
            method: "GET",
            json: true,
            url: url,
        },
        (err, resp, data) => {
            if (err) return console.error(err);

            let picUrl = url.replace("api", "media").replace("0/1/random", "");
            let embed = getBootyEmbed(picUrl, data[0].id);

            channel.send({ embeds: [embed] }).then((mess) => {
                mess.react("⬅").then(() => mess.react("➡"));

                let message = new apis.defMessage(mess.id, data[0].id);
                let collector = mess.createReactionCollector({
                    filter: settings.filter,
                    time: 100000,
                });

                collector.on("collect", (r) => {
                    if (r.emoji.name == "⬅") {
                        message.pos--;
                    } else if (r.emoji.name == "➡") {
                        message.pos++;
                    }

                    embed = getBootyEmbed(picUrl, message.pos);

                    channel.messages.fetch(message.id).then((mess) => {
                        mess.edit({ embeds: [embed] });
                    });

                    mess.reactions.removeAll().then(() => {
                        mess.react("⬅").then(() => mess.react("➡"));
                    });
                });

                collector.on("end", (collected) => {
                    channel.messages.fetch(message.id).then((mess) => mess.reactions.removeAll());
                });
            });
        }
    );
}

// https://github.com/RaphielHS/akaneko-wrapper
async function hentaiAkaneko(cmd, arg, channel) {
    if (!channel.nsfw) {
        channel.send("```nsfw room only you pervert```");
        return;
    }

    let imgUrl;

    try {
        if (cmd == "hentai") {
            //nsfw
            switch (arg.toLowerCase()) {
                case "tags":
                case "info":
                case "help":
                    channel.send(
                        "```Avaible tags:\nass, bdsm, cum, femdom, doujin, maid, orgy, panties, wallpaper, pussy, succubus```"
                    );
                    break;
                case "ass":
                    imgUrl = await akaneko.nsfw.ass();
                    break;
                case "bdsm":
                    imgUrl = await akaneko.nsfw.bdsm();
                    break;
                case "cum":
                    imgUrl = await akaneko.nsfw.cum();
                    break;
                case "femdom":
                    imgUrl = await akaneko.nsfw.femdom();
                    break;
                case "doujin":
                    imgUrl = await akaneko.nsfw.doujin();
                    break;
                case "maid":
                    imgUrl = await akaneko.nsfw.maid();
                    break;
                case "orgy":
                    imgUrl = await akaneko.nsfw.orgy();
                    break;
                case "panties":
                    imgUrl = await akaneko.nsfw.panties();
                    break;
                case "wallpaper":
                    imgUrl = await akaneko.nsfw.wallpapers();
                    break;
                case "pussy":
                    imgUrl = await akaneko.nsfw.pussy();
                    break;
                case "succubus":
                    imgUrl = await akaneko.nsfw.succubus();
                    break;
                default:
                    imgUrl = await akaneko.nsfw.hentai();
                    break;
            }
        } else if (cmd == "anime") {
            //sfw
            switch (arg.toLowerCase()) {
                case "tags":
                case "info":
                case "help":
                    channel.send("```Avaible tags:\nwallpaper, girl, foxgirl```");
                    break;
                case "wallpaper":
                default:
                    imgUrl = await akaneko.wallpapers();
                    break;
                case "girl":
                    imgUrl = await akaneko.neko();
                    break;
                case "foxgirl":
                    imgUrl = await akaneko.foxgirl();
                    break;
            }
        }
    } catch (err) {
        console.log(err);
        channel.send("```Error has occured, try again later```");

        return;
    }

    let embed = new discord.MessageEmbed().setImage(imgUrl).setTitle(arg);
    channel.send({ embeds: [embed] });
}

function getBootyEmbed(url, id) {
    let myUrl = url + id.toString().padStart(5, "0") + ".jpg";
    let embed = new discord.MessageEmbed().setTitle(":flushed:").setImage(myUrl);

    return embed;
}

module.exports = {
    gifs,
    getBooty,
    danbooru,
    hentaiAkaneko,
};
