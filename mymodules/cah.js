const fs = require("fs");
const discord = require("discord.js");
const mine = require("./misc");

const guide = `**Commands:**\n All commands must have '_cah' prefix\n\n **join** - joins you to game\n **start** - starts game\n **players** - see joined players\n **set/settings** - see settings\n **packs** - see packs\n **leave** - leaves game\n **end** - ends game (game master or mods only)\n **kick @player** - kicks player (game master or mods only)\n\n Tips:\n Its possible to change answers before all players picked\n You can choose only one blank at time`;
const settingsInfo = `**Avaible settings**:\n\n **blanks** - on/off *(on default)*\n **triples** - on/off *(on default)*\n **throwhand** - on/off *(on default)*\n **cards** - x *(12 default)*\n **points** - x *(10 default)*\n **packs** - official/unofficial/both *(both default)*\n\n **Syntax:** _cah set *type* *option*\n **Example:** _cah set triples off`;

// Add if afk player to checkIfPlayersReady() ?
// More cahpacks?
// Only one blank can be chosen at time

const officialPack = JSON.parse(fs.readFileSync("data/cah/official.json", "utf8", function(){***REMOVED***));
const unofficialPack = JSON.parse(fs.readFileSync("data/cah/unofficial.json", "utf8", function(){***REMOVED***));


function help(channel){
    embed = new discord.MessageEmbed().setDescription(guide).setTitle("Guide");
    channel.send(embed);
***REMOVED***

function settingsHelp(channel){
    embed = new discord.MessageEmbed().setDescription(settingsInfo).setTitle("Settings");
    channel.send(embed);
***REMOVED***

function cardsAgainstHumanity(channel, modroles){
    // https://crhallberg.com/cah/
    // https://dict.emojiall.com/cs/emoji/🇵###             https://emojipedia.org/regional-indicator-symbol-letter-m/
    const emojis = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯", "🇰", "🇱", "🇲", "🇳", "🇴"***REMOVED***
    const Xemoji = "❎";                                  // alt ❌
    const blankemoji = "🅱️";

    ***REMOVED***
        return !user.bot;
    ***REMOVED***

    const messFilter = (user) => {
        return !user.author.bot;
    ***REMOVED***

    let devMode = true;

    let historyBlackcards = [***REMOVED***
    let nextRoundTimeout;
    let thisRound;
    let afkGameTimeout = setTimeout(() => this.end(), 1800 * 1000); 
    let started = false;
    this.players = [***REMOVED***
    
    this.cahSwitch = function(args, message){
       // mine.log("text", undefined, mine.getLine(), mine.getFunc());
        let player = message.member;

		let embed;
        clearTimeout(afkGameTimeout);
        afkGameTimeout = setTimeout(() => this.end(), 1800 * 1000);
        args = args.split(" ");

        switch(args[0].toLowerCase()){
            case "join":
                this.join(player);
                break;
            case "start":
                if(this.players.length <= 1){
                    channel.send("```No players!```");
                    return;
                ***REMOVED***

                if(!started){
                    this.start();
                    started = true;
                ***REMOVED***
                break;
            case "leave":
                this.leave(player);
                break;
            case "kick":
                if(player.id != this.settings.adminId && !mine.isAdmin(message, modroles))
                    return;

                this.leave(player, args[1]);
                break;
            case "end":
                if(player.id != this.settings.adminId && !mine.isAdmin(message, modroles))
                    return false;

                this.end();
                return true;
            case "checkround":
                if(player.id != this.settings.adminId && !mine.isAdmin(message, modroles))
                    return;

                this.checkIfPlayersReady();
                break;
            case "players": case "score":
                embed = new discord.MessageEmbed().setTitle("Scoreboard:").setDescription("\n\n" + this.generateTable());
				channel.send(embed);
                break;
            case "packs":
                let offcialOn = (this.settings.packs[0] == officialPack) ? "On" : "";
                let unofficialOn = (this.settings.packs[0] == unofficialPack) ? "On" : "";
                let bothOn = (this.settings.packs.length == 2) ? "On" : "";
                let packsInfo = ` **Packs avaible:**\n\n official ${offcialOn***REMOVED***\n unofficial ${unofficialOn***REMOVED***\n both ${bothOn***REMOVED***\n `;

                embed = new discord.MessageEmbed().setDescription(packsInfo).setTitle("Use cah set packs 'option'");
                channel.send(embed);
                break;
            case "set":
                if(player.id != this.settings.adminId && !mine.isAdmin(message, modroles))
                    return;

                if(args.length < 3)
                    return;

                switch(args[1]){
                    case "blanks":
                        if(args[2] == "on" || args[2] == "true"){
                            this.settings.blankOn = true;
                            channel.send("```Blank cards enabled.```");
                        ***REMOVED*** else if(args[2] == "off" || args[2] == "false"){
                            this.settings.blankOn = false;
                            channel.send("```Blank cards disabled.```");
                        ***REMOVED*** else {
                            channel.send("```Wrong argument```");
                        ***REMOVED***
                        break;
                    case "triples":
                        if(args[2] == "on" || args[2] == "true"){
                            this.settings.triplesOn = true;
                            channel.send("```Triple picks enabled.```");
                        ***REMOVED*** else if(args[2] == "off" || args[2] == "false"){
                            this.settings.triplesOn = false;
                            channel.send("```Triple picks disabled.```");
                        ***REMOVED*** else {
                            channel.send("```Wrong argument```");
                        ***REMOVED***
                        break;
                    case "throwhand":
                        if(args[2] == "on" || args[2] == "true"){
                            this.settings.throwHand = true;
                            channel.send("```Throwhand enabled.```");
                        ***REMOVED*** else if(args[2] == "off" || args[2] == "false"){
                            this.settings.throwHand = false;
                            channel.send("```Throwhand disabled.```");
                        ***REMOVED*** else {
                            channel.send("```Wrong argument```");
                        ***REMOVED***
                        break;
                    case "cards":
                        if(isNaN(args[2]) || args[2] > 15){
                            channel.send("```Wrong argument```");
                        ***REMOVED*** else {
                            this.settings.cardsCount = args[2***REMOVED***
                            channel.send("```Cards count set to " + args[2] + ".```");
                        ***REMOVED***
                        break;
                    case "points":
                        if(isNaN(args[2]) || args[2] > 50){
                            channel.send("```Wrong argument```");
                        ***REMOVED*** else {
                            this.settings.winPoints = args[2***REMOVED***
                            channel.send("```Points to win set to " + args[2] + ".```");
                        ***REMOVED***
                        break;
                    case "packs":
                        if(started){
                            channel.send("```Cannot change packs settings after game has started```");
                            break;
                        ***REMOVED***

                        switch(args[2]){
                            case "official":
                                this.settings.packs = [officialPack***REMOVED***
                                break;
                            case "unofficial":
                                this.settings.packs = [unofficialPack***REMOVED***
                                break;
                            case "both":
                                    this.settings.packs = [officialPack, unofficialPack***REMOVED***
                                break;
                            default:
                                channel.send("```Wrong argument```");
                            ***REMOVED***
                        break;
                ***REMOVED***
                break;
                // Settings end
            default:
                channel.send("```Wrong command```");
                break;
        ***REMOVED***
    ***REMOVED***
    
    this.settings = {
        round: 0,
        activeBlackcard: "",
        playersIdList: [],
        czar: 0,
        activePlayers: 0,
        end: false,
        adminId: 0,
		// Real settings
        maxPlayers: 10,
        roundDelay: (devMode) ? 5000 : 10000,
        answerDelay: (devMode) ? 40000 : 80000,
        packs: [officialPack, unofficialPack],
        cardsCount: 12,
        winPoints: 10,
        blankOn: true,
        throwHand: true,
        triplesOn: true,
    ***REMOVED***

    this.player = function(discordPlayer){              // Type member
        this.nick = discordPlayer.displayName;
        this.id = discordPlayer.id;
        this.cards = [***REMOVED***
        this.points = 0;
        this.discordPlayer = discordPlayer;       
        this.activeCards = [***REMOVED***
        this.answerEmoji = "";
        this.tempAnswer = "";
        this.activeBlanks = 0;
        this.ready = (started) ? true : false;
        this.afk = (started) ? true : false;
        this.canThrowHand = true;
        this.playerAlert = null;
        this.collector = null;
        this.blanksUsed = 0;
    ***REMOVED***

    this.generateBlackcard = function(){
        let pack = this.settings.packs[Math.trunc(Math.random() * this.settings.packs.length)***REMOVED***
        let blackcard;

        do {
            blackcard = pack.blackCards[Math.trunc(Math.random() * pack.blackCards.length)***REMOVED***
        ***REMOVED*** while(historyBlackcards.filter(card => card == blackcard).length || (!this.settings.triplesOn && blackcard.pick == 3));

        blackcard.text = this.replaceHTMLtags(blackcard.text.replace(/(\S)_/g,"$1 _").replace(/_/g, "\\_"));

        // Repairing that sometimes pick property is wrong
        if(blackcard.text.match("_") != null){
            blackcard.pick = blackcard.text.match(/_/g).length;
        ***REMOVED***

        historyBlackcards.push(blackcard);

        return blackcard;
    ***REMOVED***
    this.generateWhitecard = function(player){               
        let pack = this.settings.packs[Math.trunc(Math.random() * this.settings.packs.length)***REMOVED***
        let whitecard;

        do {
            whitecard = this.replaceHTMLtags(pack.whiteCards[Math.trunc(Math.random() * pack.whiteCards.length)], false).slice(0, -1);
        ***REMOVED*** while(player.cards.filter(card => card == whitecard).length)

        return whitecard;
    ***REMOVED***

    this.replaceHTMLtags = function(text, blackcard = true){
        if(blackcard){
            text = text.replace(/<br>|<br\/>/gi, "\n");
            text = text.replace(/<b>|<\/b>/gi, "**");
            text = text.replace(/<i>|<\/i>/gi, "*");
        ***REMOVED***

        text = text.replace(/<.*?>/gi, "");
        text = text.replace(/&gt;/gi, ">").replace(/&lt;/gi, "<").replace(/&amp;/gi, "&").replace(/&quot;/gi, "'").replace(/&reg;/gi, "®").replace(/&trade;/gi, "™");

        return text;
    ***REMOVED***
    
    this.join = function(discordPlayer){                             
        if(this.isInGame(discordPlayer) || this.players.length == this.settings.maxPlayers)        
            return false;

        let newPlayer = new this.player(discordPlayer);
        this.settings.playersIdList.push(newPlayer.id);
        this.fillHand(newPlayer);
        this.players.push(newPlayer);

        let embed = new discord.MessageEmbed().setDescription(newPlayer.nick + " joined game (" + (this.players.length) + "/" + this.settings.maxPlayers + ")")
        channel.send(embed);

        if(this.players.length == 1)
            this.settings.adminId = discordPlayer.id;

        devMode && console.log("*\nPLAYER JOINED\n*");
		return true;
    ***REMOVED***

    this.leave = function(member, kickedTag = ""){
        // if kickedTag exist kick this player, otherwise member is leaving
        let kicked = false;
        let leavePlayerId;

        if(kickedTag){
            // Kick
            leavePlayerId = kickedTag.match(/<@!?(\d+)>/i)[1***REMOVED***

            this.players = this.players.filter(player => {
                if(player.discordPlayer.id == leavePlayerId){                      // <@!530704313581043713> = mention
                    kicked = true;
                    return false;
                ***REMOVED***
                return true;
        ***REMOVED***

            if(!kicked){
                let embed = new discord.MessageEmbed().setDescription(kickedTag + " not found");
                channel.send(embed);
                return;
            ***REMOVED***

            let embed = new discord.MessageEmbed().setDescription(kickedTag + " was kicked!");
            channel.send(embed);
        ***REMOVED*** else {
            // Leave
            leavePlayerId = member.id;

            this.players = this.players.filter(gamePlayer => {
                return gamePlayer.discordPlayer != member;
        ***REMOVED***

            let embed = new discord.MessageEmbed().setDescription(member.toString() + " left the game!");
            channel.send(embed);
        ***REMOVED***

        if(this.players.length < 2){
            this.end();
            return;
        ***REMOVED***

        // Set new czar if kicked player is czar
        if(typeof this.players[this.settings.czar] == "undefined"){
            this.settings.czar++;
            if(this.settings.czar == this.players.length){
                this.settings.czar = 0;
            ***REMOVED***
        ***REMOVED***

        if(member.id == this.settings.adminId){
            let random = Math.floor(Math.random() * this.players.length);
            this.settings.adminId = this.players[random].id;

            let embed = new discord.MessageEmbed().setDescription(this.players[random].discordPlayer.user.toString() + " is the new game master!");
            channel.send(embed);
        ***REMOVED***

        this.checkIfPlayersReady();
    ***REMOVED***
    
    this.start = function(){
        this.nextRound();
    ***REMOVED***

    this.end = function(){
        this.settings.end = true;
        this.players = [***REMOVED***

        clearTimeout(nextRoundTimeout);

        let embed = new discord.MessageEmbed().setTitle("Game Ended").setDescription("\n\n" + this.generateTable());
        channel.send(embed);

        return;
    ***REMOVED***
	
	this.generateTable = function(){
        let table = "";

        if(!this.players.length)
            return "No players!";

        for(let i = 0; i < this.players.length; i++)
            table += this.players[i].nick + ": **" + this.players[i].points + "**\n";

		return table;
	***REMOVED***
    
    this.cleanRound = function(){
        // Renew cards, clear player temps
        for(let i = 0; i < this.players.length; i++){
            if(!this.players[i].afk){
                // Replace old cards
                this.players[i].cards = this.players[i].cards.filter(card => {
                    for(let j = 0; j < this.players[i].activeCards.length; j++)
                        if(card == this.players[i].activeCards[j])
                            return false;
                    return true;
            ***REMOVED***

                for(let j = 0; j < this.players[i].activeCards.length - this.players[i].activeBlanks; j++)
                    this.players[i].cards.splice(this.settings.cardsCount - (this.activeBlackcard.pick + 1 - this.players[i].activeBlanks), 0, this.generateWhitecard(this.players[i]));
            ***REMOVED***

            clearTimeout(this.players[i].playerAlert);

            this.players[i].activeCards = [***REMOVED***
            this.players[i].ready = false;
            this.players[i].activeBlanks = 0;
            this.players[i].collector = null;
            this.players[i].playerAlert = null;
            this.players[i].tempAnswer = "";
            this.players[i].answerEmoji = "";
        ***REMOVED***

        this.settings.czar++;

        if(this.settings.czar == this.players.length)
            this.settings.czar = 0;

        this.settings.activePlayers = 0;
    ***REMOVED***
    
    this.nextRound = function(){
        devMode && console.log("***** New round *****");

        this.cleanRound();
        this.activeBlackcard = this.generateBlackcard();
        let picks = "Pick " + this.activeBlackcard.pick + " card" + (this.activeBlackcard.pick > 1 ? "s" : "") + ".";

        let embed = new discord.MessageEmbed()
            .setTitle("New Round")
            .setDescription(this.generateTitleText(this.activeBlackcard) + picks);

        channel.send(embed);
        // Send to players
        thisRound = this.settings.round;

        for(let i = 0; i < this.players.length; i++){
            this.sendQuestion(this.players[i]);
        ***REMOVED***
    ***REMOVED***

    this.fillHand = function(player){
        for(let i = (this.settings.blankOn) ? 1 : 0; i < this.settings.cardsCount; i++){
            player.cards.push(this.generateWhitecard(player));
        ***REMOVED***

        if(this.settings.blankOn)
            player.cards.push("___");
    ***REMOVED***
    
    this.checkIfPlayersReady = function(){
        for(let i = 0; i < this.players.length; i++){
            if(!this.players[i].ready)
                return false;
        ***REMOVED***

        this.allPlayersPicked();
        return true;
    ***REMOVED***
    
	this.generateTitleText = function(){
        return this.players[this.settings.czar].discordPlayer.user.toString() + " is czar for this round.\n\n" + this.activeBlackcard.text + "\n\n";
    ***REMOVED***

    this.isInGame = function(player){
        if(this.players.filter(gamePlayer => gamePlayer.discordPlayer == player).length){
            return true
        ***REMOVED*** else {
            return false;
        ***REMOVED***
    ***REMOVED***
	
    this.waitForBlank = async function(discordPlayer){
        let blank;

        await discordPlayer.createDM().then(async channel => {
            await channel
                .awaitMessages(messFilter, {max: 1, time: this.settings.answerDelay - 20000***REMOVED***)
                    .then(collected => {
                        const mess = collected.first();
                        blank = mess.content;
                    ***REMOVED***).catch(err => {
                        if(devMode){
                            mine.log("Player didnt answer blank:" + err.message, undefined, mine.getLine(), mine.getFunc());
                            console.log("Player didnt answer blank:");
                            console.log(err);
                        ***REMOVED***

                        return "";
                ***REMOVED***
    ***REMOVED***

        return blank;
    ***REMOVED***
    
    this.allPlayersPicked = function(){
        if(thisRound != this.settings.round)
            return;

        for(let i = 0; i < this.players.length; i++){
            this.players[i].collector.stop();

            devMode && mine.log("collector stopped for: " + this.players[i].nick + "", undefined, mine.getLine(), mine.getFunc());   
        ***REMOVED***
        
        devMode && console.log("All players picked");

        this.settings.round++;
        const czarId = this.players[this.settings.czar].id;
        const czar = this.players[this.settings.czar].discordPlayer.user.toString();

        const czarFilter = (reaction, user) => {
            return (user.id == czarId && emojis.filter((emoji, index) => {
                return (index < this.settings.activePlayers && reaction.emoji.name == emoji)
            ***REMOVED***).length);
        ***REMOVED***

        // Create embed for picking card
        let _found = (this.activeBlackcard.text.match("_") == null) ? false : true;
        let text = this.activeBlackcard.text + "\n\n";
        let temp;
        let history = [***REMOVED***
        let afkPlayers = 0;

        if(!this.activeBlackcard){
            channel.send("```Round skipped.```");
            this.nextRound();
        ***REMOVED***

        for(let i = 0; i < this.players.length; i++){
            temp = this.activeBlackcard.text;
            // Randomize players
            do{
                randomed = Math.floor(Math.random() * this.players.length);
            ***REMOVED*** while(history.filter(player => player == randomed).length)

            if(this.players[randomed].afk){          
                afkPlayers++;   
                continue;
            ***REMOVED***

            if(_found){
                for(let o = 0; o < this.players[randomed].activeCards.length; o++){
                    temp = temp.replace("\\_", "**" + this.players[randomed].activeCards[o] + "**");
                ***REMOVED***
                text += emojis[i - afkPlayers] + " " + temp + "\n\n";
            ***REMOVED*** else {
                temp += " **" + this.players[randomed].activeCards.join(" ") + "**"; 
                text += emojis[i - afkPlayers] + " **" + this.players[randomed].activeCards.join(" ") + "**\n\n";
            ***REMOVED***

            this.players[randomed].tempAnswer = temp;
            this.players[randomed].answerEmoji = emojis[i - afkPlayers***REMOVED***
            history.push(randomed);
        ***REMOVED***

        if(this.players.length == afkPlayers){
            channel.send("```Round skipped.```");
            this.nextRound();
        ***REMOVED***

        let embed = new discord.MessageEmbed().setDescription(czar + " is picking\n\n" + text);
        // Sending Czar question to main channel
        channel.send(embed)
            .then(m => {
            // Czar picking message
                for(let o = 0; o < this.settings.activePlayers; o++)
                    m.react(emojis[o]);
                // waiting for czar pick
                let collector = m.createReactionCollector(czarFilter, { time: this.settings.answerDelay + 20000, max: 1***REMOVED***);

                collector.on("collect", r => { 
                    if(this.settings.end)
                        return;
                    
                    if(devMode){
                        mine.log("CZAR REACTED", undefined, mine.getLine(), mine.getFunc());
                        console.log("CZAR REACTED");                
                    ***REMOVED***

                    for(let o = 0; o < this.players.length; o++)
                        // CZAR PICKED ANSWER
                        if(r.emoji.name == this.players[o].answerEmoji){            
                            this.players[o].points++;
                            let title = "Round Winner is:";
                            let text = this.players[o].discordPlayer.user.toString() + " (picked by " + czar + ")\n\n" + this.players[o].tempAnswer + "\n\n**Scoreboard:**\n" + this.generateTable() + ((this.players[o].points == this.settings.winPoints) ? "" : "\n\nNext round in " + this.settings.roundDelay/1000 + " seconds.");
                            
                            let embed = new discord.MessageEmbed().setTitle(title).setDescription(text);
                            channel.send(embed);

                            // m.reactions.removeAll();
                            if(this.players[o].points == this.settings.winPoints){                  // Player won
                                let embed = new discord.MessageEmbed().setTitle("Game Ended").setDescription(this.players[o].discordPlayer.user.toString() + " is Winner!." + "\n\n" + this.generateTable());
                                channel.send(embed);
                                this.settings.end = true;
                            ***REMOVED***

                            nextRoundTimeout = setTimeout(() => this.nextRound(), this.settings.roundDelay);
                        ***REMOVED***
            ***REMOVED***

                collector.on("end", collected => {
                    // m.reactions.removeAll();
                    if(this.settings.end || thisRound != this.settings.round)
                        return;

                    if(collected.size == 0){
                        devMode && console.log("Czar collected size is 0")

                        // AFK CZAR
                        for(let i = 0; i < this.players.length; i++){
                            this.players[i].activeCards = [***REMOVED***
                            this.players[i].ready = false;
                        ***REMOVED***

                        let embed = new discord.MessageEmbed().setDescription("Czar **" + czar + "** is AFK, round skipped");
                        channel.send(embed);
                        this.settings.czar++;

                        if(this.settings.czar == this.players.length){
                            this.settings.czar = 0;
                        ***REMOVED***

                        this.settings.activePlayers = 0;
                        nextRoundTimeout = setTimeout(() => this.nextRound(), this.settings.roundDelay);
                    ***REMOVED***
            ***REMOVED***
        ***REMOVED***
            // Czar picking message END
    ***REMOVED***

    this.sendQuestion = function(player){
        if(player == this.players[this.settings.czar] && !devMode)
            return;

        let cards = "";
        let afterpickMessageId;
        let picks = "Pick " + this.activeBlackcard.pick + " card" + (this.activeBlackcard.pick > 1 ? "s" : "") + ".";
        
        for(let i = 0; i < player.cards.length; i++){
            cards += ((this.settings.blankOn && i + 1 == player.cards.length) ? blankemoji : emojis[i]) + " " + player.cards[i] + "\n";
        ***REMOVED***

        if(player.canThrowHand && this.settings.throwHand){
            cards += "\n" + Xemoji + " throw entire hand\n";
        ***REMOVED***

        let playerText = this.generateTitleText() + cards + "\n\n" + picks;
        let playerEmbed = new discord.MessageEmbed().setDescription(playerText);

        player.playerAlert = setTimeout(() => {
            devMode && console.log("TIMEOUT for " + player.nick);

            if(this.isInGame(player.discordPlayer)){
                let embed = new discord.MessageEmbed().setDescription("You have only " + (20) + " seconds to answer.");
                player.discordPlayer.send(embed);
            ***REMOVED***
        ***REMOVED***, this.settings.answerDelay - 20000);

        player.discordPlayer.send(playerEmbed)
            .then(m => {
            // Question sent to player
                for(let o = 0; o < player.cards.length; o++)
                    m.react((this.settings.blankOn && o + 1 == player.cards.length) ? blankemoji : emojis[o]);

                if(player.canThrowHand && this.settings.throwHand)
                    m.react(Xemoji);

                let answers = 0;
                let blank = "";
                player.collector = m.createReactionCollector(filter, { time: this.settings.answerDelay, dispose: true ***REMOVED***);

                player.collector.on('collect', async(r) => {                                     // Waiting for players picks
                    if(this.settings.end)
                        return;
                    // Throwing hand
                    if(r.emoji.name == Xemoji && player.canThrowHand && this.settings.throwHand){
                        player.cards = [***REMOVED***
                        this.fillHand(player);
                        player.canThrowHand = false;
                        this.sendQuestion(player);
                        return;
                    ***REMOVED***
            
                    if(player.ready)                                                            // Player answered already
                        return;

                    if(devMode){
                        mine.log("Player " + player.nick + " REACTED", undefined, mine.getLine(), mine.getFunc());
                        console.log("Player " + player.nick + " REACTED");
                    ***REMOVED***

                    for(let o = 0; o < player.cards.length; o++){
                        if(r.emoji.name == emojis[o] || player.cards.length == o + 1){
                            // Player picked blank
                            if(r.emoji.name == blankemoji && this.settings.blankOn){      
                                if(devMode){
                                    mine.log("BLANK PICKED", undefined, mine.getLine(), mine.getFunc());
                                    console.log("BLANK PICKED");
                                ***REMOVED***

                                player.discordPlayer.send(new discord.MessageEmbed().setDescription("Enter blank card:"));
                                blank = await this.waitForBlank(player.discordPlayer);
                                player.blanksUsed++;
                                player.activeBlanks++;
                                
                                if(!blank){
                                    player.afk = true;
                                    player.ready = true;
                                    this.checkIfPlayersReady();
                                    return;
                                ***REMOVED***

                                if(this.settings.end)
                                    return;
                            ***REMOVED***
    
                            answers++;

                            if(devMode){
                                console.log("answers picked: "+answers);
                                console.log("need to answer: "+this.activeBlackcard.pick);
                            ***REMOVED***

                            if(blank){
                                player.activeCards.push(blank);     
                            ***REMOVED*** else {
                                player.activeCards.push(player.cards[o]);       // Make sure its not repeated?   - takes answers from old messages too
                            ***REMOVED***

                            devMode && console.log("Active cards: " + player.activeCards);

                            if(answers == this.activeBlackcard.pick){
                                devMode && console.log("player answered");
                                // Player answered
                                clearTimeout(player.playerAlert);

                                let embed = new discord.MessageEmbed()
                                    .setDescription("You picked: **" + (player.activeCards.join(", ") + "**\nBack to the channel " + channel.toString()));

                                player.discordPlayer.send(embed).then(mess => {
                                    afterpickMessageId = mess.id;
                            ***REMOVED***

                                player.ready = true;
                                player.afk = false;
                                this.settings.activePlayers++;
                                this.checkIfPlayersReady();
                            ***REMOVED***

                            return;
                        ***REMOVED***
                    ***REMOVED***
            ***REMOVED***

            player.collector.on("end", collected => {
                if(this.settings.end || thisRound != this.settings.round)
                    return;

                if(!this.isInGame(player.discordPlayer) || player.ready)
                    return;

                if(devMode){
                    mine.log("Player " + player.nick + " is afk", undefined, mine.getLine(), mine.getFunc());
                    console.log("Player " + player.nick + " IS AFK");
                ***REMOVED***

                player.discordPlayer.send("```You were skipped this round.```");
                player.afk = true;
                player.ready = true;
                
                this.checkIfPlayersReady();
        ***REMOVED***
            
            player.collector.on("remove", removed => {
                if(thisRound != this.settings.round)
                    return;

                if(devMode){
                    mine.log("reaction removed: " + removed.emoji.name , undefined, mine.getLine(), mine.getFunc());
                    console.log("reaction removed: " + removed.emoji.name);
                ***REMOVED***

                if(player.ready){
                    player.ready = false;
                    this.settings.activePlayers--;

                    m.channel.messages.fetch(afterpickMessageId).then(mess => {
                        let embed = new discord.MessageEmbed().setDescription("Answer changed!");

                        mess.edit(embed);
                ***REMOVED***
                ***REMOVED***

                answers--;

                if(blank && removed.emoji.name == blankemoji){
                    player.activeCards = player.activeCards.filter(card => {
                        return card != blank
                ***REMOVED***

                    blank = "";
                    player.blankActive--;
                ***REMOVED*** else {
                    for(let o = 0; o < player.cards.length; o++){
                        if(removed.emoji.name == emojis[o]){
                            player.activeCards = player.activeCards.filter(card => {
                                return card != player.cards[o]
                        ***REMOVED***
                        ***REMOVED***
                    ***REMOVED***
                ***REMOVED***

                if(devMode){
                    console.log("activecards for " + player.nick);
                    console.log(player.activeCards);
                ***REMOVED***
        ***REMOVED***
        ***REMOVED***).catch(err => {
            // Kick no DM player from game
            let embed = new discord.MessageEmbed().setDescription(player.discordPlayer.user.toString() + " you need to allow private DMs to play.");

            if(devMode){
                mine.log("Kicked no DM player from game:" + err.message, undefined, mine.getLine(), mine.getFunc());
                console.log("Kicked no DM player from game");
                console.log(err);
            ***REMOVED***

            channel.send(embed);
            this.leave({***REMOVED***, player.discordPlayer.toString());
    ***REMOVED***     
    // Question to player End
    ***REMOVED***
***REMOVED***

***REMOVED***
    cardsAgainstHumanity,
    help,
    settingsHelp
***REMOVED***
