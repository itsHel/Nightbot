const mongoose= require("mongoose");

function mongoDb(){
    var dbUrl = "mongodb://localhost:27017/Nightbot";

    mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false***REMOVED***)
        .then(result => console.log("DBloaded"))
        .catch(err => console.log(err))
***REMOVED***

function updateSchema(values, schema, guildid, reset = false){
    let newSchema;
    switch(schema){
        case "room":
            newSchema = mongoose.model("room", roomSchema);
            newSchema.findOneAndUpdate({guildid: guildid***REMOVED***, values, {upsert: true***REMOVED***)
                .then(result => {***REMOVED***)
                .catch(err => console.log(err));
            break;
        case "reddit":
            newSchema = mongoose.model("reddit", redditSchema);
            newSchema.findOneAndUpdate({guildid: guildid, reddit: values.reddit, type: values.type***REMOVED***, values, {upsert: true***REMOVED***)
                .then(result => {***REMOVED***)
                .catch(err => console.log(err));
            break;
        case "settings":
            newSchema = mongoose.model("settings", settingsSchema);
            if(values.nopinsrooms || values.bans || values.modroles){
                // Is array
                if(!reset){
                    let property = Object.keys(values)[0***REMOVED***
                    values = {$addToSet: {[property]: values[Object.keys(values)[0]]***REMOVED******REMOVED***
                ***REMOVED***
            ***REMOVED***

            newSchema.findOneAndUpdate({guildid: guildid***REMOVED***, values, {upsert: true***REMOVED***)
                .then(result => {***REMOVED***)
                .catch(err => console.log(err));
            break;
    ***REMOVED***
***REMOVED***

function addReminder(userid, message, time){
    let newSchema = mongoose.model("reminder", reminderSchema);
    let reminder = new newSchema({userid:userid, message: message, time: time***REMOVED***);
    reminder.save().then(result => console.log(result));
***REMOVED***

async function getReminders(userid){
    let newSchema = mongoose.model("reminder", reminderSchema);
    await newSchema.deleteMany({time: {$lte: new Date().getTime()***REMOVED******REMOVED***)
        .then()
        .catch(err => console.log(err));
    
    return await newSchema.find()
        .then((res) => {return res***REMOVED***);
***REMOVED***

async function getRooms(){
    let newSchema = mongoose.model("room", roomSchema);

    return await newSchema.find()
        .then((res) => {
            let rooms = {***REMOVED***
            res.forEach(row => {
                rooms[row.guildid] = {***REMOVED***
                for(const prop in row){
                    if((prop.match("room") || prop.match("reddit")) && row[prop]){
                        rooms[row.guildid][prop] = row[prop***REMOVED***
                    ***REMOVED***
                ***REMOVED***
        ***REMOVED***
            return rooms;
    ***REMOVED***
***REMOVED***

async function getReddits(){
    let newSchema = mongoose.model("reddit", redditSchema);

    return await newSchema.find()
        .then((res) => {
            let reddits = {***REMOVED***
            res.forEach(row => {
                if(!reddits[row.guildid])
                    reddits[row.guildid] = [***REMOVED***
                let newReddit = {***REMOVED***
                newReddit["reddit"] = row.reddit;
                newReddit["minupvotes"] = row.minupvotes;
                newReddit["type"] = row.type;
                newReddit["ignorevidsandgifs"] = row.ignorevidsandgifs;
                reddits[row.guildid].push(newReddit);
        ***REMOVED***
            return reddits;
    ***REMOVED***
***REMOVED***

function deleteReddit(values){
    let newSchema = mongoose.model("reddit", redditSchema);

    newSchema.deleteMany(values)
        .then()
        .catch(err => console.log(err));
***REMOVED***

async function getRedditHistory(guildid, reddit, type){
    let newSchema = mongoose.model("reddit", redditSchema);

    return await newSchema.find({guildid: guildid, reddit:reddit, type: type***REMOVED***)
        .then((res) => {
            return res[0].history***REMOVED***);
***REMOVED***


async function getSetting(guildid, type){
    let newSchema = mongoose.model("settings", settingsSchema);
    
    return await newSchema.find({guildid: guildid***REMOVED***)
        .then((res) => {return res[0][type]***REMOVED***);
***REMOVED***

async function getSettings(guilds){
    let newSchema = mongoose.model("settings", settingsSchema);

    return await newSchema.find({guildid: {$in: guilds***REMOVED******REMOVED***)
        .then((res) => {
            let settings = {***REMOVED***
            let i = 0;
            res = res.sort((a, b) => a.guildid - b.guildid);
            guilds.sort((a, b) => a - b).forEach(row => {
                if(!res[i] || res[i].guildid != row){
                    settings[row] = {
                        leavebandays: 0,
                        ratepeoplecount: 0,
                        nopinsrooms: [],
                        modroles: [],
                        emoteshistory: "{***REMOVED***",
                        defaultrole: "",
                        leaveQuoteLastIndex: 0
                    ***REMOVED***
                ***REMOVED*** else {
                    settings[row] = {
                        leavebandays: res[i].leavebandays || 0,
                        ratepeoplecount: res[i].ratepeoplecount || 0,
                        nopinsrooms: res[i].nopinsrooms || [],
                        modroles: res[i].modroles || [],
                        emoteshistory: res[i].emoteshistory || "{***REMOVED***",
                        defaultrole: res[i].defaultrole || "",
                        leaveQuoteLastIndex: res[i].leaveQuoteLastIndex || 0
                    ***REMOVED***
                ***REMOVED***
                settings[row].emoteshistory = JSON.parse(settings[row].emoteshistory);
                settings[row].pinning = true;
        ***REMOVED***
            return settings;
    ***REMOVED***
***REMOVED***

async function getRoleMessages(){
    let newSchema = mongoose.model("role", roleSchema);

    return await newSchema.find()
        .then((res) => {
            let roles = {***REMOVED***
            res.forEach(row => {
                if(!roles[row.guildid])
                    roles[row.guildid] = [***REMOVED***
                let newMessage = {
                    messageid: row.messageid,
                    channelid: row.channelid,
                    roles: row.roles,
                    emotes: row.emotes,
                    unique: row.unique
                ***REMOVED***
                roles[row.guildid].push(newMessage);
        ***REMOVED***
            return roles;
    ***REMOVED***
***REMOVED***

async function saveRoleMessage(description, messageid, channelid, guildid, unique){
    let newSchema = mongoose.model("role", roleSchema);
    let values = {
        guildid: guildid,
        messageid: messageid,
        channelid: channelid,
        roles: [],
        emotes: [],
        unique: unique
    ***REMOVED***
    let rows = description.split("\n");
    rows.forEach(row => {
        let temp = row.split("-");
        let emote = temp[0].trim();
        let role = temp[1].trim();
        values.emotes.push(emote);
        values.roles.push(role);
***REMOVED*** 

    newSchema.create(values)
        .then(result => console.log(result))
        .catch(err => console.log(err));
***REMOVED***

function deleteRoleMessage(messageid){
    let newSchema = mongoose.model("role", roleSchema);

    newSchema.deleteOne({messageid:messageid***REMOVED***)
        .then()
        .catch(err => console.log(err));
***REMOVED***

async function getBans(){
    let newSchema = mongoose.model("settings", settingsSchema);

    return await newSchema.find()
        .then((res) => {
            let bans = {***REMOVED***
            res.forEach(row => {
                    bans[row.guildid] = row.bans;
        ***REMOVED***
            return bans;
    ***REMOVED***
***REMOVED***


const roomSchema = new mongoose.Schema({
    guildid: {
        type: String,
        unique : true
    ***REMOVED***,
    pinroom: {
        type: String
    ***REMOVED***,
    pollroom: {
        type: String
    ***REMOVED***,
    confessroom: {
        type: String
    ***REMOVED***,
    rolesroom: {
        type: String
    ***REMOVED***,
    delroom: {
        type: String
    ***REMOVED***,
    welcomeroom: {
        type: String
    ***REMOVED***,
    announceroom: {
        type: String
    ***REMOVED***,
    reddittheatre: {
        type: String
    ***REMOVED***,
    reddittext: {
        type: String
    ***REMOVED***,
    redditnsfw: {
        type: String
    ***REMOVED***,
    rateroom: {
        type: String
    ***REMOVED***
***REMOVED***);

const redditSchema = new mongoose.Schema({
    guildid: {
        type: String
    ***REMOVED***,
    reddit: {
        type: String
    ***REMOVED***,
    minupvotes: {
        type: Number
    ***REMOVED***,
    type: {
        type: String
    ***REMOVED***,
    ignorevidsandgifs: {
        type: Boolean,
        default: true
    ***REMOVED***,
    history: [{
        type: String
    ***REMOVED***]
***REMOVED***);

const settingsSchema = new mongoose.Schema({
    guildid: {
        type: String,
        unique : true
    ***REMOVED***,
    modroles: [{
        type: String
    ***REMOVED***],
    nopinsrooms: [{
        type: String
    ***REMOVED***],
    leavebandays: {
        type: Number
    ***REMOVED***,
    ratepeoplecount: {
        type: Number
    ***REMOVED***,
    defaultrole: {
        type: String
    ***REMOVED***,
    bans: [{
        type: String
    ***REMOVED***],
    emoteshistory: {
        type: String
    ***REMOVED***,
    leaveQuoteLastIndex: {
        type: Number
    ***REMOVED***
***REMOVED***);

const roleSchema = new mongoose.Schema({
    guildid: {
        type: String
    ***REMOVED***,
    messageid: {
        type: String
    ***REMOVED***,
    channelid: {
        type: String
    ***REMOVED***,
    roles: [{
        type: String
    ***REMOVED***],
    emotes: [{
        type: String
    ***REMOVED***],
    unique: {
        type: Boolean,
        default: false
    ***REMOVED***
***REMOVED***);

const reminderSchema = new mongoose.Schema({
    userid: {
        type: String
    ***REMOVED***,
    message: {
        type: String
    ***REMOVED***,
    time: {
        type: Number
    ***REMOVED***
***REMOVED***);

***REMOVED***
    mongoDb,
    updateSchema,
    addReminder,
    getReminders,
    getRooms,
    getRedditHistory,
    deleteReddit,
    getReddits,
    getSetting,
    getSettings,
    getBans,
    getRoleMessages,
    saveRoleMessage,
    deleteRoleMessage,
***REMOVED***

    // var MongoClient = require('mongodb').MongoClient;
    // const blogSchema = new mongoose.Schema({title: {type: String***REMOVED***, title22: {type: String***REMOVED******REMOVED***);

    // MongoClient.connect(dbUrl, function(err, db) {
    // if (err) throw err;
    // let dbo = db.db("Nightbot");
    // dbo.createCollection("customers", function(err, res){
    //     if(err) throw err;
    // ***REMOVED***);
    // console.log("Database created!");
    // db.close();
    // ***REMOVED***);


    // const Blog = mongoose.model("Blog", blogSchema);

    // Blog.findOneAndUpdate({title:"MYTITTLE-----------"***REMOVED***, {title22: "UPDATEEEEEEEED"***REMOVED***, {upsert: true***REMOVED***)
    //     .then(result => console.log(result))
    //     .catch(err => console.log(err));


    // Blog.update({title:"MYTITTLE-----------"***REMOVED***, {title22: "U"***REMOVED***)
    //     .then(result => console.log(result))
    //     .catch(err => console.log(err));

    // const blog = new Blog({title:"MYTITTLE-----------",title22:"newroom"***REMOVED***);
    // blog.save();