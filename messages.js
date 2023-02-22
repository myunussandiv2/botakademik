const { jadwalKuliahHandler } = require('./feature/jadwal_kuliah')
const { infoMahasiswaHandler } = require('./feature/info_mahasiswa')
const { menu } = require('./menu')

async function messages(sock) {
  sock.ev.on('messages.upsert', async (msg, type) => {
    const m = msg.messages[0]
    const sender = m.key.remoteJid
    // console.log(JSON.stringify(msg, type, 2))
    // const fromMe = m.key.fromMe
    // let text = (m.message?.conversation || m.message?.extendedTextMessage?.text)?.toLowerCase().split()
    // if (typeof text == 'string' && text.includes(' ')) {
    //   text = [text]
    // }
    let text = m.message?.conversation?.toLowerCase()?.split(' ')
    if (m.message?.extendedTextMessage) {
      text = m.message?.extendedTextMessage?.text?.toLowerCase()?.split(' ')
      if (!text) return
    }
    const listResponseId = m.message?.listResponseMessage?.singleSelectReply?.selectedRowId
    const prefix = ['.', '!', '#']
    const key = {
      remoteJid: sender,
      id: m.key.id,
      participant: m.key?.participant
    }
    
    if (sender === 'status@broadcast') return;
    try {
      if(text && prefix.some(p => text[0].startsWith(p))) {
        text[0] = text[0].substring(1)
        switch (text[0]) {
          case 'menu':
            await sock.readMessages([key])
            menu(sock, sender)
            break;
          case 'jadwal': case 'jadawal':
            await sock.readMessages([key])
            jadwalKuliahHandler(sock, sender, text, m)
            break;
          case 'info':
            await sock.readMessages([key])
            infoMahasiswaHandler(sock, sender, text, m)
            break;
          default:
            sock.sendMessage(
              sender,
              {text: `${text[0]}: perintah tidak ditemukan`}
            )
        }
      }
      if (listResponseId) {
        await sock.readMessages([key])
        infoMahasiswaHandler(sock, sender, text, m, listResponseId)
      }
    } catch (e) {
      console.log('Terjadi kesalahan' + e)
      if (m.messageStubType === 2 && m.messageStubParameters && m.messageStubParameters[0].includes('Bad MAC')) {
        sock.sendMessage(
          sender,
          {text: 'Mohon maaf, permintaan Anda tidak dapat kami proses saat ini karena terdapat gangguan pada jaringan. Mohon coba kembali nanti atau periksa koneksi internet Anda. Apabila Anda menggunakan WhatsApp Web, mohon untuk beralih ke WhatsApp pada ponsel Anda.'},
          {quoted: m}
        )
      }
    }
  })
}

module.exports = { messages }
