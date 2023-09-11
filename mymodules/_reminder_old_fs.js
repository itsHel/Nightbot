const fs = require("fs");
const settings = require("../settings");

function remind(message) {
    let temp = message.content.substr(8).split(";");
    let text = temp[0];
    let time = temp[1];
    let delay = 0;

    let days = time.match(/([0-9]*)d/i);
    days = days ? days[1] : 0;
    let hours = time.match(/([0-9]*)h/i);
    hours = hours ? hours[1] : 0;
    let minutes = time.match(/([0-9]*)m/i);
    minutes = minutes ? minutes[1] : 0;
    delay = days * 86400 + hours * 3600 + minutes * 60;
    if (delay == 0) delay = time * 3600;

    let date = new Date();
    let newDate = new Date(date.getTime() + delay * 1000);
    console.log(delay + " s");
    fs.appendFile(
        "temp/reminders.txt",
        message.author.id + ";;" + text + ";;" + newDate + "\r\n",
        function () {},
    );
    setTimeout(function () {
        message.author.send(text);
        console.log(text);
    }, delay * 1000);
    message
        .reply("I will remind you in" + secondsToTime(delay))
        .then((sent) => sent.delete({ timeout: settings.autoDelDelay }));
}

function loadReminders(client) {
    fs.readFile("temp/reminders.txt", "utf8", function (err, data) {
        let rows = data.split("\r\n");
        let newFile = "";
        for (let i = 0; i < rows.length - 1; i++) {
            let temp = rows[i].split(";;");
            let text = temp[1];
            let member = temp[0];
            let dateNow = new Date();
            let dateUnban = new Date(temp[2]);
            let timer = dateUnban - dateNow;
            if (timer < 0) continue;
            newFile += rows[i] + "\r\n";
            setTimeout(function () {
                client.users
                    .fetch(member)
                    .then((user) => {
                        user.send(text);
                    })
                    .catch((err) => console.log(err));
            }, timer);
            console.log("reminder in " + Math.floor(timer / 1000) + " s");
        }
        fs.writeFile("temp/reminders.txt", newFile, function () {});
    });
}

function secondsToTime(seconds) {
    if (seconds == 0) return " - right now?";
    var days = Math.trunc(seconds / 86400);
    seconds = seconds % 86400;
    var hours = Math.trunc(seconds / 3600);
    var minutes = Math.trunc((seconds % 3600) / 60);
    var output = "";
    output += myparse(days, " day");
    output += myparse(hours, " hour");
    output += myparse(minutes, " minute");
    return output;
}

function myparse(i, s) {
    //adds "s" to multi (days..)
    if (i == 0) return "";
    if (i == 1) return " " + i.toString() + s;
    return " " + i.toString() + s + "s";
}

module.exports = {
    remind,
    loadReminders,
};

//}
