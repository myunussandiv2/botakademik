const { jadwalKuliahHandler } = require('./feature/jadwal_kuliah')

async function messages(sock) {
  sock.ev.on('messages.upsert', (msg, type) => {
    console.log(JSON.stringify(msg, type, 2))
    const m = msg.messages[0]
    const sender = m.key.remoteJid
    // const fromMe = m.key.fromMe
    let text = m.message?.conversation.toLowerCase().split(' ')
    if (m.message?.extendedTextMessage?.text) {
      text = m.message?.extendedTextMessage?.text.toLowerCase().split(' ')
    }
    
    const key = {
      remoteJid: sender,
      id: m.key.id,
      participant: m.key?.participant
    }
    if (sender === 'status@broadcast') return;
    
    switch (text[0]) {
      case '.menu':
        sock.readMessages([key])
        sock.sendMessage(sender, {
          image: {url: './img/menhera-kun.jpeg'},
          caption: `*fitur Chat Bot Akademik*
*_______________________*
*.jadwal [kelas] [hari]*
_••>Chat Bot akan menampilkan list jadwal berdasarkan nama kelas_
contoh: .jadwal si4k senin`
        })
        break;
      case '.jadwal': case 'jadwal':
        sock.readMessages([key])
        jadwalKuliahHandler(sock, sender, ...text)
        break;
    }
  })
}

module.exports = { messages }
