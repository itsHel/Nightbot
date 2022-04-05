const discord = require("discord.js");
const settings = require("../settings.js");
const fs = require("fs");
const mongo = require("./mymongo.js");
const help = require("./help.js");

// Kingdom emojis
const emojis = {
    noU: "693684338952241195",
    faceHoof: "677496035551215637",
    upvote: "692108118531768391",
    thisTbh: "693228128620773536",
    iLovePandas: "708649941987360818",
    thinkLurk: "705108642617229353",
    milkBow: "822160031905611796",
    check: "939593789000011917"
***REMOVED***
// Classic emojis
const emojisClassic = {
    upArrowBlue: "⬆️",
    downArrowBlue: "⬇️",
    check: "✅"
***REMOVED***

const noModMessage = "```Mod only command```";   

var ratings = [***REMOVED***

function privateDmMessage(user){
    return "Cannot send DM to " + user + ", change your \"Privacy & safety\" settings please";
***REMOVED***

async function autoPin(channel, pinChannel, guildId){
    let nopins = await mongo.getSetting(guildId, "nopinsrooms");
    
    for(let i = 0; i < nopins.length; i++)
        if(channel.id == nopins[i])
            return;

    channel.messages.fetch({limit: 100***REMOVED***).then(messages => {
        messages.forEach(mess => {
            if(mess.pinned){
                let pfp = mess.author.avatarURL();
                let nick = mess.author.username;
                let color = mess.member.displayHexColor;
                let files = mess.attachments.array();
                let img = files.length ? files[0].url : "";
                let text = mess.content;
                let embed = new discord.MessageEmbed();
                let vid, link, title;

                if(mess.embeds.length){
                    img = (mess.embeds[0].image == null) ? "" : mess.embeds[0].image.url;
                    vid = (mess.embeds[0].video == null) ? "" : mess.embeds[0].video.url;
                    link = (mess.embeds[0].url == null) ? "" : mess.embeds[0].url;
                    title = (mess.embeds[0].title == null) ? "" : mess.embeds[0].title;
                    if(img == "")
                        img = (mess.embeds[0].thumbnail == null) ? "" : mess.embeds[0].thumbnail.url;
                    text = (mess.embeds[0].description);
                    text = (text == undefined) ? "" : text;

                    mess.embeds[0].fields.forEach(field => {
                         embed.addField(field.name, field.value, field.inline);
                ***REMOVED***
                ***REMOVED***

                embed
                    .setColor(color)
                    .setAuthor(nick, pfp)
                    .setDescription(text);

                if(img){
                    embed.setImage(img);
                ***REMOVED***

                if(title){
                    embed.setTitle(title);
                ***REMOVED***

                if(link){
                    embed.setURL(link);
                ***REMOVED***

                if(vid){
                    embed.setURL(vid);
                    embed.setTitle(vid);
                ***REMOVED***

                pinChannel.send(embed);
                mess.unpin();
            ***REMOVED***
    ***REMOVED***
    ***REMOVED***).catch(err => { console.log(err); log("autoPin error:\n" + err.message); ***REMOVED***);

    console.log("pinned");
***REMOVED***

function polls(pollChannel, text, author){
    let footer = (text.match(";")) ? "Suggested by: " + author.displayName : "";
    let pollText = text.replace(";", "") + "\n";
    pollText = pollText.charAt(0).toUpperCase() + pollText.slice(1);
    let embed = new discord.MessageEmbed().setDescription(pollText).setFooter(footer);

    pollChannel.send(embed).then(m => {
        m.react(emojisClassic.upArrowBlue);
        m.react(emojisClassic.downArrowBlue);
        m.react(emoji(emojis.faceHoof, m));
***REMOVED***
***REMOVED***

// Reset bullets after dead?
function russianRoulette(args, message, modroles = []){
    const drumSize = 6;

    let step = parseInt(args.match(/\b\d\b/) || 0);
    let type = (args.match(/\b(kick|ban)\b/) || [""])[0***REMOVED***
    let force = !!(args.match(/\bforce\b/) && isAdmin(message, modroles));

    let allMentionedPlayers = [], activePlayers = [***REMOVED***
    message.mentions.members.forEach(member => {
        if(!member.user.bot)
            allMentionedPlayers.push(member)
***REMOVED***

    // Add players from mentioned roles
    message.mentions.roles.forEach(role => {
        message.guild.roles.cache.get(role.id).members.forEach(member => {
            if(!member.user.bot)
                allMentionedPlayers.push(member);
    ***REMOVED***
***REMOVED***

    allMentionedPlayers = allMentionedPlayers.filter((x, i, a) => a.indexOf(x) == i && x != message.member);

    if(!allMentionedPlayers.length){
        help.commandHelp("russianroulette", message.channel);
        return;
    ***REMOVED***

    let bullets = [Math.floor(Math.random() * drumSize) + 1***REMOVED***
    let round = 1;
    let newRound = false;
    let pos = 0;
    
    if(!force){
        var welcomeText = message.mentions.members.map(member => member.user.toString() + " ").join("") + "you are challenged to Russian Roulette, react with \"check\" to accept";
    ***REMOVED*** else {
        var welcomeText = message.mentions.members.map(member => member.user.toString() + " ").join("") + "... all of a sudden you find yourself playing Russian Roulette, good luck";
    ***REMOVED***

    let welcomeEmbed = new discord.MessageEmbed().setColor("#000").setDescription(welcomeText);
    message.channel.send(welcomeEmbed);

    if(type){
        let alertText = "Loser(s) will be dishonorably **" + ((type == "kick") ? "kicked" : "banned") + "** from server!";
        let alertEmbed = new discord.MessageEmbed().setColor("#cc0000").setDescription(alertText);
        message.channel.send(alertEmbed);
    ***REMOVED***

    if(force){
        activePlayers = allMentionedPlayers;
        start();
    ***REMOVED*** else {
        ***REMOVED***
            return allMentionedPlayers.filter(player => player.user == user).length && user != message.member.user;
        ***REMOVED***

        activePlayers.push(message.member);
        message.react(emojisClassic.check);

        let collector = message.createReactionCollector(filter, { time: 30000 ***REMOVED***);

        collector.on("collect", (reaction, user) => {
            if(reaction.emoji.name == emojisClassic.check){
                let reactMember = allMentionedPlayers.find(player => player.user == user);

                activePlayers.push(reactMember);
                if(activePlayers.length == allMentionedPlayers.length + 1){
                    collector.stop("ignore");
                    start();
                ***REMOVED***
            ***REMOVED***
    ***REMOVED***
        collector.on("end", (collected, reason) => {
            if(activePlayers.length > 1 && reason != "ignore"){
                start();
            ***REMOVED*** else {
                if(reason != "ignore"){
                    let embed = new discord.MessageEmbed().setColor("#ffca2c").setDescription("Player(s) didn't react, timeout...");
                    message.channel.send(embed);
                ***REMOVED***
            ***REMOVED***
    ***REMOVED***
    ***REMOVED***
    
    function start(){
        setTimeout(function(){
            // Randomize array
            activePlayers = activePlayers.map(value => ({ value, sort: Math.random() ***REMOVED***)).sort((a, b) => a.sort - b.sort).map(({ value ***REMOVED***) => value);

            let embed = new discord.MessageEmbed().setColor("#31d2f2").setDescription("----- **Round 1** -----\n1 bullet\n\nPlayer order: " + activePlayers.map(member => member.user.toString() + "  ").join(""));
            message.channel.send(embed);

            rrRoll(activePlayers[0]);
        ***REMOVED***, 2000);
    ***REMOVED***

    function rrRoll(player){
        if(!player)
            return;

        let nextDelay = (newRound) ? 2750 : 1000;            // new round delay / next player delay

        if(newRound){
            setTimeout(function(){
                if(round != 1){
                    for(let i = 0; i < step; i++){
                        if(bullets.length == drumSize)
                            break;

                        do {
                            var newBullet = Math.floor(Math.random() * drumSize) + 1;
                        ***REMOVED*** while(bullets.filter(bullet => bullet == newBullet).length);
                        
                        bullets.push(newBullet);
                    ***REMOVED***
                ***REMOVED***

                let text = "----- **Round " + round + "**-----";
                if(bullets.length > 1){
                    text += "\n" + bullets.length + " bullet(s)";
                ***REMOVED***

                let embed = new discord.MessageEmbed().setColor("#31d2f2").setDescription(text);
                message.channel.send(embed);

                newRound = false;
            ***REMOVED***, 1750);
        ***REMOVED***

        setTimeout(function(){
            let rollEmbed = new discord.MessageEmbed().setColor("#000").setDescription(player.user.toString() + " rolls...");

            message.channel.send(rollEmbed).then(mess => {
                setTimeout(function(){
                    let roll = Math.floor(Math.random() * drumSize) + 1;
                    let nextRollDelay = 0;

                    mess.edit(rollEmbed.setDescription(player.user.toString() + " rolls... " + roll + "/" + drumSize)); 
                        if(bullets.filter(bullet => bullet == roll).length){
                            // Bullet hit player
                            nextRollDelay = 500;

                            setTimeout(function(){
                                let embed = new discord.MessageEmbed().setColor("#cc0000").setDescription(player.user.toString() + " falls down dead...");
                                message.channel.send(embed);

                                switch(type){
                                    case "kick":
                                        player.kick("Better luck next life");
                                        break; 
                                    case "ban":
                                        player.ban("Better luck next life");
                                        break; 
                                ***REMOVED***
                            ***REMOVED***, nextRollDelay); 

                            activePlayers.splice(pos, 1);
                            --pos;
                           
                            if(activePlayers.length == 1){
                                // End
                                setTimeout(function(){
                                    let embed = new discord.MessageEmbed().setColor("#31d2f2").setDescription(activePlayers[0].user.toString() + " lives to see another day");
                                    message.channel.send(embed);
                                ***REMOVED***, 1250);
                                return;
                            ***REMOVED***
                        ***REMOVED***

                        setTimeout(function(){
                            rrRoll(activePlayers[nextPos()]);
                        ***REMOVED***, nextRollDelay);             
                ***REMOVED***, 750);            // roll delay
        ***REMOVED***
        ***REMOVED***, nextDelay);              // next person delay
    ***REMOVED***

    function nextPos(){
        ++pos;
        if(pos >= activePlayers.length){
            pos = 0;
            ++round;
            newRound = true;
        ***REMOVED***

        return pos;
    ***REMOVED***
***REMOVED***

function sendToChannel(text, targetChannel, channel){
    let embed = new discord.MessageEmbed ()
        .setColor("#3BE8C6")
        .setDescription(text);

    targetChannel.send(embed).catch(err => {
        console.log(err);
        channel.send("we're sorry but something went wrong, try again");
***REMOVED***

    channel.send("sent").then(sent => sent.delete({timeout: settings.autoDelDelay***REMOVED***));
***REMOVED***

function rate(args, rateChannel, user, channel, peopleCount){
    const help = "Rating command example: '_rate 9.9/10'";
    let resetTimeout;

    if(args){
        // Save rating

        if(!args.match(/\d+/)){
            channel.send("```Wrong format\n" + help + "```");
            return;
        ***REMOVED***

        // Check if user already rated
        let found = false;
        for(let i = 0; i < ratings.length; i++){
            if(ratings[i].user == user){
                ratings[i].rating = args;
                found = true;
                break;
            ***REMOVED***
        ***REMOVED***

        let rate = { user: user, rating: args ***REMOVED***

        if(!found){
            clearTimeout(resetTimeout);
            setTimeout(function(){
                ratings = [***REMOVED***
            ***REMOVED***, 3_600_000);          // 60 mins

            ratings.push(rate);
            channel.send("Thank you for watching <a:milkBow:822160031905611796>");

            // (:
            setTimeout(function(){
                if(Math.floor(Math.random() * 50) == 0){
                    channel.send("YOU'LL PAY FOR YOUR CRIMES AGAINST HUMANITY!!!").then(sent => sent.delete({timeout: 2000***REMOVED***));
                    return;
                ***REMOVED***  
                if(Math.floor(Math.random() * 10) == 0){
                    channel.send("You little brat");
                ***REMOVED***
            ***REMOVED***, 1000);
         
            // If all users rated and channel is set, show ratings
            if(rateChannel && ratings.length == peopleCount){
                let msg = getRatingMessage(ratings);
                rateChannel.send(msg);

                clearTimeout(resetTimeout);
                ratings = [***REMOVED***
            ***REMOVED***
        ***REMOVED***
    ***REMOVED*** else {
        // No args = show ratings and then clear
        
        if(ratings.length == 0){
            channel.send("```No user has rated yet!\n" + help + "```")
            return;
        ***REMOVED***
        if(ratings.length == 1){
            channel.send("```Only one user rated yet!```")
            return;
        ***REMOVED***
        
        if(channel.type.toLowerCase() == "dm"){
            channel.send("```Cannot show ratings in DM!```");
            return;
        ***REMOVED***

        let msg = getRatingMessage(ratings);
        channel.send(msg);

        ratings = [***REMOVED***
    ***REMOVED***
***REMOVED***

function getRatingMessage(ratingsAll){              // Private
    let msg = "";
    for(let i = 0; i < ratingsAll.length; i++){
        msg += ratingsAll[i].user.toString() + " - " + ratingsAll[i].rating + "\n";
    ***REMOVED***
    msg = msg.slice(0, -1);

    return msg;
***REMOVED***

function countDown(i, delay, channel){
    setTimeout(function(){
        if(!i){
            channel.send("Now").then(sent => sent.delete({timeout: settings.autoDelDelay * 10***REMOVED***));
            return;
        ***REMOVED***
        channel.send(i--).then(sent => sent.delete({timeout: settings.autoDelDelay * 10***REMOVED***));
        countDown(i, delay, channel);
    ***REMOVED***, delay);
***REMOVED***

function emotesCount(text, author, stats){
    if(author.bot || text == "")
        return;
    let matches = text.match(/<a*:[^\s]+?:/gi);
    if(matches != null)
        for(let i = 0; i < matches.length; i++){
            matches[i] = matches[i].replace(/<a*:|:/g, "");
            if(stats[matches[i]] == undefined)
                stats[matches[i]] = 1;
            else
                stats[matches[i]]++;
    ***REMOVED***
***REMOVED***

function emotesShow(stats, message, client){
    let emotesArr = [***REMOVED***
    for(let emote in stats)
        emotesArr.push([emote, stats[emote]]);
    emotesArr.sort(function(a, b){return b[1] - a[1]***REMOVED***);

    let text = emotesArr.map(emote => {
        if(emote[1] < 10)
            return;

        let emoteID = client.emojis.cache.find(emoji => emoji.name == emote[0]);
        if(emoteID != undefined){
            let animated = (emoteID.animated == false) ? "" : "a";
            return "<" + animated + ":" + emote[0] + ":" + emoteID + "> - " + emote[1***REMOVED***
        ***REMOVED***
        else{
            return emote[0] + " - " + emote[1***REMOVED***
        ***REMOVED***
    ***REMOVED***).join("\n");

    message.channel.send(text);
***REMOVED***

// Reactions
function reactions(message){
    let text = message.content.toLowerCase();
    if(message.author.bot || text == "" || text[0].match(/>|!|_|-/))
        return;

    if(text.match("shut up")){
        let x = (text.match("shut up bot")) ? 1 : 3;
        if(Math.floor(Math.random()*x) == 0)
            message.react(emoji(emojis.noU, message));
    ***REMOVED***
    if(text.match(/\bhel\b/)){
        if(Math.floor(Math.random()*3) == 0)
            message.react(emoji(emojis.faceHoof, message));
    ***REMOVED***
    if(text.match(/\bnoob\b/)){
        if(Math.floor(Math.random()*3) == 0)
            message.react(emoji(emojis.noU, message));
    ***REMOVED***
    if(text.match(/\bpanda\b/)){
        if(Math.floor(Math.random()*3) == 0)
            message.react(emoji(emojis.iLovePandas, message));
    ***REMOVED***
    if(text.match(/\bhelsworth\b/)){
        if(Math.floor(Math.random()*2) == 0)
            message.react(emoji(emojis.thinkLurk, message));
    ***REMOVED***
    if(text.match(/\blame\b/)){
        if(Math.floor(Math.random()*3) == 0)
            message.react(emoji(emojis.noU, message));
    ***REMOVED***
    if((text[0] != "<" && text[text.length - 1] != ">" && text[text.length - 2] != ">")){
        if(Math.floor(Math.random()*250) == 0)
            message.react(emoji(emojis.upvote, message));
    ***REMOVED***
***REMOVED***

function emoji(id, message){
    return message.guild.emojis.resolveID(id);
***REMOVED***

function isAdmin(message, modRoles = [], response = true){
    if((message.member && message.member.id == settings.Hel) || (message.author && message.author.id == settings.Hel))
        return true;

    let member = message.member;
    let guild = message.guild;
    
    if(!member.manageable)                  // Member is above bot in hierarchy
        return true;
    
    if(member.id == guild.ownerID)
        return true;

    if(member.roles.cache.find(role => {
        for(let i = 0; i < modRoles.length; i++)
            if(role.name == modRoles[i])
                return true;
    ***REMOVED***)){
        return true;
	***REMOVED*** else {
        if(response)
            message.channel.send(noModMessage).then(mess => mess.delete({timeout: settings.autoDelDelay***REMOVED***));

		return false;
	***REMOVED***
***REMOVED***

function addEmojis(args, channel, guild){
    try{
        if(args[0] == "h"){                                      
            // Add emotes from links
            let emotes = args.split(" ");
            for(const url of emotes){
                if(url == "")
                    continue;

                guild.emojis.create(url, "new")
                    .then((e) => {
                        console.log(e.name + " added, yay!");
                        channel.send("Emoji <" + ((e.animated) ? "a" : "") + ":" + e.name + ":" + e.id + "> added!"); 
                    ***REMOVED***)
                    .catch((err) => {
                        console.log("Addemoji error: " + err.message);
                        channel.send("```Couldnt add emoji(s)!```"); 
                        log("Addemoji error:\n" + err.message);
                ***REMOVED***
            ***REMOVED***
        ***REMOVED*** else {
            // Add emotes from message
            let emotes = args.replace(/\s+/g, " ").split("<");
            for(const line of emotes){
                if(line == "")
                    continue;

                let emoji = line.slice(line.lastIndexOf(":") + 1, line.indexOf(">"));
                let emojiName = line.slice(line.indexOf(":") + 1, line.lastIndexOf(":"));
                let emojiUrl;

                if(line[0] == "a"){
                    // Animated
                    emojiUrl = "https://cdn.discordapp.com/emojis/" + emoji + ".gif";
                ***REMOVED*** else {
                    // Non-animated
                    emojiUrl = "https://cdn.discordapp.com/emojis/" + emoji + ".png";
                ***REMOVED***       
                guild.emojis.create(emojiUrl, emojiName)
                    .then((e) => {
                        console.log(e.name + " added, yay!");
                        channel.send("Emoji <" + ((e.animated) ? "a" : "") + ":" + e.name + ":" + e.id + "> added!"); 
                    ***REMOVED***)
                    .catch((err) => {
                        console.log("Addemoji error: " + err.message);
                        channel.send("```Couldnt add emoji(s)!```");
                        log("Addemoji error:\n" + err.message);
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
    ***REMOVED*** catch(err){
        console.log("Addemoji error: " + err);
        channel.send("```Couldnt add emoji(s)!```");
        log("Addemoji error:\n" + err.message);
    ***REMOVED***
***REMOVED***

function log(text, file = "log", line = null, funct = null){
    let d = new Date();
    let time = d.toLocaleTimeString();
    let printText = "[" + time + "]\n";

    if(line){
        printText += "Line: " + line + ((funct) ? ", " : "\n");
    ***REMOVED***
    if(funct){
        printText += "Function: " + funct + "\n";
    ***REMOVED***

    printText += text;

    fs.appendFileSync("temp/" + file + ".txt", printText, function(){***REMOVED***);
***REMOVED***

function getLine(){
    let e = new Error();
    let frame = e.stack.split("\n")[2***REMOVED***
    return frame.match(/:(\d+):/)[1***REMOVED***
***REMOVED***

function getFunc(){
    let e = new Error();
    let frame = e.stack.split("\n")[2***REMOVED***
    return frame.match(/at\s(.+)\s/)[1***REMOVED***
***REMOVED***

function delMessages(args, channel){
    let count = ((args) ? parseInt(args) : 1) + 1;

    if(isNaN(count)){
        channel.send("```Wrong argument```");
        return;
    ***REMOVED***

    if(count == 101)
        count = 100;

    if(count > 100){
        channel.send("```100 is max amount```");
        return;
    ***REMOVED***

    channel.bulkDelete(count, true).then(console.log("deleted " + (args) + " messages")).catch(console.error);
***REMOVED***

function sendDm(args, message, client){                 // Mess?
    if(!args){
        message.channel.send("```Message empty```").then(sent => sent.delete({timeout: settings.autoDelDelay***REMOVED***));
        return;
    ***REMOVED***
    let nick;
    let text = args;

    // Takes original nick (without id part), can be in double quotes or @tagging
    if(args.match("\"")){
        if(args.match("\"@")){
            args.replace("\"@", "");
        ***REMOVED*** else {
            args = args.substr(1);
        ***REMOVED***
        nick = args.slice(0, args.indexOf("\""));
        text = args.substr(args.indexOf("\"") + 2);
    ***REMOVED*** else {
        nick = args.substring(0, args.indexOf(" "));
        text = args.substr(args.indexOf(" ") + 1);
    ***REMOVED***

    client.users.fetch(nick.replace("<@","").replace(">","").replace("!","")).then((user) => {
        user.send(text).catch(err => {
            console.log(err);
            message.channel.send("```Cannot send message to this user```");
        ***REMOVED***).then(sent => {
            if(message.channel.type != "dm")
                message.delete({timeout: 1000***REMOVED***);    
    ***REMOVED***

        message.channel.send("```Sent```").then(sent => sent.delete({timeout: settings.autoDelDelay***REMOVED***));
    ***REMOVED***).catch((err) => {
        nick = nick.replace(/^@/, "");

        if(client.users.cache.find(user => user.username == nick) == null){
            help.commandHelp("dm", message.channel);
            // message.channel.send("```User not found (case sensitive, use original nick without numbers, put it in \"\" for nicknames with spaces)```");
            console.log(err);
            return;
        ***REMOVED***
        client.users.fetch(client.users.cache.find(user => user.username == nick).id).then((user) => {
            user.send(text).catch((err) => {
                console.log(err);
                message.channel.send("```Cannot send message to this user```");
            ***REMOVED***).then(sent => {
                if(message.channel.type != "dm")
                    message.delete({timeout: 1000***REMOVED***);    
        ***REMOVED***

            message.channel.send("```Sent```").then(sent => sent.delete({timeout: settings.autoDelDelay***REMOVED***));
        ***REMOVED***).catch((err) => {
            help.commandHelp("dm", message.channel);
            console.log(err);
    ***REMOVED***
***REMOVED***
***REMOVED***

// Kicks members that have only defined role and no others
// Every user has at least one role - "everyone"
// Doesnt work for roles names that start with @ but idc
function kickOnlyRole(message){
	let role = message.cleanContent.split(" ")[1***REMOVED***	
	role = role.replace(/^@/, "").toLowerCase();

    if(role != "everyone" && (!role.length || message.guild.roles.cache.find(guildRole => guildRole.name.toLowerCase() === role) == undefined)){
        message.channel.send("```Role not found```"); //.then(mess => mess.delete({timeout: settings.autoDelDelay***REMOVED***));
        return;
    ***REMOVED***

    let kickedCount = 0;
    message.guild.members.cache.forEach(member => {
		let roleCount = 0;
		member.roles.cache.each(memberRole => {
			if(roleCount > 2)
				return;

			roleCount++;
		***REMOVED***);
	
        if((roleCount == 1 && role == "everyone") || (roleCount == 2 && member.roles.cache.some(memberRole => memberRole.name.toLowerCase() == role.toLowerCase()))){
			console.log(member.user.username + " kicked");
            member.kick();
            kickedCount++;
        ***REMOVED***
***REMOVED***

    message.channel.send(("```"+ kickedCount + " members were kicked```"));
***REMOVED***

function saveImages(message){
    message.channel.messages.fetch({limit: parseInt(args)***REMOVED***).then(messages => {
        const path = "data/pics/";
        let savedCount = 0;

        if(!fs.existsSync(path)){
            fs.mkdirSync(path);
        ***REMOVED***

        messages.forEach(mess => {
            mess.attachments.forEach((pic) => {
                savedCount++;
                request.get(pic.url)
                    .on('error', console.error)
                    .pipe(fs.createWriteStream(path + Date.now() + pic.filename));      // Write file to the system synchronously
        ***REMOVED***
    ***REMOVED***
        message.channel.send("Saved " + savedCount + " pics");
    ***REMOVED***).catch((err) => {
        console.log(err);
        log("saveImages error:\n" + err.message);
        message.channel.send("```I just dont know what went wrong!```");
***REMOVED***
***REMOVED***

***REMOVED***
    sendToChannel,
    reactions,
    countDown,
    autoPin,
    isAdmin,
    privateDmMessage,
    polls,
    emotesCount,
    emotesShow,
    log,
    rate,
    getLine,
    getFunc,
    addEmojis,
    sendDm,
    kickOnlyRole,
    saveImages,
    delMessages,
    russianRoulette
***REMOVED***


// //https://dict.emojiall.com/cs/emoji/🇵###          https://emojipedia.org/regional-indicator-symbol-letter-m/
//"<@!" + author.id + ">"       tag
//message.reply
// AIzaSyCtIhS3GB4x_siyzb7kcxs_MRnQMiBSIAM - google api
// Njg0MDA0ODc1MTM4MzY3NDg5.XlzzQA.0huYRrLbk2VH2PAskiBCSySUJYk      - token
//const attach = new discord.Attachment("http://images6.fanpop.com/image/photos/36600000/My-Little-Pony-Friendship-is-Magic-image-my-little-pony-friendship-is-magic-36659156-1024-576.png");
//message.mentions.users, returns a map

//add attachement 
//pinChannel.send(mess.content, {files: [files]***REMOVED***);
