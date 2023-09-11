// Temp settings
const prefix = "_";
const adminRoles = ["King", "Village Fool", "Queen", "Empress", "prince"];

const autoDelDelay = 10000;
const filter = (reaction, user) => {
    return ["➡", "⬅"].includes(reaction.emoji.name) && !user.bot;
};

// Returns array of two strings
function getLeaveQuote(index) {
    let i = Math.floor(Math.random() * (goodbyes.length - 1));
    let quote = leaveQuotes[index];
    quote = quote.map((string) => {
        return string.replace("*Goodbye*", goodbyes[i]);
    });

    return quote;
}

const goodbyes = ["Goodbye", "Farewell", "So long"]; // Replaces "*Goodbye*" in string
const leaveQuotes = [
    ["", " escaped this labyrinth of suffering"],
    ["", " goes to seek a Great Perhaps"],
    ["", " left because nobody asked them to stay"],
    ["", " realized that good people dont end up here"],
    ["", " is not so high and mighty anymore"],
    ["", " tried their best and failed miserably, the lesson is to never try"],
    ["", " has to go now, his home planet needs him"], // ; _Note: X died on the way back to his home Planet_
    ["*Goodbye* ", ", on the dark lonely road you travel, I'm afraid we cannot follow"],
    ["*Goodbye* ", ", some cause happiness wherever they go; others whenever they go"],
    ["*Goodbye* ", ", who cares if one more light goes out, in the sky of a million stars"],
    ["*Goodbye* ", ", who cares when someone's time runs out, if a moment is all we are"],
    [
        "*Goodbye* ",
        ", this is the hardest part about being an impartial announcer: balancing how little I care about anything thats happening here",
    ],
    ["There was nothing left here for ", ""],
    ["The show is over for ", ""],
    ["*Goodbye* ", ", maybe this was how things had to be"],
    ["The song has ended for ", " but the melody lingers on"],
    ["*Goodbye* ", ", we'll miss you a lot, then a little, then not really"],
    ["", " went out to pick up a pack of cigarettes, he will be back anytime soon..."],
    ["*Goodbye* ", ", we have a sad feeling for a moment, then it passes"],
];

const gladosCheers = [
    "Let me record this victory in your file. Where did I put it? Oh, who cares.",
    "Wait until your loved ones hear about this. This should make them proud. Or bored. One of those.",
    "Very Impressive. Because this message is pre-recorded, any comments we may make about your success are speculation on our part. Please disregard any undeserved compliments.",
    "I was going to say it's not that big a deal, but then I looked at your file and saw the list of your other accomplishements. The space on the form where they should have been, I mean.",
    "Here, let me engrave a trophy for you: nobody cares.",
    "It's a good feeling, isn't it? I wouldn't get used to it.",
    "This should impress all the people who doubted you at the comic book store.",
    "This is probably the most heroic thing anyone's ever done while sitting motionless in their parents' rec room.",
    "So that's a minor victory, right square in the middle of all your failures.",
    "If you had any idea what you were doing, this would be a real achievement.",
    "Unbelievable. You, [subject name here], must be the pride of [subject hometown here]!]",
];

module.exports = {
    prefix,
    autoDelDelay,
    leaveQuotes,
    gladosCheers,
    adminRoles,
    Hel,
    defaultGuild,
    filter,
    getLeaveQuote,
};
