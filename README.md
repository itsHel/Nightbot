# Nightbot

##### Multi purpose Discord bot written in Nodejs, based on discord.js

Default prefix: `_`

## Functions:

-   Cards Against Humanity
-   Rock Scissors Paper game
-   Movie API
-   Reddit memes
-   Translator + some vocabulary functions
-   Anonymous confessions, Anonymous DM
-   Creating notes
-   Simpsons quote, Glados quote, Random quote, Chuck Norris joke
-   Reminder
-   Random/Cointoss
-   Create polls
-   Gif API
-   Nude API, Hentai API
-   Auto pinning
-   Saving deleted messages
-   Goodbye messages
-   Russian roulette

# All Commands:

### q/quote

> Sends random quote

### cn

> Sends random Chuck Norris joke

### s/simpsons

> Sends random Simpsons quote

### glados

> Sends GLaDOS congratulations (possible to tag someone)

### remind _message_ ;time

> Bot will DM you your message after time passes, m - mins, h - hours, d - days OR 16:16 format  
> Hours are default unit  
> Example: `_remind buy beer ;2h 10m`  
> Example: `_remind buy beer ;16:16`

### duel @user

> Will start rock-paper-scissors with chosen user
> Both players must have public DMs on
> You can use shortcut to pick (r/p/s)

### random _X_

> Picks random number, default is 2

### toss

> Head or Tails

### cd/countdown

> Countdowns from 3 to 0

### movie _title_

> Shows movie info
> you can specify year with ';' (optional)
> Example: `_movie freaks ;2018`

### movief _title_

> Same as movie but full version of info

### search _title_

> Shows list of movies that match _title_

### def/syn/sug/rhyme

> Word definition/synonyms/suggestions/rhymes
> Example: `_rhyme hell`

### tr/translate

> Translates words/phrases  
> Example: `_tr hello ;english spanish`  
> use `_trlist` for list of supported languages  
> you can use `en` instead of `english`

### c/confess _message_

> Sends your message annonymously into confession room (you can use Bots DM)

### announce _message_

> Sends your message annonymously into announce room (you can use Bots DM)

### dm @user _message_

> Sends your message annonymously into chosen user DMs  
> Use their main nickname and double quotes for names with spaces - "hell bot" (you can use Bots DM)

### gif(a) _tags_

> Sends random gif, if you use _gifa_ it will be anime gif  
> Example: `_gifa kiss winter`

### poll _text_

> Creates poll in poll room, annonymous by default (you can use Bots DM), add ';' sign in the end of message to show your nickname with together with poll

### rr/russianroulette _@user(s)_ _ban/kick_ _force_ _addedBullets_

> Starts Russian roulette with user(s), arguments are voluntary  
> Example: `_rr @player1 @player2 kick 1`
>
> you can tag users by role too  
> using **force** skips confirm dialog and comamnd author won't be added to game, admin command only  
> using **ban/kick** will ban/kick loser(s)  
> **addedBullets** = bullets added each round, default is 0

#####  

## Cards Against Humanity

> -   Players join first, then you can start the game
> -   First player to join becomes game master
> -   One game can be active at one channel
> -   Its possible to change answers before all players picked
> -   You can choose only one blank at the same time

### Game commands

> -   _cah join_ - joins you into the game
> -   _cah start_ - starts the game
> -   _cah leave_ - leaves the game
> -   _cah players_ - shows joined players
> -   _cah packs_ - shows active packs
> -   _cah set/settings_ - shows avaible settings
> -   _cah end_ - ends the game (game master or mods only)
> -   _cah kick @player_ - kicks player (game master or mods only)
> -   _cah_ - shows game commands
> -   _cah set_ - shows settings commands

### Avaible settings

> Example: `_cah set triples off`
>
> -   _cah set blanks **on/off**_ - **on** by default
> -   _cah set triples **on/off**_ - **on** by default
> -   _cah set throwhand **on/off**_ - allows players to throw away their hand once per game, **on** by default
> -   _cah set cards **X**_ - default number of cards, **12** by default
> -   _cah set points **X**_ - points needed to win, **10** by default
> -   _cah set packs **official/unofficial/both**_ - avaible card packs, **both** by default

#####  

## NSFW commands

### butt/boobs

> Sends picture of butt/boots :flushed:

### p(f) _tags_

> Sends nsfw picture, if you use _pf_ it will be gif  
> Example: `_pf outside`  
> **Info:** _You cannot search for more than 2 tags at once, including gif_

### hentai _tag_

> Sends hentai picture, only limited tags  
> Example: `_hentai ass`  
> **Avaible tags:** ass, bdsm, femdom, doujin, maid, orgy, panties, wallpaper, pussy, succubus

### hentai tags

> Shows avaible tags

#####  

# Misc functions

### \_emotes

> Shows list of most used emotes on server (all emotes used are stored and saved every hour)  
> Shows only emotes with 10+ appereances

## Autopin

> Automatically redirects pins to designated room  
> You must set up _pinRoom_ first
> Example: `_addroom pinroom #mypins`

### _nopins _#room\_

> This room will be ignored by autopin
> Example: `_nopins #mypins`

### \_nopinslist

> Lists all nopins rooms

### \_pinstoggle

> Deactivates/activates autonpin

## Reddit

> Automatically sends feed from selected subreddits to designated rooms (refreshes every 5 hours)  
> You must set up _redditTheatre_ or _redditText_ or _redditNsfw_ rooms first  
> Videos and some gifs cant show in discord directly but only as links, therefore only option to turn them on  
> _allow-videos_ is false by default
> Example: `_addroom reddittheatre #myreddit`
>
> _redditTheatre_ - Observes image feed  
> _redditText_ - Observes text feed  
> _redditNsfw_ - Observes nsfw feed

### _addreddit \_subreddit_ _min-upvotes_ _type (text/img/nsfw) allow-videos_

> Adds/edits new subreddit observer for image or text posts  
> Example: `_addreddit news 1000 text`

### _removereddit \_subreddit_

> Removes subreddit observer  
> Example: `_removereddit news`

### \_reddits

> Shows list of observed subreddits

### \_rdr

> Refresh

## Pins

> Automatically redirects pins to designated room  
> You must set up _pinRoom_ first
> Example: `_addroom pinroom #mypins`

### _nopins _#room\_

> This room will be ignored by autopin
> Example: `_nopins #mypins`

### \_nopinslist

> Lists all nopins rooms

### \_pinstoggle

> Deactivates/activates autonpin

## Saving deleted messages

> Automatically saves message into delroom when its deleted  
> You must set up _delRoom_ first  
> Reacts only on messages that were send after bot was invited to server  
> Example: `_addroom delroom #deleted`

## Goodbyes

> Automatically sends goodbye messages after member leaves server
> You must set up _wekcomeRoom_ first  
> 12+ unique messages
> Example: `_addroom welcomeroom #welcome`

#####  

# Admin commands

### del _X_

> Deletes **X** number of messages  
> Without argument it deletes one message

### defaultrole _role_

> Default role added to new server member  
> Leave argument empty to cancel  
> Example: `_defaultrole peasant`

### addrole

> Let's you setup self-picking roles in roles room
> Bot can use only emotes from it's servers

### setban _X_

> Sets autoban after user leaves **X** is number of days  
> 24 days is maximum

### addemote/stealemote

> Adds emote to server, accepts links and emotes, accepts multiple arguments split by space

### kickrole _role_

> Kicks all users who have ONLY this role  
> accepts role as string or role with @  
> if _role_ is "everyone" kicks everyone without a role

### addmod _role_

> Allows role to use admin bot commands

#####  

# Setup commands:

## Rooms to setup: _(case insensitive)_

> -   _generalRoom_ - \_say will be sent here
> -   _pinRoom_ - Pins will be automatically sent here
> -   _pollRoom_ - Polls will be sent here
> -   _confessRoom_ - Confessions will be sent here
> -   _rolesRoom_ - Roles will be sent here
> -   _delRoom_ - Deleted messages will be sent here
> -   _welcomeRoom_ - Goodbye messages will be sent here
> -   _announceRoom_ - Announcements will be sent here
> -   _redditTheatre_ - Image subreddits will be sent here
> -   _redditText_ - Text subreddits will be sent here
> -   _redditNsfw_ - NSFW subreddits will be sent here

### addroom _roomToSetup_ _#room_

> Assigns room type to discord room  
> Can be used to edit active rooms  
> Example: `_addroom pinroom #mypins`

### removeroom _roomToSetup_

> Removes room
> Example: `_removeroom pinroom`

### rooms

> Lists all assigned rooms
