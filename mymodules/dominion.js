const mongo = require("./mymongo.js");
const help = require("./help.js");
const { prefix } = require("../settings.js");

async function DominionGetCards(message) {
    if(!message.guild) {
        message.channel.send("```Command works on server only```");
        return
    }

    const data = await mongo.getDominionData(message.guild.id);
    if(!data) {
        message.channel.send("```Set Card Count first```");
        return
    }

    if(data.cardCount - data.bannedCards.length < 10) {
        message.channel.send("```Not enough cards```");
        return
    }

    const numbers = [];
    while (numbers.length < 10) {
        const randomNum = Math.floor(Math.random() * data.cardCount + 1);

        // Skip excluded numbers and prevent duplicates
        if (
            !data.bannedCards.includes(randomNum) &&
            !numbers.includes(randomNum)
        ) {
            numbers.push(randomNum);
        }
    }

    // Sort from lowest to highest
    numbers.sort((a, b) => a - b);

    // Save last generated set in memory
    await mongo.updateSchema({ lastCards: numbers }, "dominion", message.guild.id);

    message.channel.send("```[" + numbers.join(", ") + "]```");
}

async function DominionSetCardCount(count, message) {
    if(!message.guild) {
        message.channel.send("```Command works on server only```");
        return
    }

    if (isNaN(count) || count.length == 0) {
        message.channel.send("```Wrong format```");
        return;
    }

    count = parseInt(count)
    if (count < 10) {
        message.channel.send("```10 is minimum```");
        return;
    }

    mongo.updateSchema({ cardCount: count }, "dominion", message.guild.id);
}

async function DominionAddBan(cardIndex, message) {
    if(!message.guild) {
        message.channel.send("```Command works on server only```");
        return
    }

    if (isNaN(cardIndex)) {
        message.channel.send("```Wrong format```");
        return;
    }

    const data = await mongo.getDominionData(message.guild.id);
    if(!data) {
        message.channel.send("```Set Card Count first```");
        return
    }

    cardIndex = parseInt(cardIndex)
    if (cardIndex > data.cardCount || cardIndex == 0) {
        message.channel.send("```Card is out of range (" + data.cardCount + ")```");
        return;
    }

    if (data.bannedCards.includes(cardIndex)) {
        message.channel.send("```Card already banned```");
        DominionGetBans(message);
        return;
    }

    data.bannedCards.push(cardIndex)

    await mongo.updateSchema({ bannedCards: data.bannedCards }, "dominion", message.guild.id);

    DominionGetBans(message);
}

async function DominionRemoveBan(cardIndex, message) {
    if(!message.guild) {
        message.channel.send("```Command works on server only```");
        return
    }

    if (isNaN(cardIndex)) {
        message.channel.send("```Wrong format```");
        return;
    }

    const data = await mongo.getDominionData(message.guild.id);
    if(!data) {
        message.channel.send("```Set Card Count first```");
        return
    }

    cardIndex = parseInt(cardIndex)

    if (!data.bannedCards.includes(cardIndex)) {
        message.channel.send("```Card not banned```");
        DominionGetBans(message);
        return;
    }

    const newBans = data.bannedCards.filter(n => n !== cardIndex);

    await mongo.updateSchema({ bannedCards: newBans }, "dominion", message.guild.id);

    DominionGetBans(message);
}


async function DominionGetBans(message) {
    if(!message.guild) {
        message.channel.send("```Command works on server only```");
        return
    }

    const data = await mongo.getDominionData(message.guild.id);

    if(!data) {
        message.channel.send("```Set Card Count first```");
        return
    }

    message.channel.send("```Bans: [" + data.bannedCards.join(", ") + "]```");
}

async function DominionSaveLast(note, message) {
    if(!message.guild) {
        message.channel.send("```Command works on server only```");
        return
    }

    const data = await mongo.getDominionData(message.guild.id);

    if(!data || !data.lastCards || data.lastCards.length == 0) {
        message.channel.send("```No generated cards to save```");
        return
    }

    const savedSets = data.savedSets || [];

    savedSets.push({
        cards: data.lastCards,
        note: note || ""
    });

    await mongo.updateSchema({ savedSets: savedSets }, "dominion", message.guild.id);

    message.channel.send("```Last card set saved```");
}

async function DominionShowSets(message) {
    if(!message.guild) {
        message.channel.send("```Command works on server only```");
        return
    }

    const data = await mongo.getDominionData(message.guild.id);

    if(!data || !data.savedSets || data.savedSets.length == 0) {
        message.channel.send("```No saved card sets```");
        return
    }

    let text = "";

    data.savedSets.forEach((set, index) => {
        text +=
            "#" + (index + 1) +
            " " + set.note + "\n" +
            "[" + set.cards.join(", ") + "]\n\n";
    });

    message.channel.send("```" + text + "```");
}

async function DominionClearSets(message) {
    if(!message.guild) {
        message.channel.send("```Command works on server only```");
        return;
    }

    const data = await mongo.getDominionData(message.guild.id);

    if(!data) {
        message.channel.send("```Set Card Count first```");
        return;
    }

    await mongo.updateSchema(
        { savedSets: [] },
        "dominion",
        message.guild.id
    );

    message.channel.send("```All saved sets removed```");
}

// Example input:
// "1,5,7,10,15,20,25,30,35,40 My favorite setup"

async function DominionAddSet(args, message) {
    if(!message.guild) {
        message.channel.send("```Command works on server only```");
        return;
    }

    const data = await mongo.getDominionData(message.guild.id);

    if(!data) {
        message.channel.send("```Set Card Count first```");
        return;
    }

    if(!args || args.length == 0) {
        message.channel.send("```Wrong format: use [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] note```");
        return;
    }

    // Expected format:
    // [1,2,3,4,5,6,7,8,9,10] my notes

    const match = args.match(/^\s*\[(.*?)\]\s*(.*)$/);

    if(!match) {
        message.channel.send("```Wrong format: use [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] note```");
        return;
    }

    const cardsPart = match[1];
    const note = match[2] || "";

    const cards = cardsPart
        .split(",")
        .map(n => parseInt(n.trim()))
        .filter(n => !isNaN(n));

    if(cards.length != 10) {
        message.channel.send("```Wrong format: use [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] note```");
        return;
    }

    // Check duplicates
    const uniqueCards = [...new Set(cards)];

    if(uniqueCards.length != 10) {
        message.channel.send("```Duplicate cards detected```");
        return;
    }

    // Validate range
    for(const card of uniqueCards) {
        if(card < 1 || card > data.cardCount) {
            message.channel.send(
                "```Card out of range: " + card + "```"
            );
            return;
        }
    }

    // Sort cards
    uniqueCards.sort((a, b) => a - b);

    const savedSets = data.savedSets || [];

    savedSets.push({
        cards: uniqueCards,
        note: note
    });

    await mongo.updateSchema(
        { savedSets: savedSets },
        "dominion",
        message.guild.id
    );

    message.channel.send(
        "```Saved set:\n" 
        + note + "\n[" +
        uniqueCards.join(", ") +
        "]```"
    );
}

function DominionHelp(message) {
    const commands = [
        prefix + "dominion/dom",
        prefix + "domCount <number>",
        "\n",
        prefix + "domAddBan/domBan <number>",
        prefix + "domRemoveBan <number>",
        prefix + "domBans",
        "\n",
        prefix + "domSaveLast/domSave <note>",
        prefix + "domAddSet/domAdd <cards> <note>",
        prefix + "domShowSaved/domShow",
    ];

    message.channel.send(
        // "```Dominion Commands:\n" +
        "```" +
        commands.join("\n") +
        "```"
    );
}

module.exports = {
    DominionGetCards,
    DominionSetCardCount,
    DominionAddBan,
    DominionRemoveBan,
    DominionGetBans,
    DominionSaveLast,
    DominionShowSets,
    DominionHelp,
    DominionAddSet,
    DominionClearSets
};