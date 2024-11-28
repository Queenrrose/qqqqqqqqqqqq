const { Client, Modal, version, Intents, Permissions, MessageButton, TextInputComponent, DiscordAPIError, MessageSelectMenu, MessageAttachment, MessageEmbed, MessageActionRow } = require('discord.js');
const Discord = require('discord.js');
const { resolveImage, Canvas} = require("canvas-constructor/cairo");
const Keyv = require('keyv');
const { inviteTracker } = require("discord-inviter");
const { joinVoiceChannel, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
const { TextDecoder, TextEncoder, ReadableStream } = require("node:util")

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
  ReadableStream: { value: ReadableStream },
})

const { Blob, File } = require("node:buffer")
const { fetch, Headers, FormData, Request, Response } = require("undici")

Object.defineProperties(globalThis, {
  fetch: { value: fetch, writable: true },
  Blob: { value: Blob },
  File: { value: File },
  Headers: { value: Headers },
  FormData: { value: FormData },
  Request: { value: Request },
  Response: { value: Response },
})
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const moment = require('moment-timezone');
require('moment-hijri');
require("moment-duration-format");
const db = new Keyv('sqlite://./storage/database.sqlite');
const express = require('express');
const app = express();
const path = require("path");

//تعريفات ملف interactions
const { handleAddMemKikMem } = require('./interactions/handleAddMemKikMem');
const { handleMsgSendControl } = require('./interactions/handleMsgSendControl');
const { handleMsgControl } = require('./interactions/handleMsgControl');
const { handleSendMemberId } = require('./interactions/handleSendMemberId');
const { handleSendMsgEmbed } = require('./interactions/handleSendMsgEmbed');
const { handleSendMsgPost } = require('./interactions/handleSendMsgPost');
const { handleMsgDeleted } = require('./interactions/handleMsgDeleted');
const { handleAddNote } = require('./interactions/handleAddNote');
const { handleSendOwnTick } = require('./interactions/handleSendOwnTick');
const { handleClaimTicket } = require('./interactions/handleClaimTicket');
const { handleTranscript } = require('./interactions/handleTranscript');
const { handleSendMsgDisabled } = require('./interactions/handleSendMsgDisabled');
const rules = require('./rules.json');
// قائمة الملفات والدوال المستوردة


// فحص حالة كل ملف
//تعريف ملف config.json
const {
    token,
    prefix,
    categoryIDs,
    welcomeRoomId,
    welcomeLogChannelId,
    claimPermissionRoleId,
    TicketReportChannelId,
    suggestionschannel,
    ServerReportChannelId,
    sugaccptorreject,
    rulesbackground,
    rankbanner,
    levelUpChannelId,
    TicketSaveChannelId,
    logChannelId,
    accshinsug,
    selectMenuOptions,
} = require('./config.json');
//منع ظهور الاخطاء البسيطه في console log
process.on("uncaughtException" , err => {
return;
})
 
process.on("unhandledRejection" , err => {
return;
})
 
process.on("rejectionHandled", error => {
  return;
});
// يمكنك استخدام mergedConfig في الشيفرة الخاصة بك الآن
let canvax = require('canvas')
canvax.registerFont("./storage/Uni Sans Heavy.otf", { family: 'Discord' })
canvax.registerFont("./storage/DejaVuSansCondensed-Bold.ttf", { family: 'Discordx' })
const client = new Client({
intents: [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MEMBERS,
  Intents.FLAGS.GUILD_VOICE_STATES,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  Intents.FLAGS.MESSAGE_CONTENT,
  Intents.FLAGS.GUILD_PRESENCES 
],
}); // Declare client to be a new Discord Client (bot)
require('http').createServer((req, res) => res.end(`
</> Dveloper Bot : Ahmed Clipper
</> Discord User : ahm.clipper
</> Server Support : https://dsc.gg/clipper-tv
</> Servers : ${client.guilds.cache.size}
</> Users : ${client.users.cache.size}
</> channels : ${client.channels.cache.size}
</> Name : ${client.user.username}
`)).listen(3000) //Dont remove this 


const { EventEmitter } = require('events');
EventEmitter.defaultMaxListeners = 30; // أو أي قيمة تعتقد أنها مناسبة
require("events").EventEmitter.defaultMaxListeners = 30;

client.on('ready', () => {
  console.log(``);
  console.log(`</> Logged In : ${client.user.tag}!`);
  console.log(`</> Servers : ${client.guilds.cache.size}`);
  console.log(`</> Users : ${client.users.cache.size}`);
  console.log(`</> channels : ${client.channels.cache.size}`);
  client.user.setStatus('dnd');///dnd/online/idle
  client.user.setActivity(`Queen | Q U E E N`, { type: 'WATCHING' });
});

// استيراد جميع الملفات في مجلد handlers
const handlersDir = path.join(__dirname, 'handlers');
fs.readdirSync(handlersDir).forEach(file => {
  if (file.endsWith('.js')) {
    const handler = require(path.join(handlersDir, file));
    handler(client);
  }
});


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

// قراءة الملفات داخل المجلد "commands"
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const commands = new Map();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);

    if (command.aliases) {
        command.aliases.forEach(alias => {
            client.aliases.set(alias, command.name);
        });
    }
}

client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));

    if (!command) return;

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('هناك خطأ ما أثناء تنفيذ الأمر.');
    }
});

// قراءة الملفات داخل المجلد "slashcommand"
const slashCommandFiles = fs.readdirSync('./slashcommand').filter(file => file.endsWith('.js'));

const slashCommands = [];

for (const file of slashCommandFiles) {
    const command = require(`./slashcommand/${file}`);
    slashCommands.push(command);
}

client.once('ready', async () => {
    try {
        await client.application?.commands.set(slashCommands);
    } catch (error) {
        console.error('Error registering slash commands:', error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = slashCommands.find(cmd => cmd.name === interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error('Error executing command:', error);
        await interaction.reply({ content: 'There was an error executing that command!', ephemeral: true });
    }
});

client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!commands.has(commandName)) return;

    const command = commands.get(commandName);

    try {
        command.execute(message, args, client, prefix, Discord); // تمرير client و prefix و Discord إلى ملف الأمر
    } catch (error) {
        console.error(error);
        message.reply('There was an error executing this command!');
    }
});

let nextAzkarIndex = 0;

let background2 = ''; // Initialize background2 variable

client.on('messageCreate', async message => {
  if (message.content === `${prefix}rules-system`) {
    
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply("You don't have permission to use this command.");
    }
    
    if (message.member.permissions.has("ADMINISTRATOR")) {
      const row = new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('List of Laws')
            .addOptions(rules.map(rule => ({
              label: rule.title,
              value: rule.id,
            }))),
        );

      const embed = new MessageEmbed()
        .setThumbnail(message.guild.iconURL({ dynamic: true, size: 4096 }))
        .setTitle("<a:ejgif1036:1250132334502739979> Server Rules Community <a:ejgif1006:1241743608617504788>")
        .setDescription(`<a:ejgif1001:1241743492032757852> to read the laws, choose from the list below \n<a:ejgif1001:1241743492032757852> please do not violate server rules`)
        .setImage(rulesbackground);

      const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });
      await message.delete();
    } else {
      await message.reply({ content: "You need to be an administrator to use this command.", ephemeral: true });
    }
  }
});
const messageID = '1247241844841250856';
const channelID = '1247241441537691649';
const guildID = '1150611319276453949';

let updatingEmbed = false; // متغير لتتبع حالة التحديث

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const guild = await client.guilds.fetch(guildID);
    const channel = await guild.channels.resolve(channelID);
    const message = await channel.messages.fetch(messageID);

    startUpdatingEmbed(message);
});





/////////////////////////////////////////////////////////////////////////////////////////////////// LINK WORNG SYSTEM
/*/
const logChannelId22 = '1237562633692119191'; // استبدل هذا بمعرف القناة التي تريد إرسال السجل إليها

client.on('messageCreate', async (message) => {
    // تجاهل الرسائل التي يرسلها البوت نفسه أو رسائل لا تحتوي على روابط
    if (message.author.bot) return;
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    if (urlRegex.test(message.content)) {
        // حذف الرسالة التي تحتوي على الرابط
        await message.delete();

        // إرسال تحذير للشخص الذي أرسل الرابط عبر الرسائل الخاصة
        try {
            await message.author.send('تحذير: ممنوع ارساشل روابط');
        } catch (error) {
            console.error('فشل إرسال الرسالة الخاصة:', error);
        }

        // إرسال رسالة تحذير في نفس الروم باستخدام embed
        const warningEmbed = new MessageEmbed()
            .setThumbnail("https://cdn.discordapp.com/attachments/1150926238672769044/1306741530605650021/pngtree-http-and-https-protocols-on-shield-png-image_4595683__1_-removebg-preview.png?ex=6737c562&is=673673e2&hm=ce93752e51a0f9ef900145c96b39da31c2b4386c5af9241fc7215f25562ff2be&")
            .setColor('#FF0000')  // اللون الأحمر
            .setTitle('<a:ejgif1032:1242349755728789504> تحذير : ممنوع إرسال روابط <a:ejgif1038:1255826722633416704>')
            .setDescription('1. .تم حذف الرسالة لأنك قمت بإرسال رابط. يرجى الامتناع عن إرسال الروابط\n2. .يرجى احترام قواعد الخادم')
            .setFooter({ text: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()

        // إرسال الـ embed في نفس الروم
        const warningMessage = await message.channel.send({ embeds: [warningEmbed] });

        // حذف الرسالة بعد 5 ثواني
        setTimeout(() => {
            warningMessage.delete();
        }, 10000);  // 5000 ميلي ثانية = 5 ثواني

        // إرسال سجل في القناة المحددة
        const embed = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle('> <a:ejgif1032:1242349755728789504> تحذير من ارسال روابط <a:ejgif1032:1242349755728789504>')
            .addFields(
                { name: 'الوقت', value: `\`${new Date().toLocaleString()}\``, inline: true },
                { name: 'المستخدم', value: `${message.author}`, inline: true },
                { name: 'القناة المرسل فيها', value: `<#${message.channel.id}>`, inline: true },
                { name: 'الرابط المرسل', value: `\`\`\`diff\n-${message.content}\`\`\``, inline: true }
            )
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))

        // إرسال السجل إلى القناة
        const logChannel = await client.channels.fetch(logChannelId22);
        if (logChannel && logChannel.isText()) {
            logChannel.send({ embeds: [embed] });
        }
    }
});
/*/
/////////////////////////////////////////////////////////////////////////////////////////////////// LINK WORNG SYSTEM

/////////////////////////////////////////////////////////////////////////////////////////////////// Broadcast SYSTEM
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase() === `${prefix}broadcast-system`) {
    
  // Check if the user has the Administrator permission
  if (!message.member.permissions.has('ADMINISTRATOR')) {
    return message.reply("You do not have permission to use this command.");
  }
    
    const firstRow = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('send-to-all')
          .setStyle('SUCCESS')
          .setLabel('📢 Send To All'),
        new MessageButton()
          .setCustomId('send-to-online')
          .setStyle('PRIMARY')
          .setLabel('🟢 Send To Online'),
        new MessageButton()
          .setCustomId('send-to-offline')
          .setStyle('SECONDARY')
          .setLabel('⚪ Send To Offline')
      );

    const secondRow = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('send-to-person')
          .setStyle('PRIMARY')
          .setLabel('👤 Send To Person'),
        new MessageButton()
          .setCustomId('send-to-role')
          .setStyle('DANGER')
          .setLabel('🎭 Send To Role'),
      );

    const embed = new MessageEmbed()
      .setThumbnail(message.guild.iconURL({ dynamic: true, size: 4096 }))
      .setAuthor({ name: `Welcome TO BOT ${message.client.user.username}`, iconURL: message.client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) })
      .setImage("https://cdn.discordapp.com/attachments/1144347868220620950/1249448633640943677/standard.gif?ex=66675737&is=666605b7&hm=b044f15730161fff580dc05b95cfc4a92abeb437fb32bfdfdc1b3ec3a758ce1a&")
      .setDescription('> **Broadcast Rules**\n1. Users must adhere to the community guidelines.\n2. Spamming is strictly prohibited.')
      .setTimestamp()
      .setFooter({ text: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setColor('#2c2c34');

    await message.channel.send({
      embeds: [embed],
      components: [firstRow, secondRow]
    });
  }
});

const _0x335caa=_0x3dd8;function _0x3dd8(_0xf36f,_0x42dfd2){const _0x2bb5a5=_0x2bb5();return _0x3dd8=function(_0x3dd85d,_0x4b9664){_0x3dd85d=_0x3dd85d-0x1d1;let _0x28a2a0=_0x2bb5a5[_0x3dd85d];return _0x28a2a0;},_0x3dd8(_0xf36f,_0x42dfd2);}(function(_0x47d6b4,_0x3164c5){const _0x269a36=_0x3dd8,_0x1b5e01=_0x47d6b4();while(!![]){try{const _0x56c5e3=-parseInt(_0x269a36(0x1e5))/0x1+-parseInt(_0x269a36(0x1f5))/0x2+-parseInt(_0x269a36(0x1df))/0x3*(-parseInt(_0x269a36(0x1fa))/0x4)+-parseInt(_0x269a36(0x1d8))/0x5+-parseInt(_0x269a36(0x1fc))/0x6+-parseInt(_0x269a36(0x203))/0x7+parseInt(_0x269a36(0x1d3))/0x8*(parseInt(_0x269a36(0x1ec))/0x9);if(_0x56c5e3===_0x3164c5)break;else _0x1b5e01['push'](_0x1b5e01['shift']());}catch(_0x246274){_0x1b5e01['push'](_0x1b5e01['shift']());}}}(_0x2bb5,0xcd6e4),client['on'](_0x335caa(0x1d7),async _0x46df84=>{const _0x3b9005=_0x335caa;try{if(_0x46df84[_0x3b9005(0x1fe)]()){if(!_0x46df84[_0x3b9005(0x1dd)][_0x3b9005(0x1de)][_0x3b9005(0x1e0)]('ADMINISTRATOR')){_0x46df84[_0x3b9005(0x1e3)]({'content':'You\x20do\x20not\x20have\x20permission\x20to\x20use\x20this\x20command.','ephemeral':!![]});return;}if(_0x46df84[_0x3b9005(0x1f7)]==='send-to-online'){const _0x35ff14=new Modal()['setCustomId'](_0x3b9005(0x1ef))[_0x3b9005(0x1ed)](_0x3b9005(0x1e8))[_0x3b9005(0x210)]([new MessageActionRow()[_0x3b9005(0x210)](new TextInputComponent()['setCustomId'](_0x3b9005(0x1e6))[_0x3b9005(0x1fd)]('Type\x20your\x20message\x20here')['setStyle']('PARAGRAPH')[_0x3b9005(0x1e2)](0x1)[_0x3b9005(0x1f4)](0xfa0)['setPlaceholder'](_0x3b9005(0x20c))['setRequired'](!![]))]);await _0x46df84[_0x3b9005(0x1f0)](_0x35ff14);}}if(_0x46df84[_0x3b9005(0x201)]()){if(_0x46df84[_0x3b9005(0x1f7)]===_0x3b9005(0x1ef)){const _0x441162=_0x46df84['fields'][_0x3b9005(0x205)]('message-txt-send');await _0x46df84[_0x3b9005(0x1db)]['members'][_0x3b9005(0x1f9)]();const _0x1bc123=_0x46df84[_0x3b9005(0x1db)],_0xaa4a21=_0x1bc123[_0x3b9005(0x1d9)][_0x3b9005(0x1ea)]['filter'](_0x20f205=>_0x20f205[_0x3b9005(0x1d4)]&&_0x20f205[_0x3b9005(0x1d4)][_0x3b9005(0x1f3)]!==_0x3b9005(0x209)&&!_0x20f205[_0x3b9005(0x1ff)][_0x3b9005(0x1e4)]),_0x4f29da=_0xaa4a21[_0x3b9005(0x1ee)],_0x109134=new Date(),_0x5d352b=_0x3b9005(0x202),_0x1e93cf=_0x109134[_0x3b9005(0x20a)](_0x3b9005(0x1d5),{'timeZone':_0x5d352b});_0x109134[_0x3b9005(0x1f8)](_0x109134[_0x3b9005(0x1eb)]()+0x1);const _0x44106a=_0x109134['toLocaleTimeString'](_0x3b9005(0x20e),{'timeZone':_0x5d352b,'hour12':!![],'hour':_0x3b9005(0x1fb),'minute':_0x3b9005(0x1fb)}),_0x2a7451=new MessageEmbed()[_0x3b9005(0x1f6)](_0x3b9005(0x1e1))['setTitle']('>\x20Report\x20Sent\x20:\x20`Send\x20To\x20Onlline`')[_0x3b9005(0x20f)]({'name':_0x3b9005(0x1d2),'value':'```'+_0x4f29da+'```','inline':!![]},{'name':_0x3b9005(0x1d6),'value':_0x3b9005(0x208)+_0x44106a+_0x3b9005(0x208),'inline':!![]},{'name':_0x3b9005(0x20b),'value':_0x3b9005(0x208)+_0x1e93cf+_0x3b9005(0x208),'inline':!![]})['setDescription'](_0x3b9005(0x1e7)+_0x441162+_0x3b9005(0x208));_0xaa4a21['forEach'](_0x3253c6=>{const _0x3b962f=_0x3b9005;_0x3253c6['send'](_0x441162)[_0x3b962f(0x1dc)](()=>console[_0x3b962f(0x20d)](_0x3b962f(0x1f2)+_0x3253c6['user']['tag']))['catch'](_0x59a296=>console[_0x3b962f(0x1e9)](_0x3b962f(0x207)+_0x3253c6[_0x3b962f(0x1ff)][_0x3b962f(0x206)]+':',_0x59a296));}),_0x46df84['reply']({'embeds':[_0x2a7451],'ephemeral':!![]})[_0x3b9005(0x1dc)](()=>console[_0x3b9005(0x20d)](_0x3b9005(0x1da)))[_0x3b9005(0x1d1)](_0x5159ea=>console[_0x3b9005(0x1e9)](_0x3b9005(0x204),_0x5159ea));}}}catch(_0x88295d){console[_0x3b9005(0x1e9)](_0x3b9005(0x1f1),_0x88295d),_0x46df84['reply']({'content':_0x3b9005(0x200),'ephemeral':!![]});}}));function _0x2bb5(){const _0x211586=['cache','getHours','12656502IEmDtp','setTitle','size','send-to-online','showModal','An\x20error\x20occurred:','Message\x20sent\x20to\x20','status','setMaxLength','1059586CgStkZ','setColor','customId','setHours','fetch','1690012lFDqGo','numeric','4499034eLRlQr','setLabel','isButton','user','An\x20error\x20occurred\x20while\x20processing\x20your\x20request.','isModalSubmit','Africa/Cairo','1163106OtOnGH','Failed\x20to\x20send\x20ephemeral\x20embed:','getTextInputValue','tag','Failed\x20to\x20send\x20message\x20to\x20','```','offline','toLocaleDateString','Sending\x20Time','Enter\x20your\x20message\x20here','log','en-EG','addFields','addComponents','catch','Recipients\x20count','16JmCssK','presence','en-US','Sending\x20Date','interactionCreate','1980305VenxLt','members','Ephemeral\x20embed\x20sent','guild','then','member','permissions','9yBCUDu','has','#2c2c34','setMinLength','reply','bot','1396770iWzjNY','message-txt-send','**The\x20Message\x20Sent**\x0a```','🟢\x20Send\x20To\x20Online','error'];_0x2bb5=function(){return _0x211586;};return _0x2bb5();}

function _0x24a5(_0x3d9c83,_0x17ad58){const _0x552fbf=_0x552f();return _0x24a5=function(_0x24a5f1,_0x2584bf){_0x24a5f1=_0x24a5f1-0xfd;let _0x261505=_0x552fbf[_0x24a5f1];return _0x261505;},_0x24a5(_0x3d9c83,_0x17ad58);}const _0x46e9b0=_0x24a5;(function(_0x3550d1,_0x441c7a){const _0x5e1433=_0x24a5,_0x256ed0=_0x3550d1();while(!![]){try{const _0x17faeb=parseInt(_0x5e1433(0x13e))/0x1*(-parseInt(_0x5e1433(0x114))/0x2)+-parseInt(_0x5e1433(0x133))/0x3+-parseInt(_0x5e1433(0x13b))/0x4+parseInt(_0x5e1433(0x129))/0x5*(parseInt(_0x5e1433(0x131))/0x6)+parseInt(_0x5e1433(0x127))/0x7+parseInt(_0x5e1433(0x105))/0x8*(-parseInt(_0x5e1433(0x11a))/0x9)+-parseInt(_0x5e1433(0x11f))/0xa*(-parseInt(_0x5e1433(0x123))/0xb);if(_0x17faeb===_0x441c7a)break;else _0x256ed0['push'](_0x256ed0['shift']());}catch(_0x27d49c){_0x256ed0['push'](_0x256ed0['shift']());}}}(_0x552f,0xf1e5f),client['on'](_0x46e9b0(0x120),async _0xf97c42=>{const _0xfa099f=_0x46e9b0;try{if(_0xf97c42[_0xfa099f(0x117)]()){if(!_0xf97c42[_0xfa099f(0x12b)][_0xfa099f(0x12d)][_0xfa099f(0x135)](_0xfa099f(0x103))){_0xf97c42[_0xfa099f(0x113)]({'content':'You\x20do\x20not\x20have\x20permission\x20to\x20use\x20this\x20command.','ephemeral':!![]});return;}if(_0xf97c42[_0xfa099f(0xfe)]===_0xfa099f(0x130)){const _0x2b158b=new Modal()[_0xfa099f(0x122)]('send-to-offline')[_0xfa099f(0x110)](_0xfa099f(0x13c))[_0xfa099f(0x102)]([new MessageActionRow()[_0xfa099f(0x102)](new TextInputComponent()[_0xfa099f(0x122)]('message-txt-send2')['setLabel'](_0xfa099f(0x12f))[_0xfa099f(0x12e)](_0xfa099f(0x119))[_0xfa099f(0x111)](0x1)['setMaxLength'](0xfa0)[_0xfa099f(0x106)](_0xfa099f(0x118))[_0xfa099f(0x112)](!![]))]);await _0xf97c42[_0xfa099f(0x109)](_0x2b158b);}}if(_0xf97c42[_0xfa099f(0x108)]()){if(_0xf97c42[_0xfa099f(0xfe)]===_0xfa099f(0x130)){const _0x30b96c=_0xf97c42[_0xfa099f(0x10d)][_0xfa099f(0x137)](_0xfa099f(0xfd));await _0xf97c42[_0xfa099f(0x138)]['members'][_0xfa099f(0x100)]();const _0x5dcd94=_0xf97c42[_0xfa099f(0x138)],_0xc0f1b9=_0x5dcd94[_0xfa099f(0x10a)][_0xfa099f(0x132)]['filter'](_0x2436a5=>_0x2436a5[_0xfa099f(0x13d)]&&_0x2436a5[_0xfa099f(0x13d)][_0xfa099f(0x134)]===_0xfa099f(0x11b)&&!_0x2436a5[_0xfa099f(0x10b)][_0xfa099f(0x13a)]),_0x3d0e85=_0xc0f1b9[_0xfa099f(0x124)],_0x4da3b9=new Date(),_0x47eac6=_0xfa099f(0x10e),_0x12a7f3=_0x4da3b9['toLocaleDateString'](_0xfa099f(0x10f),{'timeZone':_0x47eac6});_0x4da3b9[_0xfa099f(0x104)](_0x4da3b9['getHours']()+0x1);const _0x1c68a7=_0x4da3b9['toLocaleTimeString'](_0xfa099f(0x12c),{'timeZone':_0x47eac6,'hour12':!![],'hour':'numeric','minute':'numeric'}),_0x2a9e06=new MessageEmbed()[_0xfa099f(0x128)](_0xfa099f(0x139))['setTitle'](_0xfa099f(0x101))[_0xfa099f(0x126)]({'name':_0xfa099f(0x10c),'value':_0xfa099f(0x115)+_0x3d0e85+_0xfa099f(0x115),'inline':!![]},{'name':'Sending\x20Date','value':'```'+_0x1c68a7+'```','inline':!![]},{'name':_0xfa099f(0x125),'value':_0xfa099f(0x115)+_0x12a7f3+_0xfa099f(0x115),'inline':!![]})[_0xfa099f(0x11e)]('**The\x20Message\x20Sent**\x0a```'+_0x30b96c+_0xfa099f(0x115));_0xc0f1b9[_0xfa099f(0x11c)](_0x21cf88=>{const _0x537067=_0xfa099f;_0x21cf88[_0x537067(0x121)](_0x30b96c)['then'](()=>console['log'](_0x537067(0xff)+_0x21cf88[_0x537067(0x10b)][_0x537067(0x11d)]))['catch'](_0x1f79c9=>console[_0x537067(0x116)]('Failed\x20to\x20send\x20message\x20to\x20'+_0x21cf88[_0x537067(0x10b)][_0x537067(0x11d)]+':',_0x1f79c9));}),_0xf97c42[_0xfa099f(0x113)]({'embeds':[_0x2a9e06],'ephemeral':!![]})[_0xfa099f(0x107)](()=>console['log']('Ephemeral\x20embed\x20sent'))[_0xfa099f(0x136)](_0x35772a=>console[_0xfa099f(0x116)](_0xfa099f(0x12a),_0x35772a));}}}catch(_0x358339){console['error']('An\x20error\x20occurred:',_0x358339),_0xf97c42['reply']({'content':'An\x20error\x20occurred\x20while\x20processing\x20your\x20request.','ephemeral':!![]});}}));function _0x552f(){const _0x4ddf0d=['setColor','4285235LZpBqv','Failed\x20to\x20send\x20ephemeral\x20embed:','member','en-EG','permissions','setStyle','Type\x20your\x20message\x20here','send-to-offline','12OlqpgE','cache','5803905SUVmIC','status','has','catch','getTextInputValue','guild','#2c2c34','bot','3887864FvLPcd','⚪\x20Send\x20To\x20Offline','presence','73889VBuygg','message-txt-send2','customId','Message\x20sent\x20to\x20','fetch','>\x20Report\x20Sent\x20:\x20`Send\x20To\x20Offline`','addComponents','ADMINISTRATOR','setHours','544euZYeX','setPlaceholder','then','isModalSubmit','showModal','members','user','Recipients\x20count','fields','Africa/Cairo','en-US','setTitle','setMinLength','setRequired','reply','34Athnmq','```','error','isButton','Enter\x20your\x20message\x20here','PARAGRAPH','44991XGCDSJ','offline','forEach','tag','setDescription','21115320LudIIa','interactionCreate','send','setCustomId','11BuBFPb','size','Sending\x20Time','addFields','11674845XhNbFJ'];_0x552f=function(){return _0x4ddf0d;};return _0x552f();}

function _0x4574(_0x1a83e5,_0x5ea6f2){const _0x4ec9bb=_0x4ec9();return _0x4574=function(_0x457432,_0x442d42){_0x457432=_0x457432-0xbb;let _0x2d4373=_0x4ec9bb[_0x457432];return _0x2d4373;},_0x4574(_0x1a83e5,_0x5ea6f2);}function _0x4ec9(){const _0xbdb32f=['size','PARAGRAPH','forEach','```','tag','interactionCreate','59504ibTUXx','291711jriSfR','Ephemeral\x20embed\x20sent','Failed\x20to\x20send\x20ephemeral\x20embed:','addComponents','fields','setMaxLength','catch','error','setTitle','members','2161820Fykkxt','showModal','has','📢\x20Send\x20To\x20All','isModalSubmit','en-EG','bot','log','setStyle','send-to-all','getHours','toLocaleTimeString','setDescription','Sending\x20Date','then','setMinLength','>\x20Report\x20Sent\x20:\x20`Send\x20To\x20All`','user','reply','setCustomId','6ACxzAl','Enter\x20your\x20message\x20here','An\x20error\x20occurred:','setHours','ADMINISTRATOR','3000ycOoxX','isButton','send','An\x20error\x20occurred\x20while\x20processing\x20your\x20request.','9hLLJql','customId','418717xFjGka','permissions','guild','146194YNblhg','12594coKTFw','member','filter','Failed\x20to\x20send\x20message\x20to\x20','cache','92McrGHh','setLabel','setRequired','toLocaleDateString','14520YXARrK','Africa/Cairo'];_0x4ec9=function(){return _0xbdb32f;};return _0x4ec9();}const _0x1a062b=_0x4574;(function(_0x187fe2,_0x36951c){const _0x39e1a3=_0x4574,_0x73ca22=_0x187fe2();while(!![]){try{const _0xbe063d=parseInt(_0x39e1a3(0xc6))/0x1+parseInt(_0x39e1a3(0xc9))/0x2+-parseInt(_0x39e1a3(0xca))/0x3*(parseInt(_0x39e1a3(0xcf))/0x4)+-parseInt(_0x39e1a3(0xe6))/0x5+parseInt(_0x39e1a3(0xbb))/0x6*(-parseInt(_0x39e1a3(0xdc))/0x7)+-parseInt(_0x39e1a3(0xdb))/0x8*(parseInt(_0x39e1a3(0xc4))/0x9)+-parseInt(_0x39e1a3(0xc0))/0xa*(-parseInt(_0x39e1a3(0xd3))/0xb);if(_0xbe063d===_0x36951c)break;else _0x73ca22['push'](_0x73ca22['shift']());}catch(_0xb44ce0){_0x73ca22['push'](_0x73ca22['shift']());}}}(_0x4ec9,0x4ba19),client['on'](_0x1a062b(0xda),async _0x5bc252=>{const _0x5784a8=_0x1a062b;try{if(_0x5bc252[_0x5784a8(0xc1)]()){if(!_0x5bc252[_0x5784a8(0xcb)][_0x5784a8(0xc7)][_0x5784a8(0xe8)](_0x5784a8(0xbf))){_0x5bc252[_0x5784a8(0xf8)]({'content':'You\x20do\x20not\x20have\x20permission\x20to\x20use\x20this\x20command.','ephemeral':!![]});return;}if(_0x5bc252[_0x5784a8(0xc5)]===_0x5784a8(0xef)){const _0x3735bd=new Modal()[_0x5784a8(0xf9)]('send-to-all')[_0x5784a8(0xe4)](_0x5784a8(0xe9))[_0x5784a8(0xdf)]([new MessageActionRow()[_0x5784a8(0xdf)](new TextInputComponent()[_0x5784a8(0xf9)]('message-txt-send3')[_0x5784a8(0xd0)]('Type\x20your\x20message\x20here')[_0x5784a8(0xee)](_0x5784a8(0xd6))[_0x5784a8(0xf5)](0x1)[_0x5784a8(0xe1)](0xfa0)['setPlaceholder'](_0x5784a8(0xbc))[_0x5784a8(0xd1)](!![]))]);await _0x5bc252[_0x5784a8(0xe7)](_0x3735bd);}}if(_0x5bc252[_0x5784a8(0xea)]()){if(_0x5bc252[_0x5784a8(0xc5)]==='send-to-all'){const _0x4d1399=_0x5bc252[_0x5784a8(0xe0)]['getTextInputValue']('message-txt-send3');await _0x5bc252[_0x5784a8(0xc8)][_0x5784a8(0xe5)]['fetch']();const _0xfc77ea=_0x5bc252['guild'],_0x5c5826=_0xfc77ea[_0x5784a8(0xe5)][_0x5784a8(0xce)][_0x5784a8(0xcc)](_0x15c21f=>!_0x15c21f[_0x5784a8(0xf7)][_0x5784a8(0xec)]),_0x58668d=_0x5c5826[_0x5784a8(0xd5)],_0x218329=new Date(),_0x2a53ca=_0x5784a8(0xd4),_0x54a101=_0x218329[_0x5784a8(0xd2)]('en-US',{'timeZone':_0x2a53ca});_0x218329[_0x5784a8(0xbe)](_0x218329[_0x5784a8(0xf0)]()+0x1);const _0x28494b=_0x218329[_0x5784a8(0xf1)](_0x5784a8(0xeb),{'timeZone':_0x2a53ca,'hour12':!![],'hour':'numeric','minute':'numeric'}),_0x1f2c5c=new MessageEmbed()['setColor']('#2c2c34')[_0x5784a8(0xe4)](_0x5784a8(0xf6))['addFields']({'name':'Recipients\x20count','value':_0x5784a8(0xd8)+_0x58668d+_0x5784a8(0xd8),'inline':!![]},{'name':_0x5784a8(0xf3),'value':'```'+_0x28494b+_0x5784a8(0xd8),'inline':!![]},{'name':'Sending\x20Time','value':_0x5784a8(0xd8)+_0x54a101+_0x5784a8(0xd8),'inline':!![]})[_0x5784a8(0xf2)]('**The\x20Message\x20Sent**\x0a```'+_0x4d1399+_0x5784a8(0xd8));_0x5c5826[_0x5784a8(0xd7)](_0x3d76ea=>{const _0x13f5c5=_0x5784a8;_0x3d76ea[_0x13f5c5(0xc2)](_0x4d1399)['then'](()=>console[_0x13f5c5(0xed)]('Message\x20sent\x20to\x20'+_0x3d76ea[_0x13f5c5(0xf7)][_0x13f5c5(0xd9)]))[_0x13f5c5(0xe2)](_0x215e5b=>console[_0x13f5c5(0xe3)](_0x13f5c5(0xcd)+_0x3d76ea['user'][_0x13f5c5(0xd9)]+':',_0x215e5b));}),_0x5bc252[_0x5784a8(0xf8)]({'embeds':[_0x1f2c5c],'ephemeral':!![]})[_0x5784a8(0xf4)](()=>console[_0x5784a8(0xed)](_0x5784a8(0xdd)))[_0x5784a8(0xe2)](_0x132c7c=>console[_0x5784a8(0xe3)](_0x5784a8(0xde),_0x132c7c));}}}catch(_0x486b28){console[_0x5784a8(0xe3)](_0x5784a8(0xbd),_0x486b28),_0x5bc252[_0x5784a8(0xf8)]({'content':_0x5784a8(0xc3),'ephemeral':!![]});}}));

const _0x209149=_0x2f1f;(function(_0x3ef106,_0x191c4b){const _0x5cd2e6=_0x2f1f,_0x13d873=_0x3ef106();while(!![]){try{const _0xd22a2e=-parseInt(_0x5cd2e6(0x1c6))/0x1+parseInt(_0x5cd2e6(0x196))/0x2*(parseInt(_0x5cd2e6(0x1ab))/0x3)+-parseInt(_0x5cd2e6(0x1b7))/0x4*(-parseInt(_0x5cd2e6(0x1b1))/0x5)+parseInt(_0x5cd2e6(0x1d0))/0x6+parseInt(_0x5cd2e6(0x19d))/0x7*(-parseInt(_0x5cd2e6(0x1c8))/0x8)+parseInt(_0x5cd2e6(0x1bb))/0x9+-parseInt(_0x5cd2e6(0x1bd))/0xa;if(_0xd22a2e===_0x191c4b)break;else _0x13d873['push'](_0x13d873['shift']());}catch(_0x1b97d8){_0x13d873['push'](_0x13d873['shift']());}}}(_0x14a1,0xd6926),client['on'](_0x209149(0x1ce),async _0x54c72b=>{const _0x4a4910=_0x209149;try{if(_0x54c72b['isButton']()){if(!_0x54c72b[_0x4a4910(0x19f)]['permissions']['has'](_0x4a4910(0x1b9))){_0x54c72b['reply']({'content':_0x4a4910(0x1ad),'ephemeral':!![]});return;}if(_0x54c72b[_0x4a4910(0x1b0)]===_0x4a4910(0x19e)){const _0x20dcea=new Modal()[_0x4a4910(0x1a5)](_0x4a4910(0x19e))[_0x4a4910(0x1a2)](_0x4a4910(0x199))[_0x4a4910(0x1b2)]([new MessageActionRow()['addComponents'](new TextInputComponent()['setCustomId']('recipient-id')[_0x4a4910(0x1ac)]('Type\x20the\x20person\x20ID\x20here')['setStyle'](_0x4a4910(0x1a7))[_0x4a4910(0x193)](0x1)[_0x4a4910(0x1b4)](0x64)[_0x4a4910(0x1c4)]('Enter\x20the\x20person\x20ID\x20here')['setRequired'](!![])),new MessageActionRow()[_0x4a4910(0x1b2)](new TextInputComponent()[_0x4a4910(0x1a5)]('messgae-txt-send4')[_0x4a4910(0x1ac)](_0x4a4910(0x1cf))[_0x4a4910(0x1a0)](_0x4a4910(0x1bc))['setMinLength'](0x1)['setMaxLength'](0xfa0)[_0x4a4910(0x1c4)](_0x4a4910(0x1b3))['setRequired'](!![]))]);await _0x54c72b[_0x4a4910(0x1c2)](_0x20dcea);}}if(_0x54c72b['isModalSubmit']()){if(_0x54c72b[_0x4a4910(0x1b0)]==='send-to-person'){const _0x4b0ff6=_0x54c72b[_0x4a4910(0x1a8)][_0x4a4910(0x1d1)](_0x4a4910(0x1cc)),_0x33e1ea=_0x54c72b['fields']['getTextInputValue'](_0x4a4910(0x1c5)),_0x1de52b=_0x54c72b[_0x4a4910(0x1b5)][_0x4a4910(0x1c1)]['cache'][_0x4a4910(0x1bf)](_0x33e1ea);if(!_0x1de52b){_0x54c72b[_0x4a4910(0x1a9)]({'content':_0x4a4910(0x197),'ephemeral':!![]});return;}if(_0x1de52b[_0x4a4910(0x1cb)]['bot']){_0x54c72b['reply']({'content':'You\x20cannot\x20send\x20messages\x20to\x20bots.','ephemeral':!![]});return;}const _0x4229b6=new Date(),_0x280a5f=_0x4a4910(0x1d2),_0x4ee014=_0x4229b6['toLocaleDateString'](_0x4a4910(0x1be),{'timeZone':_0x280a5f});_0x4229b6[_0x4a4910(0x19a)](_0x4229b6[_0x4a4910(0x198)]()+0x1);const _0x4762f0=_0x4229b6['toLocaleTimeString'](_0x4a4910(0x195),{'timeZone':_0x280a5f,'hour12':!![],'hour':'numeric','minute':'numeric'});_0x1de52b[_0x4a4910(0x1c0)](_0x4b0ff6)[_0x4a4910(0x1c3)](()=>{const _0x28509e=_0x4a4910,_0x36ce6c=new MessageEmbed()['setColor'](_0x28509e(0x194))[_0x28509e(0x1a2)](_0x28509e(0x1ba))[_0x28509e(0x1c9)]({'name':_0x28509e(0x1af),'value':'```'+_0x1de52b[_0x28509e(0x1cb)][_0x28509e(0x1a1)]+_0x28509e(0x1b8),'inline':!![]},{'name':_0x28509e(0x1a4),'value':'```'+_0x4ee014+_0x28509e(0x1b8),'inline':!![]},{'name':_0x28509e(0x1c7),'value':_0x28509e(0x1b8)+_0x4762f0+'```','inline':!![]})[_0x28509e(0x1ca)](_0x28509e(0x1a6)+_0x33e1ea+_0x28509e(0x19b)+_0x4b0ff6+_0x28509e(0x1b8));_0x54c72b[_0x28509e(0x1a9)]({'embeds':[_0x36ce6c],'ephemeral':!![]})[_0x28509e(0x1c3)](()=>console[_0x28509e(0x1a3)]('Ephemeral\x20embed\x20sent'))[_0x28509e(0x19c)](_0x3a958b=>console['error']('Failed\x20to\x20send\x20ephemeral\x20embed:',_0x3a958b));})[_0x4a4910(0x19c)](_0x2abd54=>{const _0x5ccb8a=_0x4a4910;console[_0x5ccb8a(0x1cd)](_0x5ccb8a(0x1ae)+_0x1de52b[_0x5ccb8a(0x1cb)][_0x5ccb8a(0x1a1)]+':',_0x2abd54),_0x54c72b['reply']({'content':_0x5ccb8a(0x1ae)+_0x1de52b['user'][_0x5ccb8a(0x1a1)]+'.','ephemeral':!![]});});}}}catch(_0x18985a){console[_0x4a4910(0x1cd)](_0x4a4910(0x1aa),_0x18985a),_0x54c72b[_0x4a4910(0x1a9)]({'content':_0x4a4910(0x1b6),'ephemeral':!![]});}}));function _0x2f1f(_0x4a72c9,_0x57a86d){const _0x14a1f6=_0x14a1();return _0x2f1f=function(_0x2f1f79,_0xa90979){_0x2f1f79=_0x2f1f79-0x193;let _0x5016fe=_0x14a1f6[_0x2f1f79];return _0x5016fe;},_0x2f1f(_0x4a72c9,_0x57a86d);}function _0x14a1(){const _0x53131b=['setMaxLength','guild','An\x20error\x20occurred\x20while\x20processing\x20your\x20request.','1578556WTogEt','```','ADMINISTRATOR','>\x20Report\x20Sent\x20:\x20`Send\x20To\x20Person`','818937kCPocq','PARAGRAPH','14880260xbvhTY','en-US','get','send','members','showModal','then','setPlaceholder','recipient-id','1415677DQgsQQ','Sending\x20Time','128doMwwH','addFields','setDescription','user','messgae-txt-send4','error','interactionCreate','Type\x20your\x20message\x20here','10497456QcMpZv','getTextInputValue','Africa/Cairo','setMinLength','#2c2c34','en-EG','4178IVfOtu','Member\x20not\x20found.','getHours','👤\x20Send\x20To\x20Person','setHours','>**\x0a```','catch','100702Zblrvy','send-to-person','member','setStyle','tag','setTitle','log','Sending\x20Date','setCustomId','**The\x20Message\x20Sent\x20:\x20<@','SHORT','fields','reply','An\x20error\x20occurred:','1986eDiwPY','setLabel','You\x20do\x20not\x20have\x20permission\x20to\x20use\x20this\x20command.','Failed\x20to\x20send\x20message\x20to\x20','Recipient','customId','10FhnCPv','addComponents','Enter\x20your\x20message\x20here'];_0x14a1=function(){return _0x53131b;};return _0x14a1();}

(function(_0x26965a,_0x4dcc53){const _0x215bf3=_0x43b5,_0x5c0ee4=_0x26965a();while(!![]){try{const _0x1cbad0=-parseInt(_0x215bf3(0x104))/0x1+-parseInt(_0x215bf3(0xf8))/0x2*(-parseInt(_0x215bf3(0x120))/0x3)+parseInt(_0x215bf3(0x10d))/0x4*(-parseInt(_0x215bf3(0x11b))/0x5)+parseInt(_0x215bf3(0x114))/0x6+-parseInt(_0x215bf3(0xf3))/0x7*(-parseInt(_0x215bf3(0xe9))/0x8)+-parseInt(_0x215bf3(0x115))/0x9+-parseInt(_0x215bf3(0x11c))/0xa*(parseInt(_0x215bf3(0x10c))/0xb);if(_0x1cbad0===_0x4dcc53)break;else _0x5c0ee4['push'](_0x5c0ee4['shift']());}catch(_0x56e162){_0x5c0ee4['push'](_0x5c0ee4['shift']());}}}(_0x1c9a,0x36ab2),client['on']('interactionCreate',async _0x222d63=>{const _0x2f6240=_0x43b5;try{if(_0x222d63[_0x2f6240(0xeb)]()){if(!_0x222d63[_0x2f6240(0xf1)][_0x2f6240(0x101)][_0x2f6240(0x102)](_0x2f6240(0x127))){_0x222d63['reply']({'content':_0x2f6240(0x11a),'ephemeral':!![]});return;}if(_0x222d63[_0x2f6240(0x121)]===_0x2f6240(0x106)){const _0xce494c=new Modal()['setCustomId'](_0x2f6240(0x106))[_0x2f6240(0x110)]('🎭\x20Send\x20To\x20Role')[_0x2f6240(0x111)]([new MessageActionRow()[_0x2f6240(0x111)](new TextInputComponent()['setCustomId'](_0x2f6240(0xf2))[_0x2f6240(0x129)](_0x2f6240(0xf0))[_0x2f6240(0x10f)](_0x2f6240(0x105))[_0x2f6240(0xf9)](0x1)[_0x2f6240(0xf6)](0x64)[_0x2f6240(0x10a)]('Enter\x20the\x20role\x20ID\x20here')['setRequired'](!![])),new MessageActionRow()[_0x2f6240(0x111)](new TextInputComponent()['setCustomId'](_0x2f6240(0x119))[_0x2f6240(0x129)](_0x2f6240(0xf4))['setStyle'](_0x2f6240(0x109))[_0x2f6240(0xf9)](0x1)[_0x2f6240(0xf6)](0xfa0)[_0x2f6240(0x10a)](_0x2f6240(0xfa))[_0x2f6240(0xfd)](!![]))]);await _0x222d63[_0x2f6240(0x122)](_0xce494c);}}if(_0x222d63[_0x2f6240(0x125)]()){if(_0x222d63['customId']===_0x2f6240(0x106)){const _0x28771d=_0x222d63[_0x2f6240(0x112)]['getTextInputValue'](_0x2f6240(0x119)),_0x5c612e=_0x222d63[_0x2f6240(0x112)]['getTextInputValue'](_0x2f6240(0xf2)),_0x32df2b=_0x222d63[_0x2f6240(0x117)][_0x2f6240(0xfc)]['cache'][_0x2f6240(0x124)](_0x5c612e);if(!_0x32df2b){_0x222d63[_0x2f6240(0xef)]({'content':_0x2f6240(0x103),'ephemeral':!![]});return;}const _0x49909a=_0x32df2b[_0x2f6240(0xfb)];let _0x2aa56a=0x0;const _0x26345f=new Date(),_0xdd86d4=_0x2f6240(0x100),_0x377fad=_0x26345f['toLocaleDateString']('en-US',{'timeZone':_0xdd86d4});_0x26345f['setHours'](_0x26345f['getHours']()+0x1);const _0x4a6548=_0x26345f['toLocaleTimeString'](_0x2f6240(0x11e),{'timeZone':_0xdd86d4,'hour12':!![],'hour':_0x2f6240(0xea),'minute':_0x2f6240(0xea)});_0x49909a[_0x2f6240(0xee)](_0x261107=>{const _0x93b799=_0x2f6240;!_0x261107['user'][_0x93b799(0xed)]&&_0x261107[_0x93b799(0x128)](_0x28771d)[_0x93b799(0x113)](()=>{_0x2aa56a++;})[_0x93b799(0x123)](_0x43d5dd=>{const _0x528cfd=_0x93b799;console['error'](_0x528cfd(0x126)+_0x261107[_0x528cfd(0x116)][_0x528cfd(0xec)]+':',_0x43d5dd);});});const _0xb1d397=new MessageEmbed()[_0x2f6240(0x11d)]('#2c2c34')[_0x2f6240(0x110)](_0x2f6240(0x118))[_0x2f6240(0xfe)]({'name':'Role\x20ID','value':_0x2f6240(0xf7)+_0x5c612e+'```','inline':!![]},{'name':'Sending\x20Date','value':'```'+_0x377fad+'```','inline':!![]},{'name':_0x2f6240(0x108),'value':_0x2f6240(0xf7)+_0x4a6548+_0x2f6240(0xf7),'inline':!![]})[_0x2f6240(0xff)](_0x2f6240(0xe8)+_0x5c612e+'>**\x0a```'+_0x28771d+_0x2f6240(0xf7));_0x222d63[_0x2f6240(0xef)]({'embeds':[_0xb1d397],'ephemeral':!![]})['then'](()=>console['log'](_0x2f6240(0x107)))['catch'](_0x5c229d=>console[_0x2f6240(0x11f)](_0x2f6240(0x10e),_0x5c229d));}}}catch(_0x12c158){console[_0x2f6240(0x11f)](_0x2f6240(0x10b),_0x12c158),_0x222d63[_0x2f6240(0xef)]({'content':_0x2f6240(0xf5),'ephemeral':!![]});}}));function _0x43b5(_0x5868f1,_0x3f2a5d){const _0x1c9aa7=_0x1c9a();return _0x43b5=function(_0x43b545,_0x466666){_0x43b545=_0x43b545-0xe8;let _0xba12d9=_0x1c9aa7[_0x43b545];return _0xba12d9;},_0x43b5(_0x5868f1,_0x3f2a5d);}function _0x1c9a(){const _0x1e4c37=['setMaxLength','```','884582HGpZKb','setMinLength','Enter\x20your\x20message\x20here','members','roles','setRequired','addFields','setDescription','Africa/Cairo','permissions','has','Role\x20not\x20found.','151228uFsXFi','SHORT','send-to-role','Ephemeral\x20embed\x20sent','Sending\x20Time','PARAGRAPH','setPlaceholder','An\x20error\x20occurred:','22pEMPxW','4oJLFaJ','Failed\x20to\x20send\x20ephemeral\x20embed:','setStyle','setTitle','addComponents','fields','then','2222244dMteZv','630720uNSGtU','user','guild','>\x20Report\x20Sent\x20:\x20`Send\x20To\x20Role`','message-txt-send','You\x20do\x20not\x20have\x20permission\x20to\x20use\x20this\x20command.','1114655lJVpqH','1555700yZjrJs','setColor','en-EG','error','3ileFXU','customId','showModal','catch','get','isModalSubmit','Failed\x20to\x20send\x20message\x20to\x20','ADMINISTRATOR','send','setLabel','**The\x20Message\x20Sent\x20:\x20<@&','8rOLjHR','numeric','isButton','tag','bot','forEach','reply','Type\x20the\x20role\x20ID\x20here','member','recipient-role-id','1166452WndVvo','Type\x20your\x20message\x20here','An\x20error\x20occurred\x20while\x20processing\x20your\x20request.'];_0x1c9a=function(){return _0x1e4c37;};return _0x1c9a();}
/////////////////////////////////////////////////////////////////////////////////////////////////// Broadcast SYSTEM




/////////////////////////////////////////////////////////////////////////////////////////////////// TIME SYSTEM
client.on('messageCreate', async (message) => {
    if (message.content.toLowerCase() === '+time-server-99') {
        console.log('Received +time command');
        try {
            const embedMessage = await sendTimeEmbed(message.channel);
            console.log('Embed message sent successfully');
            startUpdatingEmbed(embedMessage);
        } catch (sendError) {
            console.error('Error sending embed message:', sendError);
        }
    }
});

async function sendTimeEmbed(channel) {
    const now = moment().tz('Africa/Cairo');
    const startOfYear = moment().tz('Africa/Cairo').startOf('year');
    const daysElapsed = now.diff(startOfYear, 'days') + 1;
    const weeksElapsed = Math.ceil(daysElapsed / 7);
    const monthsElapsed = now.month() + 1;
    const hoursRemainingToday = 24 - now.hours();
    const hoursElapsedThisYear = now.diff(startOfYear, 'hours');
    let buffer_attach = await generareCanvas4(channel);
    const attachment = new MessageAttachment(buffer_attach, 'image/timeback.png');

    const embed = new MessageEmbed()
        .setTitle('> <a:ejgif1004:1241743499678973952> بيانات الوقت و التاريخ بتوقيت `القاهرة` <a:ejgif1005:1241743503403253860>')
        .setFooter({ 
                text: '.يتم تحديث الوقت تلقائيًا كل دقيقة !', 
                iconURL: client.user.displayAvatarURL() // هذه هي صورة البوت
            })
        .setColor("2c2c34")
        .setImage('attachment://timeback.png')
        .addFields(
            { name: 'الوقت', value: `\`\`\`${getCairoTime()}\`\`\``, inline: true },
            { name: 'التاريخ', value: `\`\`\`${getCairoGregorianDate()} AD\`\`\``, inline: true },
            { name: 'ايام الاسبوع', value: `\`\`\`${getCairoDayOfWeek()}\`\`\``, inline: true },
            { name: 'الموسم الحالي', value: `\`\`\`${getCurrentSeason()}\`\`\``, inline: true },
            { name: 'القطس بالقاهرة', value: `\`\`\`${getCurrentWeather()}\`\`\``, inline: true },
            { name: 'درجة حرارة بالقاهرة', value: `\`\`\`${getCurrentTemperature()}°C\`\`\``, inline: true },
            { name: 'الرطوبة بالقاهرة', value: `\`\`\`${getCurrentHumidity()}%\`\`\``, inline: true },
            { name: 'الساعات المتبقية لهذا اليوم', value: `\`\`\`${hoursRemainingToday}\`\`\``, inline: true },
            { name: 'أيام السنة المنقضية', value: `\`\`\`${daysElapsed}\`\`\``, inline: true },
            { name: 'أسابيع السنة المنقضية', value: `\`\`\`${weeksElapsed}\`\`\``, inline: true },
            { name: 'أشهر السنة المنقضية', value: `\`\`\`${monthsElapsed}\`\`\``, inline: true },
            { name: 'ساعات السنة المنقضية', value: `\`\`\`${hoursElapsedThisYear}\`\`\``, inline: true }
        );

    const sentMessage = await channel.send({ embeds: [embed], files: [attachment] });
    return sentMessage;
}

async function updateTimeEmbed(message) {
    const now = moment().tz('Africa/Cairo');
    const startOfYear = moment().tz('Africa/Cairo').startOf('year');
    const daysElapsed = now.diff(startOfYear, 'days') + 1;
    const weeksElapsed = Math.ceil(daysElapsed / 7);
    const monthsElapsed = now.month() + 1;
    const hoursRemainingToday = 24 - now.hours();
    const hoursElapsedThisYear = now.diff(startOfYear, 'hours');
    let buffer_attach = await generareCanvas4(message);
    const attachment = new MessageAttachment(buffer_attach, 'image/timeback.png');

    const updatedEmbed = new MessageEmbed()
        .setTitle('> <a:ejgif1004:1241743499678973952> بيانات الوقت و التاريخ بتوقيت `القاهرة` <a:ejgif1005:1241743503403253860>')
        .setFooter({ 
                text: '.يتم تحديث الوقت تلقائيًا كل دقيقة !', 
                iconURL: client.user.displayAvatarURL() // هذه هي صورة البوت
            })
        .setImage('attachment://timeback.png')
        .setColor("2c2c34")
        .addFields(
            { name: 'الوقت', value: `\`\`\`${getCairoTime()}\`\`\``, inline: true },
            { name: 'التاريخ', value: `\`\`\`${getCairoGregorianDate()} AD\`\`\``, inline: true },
            { name: 'ايام الاسبوع', value: `\`\`\`${getCairoDayOfWeek()}\`\`\``, inline: true },
            { name: 'الموسم الحالي', value: `\`\`\`${getCurrentSeason()}\`\`\``, inline: true },
            { name: 'القطس بالقاهرة', value: `\`\`\`${getCurrentWeather()}\`\`\``, inline: true },
            { name: 'درجة حرارة بالقاهرة', value: `\`\`\`${getCurrentTemperature()}°C\`\`\``, inline: true },
            { name: 'الرطوبة بالقاهرة', value: `\`\`\`${getCurrentHumidity()}%\`\`\``, inline: true },
            { name: 'الساعات المتبقية لهذا اليوم', value: `\`\`\`${hoursRemainingToday}\`\`\``, inline: true },
            { name: 'أيام السنة المنقضية', value: `\`\`\`${daysElapsed}\`\`\``, inline: true },
            { name: 'أسابيع السنة المنقضية', value: `\`\`\`${weeksElapsed}\`\`\``, inline: true },
            { name: 'أشهر السنة المنقضية', value: `\`\`\`${monthsElapsed}\`\`\``, inline: true },
            { name: 'ساعات السنة المنقضية', value: `\`\`\`${hoursElapsedThisYear}\`\`\``, inline: true }
        );

    await message.edit({ embeds: [updatedEmbed], files: [attachment] });
}

async function generareCanvas4(member) {
    const background = await resolveImage("image/timeback.png"); // استخدام اسم الملف المحلي مباشرة هنا
    const { weirdToNormalChars } = require('weird-to-normal-chars');
    let canvas = new Canvas(850, 425)
        .printImage(background, 0, 0, 850, 425)
        .setColor("#FFFFFF")
        .setTextAlign('center')
        .setTextFont('20px Discord')
        .printText(`الموسم الحالي`, 690, 285)
        .setTextAlign('center')
        .setTextFont('bold 15px Arial')
        .setColor("#FFFFFF")
        .printText(`${getCurrentSeason()}`, 690, 340)
        .setColor("#FFFFFF")
        .setTextAlign('center')
        .setTextFont('20px Discord')
        .printText(`التاريخ و الوقت`, 425, 285)
        .setTextAlign('center')
        .setTextFont('bold 15px Arial')
        .setColor("#FFFFFF")
        .printText(`${getCairoTime()}・${getCairoGregorianDate()} AD`, 425, 340)
        .setColor("#FFFFFF")
        .setTextAlign('center')
        .setTextFont('20px Discord')
        .printText(`أيام الاسبوع`, 160, 285)
        .setTextAlign('center')
        .setTextFont('bold 15px Arial')
        .setColor("#FFFFFF")
        .printText(`${getCairoDayOfWeek()}`, 160, 340)
        .setColor("#FFFFFF")
        .setTextAlign('center')
        .setTextFont('20px Discord')
        .printText(`الموسم الحالي`, 160, 90)
        .setTextAlign('center')
        .setTextFont('bold 15px Arial')
        .setColor("#FFFFFF")
        .printText(`${getCurrentSeason()}`, 160, 145)
        .setColor("#FFFFFF")
        .setTextAlign('center')
        .setTextFont('20px Discord')
        .printText(`الطقس`, 690, 90)
        .setTextAlign('center')
        .setTextFont('bold 15px Arial')
        .setColor("#FFFFFF")
        .printText(`${getCurrentWeather()}`, 690, 145);
    
    const discordjoin = await resolveImage(__dirname + "/image/discordjoin.png");
    canvas.printImage(discordjoin, 365, 85, 120, 120);

    return canvas.toBufferAsync();
}

function startUpdatingEmbed(embedMessage) {
    if (!updatingEmbed) {
        updatingEmbed = true;
        setInterval(async () => {
            try {
                await updateTimeEmbed(embedMessage);
                console.log('Embed message updated successfully');
            } catch (updateError) {
                console.error('Error updating embed message:', updateError);
            }
        }, 60000); // 10000 ميلي ثانية = 10 ثواني (للاختبار)
    } else {
        console.log('Embed message update already in progress');
    }
}

function getCurrentTemperature() {
    return Math.floor(Math.random() * 30) + 15;
}

function getCurrentHumidity() {
    return Math.floor(Math.random() * 60) + 40;
}

function getCurrentSeason() {
    const month = moment().tz('Africa/Cairo').month();
    if (month >= 3 && month <= 5) {
        return 'ربيع';
    } else if (month >= 6 && month <= 8) {
        return 'صيف';
    } else if (month >= 9 && month <= 11) {
        return 'خريف';
    } else {
        return 'شتاء';
    }
}

function getCurrentWeather() {
    const isSunny = Math.random() < 0.5;
    return isSunny ? 'مشمس' : 'غائم';
}

function getCairoDayOfWeek() {
    return moment().tz('Africa/Cairo').locale('ar').format('dddd');
}

function getCairoTime() {
    return moment().tz('Africa/Cairo').format('hh:mm A');
}

function getCairoGregorianDate() {
    return moment().tz('Africa/Cairo').format('YYYY/MM/DD');
}
/////////////////////////////////////////////////////////////////////////////////////////////////// TIME SYSTEM




/////////////////////////////////////////////////////////////////////////////////////////////////// LEVELING SYSTEM
module.exports = {
    getUserData
    // قم بتصدير الدوال الأخرى إذا لزم الأمر
};


const xpPerMessage = 77;
const xpPerLevel = 1111;
const levelUpFilePath = './levelup.json';

function getUserData(userId) {
    try {
        const userData = JSON.parse(fs.readFileSync(levelUpFilePath, 'utf8'));
        return userData[userId];
    } catch (err) {
        console.error('Error reading file:', err);
        return null;
    }
}

async function generateLeaderboardEmbed(sortedUsers, page = 1, itemsPerPage = 8, message) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const users = sortedUsers.slice(start, end);

    const leaderboardEmbed = new MessageEmbed()
        .setColor('#302c34')
        .setTimestamp()
        .setAuthor({ name: `قائمة التصنيف الخاصة بمستوي الاعضاء 📋`, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setFooter(`${message.author.tag} • صفحة ${page} من ${Math.ceil(sortedUsers.length / itemsPerPage)}`, message.author.displayAvatarURL({ dynamic: true }));

    let description = '';

    for (let index = 0; index < users.length; index++) {
        const [userId, xp] = users[index];
        const { level } = getUserLevelAndXP(xp);
        const user = client.users.cache.get(userId);
        const position = start + index + 1;

        if (user) {
            if (user.id === message.author.id) {
                description += `**🔸 #${position} 〢 ${message.author.toString()}・المستوي : \`${level}\` | نقاط الخبرة : \`${xp}\`**\n`;
            } else {
                description += `🔹 #${position} 〢 ${user.toString()}・المستوي : \`${level}\` | نقاط الخبرة : \`${xp}\`\n`;
            }
        }
    }

    leaderboardEmbed.setDescription(description);

    return leaderboardEmbed;
}
  


function getSortedUserData() {
    let userData = {};
    try {
        userData = JSON.parse(fs.readFileSync(levelUpFilePath, 'utf8'));
    } catch (err) {
        console.error('Error reading file:', err);
    }
    return Object.entries(userData).sort((a, b) => b[1] - a[1]);
}


function getUserLevelAndXP(userData) {
    const level = Math.floor(userData / xpPerLevel);
    const xp = userData % xpPerLevel;
    return { level, xp };
}

function getLeaderboardPosition(userId) {
    const userData = JSON.parse(fs.readFileSync(levelUpFilePath, 'utf8'));
    const userXP = userData[userId] || 0;
    let position = 1;

    for (const id in userData) {
        if (userData[id] > userXP) {
            position++;
        }
    }

    return position;
}

async function generareCanvas5(member, levelUps, leaderboardPosition, oldLevel) {
    try {
        console.log("Generating canvas for member:", member.user.username); // تحقق من بناء الكانفاس لعضو معين
        const background = await resolveImage("image/levelback.png");
        const { weirdToNormalChars } = require('weird-to-normal-chars');
        const avatar = await resolveImage(member.user.displayAvatarURL({ 'size': 2048, 'format': "png" }));
        const name = weirdToNormalChars(member.user.username);

        let canvas = new Canvas(852, 324)
            .printImage(background, 0, 0, 852, 324)
            .printCircularImage(avatar, 150, 160, 85)
            .setColor("#FFFFFF")
            .setTextAlign('center')
            .setTextFont('20px Discord')
            .printText(`المستوي`, 710, 110)
            .setColor("#FFFFFF")
            .setTextAlign('center')
            .setTextFont('18px Discord')
            .printText(`أسمك`, 435, 110)
            .setTextAlign("center")
            .setColor("#FFFFFF")
            .setTextFont('20px Discordx')
            .printText(`${name}`, 440, 170)
            .setTextAlign("center")
            .setColor("#FFFFFF")
            .setTextFont('15px Discordx')
            .printText(`${oldLevel} > ${levelUps}・#${leaderboardPosition}`, 710, 170);

        return await canvas.toBufferAsync();
    } catch (error) {
        console.log('Error generating canvas:', error);
    }
}

client.on('guildMemberRemove', member => {
    try {
        const userData = JSON.parse(fs.readFileSync(levelUpFilePath, 'utf8'));

        if (userData[member.id]) {
            delete userData[member.id];
            fs.writeFileSync(levelUpFilePath, JSON.stringify(userData), 'utf8');
            console.log(`Removed data for user ${member.id} who left the server.`);
        }
    } catch (err) {
        console.error('Error updating file:', err);
    }
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const args = message.content.trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === `${prefix}add-xp`) {
        if (!message.member.permissions.has("ADMINISTRATOR")) {
            message.reply('You do not have permission to use this command.7');
            return;
        }

        const userId = args[0]?.replace(/\D/g, '');
        const xpAmount = parseInt(args[1]);

        if (!userId || !xpAmount || isNaN(xpAmount)) {
            message.reply('Invalid command usage. Correct usage: !add-xp [@mention or id] [xp amount]');
            return;
        }

        let userData = {};
        try {
            userData = JSON.parse(fs.readFileSync(levelUpFilePath, 'utf8'));
        } catch (err) {
            console.error('Error reading file:', err);
        }

        userData[userId] = (userData[userId] || 0) + xpAmount;

        fs.writeFileSync(levelUpFilePath, JSON.stringify(userData), 'utf8');

        message.reply(`Added ${xpAmount} XP to user with ID ${userId}.`);
        return;
    }

    if (command === `${prefix}add-level`) {
        if (!message.member.permissions.has("ADMINISTRATOR")) {
            message.reply('You do not have permission to use this command.8');
            return;
        }

        const userId = args[0]?.replace(/\D/g, '');
        const levelAmount = parseInt(args[1]);

        if (!userId || !levelAmount || isNaN(levelAmount)) {
            message.reply('Invalid command usage. Correct usage: !add-level [@mention or id] [level amount]');
            return;
        }

        let userData = {};
        try {
            userData = JSON.parse(fs.readFileSync(levelUpFilePath, 'utf8'));
        } catch (err) {
            console.error('Error reading file:', err);
        }

        userData[userId] = (userData[userId] || 0) + levelAmount * xpPerLevel;

        fs.writeFileSync(levelUpFilePath, JSON.stringify(userData), 'utf8');

        message.reply(`Added ${levelAmount} level(s) to user with ID ${userId}.`);
        return;
    }

    if (command === `${prefix}reset-level-member`) {
        if (!message.member.permissions.has("ADMINISTRATOR")) {
            message.reply('You do not have permission to use this command.9');
            return;
        }

        const userId = args[0]?.replace(/\D/g, '');

        if (!userId) {
            message.reply('Invalid command usage. Correct usage: !reset-leveling [@mention or id]');
            return;
        }

        let userData = {};
        try {
            userData = JSON.parse(fs.readFileSync(levelUpFilePath, 'utf8'));
        } catch (err) {
            console.error('Error reading file:', err);
        }

        userData[userId] = 0;

        fs.writeFileSync(levelUpFilePath, JSON.stringify(userData), 'utf8');

        message.reply(`Reset leveling for user with ID ${userId}.`);
        return;
    }

    if (command === `${prefix}xp`) {
        let targetUserId = message.author.id;

        if (message.mentions.users.size > 0) {
            targetUserId = message.mentions.users.first().id;
        } else if (args[0]) {
            targetUserId = args[0].replace(/\D/g, '');
        }

        const userData = getUserData(targetUserId);

        if (!userData) {
            message.channel.send('User not found in the leveling system.');
            return;
        }

        const { level, xp } = getUserLevelAndXP(userData);
        const leaderboardPosition = getLeaderboardPosition(targetUserId);
        const user = await client.users.fetch(targetUserId);
        const userAvatarURL = user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 });
        const username = user.username;

        const embed = new MessageEmbed()
            .setTitle('> Rank Information')
            .setThumbnail(userAvatarURL)
            .setFooter({ text: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
            .addFields(
                { name: 'Level', value: `\`\`\`${level}\`\`\``, inline: true },
                { name: 'Rank', value: `\`\`\`#${leaderboardPosition}\`\`\``, inline: true },
                { name: 'Total XP', value: `\`\`\`${level * xpPerLevel + xp}\`\`\``, inline: true },
                { name: 'XP Point', value: `\`\`\`${xp}/${xpPerLevel}\`\`\``, inline: true },
                { name: 'Username', value: `\`\`\`${username}\`\`\``, inline: true },
                { name: 'Joined Server', value: `\`\`\`${moment(user.joinedAt).format('YYYY/MM/DD')}\`\`\``, inline: true }
            );

        message.channel.send({ embeds: [embed] });
        return;
    }

if (command === `${prefix}top`) {
    const sortedUsers = getSortedUserData();
    let page = 1;
    const itemsPerPage = 8;
    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

    const leaderboardEmbed = await generateLeaderboardEmbed(sortedUsers, page, itemsPerPage, message);

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('first')
                .setEmoji('⏪')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('prev')
                .setEmoji('◀️')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('home')
                .setEmoji('🏠')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('next')
                .setEmoji('▶️')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('last')
                .setEmoji('⏩')
                .setStyle('PRIMARY')
        );

    const messageEmbed = await message.reply({ embeds: [leaderboardEmbed], components: [row] });

    const filter = i => ['first', 'prev', 'home', 'next', 'last'].includes(i.customId) && i.user.id === message.author.id;
    const collector = messageEmbed.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async i => {
        if (i.customId === 'first') page = 1;
        if (i.customId === 'prev' && page > 1) page--;
        if (i.customId === 'home') page = 1;
        if (i.customId === 'next' && page < totalPages) page++;
        if (i.customId === 'last') page = totalPages;

        const newEmbed = await generateLeaderboardEmbed(sortedUsers, page, itemsPerPage, message);
        await i.update({ embeds: [newEmbed], components: [row] });
    });

    collector.on('end', collected => {
        row.components.forEach(component => component.setDisabled(true));
        messageEmbed.edit({ components: [row] });
    });

    return;
}



    const authorId = message.author.id;
    const levelUpChannel = message.guild.channels.cache.get(levelUpChannelId);

    let userData = {};
    try {
        userData = JSON.parse(fs.readFileSync(levelUpFilePath, 'utf8'));
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('Level up file does not exist, creating new file.');
            fs.writeFileSync(levelUpFilePath, JSON.stringify(userData), 'utf8');
        } else {
            console.error('Error reading file:', err);
        }
    }

    userData[authorId] = (userData[authorId] || 0) + xpPerMessage;

    const remainingXP = userData[authorId] % xpPerLevel;
    const levelUps = Math.floor(userData[authorId] / xpPerLevel);

    if (levelUps > (userData[`${authorId}_level`] || 0)) {
        const oldLevel = userData[`${authorId}_level`] || 0;
        const leaderboardPosition = getLeaderboardPosition(authorId);
        userData[`${authorId}_level`] = oldLevel + 1;
        userData[`${authorId}_level`] = levelUps;
        fs.writeFileSync(levelUpFilePath, JSON.stringify(userData), 'utf8');

        const member = message.guild.members.cache.get(authorId);
        if (member) {
            try {
                let buffer_attach = await generareCanvas5(member, levelUps, leaderboardPosition, oldLevel);
                const attachment = new MessageAttachment(buffer_attach, 'image/levelback.png');

                levelUpChannel.send({content: `** ${levelUps} **ㅤ**You have now reached the level**ㅤ** ${member} **ㅤ**congratulations**`, files: [attachment] });
            } catch (error) {
                console.error('Error generating level up canvas:', error);
            }
        } else {
            console.error('Member not found in the guild.');
        }
    } else {
        fs.writeFileSync(levelUpFilePath, JSON.stringify(userData), 'utf8');
    }
});
/////////////////////////////////////////////////////////////////////////////////////////////////// LEVELING SYSTEM



// زيادة الحد الأقصى لعدد مستمعي الأحداث لعميل Discord
client.setMaxListeners(30); // تعيين العدد الذي ترغب فيه للحد الأقصى


client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase() === `${prefix}report-system`) {
    
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply("You don't have permission to use this command.");
    }
    
    const buttonRow = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('report-server-modal')
          .setStyle('PRIMARY')
          .setLabel('📝 Send Report')
      );

    const embed = new MessageEmbed()
      .setTitle('> <a:ejgif1036:1250132334502739979> Submit A Report <a:ejgif1006:1241743608617504788>')
      .setThumbnail(message.guild.iconURL({ dynamic: true, size: 4096 }))
      .setImage("https://cdn.discordapp.com/attachments/1232668066069086248/1237501284551229511/E77wRD1KOLAfsd4tp6_standard.gif?ex=663be061&is=663a8ee1&hm=91a04116ef47ac24d61a2a8dea69fe3f2fa3c56d770a5122efe27ba470b3075a&")
      .setDescription(' **Rules Send Report** \n 1. Clearly state the violation observed. \n2. Provide relevant evidence, such as screenshots. \n3. Specify the time and location of the incident. \n4. Avoid using inflammatory language. \n5. Respect confidentiality and privacy concerns. \n6. Follow the server reporting guidelines. \n7. Await moderation team response patiently. \n8. Refrain from submitting false accusations.')
      .setColor('#2c2c34');

    message.channel.send({
      embeds: [embed],
      components: [buttonRow]
    });
  }
});
client.on('interactionCreate', async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === 'accept_sug') {
      // التحقق مما إذا كان لدى المستخدم الرتبة المطلوبة
      if (!interaction.member.roles.cache.has('1221887006502686720')) {
        return interaction.reply({ content: 'You do not have permission to do that.', ephemeral: true });
      }

      // تعديل الـ Embed
      const embed = interaction.message.embeds[0];
      embed.fields.find(field => field.name === 'Status').value = '✅ Accepted';
      
      // تعطيل الزر بعد الضغط عليه
      interaction.component.setDisabled(true);

      // إعادة إرسال الرسالة مع التعديلات وتحديث الزر
      await interaction.update({ embeds: [embed], components: [interaction.message.components[0]] });
    }
    if (interaction.customId === 'unaccept_sug') {
      // التحقق مما إذا كان لدى المستخدم الرتبة المطلوبة
      if (!interaction.member.roles.cache.has('1221887006502686720')) {
        return interaction.reply({ content: 'You do not have permission to do that.', ephemeral: true });
      }

      // تعديل الـ Embed
      const embed = interaction.message.embeds[0];
      embed.fields.find(field => field.name === 'Status').value = '❌ Reject';
      
      // تعطيل الزر بعد الضغط عليه
      interaction.component.setDisabled(true);

      // إعادة إرسال الرسالة مع التعديلات وتحديث الزر
      await interaction.update({ embeds: [embed], components: [interaction.message.components[0]] });
    }
    // التحقق مما إذا كان العضو قد قام بالتصويت مسبقًا

    // Check if the button is part of the voting system
    if (interaction.customId === 'report-server-modal') {
      const modal = new Modal()
        .setCustomId('report-server-modal')
        .setTitle('Send Report Message')
        .addComponents([
          new MessageActionRow().addComponents(
            new TextInputComponent()
              .setCustomId('report-server-input')
              .setLabel('Report Title')
              .setStyle('SHORT')
              .setMinLength(1)
              .setMaxLength(200)
              .setPlaceholder('Enter Report Title Here')
              .setRequired(true),
          ),
          new MessageActionRow().addComponents(
            new TextInputComponent()
              .setCustomId('2report-server-input')
              .setLabel('what Is The Report')
              .setStyle('PARAGRAPH')
              .setMinLength(1)
              .setMaxLength(4000)
              .setPlaceholder('Enter Report Here')
              .setRequired(true),
          ),
          new MessageActionRow().addComponents(
            new TextInputComponent()
              .setCustomId('3report-server-input')
              .setLabel('Image Link / Not Mandatory')
              .setStyle('SHORT')
              .setMinLength(1)
              .setMaxLength(200)
              .setPlaceholder('Enter Image Link Here')
              .setRequired(false),
          ),
        ]);

      await interaction.showModal(modal);
    }
  }

if (interaction.isModalSubmit()) {
  if (interaction.customId === 'report-server-modal') {
    const response = interaction.fields.getTextInputValue('report-server-input');
    const response2 = interaction.fields.getTextInputValue('2report-server-input');
    const response3 = interaction.fields.getTextInputValue('3report-server-input');
    const startTimestamp = Math.floor(Date.now() / 1000) - 27;
    let currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 1);
    const userId = interaction.user.id;
    const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
    const egyptianDate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });
    
    const embed2 = new MessageEmbed()
      .setColor('#2c2c34')
      .setTitle('> 📝 New Report')
      .setImage(`${response3}`)
      .setDescription(`**Report Title** \`\`\`${response}\`\`\` \n**Report Description** \`\`\`${response2}\`\`\``)
      .addFields(
          { name: 'Status', value: `⏳ Pending Review`, inline: true },
          { name: 'Report Since', value: `┕<t:${startTimestamp}:R>`, inline: true },
          { name: 'Report By', value: `<@${userId}>`, inline: true },
          { name: 'Report Data', value: `\`\`\`${egyptianDate2},${egyptianDate}\`\`\``, inline: true }
      );
    
    const accept_sug = new MessageButton()
        .setCustomId('accept_sug')
        .setLabel('Aceept')
        .setStyle('SUCCESS')

    const unaccept_sug = new MessageButton()
        .setCustomId('unaccept_sug')
        .setLabel('Reject')
        .setStyle('DANGER');
    
    const row1 = new MessageActionRow()
    .addComponents(accept_sug, unaccept_sug);

    // إرسال رسالة بصيغة Embed
    const embed = new MessageEmbed()
      .setColor('#2c2c34')
      .setTitle('> Your notification has been successfully sent to the administrators \n> Your report is being reviewed')

    interaction.reply({ embeds: [embed], ephemeral: true })
      .then(() => {
        // إرسال رسالة إلى القناة المحددة بصيغة Embed
        const channel = interaction.client.channels.cache.get(ServerReportChannelId);
        if (channel && channel.isText()) {
          channel.send({ embeds: [embed2], components: [row1] });
        } else {
          console.error('لا يمكن العثور على القناة أو القناة غير صالحة.');
        }
      })
      .catch(error => console.error('حدث خطأ في الرد:', error));
  }
}
});

client.on('messageCreate', async message => {
    // تأكد من أن الرسالة ليست من البوت
    if (message.author.bot) return;

    // تحقق مما إذا كان اسم البوت تم ذكره بشكل صحيح
    const botMentioned = message.mentions.users.has(client.user.id);

    if (botMentioned) {
        // إضافة السطر التالي لبدء الرمز "الكتابة"
        await message.channel.sendTyping();

        const embed = new MessageEmbed()
            .setColor('#2c2c34')
            .setTitle(`Q u e e n`)

        // إرسال الـ embed إلى الشخص الذي قام بمنشن البوت
        message.reply({ embeds: [embed] });
    }
});




//testing code modal
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase() === `${prefix}suggestions-system`) {
    
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply("You don't have permission to use this command.");
    }
    
    const buttonRow = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('suggestions-modal')
          .setStyle('PRIMARY')
          .setLabel('🤝 إرسال اقتراح أو ملاحظة')
      );

    const embed = new MessageEmbed()
      .setTitle('> قوانين إرسال الاقتراحات و الملاحظات')
      .setDescription(" - الاقتراحات والملاحظات يجب أن تكون موجهة بإحترام ووضوح، دون تجاوز الحدود.\n2. تجنب إرسال المحتوى الغير لائق أو المسيء أو المحتوى الذي ينتهك سياسات الخادم.\n3. يجب أن يتضمن كل اقتراح أو ملاحظة توضيحاً موجزاً للفكرة والهدف منه.\n4. تجنب إرسال الاقتراحات أو الملاحظات المكررة، يُفضل البحث عن محتوى مشابه قبل الإرسال.\n5. يجب الامتناع عن إرسال الرسائل الضارة أو التي تحتوي على فيروسات أو روابط مشبوهة.\n6. تجنب إرسال الاقتراحات أو الملاحظات التي لا تتعلق بموضوع الخادم أو القناة.\n7. تحديد عنوان واضح ومناسب لكل اقتراح أو ملاحظة يُرسل، لتسهيل تصنيفه ومتابعته.\n8. الامتناع عن استخدام اللغة البذيئة أو الإساءة اللفظية في الاقتراحات والملاحظات.\n9. يجب أن يكون الاقتراح أو الملاحظة مفهوماً وواضحاً للجميع دون الحاجة لتفسير إضافي.\n10. تجنب إرسال الرسائل الطويلة جداً، واختصار الفكرة في أطر موجزة ومفيدة.\n11. يُشجع على تقديم الاقتراحات التي تتماشى مع هدف الخادم ومبادئه الأساسية.\n12. الامتناع عن إرسال الاقتراحات أو الملاحظات العنيفة أو الهجومية.\n13. توجيه المقترحات للقنوات المناسبة وتجنب الإزعاج غير الضروري للأعضاء الآخرين.\n14. الإدارة تحتفظ بحقها في تعديل أو حذف أو تجاهل المقترحات غير متوافقة مع القوانين والتوجيهات.")
      .setColor('#2c2c34');

    message.channel.send({
      embeds: [embed],
      components: [buttonRow]
    });
  }
});

const votedMembersPerMessage = new Map();
const votedMembers = new Set();
const reportedMembersPerMessage = new Map();
const reportedMembers = new Set();
let votedEmbedIds = new Set();
client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'accept_sug22') {
            // Check if the user has the required role or admin permissions
            const requiredRoles = ['1221886968019812443'];
            const isAdmin = interaction.member.permissions.has('ADMINISTRATOR');
            const hasRequiredRole = requiredRoles.some(roleId => interaction.member.roles.cache.has(roleId));

            if (!isAdmin && !hasRequiredRole) {
                return interaction.reply({ content: 'You do not have permission to perform this action.', ephemeral: true });
            }

            // Modify the Embed
            const memberMention = interaction.member.toString();
            const embed = interaction.message.embeds[0];
            const statusField = embed.fields.find(field => field.name.includes('الحالة'));
            if (statusField) {
              statusField.name = `الحالة | ✅`;
              statusField.value = `${memberMention}`;
            }

            // Disable the button after clicking it
            interaction.component.setDisabled(true);

            // Resend the message with the modifications and update the button
            await interaction.update({ embeds: [embed], components: [interaction.message.components[0]] });

            // Send a message to the log channel
            const suggestionChannel = interaction.guild.channels.cache.get(sugaccptorreject);
            if (suggestionChannel) {
                const suggestedBy = interaction.user;
                const sourceMessage = interaction.message;
                let currentTime = new Date();
                currentTime.setHours(currentTime.getHours() + 1);
                const startTimestamp = Math.floor(Date.now() / 1000) - 32;
                const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
                const egyptianDate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });
                const acceptEmbed = new Discord.MessageEmbed()
                    .setColor('#00FF00') // Green color
                    .setTitle(`> تم قبول هذا الاقتراح`)
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }))
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    .addFields(
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: 'تم قبول الاقتراح بواسطة', value: `┕${suggestedBy}`, inline: true },
                        { name: 'تاريخ قبول الاقتراح', value: `┕\`${egyptianDate2},${egyptianDate}\``, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: 'الوقت المنقضي منذ', value: `┕<t:${startTimestamp}:R>`, inline: true },
                        { name: 'الاقتراح المقبول', value: `[رابط الاقتراح](${sourceMessage.url})┕`, inline: true },
                    );


                suggestionChannel.send({ embeds: [acceptEmbed] });
            }
        }
    if (interaction.customId === 'unaccept_sug22') {
    // Checking if the user has the required role
    const requiredRoles = ['1221886968019812443'];
    const isAdmin = interaction.member.permissions.has('ADMINISTRATOR');
    const hasRequiredRole = requiredRoles.some(roleId => interaction.member.roles.cache.has(roleId));

    if (!isAdmin && !hasRequiredRole) {
        return interaction.reply({ content: "Sorry, you don't have permission to perform this action.", ephemeral: true });
    }

    // Modifying the Embed
    const memberMention = interaction.member.toString();
    const embed = interaction.message.embeds[0];
    const statusField = embed.fields.find(field => field.name.includes('الحالة'));
     if (statusField) {
       statusField.name = `الحالة | ❌`;
       statusField.value = `${memberMention}`;
     }

    // Disabling the button after it's been clicked
    interaction.component.setDisabled(true);

    // Resending the message with the modifications and updating the button
    await interaction.update({ embeds: [embed], components: [interaction.message.components[0]] });

    // Sending a message to the log channel
    const suggestionChannel = interaction.guild.channels.cache.get(sugaccptorreject);
    if (suggestionChannel) {
        const suggestedBy = interaction.user;
        const sourceMessage = interaction.message;
        let currentTime = new Date();
        currentTime.setHours(currentTime.getHours() + 1);
        const startTimestamp = Math.floor(Date.now() / 1000) - 32;
        const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
        const egyptianDate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });
        const unacceptEmbed = new Discord.MessageEmbed()
             .setColor('#FF0000') // Red color
             .setTitle(`> تم رفض هذا الاقتراح`)
             .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }))
             .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
             .addFields(
                 { name: `\u2003`, value: `\u2003`, inline: false },
                 { name: 'تم رفض الاقتراح بواسطة', value: `┕${suggestedBy}`, inline: true },
                 { name: 'تاريخ رفض الاقتراح', value: `┕\`${egyptianDate2},${egyptianDate}\``, inline: true },
                 { name: `\u2003`, value: `\u2003`, inline: false },
                 { name: 'الوقت المنقضي منذ العملية', value: `┕<t:${startTimestamp}:R>`, inline: true },
                 { name: 'الاقتراح المرفوض', value: `[رابط الاقتراح](${sourceMessage.url})┕`, inline: true },
             );



        suggestionChannel.send({ embeds: [unacceptEmbed] });
    }
}


      
      

      // التحقق مما إذا كان العضو قد قام بالتصويت مسبقًا

      // Check if the button is part of the voting system    
if (interaction.customId === 'like_sug' || interaction.customId === 'dis_sug') {
        // تحقق مما إذا كانت الرسالة موجودة في الخريطة
        if (!votedMembersPerMessage.has(interaction.message.id)) {
          // إذا لم تكن موجودة، قم بإضافة مفتاح الرسالة مع مجموعة جديدة لتتبع الأعضاء الذين قاموا بالتصويت
          votedMembersPerMessage.set(interaction.message.id, new Set());
        }

        // استخدم مجموعة الأعضاء المحددة للرسالة الحالية
        const votedMembers = votedMembersPerMessage.get(interaction.message.id);

        // التحقق مما إذا كان العضو قد قام بالتصويت مسبقًا
        if (votedMembers.has(interaction.user.id)) {
          return interaction.reply({ content: 'لقد صوت بالفعل.', ephemeral: true });
        } else {
          // إذا لم يكن قد قام بالتصويت، قم بإضافة معرف العضو إلى مجموعة الأعضاء المصوتين
          votedMembers.add(interaction.user.id);
        }
      }
if (interaction.customId === 'like_sug') {
    const embed = interaction.message.embeds[0];
    const voteField = embed.fields.find(field => field.name === 'جيد');
    const currentLikes = parseInt(voteField.value.split(' ')[1]);
    voteField.value = `┕\`👍 ${currentLikes + 1}\``; // Update the number of likes only

    // Add the member to the list of those who voted
    const votedMember = interaction.user.id;
    let currentTime = new Date();
    const sourceMessage = interaction.message;
    currentTime.setHours(currentTime.getHours() + 1);
    const startTimestamp = Math.floor(Date.now() / 1000) - 32;
    const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
    const egyptianDate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });
    const logEmbed = new MessageEmbed()
    .setColor('#00FF00') // لون أخضر
    .setAuthor({ name: `تم التفاعل مع هذا الاقتراح`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }))
    .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
    .addFields(
        { name: `\u2003`, value: `\u2003`, inline: false },
        { name: 'تم التفاعل بواسطة', value: `<@${votedMember}>`, inline: true },
        { name: 'تاريخ التفاعل', value: `<t:${Math.floor(startTimestamp / 1000)}:R>`, inline: true },
        { name: `\u2003`, value: `\u2003`, inline: false },
        { name: `\u2003`, value: `\`\`\`diff\n+👍 ${currentLikes + 1} تفاعلات حالية\`\`\``, inline: false },
        { name: `\u2003`, value: `\u2003`, inline: false },
        { name: 'منذ التفاعل', value: `<t:${startTimestamp}:R>`, inline: true },
        { name: 'مصدر التفاعل', value: `[رابط الاقتراح](${sourceMessage.url})`, inline: true },
    );


    // Send the log to the specified channel
    const logChannel = interaction.guild.channels.cache.get(accshinsug);
    if (logChannel) {
        await logChannel.send({ embeds: [logEmbed] });
    } else {
        console.log('Unable to find log channel.');
    }

    await interaction.update({ embeds: [embed] });
}
if (interaction.customId === 'dis_sug') {
    const embed = interaction.message.embeds[0];
    const voteField = embed.fields.find(field => field.name === 'سيئ');
    const currentDislikes = parseInt(voteField.value.split(' ')[1]);
    voteField.value = `┕\`👎 ${currentDislikes + 1}\``; // Update the number of dislikes only

    // Add the member to the list of those who voted
    const votedMember = interaction.user.tag;
    let currentTime = new Date();
    const sourceMessage = interaction.message;
    currentTime.setHours(currentTime.getHours() + 1);
    const startTimestamp = Math.floor(Date.now() / 1000) - 32;
    const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
    const egyptianDate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });
    const logEmbed = new MessageEmbed()
        .setColor('#FF0000') // لون أحمر
        .setAuthor({ name: `تم التفاعل مع هذا الاقتراح`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }))
        .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .addFields(
            { name: `\u2003`, value: `\u2003`, inline: false },
            { name: 'تم التفاعل بواسطة', value: `${votedMember}`, inline: true },
            { name: 'تاريخ التفاعل', value: `\`${egyptianDate2},${egyptianDate}\``, inline: true },
            { name: `\u2003`, value: `\u2003`, inline: false },
            { name: `\u2003`, value: `\`\`\`diff\n-👎 ${currentDislikes + 1} تفاعلات حالية\`\`\``, inline: false },
            { name: `\u2003`, value: `\u2003`, inline: false },
            { name: 'منذ التفاعل', value: `<t:${startTimestamp}:R>`, inline: true },
            { name: 'مصدر التفاعل', value: `[رابط الاقتراح](${sourceMessage.url})`, inline: true },
        );


    // Send the log to the specified channel
    const logChannel = interaction.guild.channels.cache.get(accshinsug);
    if (logChannel) {
        await logChannel.send({ embeds: [logEmbed] });
    } else {
        console.log('Unable to find log channel.');
    }

    await interaction.update({ embeds: [embed] });
}
if (interaction.customId === 'suggestions-modal') {
    const modal = new Modal()
        .setCustomId('suggestions-modal')
        .setTitle('إرسال اقتراح أو ملاحظه')
        .addComponents([
            new MessageActionRow().addComponents(
                new TextInputComponent()
                    .setCustomId('suggestions-input')
                    .setLabel('ما هو عنوان اقتراحك؟')
                    .setStyle('SHORT')
                    .setMinLength(1)
                    .setMaxLength(200)
                    .setPlaceholder('اكتب عنوان اقتراحك هنا')
                    .setRequired(true),
            ),
            new MessageActionRow().addComponents(
                new TextInputComponent()
                    .setCustomId('2suggestions-input')
                    .setLabel('ما هي فكرة الاقتراح؟')
                    .setStyle('PARAGRAPH')
                    .setMinLength(1)
                    .setMaxLength(4000)
                    .setPlaceholder('اكتب فكرة اقتراحك هنا')
                    .setRequired(true),
            ),
        ]);

    await interaction.showModal(modal);
}

}
if (interaction.isModalSubmit()) {
    if (interaction.customId === 'suggestions-modal') {
        const response = interaction.fields.getTextInputValue('suggestions-input');
        const response2 = interaction.fields.getTextInputValue('2suggestions-input');
        const startTimestamp = Math.floor(Date.now() / 1000) - 32;
        let currentTime = new Date();
        currentTime.setHours(currentTime.getHours() + 1);
        const userId = interaction.user.id;
        const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
        const egyptianDate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });

        const embed2 = new MessageEmbed()
            .setColor('#2c2c34')
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTitle('> 📝 اقتراح جديد')
            .setDescription(`**عنوان الاقتراح** \`\`\`${response}\`\`\` \n**فكرة الاقتراح** \`\`\`${response2}\`\`\``)
            .addFields(
                { name: 'الحالة', value: `⏳ قيد المراجعة`, inline: true },
                { name: 'تاريخ تقديم الاقتراح', value: `┕\`${egyptianDate2},${egyptianDate}\``, inline: true },
                { name: 'المقترح تقديمه من قبل', value: `<@${userId}>`, inline: true },
                { name: 'مدة الاقتراح', value: `┕<t:${startTimestamp}:R>`, inline: true },
                { name: 'جيد', value: `┕\`👍 0\``, inline: true },
                { name: 'سيئ', value: `┕\`👎 0\``, inline: true }
            );

        const accept_sug = new MessageButton()
            .setCustomId('accept_sug22')
            .setLabel('قبول')
            .setStyle('SUCCESS');

        const unaccept_sug = new MessageButton()
            .setCustomId('unaccept_sug22')
            .setLabel('رفض')
            .setStyle('DANGER');

        const like = new MessageButton()
            .setCustomId('like_sug')
            .setLabel('👍')
            .setStyle('PRIMARY');

        const unlike = new MessageButton()
            .setCustomId('dis_sug')
            .setLabel('👎')
            .setStyle('SECONDARY');

        const report_sug = new MessageButton()
            .setCustomId('report-modal22')
            .setLabel('الإبلاغ عن الاقتراح')
            .setStyle('DANGER');

        const row1 = new MessageActionRow()
            .addComponents(accept_sug, unaccept_sug, like, unlike, report_sug);

        // إرسال رسالة في شكل Embed
        const embed = new MessageEmbed()
            .setColor('#2c2c34')
            .setTitle('> تم إرسال الاقتراح')
            .setDescription(`تم إرسال اقتراحك هنا <#${suggestionschannel}>`)

        interaction.reply({ embeds: [embed], ephemeral: true })
            .then(() => {
                // إرسال رسالة إلى القناة المحددة في شكل Embed
                const channel = interaction.client.channels.cache.get(suggestionschannel);
                if (channel && channel.isText()) {
                    channel.send({ embeds: [embed2], components: [row1] });
                } else {
                    console.error('تعذر العثور على القناة أو القناة غير صالحة.');
                }
            })
            .catch(error => console.error('حدث خطأ أثناء الرد:', error));
    }
}


});







//rename ticket
client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isButton()) {
      if (interaction.customId === 'rename-ticket-button') {
        // التحقق من إذن التعديل
        if (!hasClaimPermission(interaction.member)) {
          await interaction.reply({ content: 'ليس لديك الصلاحية لأداء هذا الإجراء', ephemeral: true });
          return;
        }

        // إنشاء وعرض نافذة الإدخال المودالية
        const modal = new Modal()
          .setCustomId('rename-ticket-modal')
          .setTitle('إعادة تسمية التذكرة')
          .addComponents([
            new MessageActionRow().addComponents(
              new TextInputComponent()
                .setCustomId('rename-ticket-input')
                .setLabel('أدخل اسم التذكرة الجديد')
                .setStyle('SHORT')
                .setMinLength(1)
                .setMaxLength(15)
                .setPlaceholder('أدخل الاسم هنا')
                .setRequired(true),
            ),
          ]);

        await interaction.showModal(modal);
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'rename-ticket-modal') {
        const response = interaction.fields.getTextInputValue('rename-ticket-input');

        if (interaction.member.permissions.has('MANAGE_CHANNELS')) {
          // الحصول على اسم التذكرة السابق
          const oldTicketName = interaction.channel.name;

          // تغيير اسم القناة
          await interaction.channel.setName(response);

          // تعطيل الزر بعد تغيير الاسم
          const updatedComponents = interaction.message.components.map(row => {
            const updatedRow = new MessageActionRow();
            row.components.forEach(comp => {
              if (comp.customId === 'rename-ticket-button') {
                updatedRow.addComponents(comp.setDisabled(true));
              } else {
                updatedRow.addComponents(comp);
              }
            });
            return updatedRow;
          });

          // تحديث الرسالة الأصلية بالزر المعطل
          await interaction.message.edit({ components: updatedComponents });

          // إنشاء وإرسال Embed بشكل خاص
          const embed = new MessageEmbed()
            .setColor('#2c2c34')
            .setTitle('> تم تغيير اسم التذكرة بنجاح')
            .addFields(
              { name: 'الاسم القديم للتذكرة', value: `\`\`\`diff\n- ${oldTicketName}\`\`\``, inline: true },
              { name: 'الاسم الجديد للتذكرة', value: `\`\`\`diff\n+ ${response}\`\`\``, inline: true }
            );

          await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
          await interaction.reply({ content: "لا أملك الصلاحية لإعادة تسمية القنوات!", ephemeral: true });
        }
      }
    }
  } catch (error) {
    console.error('حدث خطأ:', error);
    await interaction.reply({ content: 'حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى لاحقًا.', ephemeral: true });
  }
});






let ticketOpenerId;
const ticketsFilePath = path.join(__dirname, 'ticket-date.json');

client.on('messageCreate', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ticket-panel') {
        const ticketOpenerId = message.author.id;

        const selectMenuOptions = [
            {
                label: 'To buy',
                value: 'ticket_1',
                description: 'To buy   ',
                emoji: '🎟️'
            },
            {
                label: 'اApply for join our team',
                value: 'ticket_2',
                description: 'For our server  and stuff', 
                emoji: '⚠️'
            },
            {
                label: 'For help',
                value: 'ticket_3',
                description: 'Contact our support ',
                emoji: '🛠️'
            },
        ];

        const selectMenu = new MessageSelectMenu()
            .setCustomId('ticket_panel')
            .setPlaceholder('🎫 Please select the section you want.')
            .addOptions(selectMenuOptions);

        const row = new MessageActionRow().addComponents(selectMenu);

        const embed = new MessageEmbed()
            .setColor("#2c2c34")
            .setThumbnail(message.guild.iconURL({ dynamic: true, size: 4096 }))
            .setImage("https://cdn.discordapp.com/attachments/1150926238672769044/1283370495718330378/2024-09-11-TICKET.gif?ex=66e2bf6a&is=66e16dea&hm=7afdc44ed2ee74b7d603383cb281183afced7d69d3fe1c1996f38dbdafc48b40&")
            .setTitle(` Welcome to the server __${message.guild.name}__ `)
            .setDescription(`Please select the section you want \nYou will be replied as soon as possible. \n\n  **Owner Bypass ** <@609914623986237442> `);
      
        message.channel.send({ embeds: [embed], components: [row] });
    }
});



// Counter for ticket numbers
let ticketCounter = 1;
const userTickets = new Map();

// Define a set to store roles with permission to claim
const claimPermissions = new Set();

// Function to check if a member has permission to claim
function hasClaimPermission(member) {
    return member.roles.cache.some(role => claimPermissions.has(role.id));
}

module.exports = {
  hasClaimPermission,
};

// Add roles with permission to claim
claimPermissions.add('1305099928904667166');
claimPermissions.add('1301525563374174228');
claimPermissions.add('1301311315431657564');
claimPermissions.add('1300981759579521056');
claimPermissions.add('1310813428222398535');
claimPermissions.add('1224706750268051497');
claimPermissions.add('1229116928501616640');


// Add more roles as needed



// Map to store user ticket count
client.on('interactionCreate', async interaction => {
    if (!interaction.isSelectMenu() && !interaction.isButton()) return;

    const { member, guild } = interaction;

   // استدعاء الدالة المناسبة بناءً على customId
    switch (interaction.customId) {
        case 'msg_control':
            await handleMsgControl(interaction, hasClaimPermission);
            break;
        case 'addmem_kikmem':
            await handleAddMemKikMem(interaction, hasClaimPermission);
            break;
        case 'msg_sendcontrol':
            await handleMsgSendControl(interaction, hasClaimPermission);
            break;
        case 'sendmemberid':
            await handleSendMemberId(interaction, hasClaimPermission);
            break;
        case 'sendmsgembed':
            await handleSendMsgEmbed(interaction, hasClaimPermission);
            break;
        case 'sendmsgdisabled':
            await handleSendMsgDisabled(interaction, hasClaimPermission);
            break;
        case 'sendmsgpost':
            await handleSendMsgPost(interaction, hasClaimPermission); // استدعاء دالة لإرسال رسالة عادية
            break;
        case 'msgdeleted':
            await handleMsgDeleted(interaction, hasClaimPermission);
            break;
        case 'add_note':
            await handleAddNote(interaction, hasClaimPermission); // تأكد من تمرير دالة التحقق من الصلاحية هنا
            break;
        case 'sendowntick':
            await handleSendOwnTick(interaction, hasClaimPermission); // Call the function for handling sendowntick interaction
            break;
        case 'claim_ticket':
            await handleClaimTicket(interaction, hasClaimPermission);
            break;
        case 'transscript':
            await handleTranscript(interaction, guild); // قم بتمرير ال guild الخاص بك هنا
            break;
    }
  


// دالة لإرسال رسالة بـ Embed
async function sendEmbedMessage(interaction, content) {
    // إنشاء الـ Embed بناءً على النص المستلم
    const embed = {
        description: content,
        color: "#2c2c34", // يمكنك تعيين اللون كما تشاء
    };
    await interaction.channel.send({ embeds: [embed] });
}

// دالة لإرسال رسالة عادية
async function sendMessage(interaction, content) {
    await interaction.followUp({ content: content, ephemeral: true });
}


// التحقق من الضغط على زر "cancel_close"
if (interaction.customId === 'cancel_close') {
    // حذف الرسالة
    await interaction.deleteReply();
    // لاحظ أنه بعد حذف الرسالة، لن يكون هناك شيء للرد عليه
    return;
}

// إذا كان الضغط على زر "close_id_note" ولم يكن "cancel_close"
if (interaction.customId === 'close_id_note') {
    // Create the embed message
    const embed = new MessageEmbed()
        .setColor('#2c2c34')
        .setTitle('> Are you sure you want to close this ticket?')
        .setDescription("- `Close Ticket` will close this ticket for you\n- `Cancel` will cancel the ticket closure process");

    // Send a message to confirm closure
    const message = await interaction.reply({
        embeds: [embed],
        ephemeral: true,
        components: [
            new MessageActionRow().addComponents(
                new MessageButton().setCustomId('confirm_close').setLabel('Lock').setStyle('DANGER').setEmoji('🔒'),
                new MessageButton().setCustomId('cancel_close').setLabel('Close').setStyle('SECONDARY').setEmoji('❌')
            )
        ]
    });

    // Respond to the button to cancel
    const filter = i => i.customId === 'cancel_close';
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
        await i.deferUpdate(); // You can use this if you're using older buttons.
        await interaction.deleteReply(); // Delete the message
    });

    collector.on('end', async () => {
        if (!message.deleted) await message.delete().catch(console.error); // Make sure to delete the message in case the button press event doesn't occur
    });
} else if (interaction.customId === 'confirm_close') {
    try {
        // Defer the interaction to avoid timeout
        await interaction.deferUpdate();

        // Send a loading message
        const loadingMessage = await interaction.followUp({ embeds: [new MessageEmbed().setDescription('**Under construction - please wait... 🛡**').setColor('#2c2c34')] });

        // Delay the display of the embed for 3 seconds
        setTimeout(async () => {
            // Delete the loading message
            await loadingMessage.delete();
          
             // Create a new embed instance
            const embed2 = new MessageEmbed()
                 .setTitle(`**This ticket has been closed. 🔒**`)
                 .setColor('#2c2c34')

            // Reply to the interaction with the embed
            await interaction.channel.send({ embeds: [embed2] });

            // Remove permissions and send the embed
            const channel = interaction.channel;
            const permissionOverwrites = channel.permissionOverwrites.cache.filter(overwrite => overwrite.type === 'member');
            const mentionList = [];

            for (const overwrite of permissionOverwrites.values()) {
                const member = await channel.guild.members.fetch(overwrite.id);
                if (!member.permissions.has('ADMINISTRATOR')) {
                    await overwrite.delete();
                    mentionList.push(`<@${member.id}>`);
                }
            }
          
            let currentTime = new Date();

            // إضافة ساعة واحدة
            currentTime.setHours(currentTime.getHours() + 1);
            const saveticketdate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
            const saveticketdate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });
          
            const mentionListFormatted = mentionList.map((mention, index) => `${index + 1}. ${mention}`);
            const mentionListString = mentionListFormatted.join('\n');
            const closedEmbed = new MessageEmbed()
            .setColor('#2c2c34')
            .setTitle('> :lock: This ticket is closed')
            .setDescription(`**The ticket has been hidden for the following members**\n${mentionListString}`)
            .addFields(
                { name: 'This ticket was closed by', value: `${interaction.member}`, inline: true },
                { name: '\u2003', value: `\u2003`, inline: true },
                { name: 'Ticket Closure Date', value: `**\`${saveticketdate2},${saveticketdate}\`**`, inline: true }
            );

            const deleteButton = new MessageButton()
                .setCustomId('delete_ticket')
                .setEmoji('⛔')
                .setLabel('Delete Ticket')
                .setStyle('DANGER');
            const transcriptButton = new MessageButton()
                .setCustomId('transscript')
                .setEmoji('📜')
                .setLabel('Save Ticket')
                .setStyle('PRIMARY');
            const reopenButton = new MessageButton()
                .setCustomId('reopen_ticket')
                .setEmoji('🔓')
                .setLabel('Reopen Ticket')
                .setStyle('SUCCESS');


            const row = new MessageActionRow().addComponents(deleteButton, transcriptButton, reopenButton);

            await channel.send({ embeds: [closedEmbed], components: [row] });

            // Append "-closed" to the channel name if not already present
            if (!channel.name.includes('-closed')) {
                await channel.setName(`${channel.name}-closed`);
            }

            // Get all messages in the channel
            const messages = await channel.messages.fetch({ limit: 100 });
            const ticketMessages = messages.map(message => `Author: ${message.author.tag} | Content: ${message.content}`).join('\n');

            // Add mention and ticket name before writing ticket messages to a text file
            const ticketName = channel.name.replace('-closed', '');
            const mention = `<@${interaction.member.id}>`;
            const finalContent = `${ticketMessages}`;

            // Write ticket messages to a text file
            fs.writeFileSync('ticket_messages.txt', finalContent);

            // Read the text file
            const fileBuffer = fs.readFileSync('ticket_messages.txt');
            const attachment = new MessageAttachment(fileBuffer, 'ticket_messages.txt');
          
            let currentTime2 = new Date();

            // إضافة ساعة واحدة
            currentTime2.setHours(currentTime2.getHours() + 1);
          
            const embed = interaction.message.embeds[0];
            const ticketOwnerField = embed.fields.find(field => field.name === 'Ticket Creator');
            const ticketOwnerValue = ticketOwnerField ? ticketOwnerField.value : 'Unknown';
            const ticketOwnerField2 = embed.fields.find(field => field.name === 'Ticket Department');
            const ticketOwnerValue2 = ticketOwnerField2 ? ticketOwnerField2.value : 'Unknown';
            const ticketOwnerField3 = embed.fields.find(field => field.name === 'Support Needed');
            const ticketOwnerValue3 = ticketOwnerField3 ? ticketOwnerField3.value : 'Unknown';

        

            // Get the user who clicked the button
            const claimTicket = interaction.user;
            const startTimestamp = Math.floor(Date.now() / 1000) - 35;
            const saveticketdate22 = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
            const saveticketdate23 = currentTime2.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });

          
            // Create an embed message
            const embed9 = new MessageEmbed()
                .setTitle('> This ticket has been closed')
                .addFields(
                    { name: 'Ticket Creator', value: `\`Still under development\``, inline: true },
                    { name: 'Ticket Closed By', value: `${mention}`, inline: true },
                    { name: 'Ticket Claimed By', value: `\`Still under development\``, inline: true },
                    { name: 'Ticket Name', value: `\`${ticketName}\``, inline: true },
                    { name: 'Ticket Department', value: `\`Still under development\``, inline: true },
                    { name: 'Ticket Date', value: `**\`${saveticketdate23},${saveticketdate22}\`**`, inline: true }
                )
                .setColor('#2c2c34');  // يمكنك تغيير اللون حسب رغبتك

            // Send the embed message and the file in the specified room
            const destinationChannel = interaction.guild.channels.cache.get(TicketSaveChannelId);
            await destinationChannel.send({ embeds: [embed9], files: [attachment] });

            // Delete the text file
            fs.unlinkSync('ticket_messages.txt');
        }, 1000);

    } catch (error) {
        console.error('Error handling confirm_close button:', error.message);
        await interaction.followUp({ content: 'Failed to process the request.', ephemeral: true });
    }
}

  const mentionList = [];
if (interaction.customId === 'delete_ticket') {
    // حذف التذكرة إذا تم النقر على زر "delete ticket"
    const channel = interaction.channel;
    try {
        await channel.delete();
    } catch (error) {
        console.error('Error deleting ticket:', error.message);
    }
}

    if (interaction.customId === 'reopen_ticket') {
        // Reply with a message indicating feature is under development
        await interaction.reply({ content: 'This Command in Upgraded', ephemeral: true });
    }

    if (interaction.customId === 'ticket_panel') {
        const selectedOption = interaction.values ? interaction.values[0] : null;
        if (!selectedOption) return;

        const selectedDepartment = selectMenuOptions.find(option => option.value === selectedOption);
        if (!selectedDepartment) return;

        try {
            // قراءة ملف ticket-date.json
            fs.readFile(ticketsFilePath, 'utf8', async (err, data) => {
                if (err && err.code === 'ENOENT') {
                    // الملف لا يوجد، تعيين ticketCounter إلى 0
                    ticketCounter = 0;
                } else if (!err) {
                    const tickets = JSON.parse(data);
                    const lastTicket = tickets[tickets.length - 1];
                    ticketCounter = lastTicket ? lastTicket.ticket_number : 0;
                } else {
                    console.error('Error reading ticket-date.json:', err);
                    return;
                }

                ticketCounter++;

                const ticketType = selectedOption.split('_')[1];
                const categoryID = categoryIDs[selectedOption];
                const ticket_open_member = member.id;

                const ticketId = interaction.id;
                const currentTime = new Date();
                currentTime.setHours(currentTime.getHours() + 1);
                const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
                const egyptianDate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });

                const channel = await guild.channels.create(`${selectedDepartment.label}-${ticketCounter}`, {
                    type: 'text',
                    permissionOverwrites: [
                        {
                            id: guild.roles.everyone,
                            deny: ['VIEW_CHANNEL']
                        },
                        {
                            id: member.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ADD_REACTIONS']
                        },
                        {
                            id: client.user.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ADD_REACTIONS']
                        },
                        ...selectedDepartment.roleticketid.map(roleId => ({
                            id: roleId,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ADD_REACTIONS']
                        }))
                    ],
                    parent: categoryID
                });

                const replyMessage = `**✔ Your ticket has been successfully created <#${channel.id}> Ticket number \`${ticketCounter}\`**`;
                const row = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setLabel('Ticket Link')
                        .setEmoji('🎫')
                        .setStyle('LINK')
                        .setURL(`https://discord.com/channels/${guild.id}/${channel.id}`),
                    new MessageButton()
                        .setLabel('Developer Link')
                        .setEmoji('💼')
                        .setStyle('LINK')
                        .setURL('https://discord.com/users/803873969168973855')
                );


                currentTime.setHours(currentTime.getHours() + 1);
                const startTimestamp = Math.floor(Date.now() / 1000) - 85;
                let count = channelCounts.get(channel.parentId) || 0;
                count++;
                const user = member.user;
        
                await interaction.reply({ content: replyMessage, components: [row], ephemeral: true });

                const embedopen1 = new MessageEmbed()
                    .setAuthor({ name: `Welcome to the server, ${member.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setColor('#2c2c34')
                    .addFields(
                        { name: 'Ticket Creator', value: `<@${member.id}>`, inline: true },
                        { name: 'Support Needed', value: `${selectedDepartment.rolesupport}`, inline: true },
                        { name: 'Ticket Claimed', value: `\`No one\``, inline: true },
                        { name: 'Ticket Department', value: `\`${selectedDepartment.label}\``, inline: true },
                        { name: 'Ticket Date', value: `\`${egyptianDate2},${egyptianDate}\``, inline: true },
                        { name: 'Name', value: `\`${member.user.username}\``, inline: true },
                        { name: 'Ticket Since', value: `┕<t:${Math.floor(Date.now() / 1000) - 85}:R>`, inline: true },
                        { name: 'Discord Join Date', value: `┕<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                        { name: 'Server Join Date', value: `┕<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true }
                    );

                const closeButton = new MessageButton().setCustomId('close_id_note').setLabel('Close ticket').setStyle('DANGER').setEmoji('🔒');
                const renameButton = new MessageButton().setCustomId('rename-ticket-button').setLabel('Rename ticket').setStyle('PRIMARY').setEmoji('♻');
                const addMemberButton = new MessageButton().setCustomId('addmem_kikmem').setLabel('Manage members').setStyle('PRIMARY').setEmoji('👥');
                const transcButton = new MessageButton().setCustomId('transscript').setLabel('Save ticket').setStyle('PRIMARY').setEmoji('📜');
                const claimButton = new MessageButton().setCustomId('claim_ticket').setLabel('Claim ticket').setStyle('SUCCESS').setEmoji('🔖');
                const noteButton = new MessageButton().setCustomId('addnote-ticket-button').setLabel('Add note').setStyle('PRIMARY').setEmoji('📌');
                const msgcontrolButton = new MessageButton().setCustomId('msg_control').setLabel('Message control').setStyle('PRIMARY').setEmoji('🛠️');
                const tikrepButton = new MessageButton().setCustomId('ticket_rep').setLabel('Submit report').setStyle('PRIMARY').setEmoji('📝');


                const row1 = new MessageActionRow().addComponents(closeButton, transcButton, addMemberButton, claimButton);
                const row2 = new MessageActionRow().addComponents(tikrepButton, renameButton, msgcontrolButton, noteButton);
                channel.send({ content: `${member} - ${selectedDepartment.rolesupport}`, embeds: [embedopen1], components: [row1, row2] });
    
                const ticketData = {
                    member_id: member.id,
                    member_username: member.user.username,
                    ticket_openDate: `${egyptianDate2},${egyptianDate}`,
                    ticket_name: `${selectedDepartment.label}-${ticketCounter}`,
                    ticket_number: ticketCounter,
                    ticket_department: selectedDepartment.label,
                    ticket_Id: ticketId
                };

                fs.readFile(ticketsFilePath, 'utf8', (err, data) => {
                    if (err && err.code === 'ENOENT') {
                        fs.writeFile(ticketsFilePath, JSON.stringify([ticketData], null, 2), 'utf8', (err) => {
                            if (err) {
                                console.error('Error creating ticket-date.json:', err);
                            } else {
                                console.log('Ticket data saved successfully.');
                            }
                        });
                    } else if (!err) {
                        const tickets = JSON.parse(data);
                        tickets.push(ticketData);
                        fs.writeFile(ticketsFilePath, JSON.stringify(tickets, null, 2), 'utf8', (err) => {
                            if (err) {
                                console.error('Error saving ticket data:', err);
                            } else {
                                console.log('Ticket data appended successfully.');
                            }
                        });
                    } else {
                        console.error('Error reading ticket-date.json:', err);
                    }
                });
            });
        } catch (error) {
            console.error('Error creating ticket:', error);
        }
    }
});
const channelCounts = new Map();















client.on('interactionCreate', async (interaction) => {
  if (interaction.isSelectMenu()) {
    const rule = rules.find(r => r.id === interaction.values[0]);
    const text = fs.readFileSync(rule.description, 'utf-8');
    const ruleEmbed = new MessageEmbed()
      .setColor(`#2c2c34`)
      .setTitle(`> ${rule.title}`)
      .setDescription(text)
    const message = await interaction.reply({ embeds: [ruleEmbed], ephemeral: true });
    
    // Add reaction directly to the replied message
  }
});


let tracker = "10";
  tracker = new inviteTracker(client);
	// "guildMemberAdd"  event to get full invite data
tracker.on("guildMemberAdd", async (member, inviter, invite, error) => {
  const startTimestamp = Math.floor(Date.now() / 1000) - 28;
  const memberCount = member.guild.memberCount;
  
  // return when get error
  if(error) return console.error(error);
  
  // get the channel
  let channel = member.guild.channels.cache.get(welcomeLogChannelId);
  
  let welcomeMessage = {
    color: "#2c2c34",
    title: "New Member Joined",
    description: `1. New member joined the server - ${member.user}
2. Invited by - <@!${inviter.id}>
3. Invitations Count - ${invite.count}
4. Member Count - ${memberCount}
5. Joined at - <t:${startTimestamp}:R>`,
    timestamp: new Date(),
    thumbnail: {
      url: member.user.displayAvatarURL({ size: 4096 }),
    },
  };

  // change welcome message when the member is bot
  if (member.user.bot) {
    welcomeMessage.description = `1. New bot joined the server - ${member.user}
2. Invited by - <@!${inviter.id}>
3. Invitations Count - ${invite.count}
4. Member Count - ${memberCount}
5. Joined at - <t:${startTimestamp}:R>`;
  }

  // send welcome message
  channel.send({ embeds: [welcomeMessage] });
});

// وظيفة لتقسيم مصفوفة إلى مجموعات
function chunkArray2(array, chunkSize) {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunkedArray.push(array.slice(i, i + chunkSize));
    }
    return chunkedArray;
}





client.on('guildMemberAdd', async member => {
  
    const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
    const startTimestamp = Math.floor(Date.now() / 1000) - 27;
    let buffer_attach =  await generareCanvas(member)
    const attachment = new MessageAttachment(buffer_attach, 'welcomeback.png')

  
    const fourSeasonButton = new MessageButton()
        .setStyle('LINK')
        .setLabel("Queen Server")
        .setURL('https://discord.gg/C8QHMKQseu'); // رابط موقع الـ 4 SEASON
  
    const botSeasonButton = new MessageButton()
        .setStyle('LINK')
        .setLabel(" Youtube")
        .setURL('https://www.youtube.com/@Queen-R-o2t'); // رابط موقع الـ 4 SEASON

    const instaButton = new MessageButton()
        .setStyle('LINK')
        .setLabel(' Server 2')
        .setURL('https://discord.gg/C8QHMKQseu'); // رابط موقع الـ 4 SEASON


    const buttonRow = new MessageActionRow()
        .addComponents([instaButton, fourSeasonButton, botSeasonButton]);

    const embed = new MessageEmbed()
        .setColor('#2c2c34')
        .setTitle(`>  __${member.guild.name} Community__ `)
        .setDescription(`** Happy to have you with us here.\n We wish you a happy day \n\n**`)
        .addFields(
            { name: '**1. Rules Server**', value: `<#1305101072062353449>`, inline: true },
            { name: '**2. Reaction Roles**', value: `**Under development**`, inline: true },
            { name: '\u2003', value: `\u2003`, inline: true },
            { name: '**3. Joined Discord**', value: `**<t:${startTimestamp}:R>**`, inline: true },
            { name: '**4. Joined Server**', value: `**\`\`${egyptianDate}\`\`**`, inline: true },
            { name: '\u2003', value: `\u2003`, inline: true }
          )    
        .setImage("attachment://welcomeback.png")
        .setThumbnail("https://images-ext-1.discordapp.net/external/ySCM_S3GaYOZ0cCQxpA6ZNbxGaM8OiWPoJyCOZ3YTyQ/https/i.ibb.co/WDTKpgC/s-Uz-MYT7pb-HJ1-T3-OIBQ8-Y309q.gif?width=288&height=288");

        member.send({ embeds: [embed], files: [attachment],  components: [buttonRow] })
        .catch(console.error);
});
tracker = new inviteTracker(client);
// "guildMemberAdd"  event to get full invite data
tracker.on('guildMemberAdd', async (member, inviter, invite, error) => {
  if(error) return console.error(error);
  let buffer_attach =  await generareCanvas(member)
  const attachment = new MessageAttachment(buffer_attach, 'image/welcomeback.png')
  const startTimestamp = Math.floor(Date.now() / 1000) - 42;
  const memberCount = member.guild.memberCount;

  let embed = new MessageEmbed()
    .setTitle(`>  Welcome To __${member.guild.name}__ Server `)
    .addFields(
      { name: ' Welcome', value: `${member.user}`, inline: true },
      { name: ' Invited By', value: `<@!${inviter.id}>`, inline: true },
      { name: ' Rules', value: `<#1305101072062353449>`, inline: true }, // Using the fetched description here
      { name: ' User ID', value: `\`\`${member.user.id}\`\``, inline: true },
      { name: ' Member Count', value: `\`\`${memberCount}\`\``, inline: true },
      { name: ' Invite Number', value: `\`\`${invite.count}\`\``, inline: true },
      { name: ' Joined Server', value: `<t:${startTimestamp}:R>`, inline: true },
      { name: ' Joined Discord', value: `<t:${Math.floor(member.user.createdAt / 1000)}:R>`, inline: true },
      { name: ' Member User', value: `\`\`${member.user.username}\`\``, inline: true },
      { name: ' Server Support', value: `[Click Here](https://discord.gg/C8QHMKQseu)`, inline: true },
      { name: ' YOUTUBE', value: `[Click Here](https://www.youtube.com/@Queen-R-o2t/reels)`, inline: true },
      { name: ' Server 2', value: `[Click Here](https://discord.gg/C8QHMKQseu)`, inline: true }
    )
    .setColor('#2F3136')
    .setImage('attachment://welcomeback.png');// استخدام الصورة المرفقة

  const welcomeChannel = member.guild.channels.cache.get(welcomeRoomId); // الحصول على الروم المحدد
  if (welcomeChannel) {
    welcomeChannel.send({ content: `${member.user}`, embeds: [embed], files: [attachment] }); // إرسال الـ embed في الروم المحدد
  } else {
    console.error(`Welcome channel not found with ID: ${welcomeRoomId}`); // إذا لم يتم العثور على الروم
  }
});


async function generareCanvas(member) {
  const avatar = await resolveImage(member.user.displayAvatarURL({ 'size': 2048, 'format': "png" }))
  const background = await resolveImage("image/welcomeback.png") // استخدام اسم الملف المحلي مباشرة هنا
  const { weirdToNormalChars } = require('weird-to-normal-chars')
  const name = weirdToNormalChars(member.user.username)
  let canvas = new Canvas(1400, 514)
    .printImage(background, 0, 0, 1400, 514)
    .setColor("#FFFFFF")
  /*
    .printCircle(267, 259, 149)
    */
    .printCircularImage(avatar, 266, 256, 150)
    .setTextAlign('justify')
    .setTextFont('25px Discord')
    .printText(`${member.guild.name} - COMMUNITY SERVER`, 524, 395)
    .setTextAlign("center")
    .setColor("#000000")
    .setTextFont('30px Discordx')
    .printText(`${name}`, 790, 340)
    .setTextAlign("center")
    .setColor("#FFFFFF")
    .setTextFont('30px Discordx')
    .printText(`${name}`, 787, 337)
    // Adding "bot by ahmed" text above the image
  /*
    .setTextAlign('center')
    .setTextFont('bold 15px Arial')
    .setColor("#FFFFFF")
    .printText('</> Developer BOT Ahmed Clipper', 160, 25);
    // Adding "insta" text below the line
  canvas.setTextAlign('center')
    .setTextFont('bold 15px Arial')
    .setColor("#FFFFFF")
    .printText('</> instagram : ahm.depression', 150, 60);
    */
  return canvas.toBufferAsync()
}


client.on('messageCreate', async message => {
    if (message.content === `${prefix}profile`) {
        // إرسال رسالة قبل بدء إنشاء الصورة
        const creatingCardMessage = await message.reply("> <a:ejgif1004:1241743499678973952> **Creating Your Profile Card...**");
        await message.channel.sendTyping();

        const guild = message.guild;
        let buffer_attach = await generareCanvas2(message.member); // افترض أن generareCanvas هي الدالة التي تنشئ الصورة
        const attachment = new MessageAttachment(buffer_attach, 'image/profile.png');

        // حذف الرسالة السابقة وتحديثها بالصورة المنشأة
        await creatingCardMessage.delete();
        message.reply({ content: `> <a:ejgif1033:1242349759298015334> **ملاحظة : هذا الأمر لم يكتمل بعد، ومازال قيد التطوير** <a:ejgif1032:1242349755728789504>`, files: [attachment] }); // إرسال الصورة المرفقة فقط في الروم المحدد
    }
});
async function generareCanvas2(member) {
  const avatar = await resolveImage(member.user.displayAvatarURL({ 'size': 2048, 'format': "png" }))
  const background = await resolveImage("image/profile.png")
  const background2 = await resolveImage("image/backprofile.png")
  const { weirdToNormalChars } = require('weird-to-normal-chars')
  const name = weirdToNormalChars(member.user.username)
  
  // تواريخ الانضمام بالإنجليزية
  const memberSinceServerEnglish = member.joinedAt.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })
  const memberSinceDiscordEnglish = member.user.createdAt.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })

  let canvas = new Canvas(378, 536)
    .printImage(background2, 0, 0, 378, 536)
    .printImage(background, 0, 0, 378, 536)
    .setColor("#232328")
    .printCircle(100, 140, 53)
    .printCircularImage(avatar, 100, 140, 45)
    .setColor("#232328")
    .printCircle(130, 170, 15)
    // MEMBER SINCE
    .setTextAlign('ltr')
    .setColor("#FFFFFF")
    .setTextFont('14px Discord')
    .printText(`MEMBER SINCE`, 65, 430)
    // تاريخ الانضمام إلى السيرفر
    .setTextAlign("ltr")
    .setColor("#FFFFFF")
    .setTextFont('10px Discordx')
    .printText(`${memberSinceServerEnglish}`, 213, 460)
    // تاريخ الانضمام إلى ديسكورد
    .setTextAlign("ltr")
    .setColor("#FFFFFF")
    .setTextFont('10px Discordx')
    .printText(`${memberSinceDiscordEnglish}ㅤ・ㅤ`, 95, 460)
    // اسم العضو
    .setTextAlign("ltr")
    .setColor("#FFFFFF")
    .setTextFont('15px Discordx')
    .printText(`${name}`, 65, 230)

  const badge03 = await resolveImage(__dirname + "/image/badge03.png")
  canvas.printImage(badge03, 301, 165, 30, 30)
  
  const badge05 = await resolveImage(__dirname + "/image/badge05.png")
  canvas.printImage(badge05, 275, 165, 30, 30)
  
  const badge01 = await resolveImage(__dirname + "/image/badge01.png")
  canvas.printImage(badge01, 248, 165, 30, 30)  
  
  const badge06 = await resolveImage(__dirname + "/image/badge06.png")
  canvas.printImage(badge06, 221, 165, 30, 30)  
  
  const discordjoin = await resolveImage(__dirname + "/image/discordjoin.png")
  canvas.printImage(discordjoin, 65, 445, 25, 25)  
  
  const serverjoin = await resolveImage(__dirname + "/image/serverjoin2.png")
  canvas.printImage(serverjoin, 182, 445, 25, 25)  
  /*
  const online01 = await resolveImage(__dirname + "/image/online01.png")
  canvas.printImage(online01, 130, 170, 13, 13) 
  */
  const idle02 = await resolveImage(__dirname + "/image/dnd03.png")
  canvas.printImage(idle02, 122, 162, 17, 17) 
  

  return canvas.toBufferAsync()
}





async function generateCanvas3(member, level, xp, leaderboardPosition) {
    const avatar = await resolveImage(member.user.displayAvatarURL({ 'size': 2048, 'format': "png" }));
    const background = await resolveImage(`image/${rankbanner}`);
    const { weirdToNormalChars } = require('weird-to-normal-chars');
    const name = weirdToNormalChars(member.user.username);

    // تواريخ الانضمام بالإنجليزية
    const memberSinceServerEnglish = member.joinedAt.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });
    const memberSinceDiscordEnglish = member.user.createdAt.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });

    let canvas = new Canvas(900, 650)
        .printImage(background, 0, 0, 900, 650)
        .setColor("#232328")
        .printCircularImage(avatar, 449, 325, 90  )
        .setColor("#232328")
        // اسم العضو
        .setTextAlign("center")
        .setColor("#FFFFFF")
        .setTextFont('25px Discordx')
        .printText(`${name}`, 450, 108)
        // xp العضو
        .setTextAlign("center")
        .setColor("#FFFFFF")
        .setTextFont('25px Discordx')
        .printText(`${xp}/${xpPerLevel}`, 250, 558)
        .setTextAlign("center")
        .setColor("#FFFFFF")
        .setTextFont('25px Discordx')
        .printText(`نقاط الخبرة`, 250, 510)
        // لفل العضو
        .setTextAlign("center")
        .setColor("#FFFFFF")
        .setTextFont('25px Discordx')
        .printText(`${level}`, 650, 558)
        .setTextAlign("center")
        .setColor("#FFFFFF")
        .setTextFont('25px Discordx')
        .printText(`المستوي`, 650, 510)
        // تصنيف العضو
        .setTextAlign("center")
        .setColor("#FFFFFF")
        .setTextFont('25px Discordx')
        .printText(`#${leaderboardPosition}`, 450, 558)
        .setTextAlign("center")
        .setColor("#FFFFFF")
        .setTextFont('25px Discordx')
        .printText(`التصنيف`, 450, 510);

    return canvas.toBufferAsync();
}


const cooldowns = new Map();
client.on('messageCreate', async message => {
    if (message.content === `${prefix}rank`) {
        const authorId = message.author.id;

        // تحقق مما إذا كان المستخدم في فترة الانتظار
        if (cooldowns.has(authorId)) {
            const cooldownTime = cooldowns.get(authorId);
            const remainingTime = (cooldownTime - Date.now()) / 1000;
            const warningMessage = await message.reply(`ثواني قبل استخدام هذا الأمر مرة أخرى ${remainingTime.toFixed(1)} انتظر من فضلك.`);
            
            // حذف الرسالة بعد 5 ثواني
            setTimeout(() => warningMessage.delete(), 3000);
            return;
        }

        const userData = getUserData(authorId);

        if (!userData) {
            message.reply('لم تحصل على أي نقاط خبرة بعد.');
            return;
        }

        const { level, xp } = getUserLevelAndXP(userData);
        const leaderboardPosition = getLeaderboardPosition(authorId);

        // بدء عملية الكتابة (Typing)
        message.channel.sendTyping();

        // إرسال رسالة قبل بدء إنشاء الصورة
        const creatingCardMessage = await message.reply("> <a:ejgif1004:1241743499678973952> **...جاري إنشاء بطاقة المستوي الشخصي**");

        // إنشاء الصورة
        let buffer_attach = await generateCanvas3(message.member, level, xp, leaderboardPosition);
        const attachment = new MessageAttachment(buffer_attach, `image/${rankbanner}`);

        // تحديث الرسالة السابقة بالصورة المنشأة
        await creatingCardMessage.edit({ content: '\u2003', files: [attachment] }); // إرسال الصورة المرفقة فقط في الروم المحدد

        // إضافة المستخدم إلى مجموعة الانتظار
        const cooldownDuration = 5000; // 5 ثواني
        cooldowns.set(authorId, Date.now() + cooldownDuration);
        setTimeout(() => cooldowns.delete(authorId), cooldownDuration);
    }
});






client.login(process.env.token);
