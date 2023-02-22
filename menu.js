function menu(sock, sender) {
  const menu = {
    image: {url: './img/menhera-kun.jpeg'},
    caption: `*fitur Chat Bot Akademik*
*_______________________*
*.jadwal [kelas] [hari]*
_••>Chat Bot akan menampilkan list jadwal berdasarkan nama kelas_
contoh: .jadwal si4k senin

*.info [nama kelas]*
_••>Chat Bot akan menampilkan list nama mahasiswa berdasarkan nama kelas_

*.info [nama mahasiswa atau NIM]*
_••>Chat Bot akan menampilkan detail informasi mahasiswa berdasarkan nama atau nim_`
  }
  sock.sendMessage(sender, menu)
}

module.exports = { menu }