const request = require("request");

function quote(channel) {
    request(
        {
            method: "GET",
            json: true,
            url: "https://gist.githubusercontent.com/shreyasminocha/7d5dedafc1fe158f82563c1223855177/raw/325d51aca7165b2498971afcff9bed286a52dc0e/quotes.json",
        },
        (err, resp, data) => {
            if (err) return console.error(err);

            if (!data) return console.error(resp);

            if (channel) {
                channel.send("```" + data[Math.floor(Math.random() * data.length)].quote + "```");
            }
        }
    );
}
function chuckNorris(channel) {
    request(
        {
            method: "GET",
            json: true,
            url: "http://api.icndb.com/jokes/random",
        },
        (err, resp, data) => {
            if (err) return console.error(err);

            if (!data) return console.error(resp);

            let joke = data.value?.joke?.replace(/\&quot;/gi, '"');
            if (channel) {
                channel.send("```" + joke + "```");
            }
        }
    );
}
function simpsons(channel) {
    request(
        {
            method: "GET",
            json: true,
            url: "https://raw.githubusercontent.com/itsHel/quotes/master/simpsons.json",
        },
        (err, resp, data) => {
            if (err) return console.error(err);

            if (!data) return console.error(resp);

            let quote = data[Math.floor(Math.random() * data.length)].quote;

            if (channel) {
                channel.send("```" + quote + "```");
            }
        }
    );
}

module.exports = {
    quote,
    chuckNorris,
    simpsons,
};
