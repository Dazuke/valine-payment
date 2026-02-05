let copyCount = localStorage.getItem("copyCount") || 0;
let trxCount = localStorage.getItem("trxCount") || 0;

document.getElementById("copyCount").innerText = copyCount;
document.getElementById("trxCount").innerText = trxCount;

function copyNumber(number) {
  navigator.clipboard.writeText(number).then(() => {
    copyCount++;
    trxCount++;

    localStorage.setItem("copyCount", copyCount);
    localStorage.setItem("trxCount", trxCount);

    document.getElementById("copyCount").innerText = copyCount;
    document.getElementById("trxCount").innerText = trxCount;

    alert("Nomor berhasil disalin");
  });
}

function openQRIS() {
  document.getElementById("qrisModal").style.display = "flex";
}

function closeQRIS() {
  document.getElementById("qrisModal").style.display = "none";
}
