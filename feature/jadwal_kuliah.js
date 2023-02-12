const fs = require('fs')
const jadwalKuliahHandler = async (sock, sender, ...text) => {
  
  const res = jadwalKuliahRequest(...text)
  let hasilJadwal = ''
  res.forEach((jadwal, i) => {
    hasilJadwal += 
`\n*${i+1}*
Kelas\t\t\t\t: ${jadwal[0]}
Hari\t\t\t\t\t: ${jadwal[1]}
Ruang\t\t\t: ${jadwal[2]}
Kampus\t\t: ${jadwal[3]}
Jam\t\t\t\t: ${jadwal[4]}
Kode MK\t: ${jadwal[5]}
MatKul\t\t: ${jadwal[6]}
SKS\t\t\t\t\t: ${jadwal[7]}
Dosen\t\t\t: ${jadwal[8]}\n`
  })
  if (res.length === 0) {
    hasilJadwal = "*Jadwal tidak ada*"
  }
  sock.sendMessage(sender, {text: 'Tahun Akademik 20231\n'+hasilJadwal})
}

const jadwalKuliahRequest = (...text) => {
  let data = {}
  const file = JSON.parse(fs.readFileSync('./databases/jadwalkuliah20222.json'))
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