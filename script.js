// script.js

// Jam Digital
function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString("id-ID");
}
setInterval(updateClock, 1000);
updateClock();

// Tabel Bahasa Online
const tables = {
  index:     { '0': '1', '1': '8', '2': '5', '3': '6', '4': '9', '5': '7', '6': '3', '7': '4', '8': '2', '9': '0' },
  tysen:     { '0': '6', '1': '3', '2': '9', '3': '2', '4': '8', '5': '6', '6': '4', '7': '5', '8': '1', '9': '7' },
  mistikBaru:{ '0': '3', '1': '2', '2': '4', '3': '8', '4': '6', '5': '1', '6': '7', '7': '0', '8': '9', '9': '5' },
  mistikLama:{ '0': '7', '1': '2', '2': '5', '3': '9', '4': '6', '5': '0', '6': '8', '7': '4', '8': '1', '9': '3' },
  m0:        { '0': '3', '1': '4', '2': '7', '3': '9', '4': '6', '5': '9', '6': '2', '7': '0', '8': '7', '9': '1' },
  m9:        { '0': '1', '1': '9', '2': '6', '3': '5', '4': '3', '5': '2', '6': '4', '7': '7', '8': '8', '9': '0' }
};

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vREhD2GBMj-NEK6NsAn-ReJLN-tyjFXQnI3FxHPKOmbnoOqiWrW3-kxhGb4c1IVDFGMrBcKBX-ANoZB/pub?gid=0&single=true&output=csv';

const tanggalInput = document.getElementById("tanggal");
const pasaranInput = document.getElementById("pasaran");
const resultInput = document.getElementById("result");
const loader = document.getElementById("loader");

function formatTanggal(tgl) {
  const d = new Date(tgl);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

async function ambilResult() {
  const tanggal = formatTanggal(tanggalInput.value);
  const pasaran = pasaranInput.value;
  if (!tanggal || !pasaran) return;

  loader.style.display = "block";

  try {
    const response = await fetch(SHEET_URL);
    const csv = await response.text();
    const lines = csv.trim().split('\n').map(line => line.split(','));
    const header = lines[0].map(h => h.trim());
    const idxTanggal = header.indexOf("Tanggal");
    const idxPasaran = header.indexOf(pasaran);

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i];
      if (row[idxTanggal]?.trim() === tanggal) {
        resultInput.value = row[idxPasaran]?.trim() || "";
        loader.style.display = "none";
        return;
      }
    }
    alert("Data tidak ditemukan!");
  } catch (err) {
    alert("Gagal mengambil data!");
    console.error(err);
  } finally {
    loader.style.display = "none";
  }
}

tanggalInput.addEventListener("change", ambilResult);
pasaranInput.addEventListener("change", ambilResult);

const form = document.getElementById("predictionForm");
const output = document.getElementById("output");

form.addEventListener("submit", function(e) {
  e.preventDefault();
  const result = resultInput.value.trim();
  const pasaran = pasaranInput.value;
  const tanggal = formatTanggal(tanggalInput.value);

  if (!/^[0-9]{4}$/.test(result)) {
    alert("Masukkan 4 digit angka!");
    return;
  }

  const digits = result.split('');
  const [as, kop] = [parseInt(digits[0]), parseInt(digits[1])];

  const detailPerTabel = {};
  const semuaAngka = [];

  for (const [key, table] of Object.entries(tables)) {
    const hasil = digits.map(d => `${d} → ${table[d]}`);
    const final = [...new Set(digits.map(d => table[d]))];
    detailPerTabel[key] = { hasil, final };
    semuaAngka.push(...final);
  }

  const angkaUnik = [...new Set(semuaAngka)];
  const bbfs = angkaUnik.filter(a => a !== '8');

  const count = {};
  semuaAngka.forEach(d => count[d] = (count[d] || 0) + 1);
  const colokBebas = Object.entries(count).filter(([_, v]) => v >= 3).map(([k]) => k);

  const kenaikan = [];
  for (let i = 0; i <= 4; i++) {
    const naikAS = (as + i) % 10;
    const naikKOP = (kop + i) % 10;
    kenaikan.push([naikAS, naikKOP]);
  }

  const enhanced2D = kenaikan.flatMap(([a]) => {
    return Array.from({length: 10}, (_, i) => `${a}${i}`);
  });

  const top25 = enhanced2D.slice(0, 20).concat([
    `${as}3`, `${(as+1)%10}3`, `${(as+2)%10}3`, `${(as+3)%10}3`, `${(as+4)%10}3`
  ]);

  const top15 = enhanced2D.filter((_, i) => i % 2 === 0).slice(0, 15);

  const teks = `📍 Pasaran: ${pasaran}
🗕️ Tanggal: ${tanggal}

🔢 Pecah Digit:
${digits.join(' – ')}
➡️ AS = ${as}, KOP = ${kop}

📌 Tabel Bahasa Online:
${Object.entries(detailPerTabel).map(([key, val], i) => `${i+1}. ${key.toUpperCase()}
${val.hasil.join('\n')}
➡️ ${key.toUpperCase()} Final: ${val.final.join(', ')}`).join('\n\n')}

✅ Gabungan Angka Unik:
${angkaUnik.join(', ')}
➡️ BBFS Final: ${bbfs.join(' – ')}

🔘 Colok Bebas (Dominan):
➡️ ${colokBebas.join(' – ')}

🔁 Kenaikan AS–KOP:
AS = ${as}, KOP = ${kop}
+1 hingga +4:
${kenaikan.slice(1).map(([a, k], i) => `+${i+1}\t${a}\t${k}`).join('\n')}

✅ Enhanced 2D – 40 Line:
${enhanced2D.join(', ')}

🔝 TOP 25 Line:
${top25.join(', ')}

🔝 TOP 15 Line:
${top15.join(', ')}

📦 Rangkuman Final:
✅ BBFS: ${bbfs.join(' – ')}
✅ Colok Bebas: ${colokBebas.join(' – ')}
✅ Enhanced 2D (40 line)
✅ TOP 25 Line
✅ TOP 15 Line`;

  output.innerText = teks;
});

document.getElementById("resetBtn").addEventListener("click", () => {
  form.reset();
  output.innerText = "";
});

document.getElementById("downloadBtn").addEventListener("click", () => {
  if (!output.innerText.trim()) return alert("Harap proses result dahulu!");

  const div = document.createElement("div");
  div.style.whiteSpace = "pre-wrap";
  div.style.fontFamily = "monospace";
  div.innerText = output.innerText;

  html2pdf().set({
    margin: 0.5,
    filename: "prediksi-2d.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
  }).from(div).save();
});
