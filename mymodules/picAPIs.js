const request = require("request");
const discord = require("discord.js");
const settings = require("../settings.js");
const keys = require("../keys.js");
const apis = require("./APIs.js");
const akaneko = require('akaneko');


const tenorUrlBase = "https://api.tenor.com/v1/random?q=";
const booruUrlBase = "https://danbooru.donmai.us/posts.json?";
//https://danbooru.donmai.us/posts.json?limit=1&tags=sex&random=true
const limit = "&limit=1";

function gifs(cmd, args, channel){
    let splitNick = args.split(" <@");
    let temp = splitNick[0].split(" ");
    if(cmd.length == 4){            //gifA = anime option
        temp.push("anime");
    ***REMOVED***
    let words = temp.map(word => {
        return word;
    ***REMOVED***).join("+");
    let url = tenorUrlBase + words + "&key=" + keys.tenorKey + limit;
    request.get(url, {json:true***REMOVED***, (err, res, resp) => {
        if (err)
            return console.error(err);
        if(!resp.results.length){
            channel.send("```not found```").then(sent => sent.delete({timeout: settings.autoDelDelay***REMOVED***));        
            return;
        ***REMOVED***
        let imageUrl = resp.results[0].media[0].gif.url;
        let embed = new discord.MessageEmbed ()
            .setImage(imageUrl);
            //.setFooter("Score: " + resp.score);
        channel.send(embed);
***REMOVED***
***REMOVED***

// _pf
function danbooru(cmd, args, channel){
    //https://danbooru.donmai.us/posts.json?tags=fuck&random=true&limit=100
    args = args.replace(/<@.+>/, "");
    let splitted = args.split(";");
    let minScore = splitted[1***REMOVED***
    if(minScore == undefined)
        minScore = 5;
    let temp = splitted[0].trim().split(" ");
    if(cmd.length == 2){            //gifA = anime option
        temp.push("gif");
    ***REMOVED***
    console.log(temp);
    if(temp.length > 2){
        channel.send("```You cannot search for more than 2 tags at a time```")
        return;
    ***REMOVED***
    let words = temp.map(word => {
        return word;
    ***REMOVED***).join("+");
    let url = booruUrlBase + "tags=" + words + "&random=true&limit=100";
    request.get(url, {json:true***REMOVED***, (err, res, resp) => {
        if (err)
            return console.error(err);
        if(!resp.length){
            channel.send("```not found```").then(sent => sent.delete({timeout: settings.autoDelDelay***REMOVED***));        
            return;
        ***REMOVED***
        let imageUrl, embed;
        for(let i = 0; i < resp.length; i++){
            if(resp[i].score > minScore && resp[i].file_url != undefined){
                imageUrl = resp[i].file_url;
                embed = new discord.MessageEmbed()
                    .setImage(imageUrl)
                    .setFooter("Score: " + resp[i].score);
                break;
            ***REMOVED***
        ***REMOVED***
        channel.send(embed);
***REMOVED***
***REMOVED***

function getBooty(url, channel){
    if(!channel.nsfw){
        channel.send("nsfw room only you pervert");
        return;
    ***REMOVED***
    request({
        method: "GET", json: true, url: url
    ***REMOVED***, (err, resp, data) => {
        if (err)
            return console.error(err);
        let picUrl = url.replace("api", "media").replace("0/1/random", "");
        let embed = getBootyEmbed(picUrl, data[0].id);
        channel.send(embed).then(sent => {
            sent.react('⬅').then(() => sent.react('➡'));
            let message = new apis.defMessage(sent.id, data[0].id);
			let collector = sent.createReactionCollector(settings.filter, { time: 100000 ***REMOVED***);
            collector.on('collect', r => {
                if(r.emoji.name == '⬅')
                    message.pos--;
                else if(r.emoji.name == '➡')
                    message.pos++;
                embed = getBootyEmbed(picUrl, message.pos);
                channel.messages.fetch(message.id).then(mess => {
                    mess.edit(embed);
            ***REMOVED***
                sent.reactions.removeAll().then(() => {
                    sent.react('⬅').then(() => sent.react('➡'));
            ***REMOVED***
        ***REMOVED***
            collector.on('end', collected => {
                channel.messages.fetch(message.id).then(mess => mess.reactions.removeAll());
        ***REMOVED***;
    ***REMOVED***
***REMOVED***
***REMOVED***

//https://gitlab.com/weeb-squad/akaneko
function hentaiAkaneko(cmd, arg, channel){
    if(!channel.nsfw){
        channel.send("```nsfw room only you pervert```");
        return;
    ***REMOVED***
    let imgUrl;
    if(cmd == "hentai"){
        //nsfw
        switch(arg.toLowerCase()){
            case "tags": case "info": case "help":
                channel.send("```Avaible tags:\nass, bdsm, cum, femdom, doujin, maid, orgy, panties, wallpaper, girl```");
                break;
            case "ass":
                imgUrl = akaneko.nsfw.ass();
                break;
            case "bdsm":
                imgUrl = akaneko.nsfw.bdsm();
                break;
            case "cum":
                imgUrl = akaneko.nsfw.cum();
                break;
            case "femdom":
                imgUrl = akaneko.nsfw.femdom();
                break;
            case "doujin":
                imgUrl = akaneko.nsfw.doujin();
                break;
            case "maid":
                imgUrl = akaneko.nsfw.maid();
                break;
            case "orgy":
                imgUrl = akaneko.nsfw.orgy();
                break;
            case "panties":
                imgUrl = akaneko.nsfw.panties();
                break;
            case "wallpaper":
                imgUrl = akaneko.nsfw.wallpapers();
                break;
            case "girl":
                imgUrl = akaneko.lewdneko();
                break;
            default:
                imgUrl = akaneko.nsfw.hentai();
                break;
        ***REMOVED***
    ***REMOVED*** else if(cmd == "anime"){
        //sfw
        switch(arg.toLowerCase()){
            case "tags": case "info": case "help":
                channel.send("```Avaible tags:\nwallpaper, girl```");
                break;
            case "wallpaper": default:
                imgUrl = akaneko.wallpapers();
                break;
            case "girl":
                imgUrl = akaneko.neko();
                break;
        ***REMOVED***
    ***REMOVED***
    let embed = new discord.MessageEmbed().setImage(imgUrl).setTitle(arg);
    channel.send(embed);
***REMOVED***

function getBootyEmbed(url, id){
    let myUrl = url + id.toString().padStart(5, "0") + ".jpg";
    let embed = new discord.MessageEmbed ()
        .setTitle(":flushed:")
        .setImage(myUrl);
    return embed;
***REMOVED***


***REMOVED***
    gifs,
    getBooty,
    danbooru,
    hentaiAkaneko
***REMOVED***
