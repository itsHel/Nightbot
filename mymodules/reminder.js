const settings = require("../settings");
const mongo = require("./mymongo");

function remind(message){
    let temp = message.content.substr(8).split(";");
    let text = temp[0***REMOVED***
    let time = temp[1***REMOVED***
    let delay = 0;

    let days = time.match(/([0-9]*)d/i);
    days = (days) ? days[1] : 0;
    let hours = time.match(/([0-9]*)h/i);
    hours = (hours) ? hours[1] : 0;
    let minutes = time.match(/([0-9]*)m/i);
    minutes = (minutes) ? minutes[1] : 0;
    delay = days *86400 + hours *3600 + minutes *60;
    if(delay == 0)
        delay = time *3600;

    let date = new Date();
    let newDate = new Date(date.getTime() + delay * 1000).getTime();
    console.log(delay + " s");
    mongo.addReminder(message.author.id, text, newDate);

    setTimeout(function(){
        message.author.send(text);
        console.log(text);
    ***REMOVED***, delay * 1000);
    message.reply("I will remind you in" + secondsToTime(delay)).then(sent => sent.delete({timeout: settings.autoDelDelay***REMOVED***));
***REMOVED***

async function loadReminders(client){
    let rows = await mongo.getReminders();
    rows.forEach(row => {
        for(let i = 0; i < rows.length -1; i++){
            let text = row.message;
            let member = row.userid;
            let dateNow = new Date();
            let remindDate = new Date(row.time);
            let timer = remindDate - dateNow;
            if(timer < 0)
                continue;
            setTimeout(function(){
                client.users.fetch(member).then((user) => {
                    user.send(text);
                ***REMOVED***).catch((err) => console.log(err))
            ***REMOVED***, timer);
            console.log("reminder in " + Math.floor(timer/1000) + " s");
        ***REMOVED***
***REMOVED***
***REMOVED***

function secondsToTime(seconds){
    if(seconds == 0)
        return " - right now?";
    var days = Math.trunc(seconds / 86400);
    seconds = seconds % 86400;
    var hours = Math.trunc(seconds / 3600);
    var minutes = Math.trunc(seconds % 3600 / 60);
    var output = "";
    output+= myparse(days, " day");
    output+= myparse(hours, " hour");
    output+= myparse(minutes, " minute");
    return output;
***REMOVED***

function myparse(i, s){
    //adds "s" to multi (days..)
    if(i == 0)
        return "";
    if(i == 1)
        return " " + i.toString() + s;
    return " " + i.toString() + s + "s";
***REMOVED***

***REMOVED***
    remind,
    loadReminders
***REMOVED***
