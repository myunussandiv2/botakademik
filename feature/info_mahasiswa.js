const fs = require('fs') 

const infoMahasiswaHandler = async (sock, sender, text, m, listResponseId) => {
  text = [text[0], text.slice(1).join('')]
  const className = text[1].slice(0, 2) +' '+ text[1].slice(2)
  
  const res = await infoMahasiswaRequest(text, listResponseId)
  let reply, rows = [], resultData = '', title
  for (let i=0; i<res.length - 1; i++) {
    if (res[i][4] == res[i+1][4]) {
      title = `Kelas\t: ${className.toUpperCase()}\n`
    } else {
      title = 'Informasi Mahasiswa\n'
    }
  }
  if (res.length == 0) {
    reply = {text: 'data tidak ditemukan'}
  } else if (res.length == 1 || listResponseId) {
    resultData = res[0]
    if (resultData[2] == 'L') {
      resultData[2] = 'Laki-laki'
    } else {
      resultData[2] = 'Perempuan'
    }
    reply = {text: `Informasi Data Mahasiswa\n
NIM\t\t\t: ${resultData[0]}
Nama\t\t: ${resultData[1]}
JenisK\t\t: ${resultData[2]}
Jurusan\t: ${resultData[3]}
Kelas\t\t\t: ${resultData[4]}`}
  } else {
    res.forEach((dataMahasiswa, i) => {
      rows.push({
        title: `${i+1}. ${dataMahasiswa[1]}`,
        rowId: dataMahasiswa[0],
        description: dataMahasiswa[0]
      })
      resultData += `${i+1}. ${dataMahasiswa[1]} (${dataMahasiswa[2]})\n`
    })
    const sections = [{ title, rows }]
    reply = {
      title: title.toUpperCase(),
      text: resultData,
      buttonText: 'pilih & lihat detail mahasiswa',
      sections
    }
  }
  sock.sendMessage(sender, reply, {quoted: m})
}

const infoMahasiswaRequest = (text, listResponseId) => {
  let data = {}
  let cari
  const file = JSON.parse(fs.readFileSync('./database/data-mahasiswa.json'))

  if(listResponseId) {
    cari = listResponseId
  } else {
    cari = text[1]
  }

  data = file.values.filter(array => {
    return array.some(i => {
      return i.replace(/\s/g, '').toLowerCase().includes(cari)
    })
  }).sort((a, b) => a[1].localeCompare(b[1]))

  return data
}

module.exports = { infoMahasiswaHandler }