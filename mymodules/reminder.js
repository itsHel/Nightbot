const settings = require("../settings");
const mongo = require("./mymongo");

function timeToSeconds(timeString){
    let timeArray = timeString.split(":");
    let seconds = timeArray[0] * 3600 + timeArray[1] * 60;

    return seconds;
***REMOVED***

function remind(message){
    let temp = message.content.substr(8).split(";");
    let text = temp[0***REMOVED***
    let time = temp[1***REMOVED***
    let delay = 0;

    if(time.match(":")){
        // 12:12 format
        time = time.trim();

        if(time.length != 5){
            message.channel.send("```Wrong time format```");
            return;
        ***REMOVED***

        let now = new Date().toLocaleTimeString("sv").slice(0, 5);
        
        let secondsDifference = timeToSeconds(time) - timeToSeconds(now);
        if(secondsDifference <= 0){
            secondsDifference += 86_400;
        ***REMOVED***

        delay = secondsDifference;
    ***REMOVED*** else {
        // 12d 12h 12m format
        let days = time.match(/([0-9]*)d/i);
        days = (days) ? days[1] : 0;
        let hours = time.match(/([0-9]*)h/i);
        hours = (hours) ? hours[1] : 0;
        let minutes = time.match(/([0-9]*)m/i);
        minutes = (minutes) ? minutes[1] : 0;
        delay = days *86400 + hours *3600 + minutes *60;
    
        if(delay == 0){
            // Hours are default
            delay = time *3600;
        ***REMOVED***
    ***REMOVED***

    let date = new Date();
    let newDate = new Date(date.getTime() + delay * 1000).getTime();

    if(delay > 2_073_600){                                      // 24 days in seconds
        message.channel.send("```24 days is maximum```");
        return;
    ***REMOVED***

    console.log(delay + " s");
    mongo.addReminder(message.author.id, text, newDate);

    setTimeout(function(){
        message.author.send(text);
        console.log(text);
    ***REMOVED***, delay * 1000);

    message.reply("I will remind you in" + secondsToTime(delay)).then(mess => setTimeout(() => mess.delete().catch(()=>{***REMOVED***), settings.autoDelDelay));
***REMOVED***

async function loadReminders(client){
    let rows = await mongo.getReminders();
    
    rows.forEach(row => {
        let text = row.message;
        let member = row.userid;
        let dateNow = new Date();
        let remindDate = new Date(row.time);
        let timer = remindDate - dateNow;

        if(timer < 0){
            user.send(text);
            return;
        ***REMOVED***

        setTimeout(function(){
            client.users.fetch(member).then((user) => {
                user.send(text);
            ***REMOVED***).catch((err) => console.log(err))
        ***REMOVED***, timer);

        console.log("Reminder in " + Math.floor(timer/1000) + " s");
***REMOVED***
***REMOVED***

function secondsToTime(seconds){
    if(seconds == 0)
        return " - right now?";

    var days = Math.trunc(seconds / 86_400);
    seconds = seconds % 86_400;
    var hours = Math.trunc(seconds / 3600);
    var minutes = Math.trunc(seconds % 3600 / 60);

    var output = "";
    output+= parsePlural(days, " day");
    output+= parsePlural(hours, " hour");
    output+= parsePlural(minutes, " minute");

    return output;
***REMOVED***

// Adds "s" to multi (days...)
function parsePlural(count, str){
    if(count == 0)
        return "";

    if(count == 1)
        return " " + count.toString() + str;

    return " " + count.toString() + str + "s";
***REMOVED***

***REMOVED***
    remind,
    loadReminders
***REMOVED***
