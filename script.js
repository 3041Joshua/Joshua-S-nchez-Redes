// ====== Configuración editable (cámbiala por cliente) ======
const dataUser = {
  name: "Joshua Sánchez Pérez",
  tagline: "Creador de contenido • Programador",
  avatar: "Imagen de WhatsApp 2025-07-17 a las 12.13.12_b6e22b25.jpg", // reemplaza por una foto 1:1
  // Redes: label, url, meta (opcional)
  links: [
    { label: "Instagram", url: "https://www.instagram.com/3041_joshua/" },
    { label: "TikTok",    url: "https://www.tiktok.com/@3041_joshua" },
    { label: "Facebook",  url: "https://www.facebook.com/profile.php?id=100072261832475" },
    { label: "Youtube",  url: "https://www.youtube.com/@3041_joshua" },

  ],
  // Datos para vCard
  vcard: {
    fullName: "Joshua Sánchez Pérez",
    org: "JSProgament",
    title: "Programador",
    phone: "+52 246 106 6503",
    email: "jsprogament@gmail.com",
    url: "https://jsprogament-redes.netlify.app/",
    note: "Agendado desde sitio de enlaces."
  }
};

// ====== Utilidades ======
const $ = (sel, root=document) => root.querySelector(sel);
const el = (tag, props = {}, children = []) => {
  const node = Object.assign(document.createElement(tag), props);
  for (const child of (Array.isArray(children) ? children : [children])) {
    if (typeof child === 'string') node.appendChild(document.createTextNode(child));
    else if (child) node.appendChild(child);
  }
  return node;
};

// ====== Inicializa contenido ======
function renderProfile(){
  $("#displayName").textContent = dataUser.name;
  $("#tagline").textContent = dataUser.tagline;
  $("#avatar").src = dataUser.avatar;
}

function renderLinks(){
  const list = $("#linksList");
  list.innerHTML = "";
  dataUser.links.forEach(link => {
    const a = el("a", { href: link.url, target: "_blank", rel: "noopener", className: "link-item" }, [
      el("span", { className: "i i-qr", style: "opacity:.0;width:2px" }), // separador sutil
      el("span", {}, link.label),
      el("span", { className: "link-right" }, "Abrir")
    ]);
    list.appendChild(a);
  });
}

// ====== Compartir & Copiar ======
async function shareProfile(){
  const shareData = {
    title: document.title,
    text: dataUser.tagline,
    url: location.href
  };
  if (navigator.share) {
    try{ await navigator.share(shareData); }catch{}
  } else {
    await copyLink();
  }
}

async function copyLink(){
  try{
    await navigator.clipboard.writeText(location.href);
    $("#copyHint").textContent = "✅ Enlace copiado";
  }catch(e){
    $("#copyHint").textContent = "Copia el enlace de la barra del navegador";
  }
  setTimeout(()=> $("#copyHint").textContent = "", 2500);
}

// ====== vCard (VCF) ======
function downloadVCard(){
  const v = dataUser.vcard;
  const vcf =
`BEGIN:VCARD
VERSION:3.0
N:${v.fullName};;;
FN:${v.fullName}
ORG:${v.org}
TITLE:${v.title}
TEL;TYPE=CELL:${v.phone}
EMAIL;TYPE=INTERNET:${v.email}
URL:${v.url}
NOTE:${v.note}
END:VCARD`;
  const blob = new Blob([vcf], {type: "text/vcard"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = (v.fullName || "contacto") + ".vcf";
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(a.href);
  a.remove();
}

// ====== QR ======
let qr;
function openQR(){
  const modal = $("#qrModal");
  if (!qr){
    qr = new QRCode($("#qrcode"), {
      text: location.href,
      width: 220,
      height: 220
    });
  }
  modal.showModal();
}

function closeQR(){
  $("#qrModal").close();
}

function downloadQR(){
  // QRCode.js crea un <img> o <canvas> dentro de #qrcode
  const holder = $("#qrcode");
  const canvas = holder.querySelector("canvas");
  const img = holder.querySelector("img");
  let dataURL;
  if (canvas){
    dataURL = canvas.toDataURL("image/png");
  } else if (img){
    // convertir imagen en canvas para descargar
    const c = document.createElement("canvas");
    c.width = img.naturalWidth || 220;
    c.height = img.naturalHeight || 220;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0);
    dataURL = c.toDataURL("image/png");
  }
  if (dataURL){
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "qr.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}

// ====== Init ======
renderProfile();
renderLinks();

// Eventos
$("#btnShare").addEventListener("click", shareProfile);
$("#btnCopy").addEventListener("click", copyLink);
$("#btnVCard").addEventListener("click", downloadVCard);
$("#btnQR").addEventListener("click", openQR);
$("#btnCloseQR").addEventListener("click", closeQR);
$("#btnDownloadQR").addEventListener("click", downloadQR);
