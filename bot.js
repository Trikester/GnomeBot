const auth = require('./auth.json');
const Discordjs = require('discord.js');
const client = new Discordjs.Client();

//logger
var logger = require('winston');
const files = new logger.transports.File({filename: 'combined.log'});
const console = new logger.transports.Console();

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

//Content used by bot
    const gnome = new Discordjs.Attachment('./attach/gnomed.gif');
    const audio = './attach/gnomed.mp3';


// Initialize Discord Bot
client.on('ready', () => {
    logger.log({
        level:'info',
        message: `Logged in as ${client.user.tag}!`
        });  
  //console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    
   if(msg.content[0] == '!'){
                
        var args = msg.content.substring(1).split(' ');        
        var cmd =args[0];
        var targ = args[1];        
        cmd = cmd.toLowerCase();   
       

        logger.log({
                        level:'info',
                        message: 'Command Called: ' + cmd + ' Arguments: ' + targ + ' Called by: ' + msg.author.username
                    });
                    
        switch(cmd){
            case 'ping':
                msg.channel.send('pong');
                //log('pong')
                break;
            case 'avatar':
                if(msg.mentions.users.first()){
                    msg.channel.send(msg.mentions.users.first().avatarURL);                    
                } else {
                    msg.reply(msg.author.avatarURL);                    
                }                
                break;
           case 'emoji':
                if(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?a-zA-Z0-9]/g.test(targ)){
                    msg.channel.send(typeof targ);
                    msg.channel.send(targ.name);
                    //msg.reply(args.url);
                } else{
                    msg.channel.send("False!");
                }
                break;
            
            case 'gotem':
                msg.channel.send(`${msg.author + ' ohohohahaha'}`,gnome);
                break;
                
            case 'rich': //test atm
                const embed = new Discordjs.RichEmbed()
                    embed.setTitle('A little embed')
                    embed.setColor(0xFF0000)
                    embed.setDescription('Hello, this is a slick embed!');
                msg.channel.send(embed);
                break;
            case 'gnome': //bot joins voice channel of tagged user or 
                if(msg.mentions.users.first()){
                    //msg.mentions.users.first()
                    msg.delete().catch(console.error);
                    var gnomed = msg.guild.member(msg.mentions.users.first())
                    //msg.react(client.emojis.get('498641320919826432'));
                    
                    if(gnomed.voiceChannel){
                        gnomed.voiceChannel.join()
                            .then(connection => {
                                logger.log({
                                        level:'info',
                                        message: msg.author.username + "'s gnome started on " + gnomed.nickname
                                        });  
                            const dispatcher = connection.playFile(audio);
                            dispatcher.on('end', () => {
                                // The song has finished
                                 logger.log({
                                    level:'info',
                                    message: msg.author.username + "'s gnome ended"
                                   });  
                                connection.disconnect();
                            });
                        })
                        .catch(console.log);
                        msg.channel.send(gnome);
                        msg.channel.send("Ohohohahaha hohohoheha \n Hello there, old chum \n I'm gnot a gnelf \n I'm gnot a gnoblin \n I'm a g'nome and you've been GNOMED");                  
                        
                    } else{
                       msg.reply("The User needs to be in a voice channel");
                    }
                    
                } else {                                 
                    if(msg.member.voiceChannel){
                        msg.member.voiceChannel.join()
                            .then(connection => {
                                msg.channel.send(gnome);
                                logger.log({
                                        level:'info',
                                        message: msg.author.username + "'s gnome started"
                                        });  
                            const dispatcher = connection.playFile(audio)
                            dispatcher.on('end', () => {
                                // The song has finished
                                 logger.log({
                                    level:'info',
                                    message: msg.author.username + "'s gnome ended"
                                   });  
                                connection.disconnect();
                            });
                        })
                        .catch(console.log);
                        msg.channel.send("Ohohohahaha hohohoheheha \n Hello there, old chum \n I'm gnot a gnelf \n I'm gnot a gnoblin \n I'm a g'nome and you've been GNOMED");                        
                    } else{
                        msg.reply("You need to be in a voice channel");
                    }
                    
                }
                break;
                
            case 'play':
                
                break;
        }
        
   }
   
});

//Log the command
//log(){
    
//}
client.login(auth.token);