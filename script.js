const NAMESPACE = "valine-payment";
const COPY_KEY = "copy";
const TRX_KEY = "trx";

async function loadCount(key, el) {
  const res = await fetch(`https://api.countapi.xyz/get/${NAMESPACE}/${key}`);
  const data = await res.json();
  document.getElementById(el).innerText = data.value || 0;
}

async function hitCount(key, el) {
  const res = await fetch(`https://api.countapi.xyz/hit/${NAMESPACE}/${key}`);
  const data = await res.json();
  document.getElementById(el).innerText = data.value;
}

function copyNumber(number, btn) {
  const label = btn.querySelector("span");
  const original = label.innerText;

  navigator.clipboard.writeText(number).then(() => {
    hitCount(COPY_KEY, "copyCount");
    hitCount(TRX_KEY, "trxCount");

    btn.classList.add("copied");
    label.innerText = "✔ Nomor Tersalin";

    setTimeout(() => {
      btn.classList.remove("copied");
      label.innerText = original;
    }, 1200);
  });
}

function openQRIS() {
  document.getElementById("qrisModal").style.display = "flex";
}

function closeQRIS() {
  document.getElementById("qrisModal").style.display = "none";
}

/* initial load */
loadCount(COPY_KEY, "copyCount");
loadCount(TRX_KEY, "trxCount");
