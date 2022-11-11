const mine = require("./misc.js");

// TODO add reaction for click-repeat, change answers to reactions?

let beginingId;

async function duel(args, guild, author, channel, client){
    let p1Answer = "", p2Answer = "", fail = false;
    const filter = (m) => {
        return client.user.id != m.author.id;
    ***REMOVED***

    let opponent = args;
    let opponentName;

    channel.send("It begins...").then(mess => {
        beginingId = mess.id;
***REMOVED***

    //second user
    await client.users.fetch(opponent.replace("<@","").replace(">","").replace("!", "")).then(async (user) => {
        opponentName = user.username;
        await user.send("**" + author.username + "**" + " has started rock-papers-scissors duel with you, you have 60 seconds to answer, play with:\r\nrock (r)\r\npaper (p)\r\nscissors (s), write your answer and press enter").then(() => {
            user.createDM().then(chan => {
                chan
                .awaitMessages({filter: filter, max: 1, time: 60000***REMOVED***)
                .then(collected => {
                    user.send(guild.channels.cache.get(channel.id).toString());
                    const mess = collected.first();
                    p2Answer = mess.content.substring(0, 1).toLowerCase();

                    if(p2Answer != "r" && p2Answer != "s" && p2Answer != "p"){
                        channel.send(opponent + " doesnt know how to play, duel over :dizzy_face:");
                        clearInterval(waitingForPlayers);
                    ***REMOVED***
                ***REMOVED***).catch(err => {
                    console.log(err);
                    fail = true;
                    channel.send(opponent + " didnt react in time, duel over :dizzy_face:");
                    clearInterval(waitingForPlayers);
            ***REMOVED***
            ***REMOVED***).catch(err => {
                fail = true;
                console.log(err)
        ***REMOVED***
        ***REMOVED***).catch(err => {
            channel.messages.fetch(beginingId).then(mess => {
                mess.edit("It begins... nevermind");
        ***REMOVED***

            fail = true;
            channel.send("```" + mine.privateDmMessage(opponentName) + "```");
            clearInterval(waitingForPlayers);
    ***REMOVED***
    ***REMOVED***).catch(err => {
        if(!fail){
            console.log(err);
            channel.send("```Cannot find this user```");
            fail = true;
        ***REMOVED***
***REMOVED***

    if(fail)
        return;
        
    //author
    author.send("you started rock-papers-scissors duel with **" + opponentName + "**, you have 60 seconds to answer, play with:\r\nrock (r)\r\npaper (p)\r\nscissors (s), write your answer and press enter").then(() => {
        author.createDM().then(chan => {
            chan
            .awaitMessages({filter: filter, max: 1, time: 60000***REMOVED***)
            .then(collected => {
                author.send(guild.channels.cache.get(channel.id).toString());
                const mess = collected.first();
                p1Answer = mess.content.substring(0,1).toLowerCase();

                if(p1Answer != "r" && p1Answer != "s" && p1Answer != "p"){
                    channel.send("<@!" + author.id + ">" + " doesnt know how to play, duel over :dizzy_face:");
                    clearInterval(waitingForPlayers);
                ***REMOVED***
            ***REMOVED***).catch(err => {
                console.log(err);
                channel.send("<@!" + author.id + ">" + " didnt react in time, duel over :dizzy_face:");
                clearInterval(waitingForPlayers);
        ***REMOVED***
        ***REMOVED***).catch(err => console.log(err));
    ***REMOVED***).catch(err => console.log(err));
    //waiting interval
    let waitingForPlayers = setInterval(function(){
        if(p1Answer == "" || p2Answer == "")
            return;

        let result = "";
        if(p1Answer == p2Answer){
            result = "draw";
        ***REMOVED*** else {
            if((p1Answer == "r" || p2Answer == "r") && (p1Answer == "s" || p2Answer == "s"))
                result = "r";
            if((p1Answer == "p" || p2Answer == "p") && (p1Answer == "r" || p2Answer == "r"))
                result = "p";
            if((p1Answer == "s" || p2Answer == "s") && (p1Answer == "p" || p2Answer == "p"))
                result = "s";
        ***REMOVED***

        let resultString = ((p1Answer == result) ? ("<@!" + author.id + ">") + " wins" : opponent + " wins") + " :trophy:";

        if(result == "draw"){
            resultString = "its a draw";
        ***REMOVED***

        let weapons = {
            r: "rock",
            s: "scissors",
            p: "paper"
        ***REMOVED***

        channel.send("<@!" + author.id + ">" + " chose " + weapons[p1Answer] + ", " + opponent + " chose " + weapons[p2Answer] + "\r\n" + resultString);
        clearInterval(waitingForPlayers);
    ***REMOVED***, 1000);
***REMOVED***

***REMOVED***
    duel
***REMOVED***