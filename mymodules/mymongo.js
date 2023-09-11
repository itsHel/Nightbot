const mongoose = require("mongoose");

function mongoDb() {
    var dbUrl = "mongodb://127.0.0.1:27017/Nightbot";

    mongoose
        .connect(dbUrl)
        .then((result) => console.log("DBloaded"))
        .catch((err) => console.log(err));
}

function updateSchema(values, schema, guildid, reset = false) {
    let newSchema;
    switch (schema) {
        case "room":
            newSchema = mongoose.model("room", roomSchema);
            newSchema
                .findOneAndUpdate({ guildid: guildid }, values, {
                    upsert: true,
                })
                .then((result) => {})
                .catch((err) => console.log(err));
            break;
        case "reddit":
            newSchema = mongoose.model("reddit", redditSchema);
            newSchema
                .findOneAndUpdate(
                    {
                        guildid: guildid,
                        reddit: values.reddit,
                        type: values.type,
                    },
                    values,
                    { upsert: true }
                )
                .then((result) => {})
                .catch((err) => console.log(err));
            break;
        case "settings":
            newSchema = mongoose.model("settings", settingsSchema);
            if (values.nopinsrooms || values.bans || values.modroles) {
                // Is array
                if (!reset) {
                    let property = Object.keys(values)[0];
                    values = {
                        $addToSet: {
                            [property]: values[Object.keys(values)[0]],
                        },
                    };
                }
            }

            newSchema
                .findOneAndUpdate({ guildid: guildid }, values, {
                    upsert: true,
                })
                .then((result) => {})
                .catch((err) => console.log(err));
            break;
    }
}

function addReminder(userid, message, time) {
    let newSchema = mongoose.model("reminder", reminderSchema);
    let reminder = new newSchema({
        userid: userid,
        message: message,
        time: time,
    });
    reminder.save().then((result) => console.log(result));
}

async function getReminders(userid) {
    let newSchema = mongoose.model("reminder", reminderSchema);
    await newSchema
        .deleteMany({ time: { $lte: new Date().getTime() } })
        .then()
        .catch((err) => console.log(err));

    return await newSchema.find().then((res) => {
        return res;
    });
}

async function getRooms() {
    let newSchema = mongoose.model("room", roomSchema);

    return await newSchema.find().then((res) => {
        let rooms = {};
        res.forEach((row) => {
            rooms[row.guildid] = {};
            for (const prop in row) {
                if ((prop.match("room") || prop.match("reddit")) && row[prop]) {
                    rooms[row.guildid][prop] = row[prop];
                }
            }
        });

        return rooms;
    });
}

async function getReddits() {
    let newSchema = mongoose.model("reddit", redditSchema);

    return await newSchema.find().then((res) => {
        let reddits = {};
        res.forEach((row) => {
            if (!reddits[row.guildid]) reddits[row.guildid] = [];

            let newReddit = {};
            newReddit["reddit"] = row.reddit;
            newReddit["minupvotes"] = row.minupvotes;
            newReddit["type"] = row.type;
            newReddit["ignorevidsandgifs"] = row.ignorevidsandgifs;
            reddits[row.guildid].push(newReddit);
        });
        return reddits;
    });
}

function deleteReddit(values) {
    let newSchema = mongoose.model("reddit", redditSchema);

    newSchema
        .deleteMany(values)
        .then()
        .catch((err) => console.log(err));
}

async function getRedditHistory(guildid, reddit, type) {
    let newSchema = mongoose.model("reddit", redditSchema);

    return await newSchema.find({ guildid: guildid, reddit: reddit, type: type }).then((res) => {
        return res[0].history;
    });
}

async function getSetting(guildid, type) {
    let newSchema = mongoose.model("settings", settingsSchema);

    return await newSchema.find({ guildid: guildid }).then((res) => {
        return res[0][type];
    });
}

async function getSettings(guilds) {
    let newSchema = mongoose.model("settings", settingsSchema);

    return await newSchema.find({ guildid: { $in: guilds } }).then((res) => {
        let settings = {};
        res = res.sort((a, b) => a.guildid - b.guildid);

        guilds
            .sort((a, b) => a - b)
            .forEach((row, i) => {
                if (!res[i] || res[i].guildid != row) {
                    settings[row] = {
                        leavebandays: 0,
                        ratepeoplecount: 0,
                        nopinsrooms: [],
                        modroles: [],
                        emoteshistory: "{}",
                        defaultrole: "",
                        leaveQuoteLastIndex: 0,
                    };
                } else {
                    settings[row] = {
                        leavebandays: res[i].leavebandays || 0,
                        ratepeoplecount: res[i].ratepeoplecount || 0,
                        nopinsrooms: res[i].nopinsrooms || [],
                        modroles: res[i].modroles || [],
                        emoteshistory: res[i].emoteshistory || "{}",
                        defaultrole: res[i].defaultrole || "",
                        leaveQuoteLastIndex: res[i].leaveQuoteLastIndex || 0,
                    };
                }

                settings[row].emoteshistory = JSON.parse(settings[row].emoteshistory);
                settings[row].pinning = true;
            });

        return settings;
    });
}

async function getRoleMessages() {
    let newSchema = mongoose.model("role", roleSchema);

    return await newSchema.find().then((res) => {
        let roles = {};
        res.forEach((row) => {
            if (!roles[row.guildid]) roles[row.guildid] = [];
            let newMessage = {
                messageid: row.messageid,
                channelid: row.channelid,
                roles: row.roles,
                emotes: row.emotes,
                unique: row.unique,
            };
            roles[row.guildid].push(newMessage);
        });

        return roles;
    });
}

async function saveRoleMessage(description, messageid, channelid, guildid, unique) {
    let newSchema = mongoose.model("role", roleSchema);
    let values = {
        guildid: guildid,
        messageid: messageid,
        channelid: channelid,
        roles: [],
        emotes: [],
        unique: unique,
    };

    let rows = description.split("\n");
    rows.forEach((row) => {
        let temp = row.split("-");
        let emote = temp[0].trim();
        let role = temp[1].trim();
        values.emotes.push(emote);
        values.roles.push(role);
    });

    newSchema
        .create(values)
        .then((result) => console.log(result))
        .catch((err) => console.log(err));
}

function deleteRoleMessage(messageid) {
    let newSchema = mongoose.model("role", roleSchema);

    newSchema
        .deleteOne({ messageid: messageid })
        .then()
        .catch((err) => console.log(err));
}

async function getBans() {
    let newSchema = mongoose.model("settings", settingsSchema);

    return await newSchema.find().then((res) => {
        let bans = {};
        res.forEach((row) => {
            bans[row.guildid] = row.bans;
        });

        return bans;
    });
}

const roomSchema = new mongoose.Schema({
    guildid: {
        type: String,
        unique: true,
    },
    pinroom: {
        type: String,
    },
    generalroom: {
        type: String,
    },
    pollroom: {
        type: String,
    },
    confessroom: {
        type: String,
    },
    rolesroom: {
        type: String,
    },
    delroom: {
        type: String,
    },
    welcomeroom: {
        type: String,
    },
    announceroom: {
        type: String,
    },
    reddittheatre: {
        type: String,
    },
    reddittext: {
        type: String,
    },
    redditnsfw: {
        type: String,
    },
    rateroom: {
        type: String,
    },
});

const redditSchema = new mongoose.Schema({
    guildid: {
        type: String,
    },
    reddit: {
        type: String,
    },
    minupvotes: {
        type: Number,
    },
    type: {
        type: String,
    },
    ignorevidsandgifs: {
        type: Boolean,
        default: true,
    },
    history: [
        {
            type: String,
        },
    ],
});

const settingsSchema = new mongoose.Schema({
    guildid: {
        type: String,
        unique: true,
    },
    modroles: [
        {
            type: String,
        },
    ],
    nopinsrooms: [
        {
            type: String,
        },
    ],
    leavebandays: {
        type: Number,
    },
    ratepeoplecount: {
        type: Number,
    },
    defaultrole: {
        type: String,
    },
    bans: [
        {
            type: String,
        },
    ],
    emoteshistory: {
        type: String,
    },
    leaveQuoteLastIndex: {
        type: Number,
    },
});

const roleSchema = new mongoose.Schema({
    guildid: {
        type: String,
    },
    messageid: {
        type: String,
    },
    channelid: {
        type: String,
    },
    roles: [
        {
            type: String,
        },
    ],
    emotes: [
        {
            type: String,
        },
    ],
    unique: {
        type: Boolean,
        default: false,
    },
});

const reminderSchema = new mongoose.Schema({
    userid: {
        type: String,
    },
    message: {
        type: String,
    },
    time: {
        type: Number,
    },
});

module.exports = {
    mongoDb,
    updateSchema,
    addReminder,
    getReminders,
    getRooms,
    getRedditHistory,
    deleteReddit,
    getReddits,
    getSetting,
    getSettings,
    getBans,
    getRoleMessages,
    saveRoleMessage,
    deleteRoleMessage,
};
