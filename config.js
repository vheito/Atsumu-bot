import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk' 
import { fileURLToPath } from 'url' 

global.owner = [
  ['56983298345', '𝑷𝑹𝑶𝑷𝑲𝑬𝑻𝑨𝑹𝑰𝑶 𝑫𝑬𝑳 𝑩𝑶𝑻 👑🍃', true],
  ['16503058299', 'ʟᴇᴏ ᴍᴀɴᴏ sᴏᴘᴏʀᴛ 👑', true],
] //Numeros de owner 

global.mods = [''] 
global.prems = ['5493536568522', '59176181985']
global.APIs = { // API Prefix
  // name: 'https://website' 
  nrtm: 'https://fg-nrtm.ddns.net',
  fgmods: 'https://api.fgmods.xyz'
}
global.APIKeys = { // APIKey Here
  // 'https://website': 'apikey'
  'https://api.fgmods.xyz': 'm2XBbNvz' //-- 100 de límite diario --- Regístrese en https://api.fgmods.xyz/
}

// Sticker WM
global.packname = '𝐀𝐭𝐬𝐮𝐦𝐮-𝐁𝐨𝐭' 
global.author = '@𝐈𝐬𝐚𝐚𝐜𝐗𝐳 👑' 
global.descripcion = '𝐖𝐚𝐁𝐨𝐭 𝐑𝐞𝐯𝐨𝐥𝐮𝐜𝐢𝐨𝐧𝐚𝐝𝐨 𝐁𝐲 𝐈𝐬𝐚𝐚𝐜𝐗𝐳 👑'

//--info FG
global.botName = '𝐀𝐭𝐬𝐮𝐦𝐮-𝐁𝐨𝐭'
global.fgig = '𝐖𝐚𝐛𝐨𝐭 𝐅𝐨𝐫 𝐖𝐡𝐚𝐭𝐬𝐚𝐩𝐩 🍃' 
global.fgigt = 'https://instagram.com/Mxz.18.l' 
global.fgsc = 'https://github.com/Maxz-on/Yumiko-.git' 
global.fgyt = ''
global.fgpyp = ''
global.fglog = '' 

//--- Grupos WA
global.id_canal = '120363302454592275@newsletter' //-ID de canal de WhatsApp
global.fgcanal = 'https://whatsapp.com/channel/0029VafBXQtDDmFbtwvkt20J'
global.bgp = 'https://chat.whatsapp.com/LcFTUnvu0Tw1tCnA2ybdR6'
global.bgp2 = 'https://chat.whatsapp.com/EVl0wxlCww74HV3vvZq83a'
global.bgp3 = 'https://chat.whatsapp.com/Fn5Ipyxu6mE6qEQlwWZTwU' //--GP NSFW

//* *******Tiempo***************
global.d = new Date(new Date + 3600000);
global.locale = 'es';
global.dia = d.toLocaleDateString(locale, {weekday: 'long'});
global.fecha = d.toLocaleDateString('es', {day: 'numeric', month: 'numeric', year: 'numeric'});
global.mes = d.toLocaleDateString('es', {month: 'long'});
global.año = d.toLocaleDateString('es', {year: 'numeric'});
global.tiempo = d.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true});
//* ****************************

global.wait = '⚡ 𝐂𝐚𝐫𝐠𝐚𝐧𝐝𝐨....'
global.rwait = '⌛'
global.dmoji = '⚡'
global.done = '✅'
global.error = '❌' 
global.xmoji = '🔥' 

global.multiplier = 69 
global.maxwarn = '2' // máxima advertencias

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
