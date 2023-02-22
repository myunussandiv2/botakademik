const fs = require('fs')
const jadwalKuliahHandler = async (sock, sender, text, m) => {
  
  const res = jadwalKuliahRequest(text)
  let hasilJadwal = ''
  res.forEach((jadwal, i) => {
    hasilJadwal += 
`\n*${i+1}*
Kelas\t\t\t\t: ${jadwal[0]}
Hari\t\t\t\t\t: ${jadwal[5]}
Kode MK\t: ${jadwal[1]}
MatKul\t\t: ${jadwal[2]}
Waktu\t\t\t: ${jadwal[6]}
SKS\t\t\t\t\t: ${jadwal[3]}
Dosen\t\t\t: ${jadwal[4]}
Ruang\t\t\t: ${jadwal[7]}\n`
  })
  if (res.length === 0) {
    hasilJadwal = "*Jadwal tidak ada*"
  }
  sock.sendMessage(
    sender,
    {text: 'Tahun Akademik 20231\n'+hasilJadwal},
    {quoted: m}
  )
}

const jadwalKuliahRequest = (text) => {
  let data = {}
  const file = JSON.parse(fs.readFileSync('./database/jadwalkuliah20231.json'))
  data = file.values.filter(array => {
    return array.some((i) => {
      const kelas = i.toLowerCase().includes(text[1])
        || (i.replace(/\s/g, '').replace('S1', '').toLowerCase().includes(text[1]))
      
      return kelas
    })
  })

  if (text.length === 3) {
    data = data.filter(array => {
      return array.some(i => {
        const hari = i.toLowerCase().includes(text[2])
        return hari
      })
    })
  }
  
  return data
}

module.exports = { jadwalKuliahHandler }