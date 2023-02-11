const { jadwalKuliahHandler } = require('./feature/jadwal_kuliah')

async function messages(sock) {
  sock.ev.on('messages.upsert', (msg, type) => {
    console.log(JSON.stringify(msg, type, 2))
    const m = msg.messages[0]
    const sender = m.key.remoteJid
    // const fromMe = m.key.fromMe
    let text = m.message?.conversation.toLowerCase()
    if (m.message?.extendedTextMessage?.text) {
      text = m.message?.extendedTextMessage?.text.toLowerCase()
    }
    const key = {
      remoteJid: sender,
      id: m.key.id,
      participant: m.key?.participant
    }
    if (sender === 'status@broadcast') return;
    
    sock.sendPresenceUpdate('unavailable', key.id)
    if (text && typeof text === 'string') {
      if (!text.indexOf('.jadwal ' )) {
        jadwalKuliahHandler(sock, sender, text)
      }
    }
  })
}

module.exports = { messages }
