const mongo = require("./mymongo.js");
const help = require("./help.js");

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

module.exports = {
    DominionGetCards,
    DominionSetCardCount,
    DominionAddBan,
    DominionRemoveBan,
    DominionGetBans
};
