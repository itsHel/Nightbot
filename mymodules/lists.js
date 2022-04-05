const fs = require("fs");
const settings = require("../settings");
const mine = require("./misc");

//          reads lists from dir and sorts by time
let lists = fs.readdirSync("data/lists").sort(function(a, b){
      return fs.statSync("data/lists/" + a).birthtime.getTime() - fs.statSync("data/lists/" + b).birthtime.getTime()
    ***REMOVED***).map(function(file, index){
        return file.substring(0, file.length - 4);
***REMOVED***

//          redo later, should be in JSON and more functions
//          cant have solo number as name, cant have spaces in name

function listFunctions(cmd, args, message, guildSettings){
	let channel = message.channel;
	let member = message.member || message.user;
	
    let temp = args.split(" ");
    let list;           //command
    if(temp.length == 1)
        list = temp[0].toLowerCase();           //show list
    else 
        list = temp[1].toLowerCase();
    if(!isNaN(parseInt(list))){
        list = lists[parseInt(list) - 1***REMOVED***       //listname is a number
    ***REMOVED***
    if(temp[0] == "create" || temp[0] == "c"){
        //CREATE
        fs.writeFile("data/lists/" + list + ".txt", "", function(){***REMOVED***);
        channel.send("```list " + list + " created```").then(sent => sent.delete({timeout: settings.autoDelDelay***REMOVED***));
        lists.push(list);
    ***REMOVED*** else if(temp[0] == "add"){
        //ADDING
        fs.appendFileSync("data/lists/" + list + ".txt", args.substring(5 + temp[1]  .length) + "\n", function(){***REMOVED***);
        channel.send("```" + args.substring(5 + temp[1].length) + " added to the " + list + " list```").then(sent => sent.delete({timeout: settings.autoDelDelay***REMOVED***));
    ***REMOVED*** else if(temp[0] == "del"){
        //DELETING items
        let mylist = fs.readFileSync("data/lists/" + list + ".txt", 'utf8', function(err){
            channel.send("```not a list```");
            return;
    ***REMOVED***
        if(!mine.isAdmin(message, guildSettings.modroles)){
            return;
        ***REMOVED***
        for(i = 0, lines = 0; i < mylist.length; i++){
            if(mylist[i] == "\n" || temp[2] == "1"){
                lines++;
                if(parseInt(temp[2]) - 1 == lines || temp[2] == "1"){
                    for(o = i + 1; true; o++){
                        if(mylist[o] == "\n"){
                            mylist = mylist.replace(mylist.substring(i + 1, o + 1), "");
                            if(temp[2] == "1")
                                mylist = mylist.substr(1);
                            break;
                        ***REMOVED***
                    ***REMOVED***
                    break;
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
        channel.send("```number " + temp[2] + " removed from " + list + "```").then(sent => sent.delete({timeout: settings.autoDelDelay***REMOVED***));
        fs.writeFile("data/lists/" + list + ".txt", mylist, function(){***REMOVED***);
    ***REMOVED*** else if(temp[0] == "remove"){
        //REMOVE LIST
        if(!mine.isAdmin(message, guildSettings.modroles)){
            return;
        ***REMOVED***
        fs.unlink("data/lists/" + list + ".txt", err => {
            if(err){
                console.log(err);
                channel.send("```not a list```").then(sent => sent.delete({timeout: settings.autoDelDelay***REMOVED***));
                return;
            ***REMOVED***
    ***REMOVED***
        channel.send("```deleted```").then(sent => sent.delete({timeout: settings.autoDelDelay***REMOVED***));
    ***REMOVED*** else {
        showList(list, channel);
    ***REMOVED***
    return list;
***REMOVED***

function showList(list, channel){
    let text = fs.readFileSync("data/lists/" + list + ".txt", "utf8", function(err){
        console.log(err);
        channel.send("```list not found```");
    ***REMOVED***).toString().split("\n").map(function(line, index){
        return (index + 1) + ". " + line;
***REMOVED***
    text.pop();
    text = text.join("\n");
    if(!text.length == 0)
        channel.send("```css\n" + text + "```");
    else    
        channel.send("```css\nempty```");
***REMOVED***
function listAll(channel){
    let text = lists.map(function(list, index){
        return (index + 1) + ". " + list;
    ***REMOVED***).join("\n");
    channel.send("```css\n" + text + "```");
***REMOVED***

***REMOVED***
    listAll,
    showList,
    listFunctions
***REMOVED***