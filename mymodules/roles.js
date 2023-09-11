const discord = require("discord.js");
const mongo = require("./mymongo");

***REMOVED***
    return !user.bot;
***REMOVED***

async function newRole(user, roleChannel) {
    let role = {***REMOVED***
    let emotes = [***REMOVED***
    let roles = [***REMOVED***
    let error = null;

    user.send("Enter title (enter . to skip)")
        .then(() => {
            user.createDM()
                .then((chan) => {
                    if (!roleChannel) {
                        chan.send("```Roleroom does not exist```");
                        throw "no channel";
                    ***REMOVED***

                    chan.awaitMessages(
                        function () {
                            return true;
                        ***REMOVED***,
                        { max: 1, time: 60000 ***REMOVED***,
                    )
                        .then(async (collected) => {
                            if (!collected.first()) throw "timeout";
                            await chan.send("Enter header (enter . to skip)");
                            role.title = collected.first().content;

                            chan.awaitMessages(
                                function () {
                                    return true;
                                ***REMOVED***,
                                { max: 1, time: 60000 ***REMOVED***,
                            )
                                .then(async (collected) => {
                                    if (!collected.first()) throw "timeout";
                                    await chan.send(
                                        "Enter emote - matching role, example: ':peace: - peace'\nMultiple entries must be split by newline (shift + enter)",
                                    );
                                    role.header = collected.first().content;

                                    chan.awaitMessages(
                                        function () {
                                            return true;
                                        ***REMOVED***,
                                        { max: 1, time: 60000 ***REMOVED***,
                                    )
                                        .then(async (collected) => {
                                            if (!collected.first())
                                                throw "timeout";
                                            await chan.send(
                                                "Enter footer (enter . to skip)",
                                            );
                                            role.roles =
                                                collected.first().content;

                                            chan.awaitMessages(
                                                function () {
                                                    return true;
                                                ***REMOVED***,
                                                { max: 1, time: 60000 ***REMOVED***,
                                            )
                                                .then(async (collected) => {
                                                    if (!collected.first())
                                                        throw "timeout";
                                                    await chan.send(
                                                        "Unique role? Y/N (user can have only one role from this category if you pick Yes)",
                                                    );
                                                    role.footer =
                                                        collected.first().content;

                                                    chan.awaitMessages(
                                                        function () {
                                                            return true;
                                                        ***REMOVED***,
                                                        { max: 1, time: 60000 ***REMOVED***,
                                                    ).then(
                                                        async (collected) => {
                                                            if (
                                                                !collected.first()
                                                            )
                                                                throw "timeout";
                                                            if (
                                                                collected
                                                                    .first()
                                                                    .content[0].toLowerCase() ==
                                                                "y"
                                                            )
                                                                role.unique = true;
                                                            else
                                                                role.unique = false;

                                                            await chan.send(
                                                                "```Unique set to " +
                                                                    (role.unique
                                                                        ? "Yes"
                                                                        : "No") +
                                                                    "```",
                                                            );

                                                            role.roles
                                                                .split("\n")
                                                                .forEach(
                                                                    (row) => {
                                                                        emotes.push(
                                                                            row.slice(
                                                                                0,
                                                                                row.indexOf(
                                                                                    " ",
                                                                                ),
                                                                            ),
                                                                        );
                                                                        roles.push(
                                                                            row.slice(
                                                                                row.indexOf(
                                                                                    "- ",
                                                                                ) +
                                                                                    2,
                                                                                row.length,
                                                                            ),
                                                                        );
                                                                    ***REMOVED***,
                                                                );

                                                            let embed =
                                                                new discord.MessageEmbed()
                                                                    .setColor(
                                                                        "#ff6600",
                                                                    )
                                                                    .setDescription(
                                                                        role.roles,
                                                                    );
                                                            if (
                                                                role.title !=
                                                                "."
                                                            )
                                                                embed.setTitle(
                                                                    role.title,
                                                                );
                                                            if (
                                                                role.header !=
                                                                "."
                                                            )
                                                                embed.setAuthor(
                                                                    role.header,
                                                                );
                                                            if (
                                                                role.footer !=
                                                                "."
                                                            )
                                                                embed.setFooter(
                                                                    {
                                                                        text: role.footer,
                                                                    ***REMOVED***,
                                                                );

                                                            roleChannel
                                                                .send({
                                                                    embeds: [
                                                                        embed,
                                                                ***REMOVED***
                                                                ***REMOVED***)
                                                                .then(
                                                                    async (
                                                                        mess,
                                                                    ) => {
                                                                        for (
                                                                            let i = 0;
                                                                            i <
                                                                            emotes.length;
                                                                            i++
                                                                        ) {
                                                                            let id =
                                                                                emotes[
                                                                                    i
                                                                                ].match(
                                                                                    /:.*:(\d+)>/,
                                                                                );
                                                                            let emoji;
                                                                            if (
                                                                                id
                                                                            )
                                                                                emoji =
                                                                                    mess.guild.emojis.resolveID(
                                                                                        id[1],
                                                                                    );
                                                                            else
                                                                                emoji =
                                                                                    emotes[
                                                                                        i
                                                                                    ***REMOVED***
                                                                            try {
                                                                                await mess
                                                                                    .react(
                                                                                        emoji,
                                                                                    )
                                                                                    .catch(
                                                                                        (
                                                                                            err,
                                                                                        ) => {
                                                                                            error =
                                                                                                err.message;
                                                                                            chan.send(
                                                                                                "```Error: " +
                                                                                                    err.message +
                                                                                                    ", with: " +
                                                                                                    emotes[
                                                                                                        i
                                                                                                    ] +
                                                                                                    "```",
                                                                                            );
                                                                                            console.log(
                                                                                                "error:",
                                                                                            );
                                                                                            console.log(
                                                                                                error,
                                                                                            );
                                                                                        ***REMOVED***,
                                                                                    );
                                                                            ***REMOVED*** catch (err) {***REMOVED***
                                                                        ***REMOVED***

                                                                        if (
                                                                            error
                                                                        )
                                                                            return mess;

                                                                        let collector =
                                                                            mess.createReactionCollector(
                                                                                {
                                                                                    filter: filter,
                                                                                    time: 0,
                                                                                    dispose: true,
                                                                                ***REMOVED***,
                                                                            );
                                                                        createRoleCollector(
                                                                            collector,
                                                                            emotes,
                                                                            roles,
                                                                            role.unique,
                                                                        );

                                                                        return mess;
                                                                    ***REMOVED***,
                                                                )
                                                                .then(
                                                                    (
                                                                        embedMessage,
                                                                    ) => {
                                                                        if (
                                                                            error
                                                                        ) {
                                                                            embedMessage
                                                                                .delete()
                                                                                .catch(
                                                                                    () => {***REMOVED***,
                                                                                );
                                                                            return;
                                                                        ***REMOVED***

                                                                        mongo.saveRoleMessage(
                                                                            embedMessage
                                                                                .embeds[0]
                                                                                .description,
                                                                            embedMessage.id,
                                                                            embedMessage
                                                                                .channel
                                                                                .id,
                                                                            embedMessage
                                                                                .guild
                                                                                .id,
                                                                            role.unique,
                                                                        );
                                                                    ***REMOVED***,
                                                                );
                                                            chan.send(
                                                                roleChannel.toString(),
                                                            );
                                                        ***REMOVED***,
                                                    );
                                                ***REMOVED***)
                                                .catch((err) => {
                                                    chan.send(
                                                        "```Cancelled```",
                                                    );
                                                    console.log(err);
                                            ***REMOVED***
                                        ***REMOVED***)
                                        .catch((err) => {
                                            chan.send("```Cancelled```");
                                            console.log(err);
                                    ***REMOVED***
                                ***REMOVED***)
                                .catch((err) => {
                                    chan.send("```Cancelled```");
                                    console.log(err);
                            ***REMOVED***
                        ***REMOVED***)
                        .catch((err) => {
                            chan.send("```Cancelled```");
                            console.log(err);
                    ***REMOVED***
                ***REMOVED***)
                .catch((err) => {
                    //chan.send("```Cancelled```");
                    console.log(err);
            ***REMOVED***
        ***REMOVED***)
        .catch((err) => {
            //chan.send("```Cancelled```");
            console.log(err);
    ***REMOVED***
***REMOVED***

async function setupRoleMessages(client) {
    let roles = await mongo.getRoleMessages();

    for (const guild in roles) {
        for (let i = 0; i < roles[guild].length; i++) {
            if (client.channels.cache.get(roles[guild][i].channelid)) {
                client.channels.cache
                    .get(roles[guild][i].channelid)
                    .messages.fetch(roles[guild][i].messageid)
                    .then((msg) => {
                        let collector = msg.createReactionCollector({
                            filter: filter,
                            time: 0,
                            dispose: true,
                    ***REMOVED***
                        createRoleCollector(
                            collector,
                            roles[guild][i].emotes,
                            roles[guild][i].roles,
                            roles[guild][i].unique,
                        );

                        collector.on("collect", (collected) => {
                            console.log("REACTED");
                    ***REMOVED***
                    ***REMOVED***)
                    .catch((err) => {
                        if (
                            err.message == "Unknown Message" ||
                            err.code == 10008
                        ) {
                            mongo.deleteRoleMessage(roles[guild][i].messageid);
                        ***REMOVED*** else {
                            console.log(err);
                        ***REMOVED***
                ***REMOVED***
            ***REMOVED*** else {
                // Channel doesnt exist anymore
                mongo.deleteRoleMessage(roles[guild][i].messageid);
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
***REMOVED***

function createRoleCollector(collector, emotes, roles, unique) {
    collector.on("collect", (collected, user) => {
        for (let i = 0; i < emotes.length; i++) {
            let thisId = emotes[i].match(/:.*:(\d+)>/);

            if (thisId) {
                thisId = thisId[1***REMOVED***
            ***REMOVED*** else {
                thisId = -1;
            ***REMOVED***

            if (
                emotes[i] == collected.emoji.name ||
                thisId == collected.emoji.id
            ) {
                try {
                    let role = collected.message.guild.roles.cache.find(
                        (role) =>
                            role.name.toLowerCase() === roles[i].toLowerCase(),
                    );
                    let member = collected.message.guild.member(user);

                    if (unique) {
                        roles.forEach((removeRole) => {
                            if (
                                member.roles.cache.some(
                                    (memberRole) =>
                                        memberRole.name == removeRole,
                                )
                            )
                                try {
                                    let roleObject =
                                        collected.message.guild.roles.cache.find(
                                            (guideRole) =>
                                                guideRole.name.toLowerCase() ===
                                                removeRole.toLowerCase(),
                                        );
                                    member.roles.remove(roleObject);
                                ***REMOVED*** catch (e) {***REMOVED***
                    ***REMOVED***
                    ***REMOVED***
                    member.roles.add(role);
                ***REMOVED*** catch (e) {
                    console.log(e);
                ***REMOVED***
                break;
            ***REMOVED***
        ***REMOVED***
***REMOVED***

    collector.on("remove", (collected, user) => {
        for (let i = 0; i < emotes.length; i++) {
            let thisId = emotes[i].match(/:.*:(\d+)>/);

            if (thisId) {
                thisId = thisId[1***REMOVED***
            ***REMOVED*** else {
                thisId = -1;
            ***REMOVED***

            if (
                emotes[i] == collected.emoji.name ||
                thisId == collected.emoji.id
            ) {
                try {
                    let role = collected.message.guild.roles.cache.find(
                        (role) =>
                            role.name.toLowerCase() === roles[i].toLowerCase(),
                    );
                    let member = collected.message.guild.member(user);
                    member.roles.remove(role);
                ***REMOVED*** catch (e) {
                    console.log(e);
                ***REMOVED***
                break;
            ***REMOVED***
        ***REMOVED***
***REMOVED***
    collector.on("dispose", (collected, user) => {
        for (let i = 0; i < emotes.length; i++) {
            let thisId = emotes[i].match(/:.*:(\d+)>/);

            if (thisId) thisId = thisId[1***REMOVED***

            if (
                emotes[i] == collected.emoji.name ||
                thisId == collected.emoji.id
            ) {
                try {
                    let role = collected.message.guild.roles.cache.find(
                        (role) =>
                            role.name.toLowerCase() === roles[i].toLowerCase(),
                    );
                    let member = collected.message.guild.member(user);
                    member.roles.remove(role);
                ***REMOVED*** catch (e) {
                    console.log(e);
                ***REMOVED***
                break;
            ***REMOVED***
        ***REMOVED***
***REMOVED***
***REMOVED***

function setDefaultRole(guildSetting, role, message) {
    let roleName = role;
    if (message.mentions.roles.first()) {
        roleName = message.mentions.roles.first().name;
    ***REMOVED***

    if (
        role.length &&
        message.guild.roles.cache.find(
            (guildRole) =>
                guildRole.name.toLowerCase() === roleName.toLowerCase(),
        ) == undefined
    ) {
        message.channel.send("```Role not found```");
        return;
    ***REMOVED***

    guildSetting.defaultrole = roleName;
    mongo.updateSchema({ defaultrole: roleName ***REMOVED***, "settings", message.guild.id);

    if (roleName.length == 0) {
        message.channel.send("```Default role cancelled```");
    ***REMOVED*** else {
        message.channel.send("```Default role set to " + roleName + "```");
    ***REMOVED***
***REMOVED***

***REMOVED***
    newRole,
    setDefaultRole,
    setupRoleMessages,
***REMOVED***
