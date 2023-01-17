const settings = require("../settings");
const discord = require("discord.js");

function help(channel){
    let embed = new discord.MessageEmbed()
        // .addField(settings.prefix + "addemote", "Adds emote to server, accepts links and emotes, accepts multiple arguments split by space")
        .addField(settings.prefix + "q", "Random quote")
        .addField(settings.prefix + "cn", "Chuck Norris joke")
        .addField(settings.prefix + "s", "Simpsons quote")
        .addField(settings.prefix + "glados", "GLaDOS congratulations")
        .addField(settings.prefix + "remind *message* ;time", "Bot will DM you your message after time passes, m - mins, h - hours, d - days, example: '*" + settings.prefix + "remind regret life choices ;1h 10m*'")
        .addField(settings.prefix + "duel user", "Will start rock-paper-scissors with chosen user")
        .addField(settings.prefix + "random *X*", "Picks random *X*, default is 2")
        .addField(settings.prefix + "toss", "Head or Tails")
        .addField(settings.prefix + "movie", "Movie info, can can specify year after ';', example: '*" + settings.prefix + "movie freaks ;2018*'")
        .addField(settings.prefix + "movief", "Same as movie but full version")
        .addField(settings.prefix + "search", "Search for movies")
        .addField(settings.prefix + "setban *X*", "Sets autoban after user leaves **X** is number of days, 24 days is maximum")
        .addField(settings.prefix + "cd/countdown", "Countdowns from 3 to 0")
        // .addField(settings.prefix + "del *X*", "Deletes *X* number of messages, without argument it deletes one message")
        .addField(settings.prefix + "defaultrole", "Default role added to new server member, example: " + settings.prefix + "defaultrole peasant")
        .addField(settings.prefix + "def, syn, sug, rhyme", "Definition of a word\nsynonyms\nsuggestions\nrhymes with word")
        .addField(settings.prefix + "tr *message* ;from into", "Translate, example: '*" + settings.prefix + "tr hello ;english spanish*'\nuse '" + settings.prefix + "trlist' for list of supported languages")
        .addField(settings.prefix + "c/confess *message*", "(can use Bots DM) Sends your message annonymously into confession room")
        .addField(settings.prefix + "announce *message*", "(can use Bots DM) Sends your message annonymously into announce room")
        .addField(settings.prefix + "dm user *message*", "(can use Bots DM) Sends your message annonymously into chosen user DMs, use their main nickname and double quotes for names with spaces - \"hell bot\"")
        .addField(settings.prefix + "gif(a) tags", "Gif, a means anime, example: '*" + settings.prefix + "gifa kiss winter*'")
        .addField(settings.prefix + "poll text", "Creates poll in one of rooms, annonymous by default (can be used in dm), add ';' sign to show your nickname with poll")
        .addField(settings.prefix + "cah", "Shows guide to Cards Against Humanity\n" + settings.prefix + "cah set/settings shows avaible settings")
        .addField(settings.prefix + "rr", "Play Russian Roulette with other user(s), " + settings.prefix + "rr shows more\n\nexample: '*" + settings.prefix + "rr @user*'")
        .addField(settings.prefix + "butt, " + settings.prefix + "boobs", ":flushed: pic")
        .addField(settings.prefix + "p(f) tags", "Nsfw pic, f means gif, example: '*" + settings.prefix + "pf double_penetration*'")
        .addField(settings.prefix + "hentai *tag*", "Hentai pic, '" + settings.prefix + "hentai tags' shows avaible tags, example: '*" + settings.prefix + "hentai ass*'\n**Avaible tags:** ass, bdsm, cum, femdom, doujin, maid, orgy, panties, wallpaper, pussy, succubus")
        .addField("\nRooms to setup:", "generalRoom, pinRoom, pollRoom, confessRoom, delRoom, welcomeRoom, announceRoom\n\nSetup: " + settings.prefix + "addroom/editroom pinRoom #gallery")
        .setColor("#d652a6")
        .setTitle("Help")
    channel.send({embeds: [embed]***REMOVED***);
***REMOVED***

function commandHelp(cmd, channel){
    let embed;
    switch(cmd){
        case "reddit":
            embed = new discord.MessageEmbed()
                .setTitle("Reddit")
                .addField("\u2800", "Automatically sends feed from selected subreddits into designated rooms (refreshes every 5 hours)\nYou must set up *redditTheatre* or *redditText* or *redditNsfw* rooms first\nVideos and some gifs cant show in discord directly but only as links, therefore only option to turn them on\n**Example:** " + settings.prefix + "addroom reddittheatre #myreddit\n\n**redditTheatre** - Observes image feed\n**redditText** - Observes text feed\n\u2800")
                .addField(settings.prefix + "addreddit", "Adds/edits new subreddit observer for text or image posts\n**Format:** " + settings.prefix + "addreddit subreddit min-upvotes text/img/nsfw ignoreVideos\n**Example:** " + settings.prefix + "addreddit philosophy 1000 img true")
                .addField(settings.prefix + "removereddit", "Removes subreddit observer\n**Example:** " + settings.prefix + "removereddit news")
                .addField(settings.prefix + "reddits", "Shows list of observed subreddits")
                .addField(settings.prefix + "rdr", "Refresh")
                .setColor("#d652a6")
            channel.send({embeds: [embed]***REMOVED***);
            break;
        case "room":
            embed = new discord.MessageEmbed()
                .setTitle("Rooms")
                .addField(settings.prefix + "rooms", "Shows list of active rooms")
                .addField(settings.prefix + "addroom", "Adds/edits new room\n\n**Example:** " + settings.prefix + "addroom confessRoom #myconfessions")
                .addField(settings.prefix + "removeroom", "Removes room\n**Example:** " + settings.prefix + "removeroom confessRoom")
                .addField("Rooms to setup: ", `pinRoom, pollRoom, rolesRoom, confessRoom, delRoom, welcomeRoom, announceRoom, redditTheatre, redditText\n
                *generalRoom* - ${settings.prefix***REMOVED***say will be sent here\n
                *pinRoom* - Pins will be automatically sent here\n
                *pollRoom* - Polls will be sent here\n
                *rolesRoom* - Roles will be sent here\n
                *confessRoom* - Confessions will be sent here\n
                *delRoom* - Deleted messages will be sent here\n
                *welcomeRoom* - Goodbye messages will be sent here\n
                *announceRoom* - Announcements will be sent here\n
                *redditTheatre* - Image subreddits will be sent here\n
                *redditText* - Text subreddits will be sent here\n
                *redditNsfw* - Nsfw subreddits will be sent here\n`)
                .setColor("#d652a6")
            channel.send({embeds: [embed]***REMOVED***);
            break;
        case "pins":
            embed = new discord.MessageEmbed()
                .setTitle("Pins")
                .addField("\u2800", "Automatically redirects pins to designated room")
                .addField("You must setup room first\n\u2800\n", "Example:\n**" + settings.prefix + "addroom pinRoom *#mypins***\n")
                .addField(settings.prefix + "nopins", "Adds room to no pins list\nExample: **" + settings.prefix + "nopins *#mainroom***")
                .addField(settings.prefix + "nopinslist", "Lists all no-pins rooms")
                .addField(settings.prefix + "pinstoggle", "Deactivates/activates pins")
                .setColor("#d652a6")
            channel.send({embeds: [embed]***REMOVED***);
            break;
        case "remind":
            embed = new discord.MessageEmbed()
                .setTitle("Reminder")
                .setColor("#d652a6")
                .setDescription("Sends you message after timeout\n\nExample:\n**" + settings.prefix + "remind drink water ;1h 10m**\n\nm - mins, h - hours, d - days\nhours are default unit")
            channel.send({embeds: [embed]***REMOVED***);
            break;
		case "kickrole":
            embed = new discord.MessageEmbed()
                .setTitle("Kickrole")
                .setColor("#d652a6")
                .setDescription("Kicks users who are having **only** this role, if its 'everyone' it kicks users without role\n\nExample:\n**" + settings.prefix + "kickrole peasant**")
            channel.send({embeds: [embed]***REMOVED***);
            break;
        case "translate":
            embed = new discord.MessageEmbed()
                .setTitle("Translator")
                .setColor("#d652a6")
                .setDescription("Example:\n**" + settings.prefix + "tr hello ;english spanish**\n\nuse **" + settings.prefix + "trlist** to get all supported languages\nuse can you *en* as shortcut for english")
            channel.send({embeds: [embed]***REMOVED***);
            break;
        case "movie":
            embed = new discord.MessageEmbed()
                .setTitle("Movies API")
                .setColor("#d652a6")
                .setDescription("Search info about movies\n\u2800\nExample:\n**" + settings.prefix + "movie freaks ;2018**\n\nyou can specify year after ';' (optional)\nyou can use  **" + settings.prefix + "movief** instead for full info\n\n**_search**\ngives list of movies matching term\nExample: **" + settings.prefix + "search *freaks***")
            channel.send({embeds: [embed]***REMOVED***);
            break;
        case "words":
            embed = new discord.MessageEmbed()
                .setTitle("Vocabulary")
                .addField(settings.prefix + "def *word*", "Shows definition of word")
                .addField(settings.prefix + "syn *word*", "Shows synonyms of word")
                .addField(settings.prefix + "rhyme *word*", "Shows rhyme of word")
                .addField(settings.prefix + "sug *word*", "Shows suggestions of word (like autocorrect)")
                .setColor("#d652a6")
            channel.send({embeds: [embed]***REMOVED***);
            break;
        case "duels":
            embed = new discord.MessageEmbed()
                .setTitle("Duels")
                .setColor("#d652a6")
                .setDescription("Rock-paper-scissors game\n\u2800\nExample:\n**" + settings.prefix + "duel *@player1***\n\nboth players must have public DMs on\nyou can use shortcut to pick (r/p/s)")
            channel.send({embeds: [embed]***REMOVED***);
            break;
        case "emotes":
            embed = new discord.MessageEmbed()
                .setTitle("Emotes")
                .setColor("#d652a6")
                .addField(settings.prefix + "addemote", "Adds emote to server\nAccepts links and emotes, accepts multiple arguments split by space\n**Example:** " + settings.prefix + "addemote :helloworld:")
                .addField(settings.prefix + "emotes", "Shows list of most used emotes on server\nAll emotes used are counted and saved every hour\nShows only emotes with 10+ appereances")
            channel.send({embeds: [embed]***REMOVED***);
            break;
        case "roles":
            embed = new discord.MessageEmbed()
                .setTitle("Roles")
                .setColor("#d652a6")
                .addField(settings.prefix + "defaultrole", "Default role added to new server member\nLeave argument empty to cancel\n**Example:** " + settings.prefix + "defaultrole peasant")
                .addField(settings.prefix + "addrole", "Let's you setup self-picking roles in roles room\nBot can use only emotes from it's servers")
            channel.send({embeds: [embed]***REMOVED***);
            break;
        case "dm":
            embed = new discord.MessageEmbed()
                .setTitle("DMs")
                .setColor("#d652a6")
                .addField("**Example:**", settings.prefix + "dm", "Zeke i love you")
                .setDescription("- can DM only users that share server with bot\n- use user's main account name but without id and hashtag OR you can use his tag\n- case sensitive\n- if user has spaces in name you must put his name into double quotes, like \"Zeke unchained\"")
            channel.send({embeds: [embed]***REMOVED***);
            break;
        case "russianroulette":
            embed = new discord.MessageEmbed()
                .setTitle("Russian Roulette")
                .setColor("#d652a6")
                .setDescription("Challenges player(s) to Russian Roulette\n\nExample: **" + settings.prefix + "rr *@player* 1 kick**\nFormat: **" + settings.prefix + "rr *@players* *bullets* kick/ban force**\n\n**bullets** - number of bullets added each new round (default 0)\n**force** - skips confirm dialog, author won't be in game, admin command");
            channel.send({embeds: [embed]***REMOVED***);
            break;
    ***REMOVED***
***REMOVED***

***REMOVED***
    help,
    commandHelp
***REMOVED***
