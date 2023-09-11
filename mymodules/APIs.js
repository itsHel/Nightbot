const request = require("request");
const discord = require("discord.js");
const settings = require("../settings.js");
const owlbot = require("owlbot-js");
const translate = require("@vitalets/google-translate-api");

//ALLOWED special chars  "š", "ž", "ý", "á", "í", "é"
//DISALLOWED chars "ě", "ř", "ů"
const langs = {
    af: "Afrikaans",
    am: "Amharic",
    ar: "Arabic",
    az: "Azerbaijani",
    ba: "Bashkir",
    be: "Belarusian",
    bg: "Bulgarian",
    bn: "Bengali",
    bs: "Bosnian",
    ca: "Catalan",
    ceb: "Cebuano",
    cs: "Czech",
    cv: "Chuvash",
    cy: "Welsh",
    da: "Danish",
    de: "German",
    el: "Greek",
    en: "English",
    eo: "Esperanto",
    es: "Spanish",
    et: "Estonian",
    eu: "Basque",
    fa: "Persian",
    fi: "Finnish",
    fr: "French",
    ga: "Irish",
    gd: "Scottish Gaelic",
    gl: "Galician",
    gu: "Gujarati",
    he: "Hebrew",
    hi: "Hindi",
    hr: "Croatian",
    ht: "Haitian",
    hu: "Hungarian",
    hy: "Armenian",
    id: "Indonesian",
    is: "Icelandic",
    it: "Italian",
    ja: "Japanese",
    jv: "Javanese",
    ka: "Georgian",
    kk: "Kazakh",
    km: "Khmer",
    kn: "Kannada",
    ko: "Korean",
    ky: "Kyrgyz",
    la: "Latin",
    lb: "Luxembourgish",
    lo: "Lao",
    lt: "Lithuanian",
    lv: "Latvian",
    mg: "Malagasy",
    mhr: "Mari",
    mi: "Maori",
    mk: "Macedonian",
    ml: "Malayalam",
    mn: "Mongolian",
    mr: "Marathi",
    mrj: "Hill Mari",
    ms: "Malay",
    mt: "Maltese",
    my: "Burmese",
    ne: "Nepali",
    nl: "Dutch",
    no: "Norwegian",
    pa: "Punjabi",
    pap: "Papiamento",
    pl: "Polish",
    pt: "Portuguese",
    ro: "Romanian",
    ru: "Russian",
    sah: "Yakut",
    si: "Sinhalese",
    sk: "Slovak",
    sl: "Slovenian",
    sq: "Albanian",
    sr: "Serbian",
    su: "Sundanese",
    sv: "Swedish",
    sw: "Swahili",
    ta: "Tamil",
    te: "Telugu",
    tg: "Tajik",
    th: "Thai",
    tl: "Tagalog",
    tr: "Turkish",
    tt: "Tatar",
    udm: "Udmurt",
    uk: "Ukrainian",
    ur: "Urdu",
    uz: "Uzbek",
    vi: "Vietnamese",
    xh: "Xhosa",
    yi: "Yiddish",
    zh: "Chinese",
};
let autoDelDelay = 60000;

function defMessage(id, pos, definitions = []) {
    this.id = id;
    this.pos = pos;
    this.defs = definitions;
}

// Old translator
// function yandexTranslate(message, args) {
//     let text = args.toLowerCase().split(";");
//     let firstLang = "en";
//     let secondLang = "cs";

//     if (text.length == 2) {
//         // Language renaming
//         let index = text[1].indexOf(" ");
//         firstLang = text[1].slice(0, index);
//         secondLang = text[1].substring(index + 1);
//         if (firstLang != "en") firstLang = Object.keys(langs).find((key) => langs[key].toLowerCase() == firstLang);
//         if (secondLang != "en") secondLang = Object.keys(langs).find((key) => langs[key].toLowerCase() == secondLang);
//     }

//     text[0] = specChars(text[0]);
//     let url =
//         "https://translate.yandex.net/api/v1.5/tr.json/translate?key=" +
//         process.env.YANDEX_KEY +
//         "&text=" +
//         text[0] +
//         "&lang=" +
//         firstLang +
//         "-" +
//         secondLang;

//     request(
//         {
//             method: "GET",
//             json: true,
//             url: url,
//         },
//         (err, resp, data) => {
//             if (err) return console.error(err);

//             if (data.code != 200) {
//                 message.channel.send("```language not supported, use 'trlist' to get language list ```");
//                 return;
//             }

//             let translated = data.text[0];

//             if ((firstLang == "cs" || secondLang == "cs") && message.author.id == process.env.ADMIN_ID) {
//                 autoDelDelay = 4000;
//             } else {
//                 autoDelDelay = 60000;
//             }

//             message.channel.send("```" + translated + "```").then((mess) => {
//                 if (mess.channel.type != "DM") setTimeout(() => mess.delete().catch(() => {}), autoDelDelay);
//             });
//             setTimeout(() => message.delete().catch(() => {}), autoDelDelay);
//         }
//     );
// }

function googleTranslate(message, args) {
    let text = args.toLowerCase().split(";");
    let firstLang = "en";
    let secondLang = "cs";

    if (text.length == 2) {
        // Language renaming
        let index = text[1].indexOf(" ");
        firstLang = text[1].slice(0, index);
        secondLang = text[1].substring(index + 1);

        if (firstLang != "en") firstLang = Object.keys(langs).find((key) => langs[key].toLowerCase() == firstLang);

        if (secondLang != "en") secondLang = Object.keys(langs).find((key) => langs[key].toLowerCase() == secondLang);
    }

    if ((firstLang = undefined || secondLang == undefined)) {
        console.log(args);
        message.channel.send("```language not supported, use 'trlist' to get language list ```");
        return;
    }

    translate(text[0], { from: firstLang, to: secondLang }).then((res) => {
        console.log(res);

        let translated = res.text;
        if ((firstLang == "cs" || secondLang == "cs") && message.author.id == process.env.ADMIN_ID) {
            autoDelDelay = 4000;
        } else {
            autoDelDelay = 60000;
        }

        message.channel.send("```" + translated + "```").then((mess) => {
            if (mess.channel.type != "DM") setTimeout(() => mess.delete().catch(() => {}), autoDelDelay);
        });
        setTimeout(() => message.delete().catch(() => {}), autoDelDelay);
    });
}

function sendLangs(message) {
    let langsS = JSON.stringify(langs);
    langsS = langsS.replace(/,/g, ",\n").replace(/:/g, ": ").replace("{", "").replace("}", "");

    message.author.send(langsS);
    setTimeout(() => message.delete().catch(() => {}), settings.autoDelDelay);

    return;
}

function specChars(text) {
    text = text
        .replace("š", "%C5%A1")
        .replace("é", "%C3%A9")
        .replace("í", "%C3%BD")
        .replace("á", "%C3%A1")
        .replace("ý", "%C3%AD")
        .replace("ž", "%C5%BE");
    return text;
}

function imdb(cmd, args, channel) {
    let temp = args.toLowerCase().split(";");
    let title = temp[0];
    let year = temp[1];
    let params = "t=" + title + "&y=" + year;

    request(
        {
            method: "GET",
            json: true,
            url: "http://www.omdbapi.com/?" + params + "&apikey=" + process.env.IMDB_KEY,
        },
        (err, resp, data) => {
            if (err) return console.error(err);

            if (data.Response == "False") {
                channel.send("```" + data.Error + "```").then((mess) => mess.delete({ timeout: autoDelDelay }));
                return;
            }

            let title = data.Title + " (" + data.Year + ")";
            let rating, embed;

            if (data.Ratings != undefined && data.Ratings.length != 0) {
                if (data.Ratings.length == 3) {
                    rating =
                        data.Ratings[0].Value +
                        " - imdb\n" +
                        data.Ratings[1].Value +
                        " - tomatoes\n" +
                        data.Ratings[2].Value +
                        " - metacritic";
                } else {
                    rating = data.Ratings[0].Value + " imdb";
                }
            } else {
                rating = "N/A";
            }

            let img = data.Poster;
            let id = data.imdbID;

            if (cmd != "movief") {
                // Small version
                embed = new discord.MessageEmbed()
                    .setURL("https://www.imdb.com/title/" + id)
                    .setTitle(title)
                    .setDescription(rating + "\n\n" + data.Runtime + " - " + data.Genre + "\n\n" + data.Plot);

                if (img != "N/A") embed.setThumbnail(img);
            } else {
                // Advanced version
                embed = new discord.MessageEmbed()
                    .setURL("https://www.imdb.com/title/" + id)
                    .setTitle(title)
                    .setDescription(
                        rating + "\n\n" + data.Runtime + " - " + data.Genre + "\n" + data.Actors + "\n\n" + data.Plot
                    )
                    .setFooter({ text: "boxOffice: " + data.BoxOffice });

                if (img != "N/A") embed.setImage(img);
            }
            channel.send({ embeds: [embed] });
        }
    );
}

function imdbSearch(args, channel) {
    let temp = args.toLowerCase().split(";");
    let title = temp[0];
    let year = temp[1];
    let params = "s=" + title + "&y=" + year;

    request(
        {
            method: "GET",
            json: true,
            url: "http://www.omdbapi.com/?" + params + "&apikey=" + process.env.IMDB_KEY,
        },
        (err, resp, data) => {
            if (err) return console.error(err);

            if (data.Response == "False") {
                channel
                    .send("```" + data.Error + "```")
                    .then((mess) => setTimeout(() => mess.delete().catch(() => {}), autoDelDelay));
                return;
            }

            let titles = { name: "Title", value: "", inline: true };
            let years = { name: "Year", value: "", inline: true };

            let list = "";
            data.Search.sort((a, b) => b.Year.slice(0, 4) - a.Year.slice(0, 4));

            for (let i = 0; i < data.Search.length; i++) {
                titles.value += data.Search[i].Title + "\n";
                years.value += data.Search[i].Year + "\n";
                list += data.Search[i].Title + " (" + data.Search[i].Year + ")\n";
            }

            let embed = new discord.MessageEmbed({ fields: [titles, years] })
                .setTitle(title)
                .setFooter({ text: "\u2800".repeat(30) });

            channel.send({ embeds: [embed] });
        }
    );
}
//https://www.datamuse.com/api/
function words(type, count, args, channel) {
    request(
        {
            method: "GET",
            json: true,
            url: "http://api.datamuse.com/" + type + args,
        },
        (err, resp, data) => {
            if (err) return console.error(err);

            if (data.length == 0) {
                channel
                    .send("```not found```")
                    .then((mess) => setTimeout(() => mess.delete().catch(() => {}), autoDelDelay));
                return;
            }

            let list = "";
            for (let i = 0; i < count && i < data.length; i++) {
                list += data[i].word + ", ";
            }

            list.slice(0, -2);
            channel.send("```" + list + "```");
        }
    );
}

const owlClient = owlbot(process.env.OWL_KEY);
function vocabulary(args, channel, author) {
    owlClient
        .define(args)
        .then(function (result) {
            let definition = result.definitions[0].definition;
            channel.send("```" + definition + "```").then((mess) => {
                if (result.definitions.length == 1) return;

                mess.react("➡");

                let message = new defMessage(mess.id, 0, result.definitions);
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

                    channel.messages.fetch(message.id).then((mess) => {
                        mess.edit("```" + message.defs[message.pos].definition + "```");
                    });

                    mess.reactions.removeAll().then(() => {
                        if (message.pos > 0) {
                            mess.react("⬅").then(() => {
                                if (message.pos < result.definitions.length - 1) mess.react("➡");
                            });
                        } else {
                            mess.react("➡");
                        }
                    });
                });
                collector.on("end", (collected) => {
                    channel.messages.fetch(message.id).then((mess) => mess.reactions.removeAll());
                });
            });
        })
        .catch((err) => {
            console.log(err);
            channel
                .send("```not found```")
                .then((mess) => setTimeout(() => mess.delete().catch(() => {}), autoDelDelay));
        });
}

module.exports = {
    imdb,
    imdbSearch,
    vocabulary,
    words,
    sendLangs,
    googleTranslate,
    defMessage,
};
