// Jam Digital
function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString("id-ID");
}
setInterval(updateClock, 1000);
updateClock();

// Fungsi format tanggal ke DD/MM/YYYY
function formatTanggal(tgl) {
  const [year, month, day] = tgl.split("-");
  return `${day}/${month}/${year}`;
}

// Tabel Bahasa Online
const tables = {
  index:     { '0': '1', '1': '8', '2': '5', '3': '6', '4': '9', '5': '7', '6': '3', '7': '4', '8': '2', '9': '0' },
  tysen:     { '0': '6', '1': '3', '2': '9', '3': '2', '4': '8', '5': '6', '6': '4', '7': '5', '8': '1', '9': '7' },
  mistikBaru:{ '0': '3', '1': '2', '2': '4', '3': '8', '4': '6', '5': '1', '6': '7', '7': '0', '8': '9', '9': '5' },
  mistikLama:{ '0': '7', '1': '2', '2': '5', '3': '9', '4': '6', '5': '0', '6': '8', '7': '4', '8': '1', '9': '3' },
  m0:        { '0': '3', '1': '4', '2': '7', '3': '9', '4': '6', '5': '9', '6': '2', '7': '0', '8': '7', '9': '1' },
  m9:        { '0': '1', '1': '9', '2': '6', '3': '5', '4': '3', '5': '2', '6': '4', '7': '7', '8': '8', '9': '0' }
};

// Ambil result dari Google Sheet
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vREhD2GBMj-NEK6NsAn-ReJLN-tyjFXQnI3FxHPKOmbnoOqiWrW3-kxhGb4c1IVDFGMrBcKBX-ANoZB/pub?gid=0&single=true&output=csv';

const tanggalInput = document.getElementById("tanggal");
const pasaranInput = document.getElementById("pasaran");
const resultInput = document.getElementById("result");
const loader = document.getElementById("loader");

async function ambilResult() {
  if (!tanggalInput.value || !pasaranInput.value) return;

  const tanggal = formatTanggal(tanggalInput.value); // ← sudah diformat ke DD/MM/YYYY
  const pasaran = pasaranInput.value;
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

// Event listeners
tanggalInput.addEventListener("change", ambilResult);
pasaranInput.addEventListener("change", ambilResult);

// ... (kode selanjutnya tetap sama, mulai dari prediksi, reset, hingga download PDF)
