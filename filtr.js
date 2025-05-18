const seradButtons = document.querySelectorAll('.seraddiv');
const filtrButtons = document.querySelectorAll('.filtrdiv');

openfiltrButton.addEventListener('click', () => {
    filtrButtons.forEach(btn => btn.style.display = 'inline-block');
    openfiltrButton.style.display = 'none';
    closefiltrButton.style.display = 'inline-block';
});

closefiltrButton.addEventListener('click', () => {
    filtrButtons.forEach(btn => btn.style.display = 'none');
    closefiltrButton.style.display = 'none';
    openfiltrButton.style.display = 'inline-block';
});

openseradButton.addEventListener('click', () => {
    seradButtons.forEach(btn => btn.style.display = 'inline-block');
    openseradButton.style.display = 'none';
    closeseradButton.style.display = 'inline-block';
});

closeseradButton.addEventListener('click', () => {
    seradButtons.forEach(btn => btn.style.display = 'none');
    closeseradButton.style.display = 'none';
    openseradButton.style.display = 'inline-block';
});


let projektyData = [];
let aktivniPuvody = new Set(); // byl: new Set(["Školní", "Zakázky", "Osobní"]);
let aktivniRoky = new Set();   // byl: new Set([2020, 2021, 2022, 2023, 2024, 2025, 2026]);
let aktivniTypy = new Set();   // byl: new Set(["Hra", "Web", "Aplikace"]);
let posledniSerazeni = null;

// ← PŘIDÁNO: Mapování id tlačítka na hodnotu v JSONu
const mapFilterValue = {
  skolni:   "Školní",
  zakazky:  "Zakázky",
  osobni:   "Osobní",
  "2020":   2020,
  "2021":   2021,
  "2022":   2022,
  "2023":   2023,
  "2024":   2024,
  "2025":   2025,
  "2026":   2026,
  hra:      "Hra",
  web:      "Web",
  aplikace: "Aplikace"
};

document.addEventListener("DOMContentLoaded", () => {
  fetch("projekty.json")
  .then(res => res.json())
  .then(data => {
    projektyData = data;
    nastavFiltry();
    seradit("nejmladsi");

  });


  document.getElementById("nejstarsi").addEventListener("click", () => seradit("nejstarsi"));
  document.getElementById("nejmladsi").addEventListener("click", () => seradit("nejmladsi"));
  document.getElementById("az").addEventListener("click", () => seradit("az"));
  document.getElementById("za").addEventListener("click", () => seradit("za"));
});


function scrollToHashIfNeeded(retryCount = 10) {
  const hash = window.location.hash;
  console.log("Hash:", hash); // Zobrazí aktuální hash
  if (!hash || retryCount <= 0) return;

  const el = document.querySelector(hash);
  if (el) {
    console.log("Prvek nalezen, scrollujeme na něj!");
    el.scrollIntoView({ behavior: 'smooth' });
  } else {
    console.log("Prvek nenalezen, pokusíme se znovu...");
    setTimeout(() => scrollToHashIfNeeded(retryCount - 1), 100);
  }
}





function nastavFiltry() {
  document.querySelectorAll(".filtrdiv").forEach(btn => {
    btn.style.backgroundColor = "#747272"; // všechna tlačítka zapnutá
    btn.addEventListener("click", () => {
      // ← ZMĚNA: bere se ID tlačítka, ne jeho text
      const key = btn.id;
      const hodnota = mapFilterValue[key];

      // podle typu hodnoty poznáme, do kterého Setu patří
      if (typeof hodnota === "number") {
        // rok
        if (aktivniRoky.has(hodnota)) {
          aktivniRoky.delete(hodnota);
          btn.style.backgroundColor = "#747272";
        } else {
          aktivniRoky.add(hodnota);
          btn.style.backgroundColor = "#000";
        }
      } else if (["Školní","Zakázky","Osobní"].includes(hodnota)) {
        // původ
        if (aktivniPuvody.has(hodnota)) {
          aktivniPuvody.delete(hodnota);
          btn.style.backgroundColor = "#747272";
        } else {
          aktivniPuvody.add(hodnota);
          btn.style.backgroundColor = "#000";
        }
      } else {
        // typ projektu
        if (aktivniTypy.has(hodnota)) {
          aktivniTypy.delete(hodnota);
          btn.style.backgroundColor = "#747272";
        } else {
          aktivniTypy.add(hodnota);
          btn.style.backgroundColor = "#000";
        }
      }

      seradit(posledniSerazeni || "nejmladsi");
    });
  });
}

function seradit(typ) {
  posledniSerazeni = typ;

  let filtrovano = projektyData.filter(p =>
  (aktivniPuvody.size === 0 || aktivniPuvody.has(p.puvod)) &&
  (aktivniRoky.size === 0 || aktivniRoky.has(p.rok)) &&
  (aktivniTypy.size === 0 || aktivniTypy.has(p.typ))
);


  switch (typ) {
    case "nejstarsi":  filtrovano.sort((a,b)=>a.rok-b.rok); break;
    case "nejmladsi":  filtrovano.sort((a,b)=>b.rok-a.rok); break;
    case "az":         filtrovano.sort((a,b)=>a.nazev.localeCompare(b.nazev)); break;
    case "za":         filtrovano.sort((a,b)=>b.nazev.localeCompare(a.nazev)); break;
  }

  document.querySelectorAll('.seraddiv').forEach(b=>b.style.backgroundColor='#747272');
  const akt = document.getElementById(typ);
  if (akt) akt.style.backgroundColor = '#000';

  zobrazProjekty(filtrovano);


}

function zobrazProjekty(projekty) {
  const c = document.getElementById("naprojekty");
  c.innerHTML = "";
  projekty.forEach(p => {
    c.insertAdjacentHTML("beforeend", `
      <div class="posp" id="projekt-${p.id}">
        <div class="natext">
          <h3 data-aos="fade-right">${p.nazev}</h3>
          <ul data-aos="fade-right">${p.popis_kratky.map(x=>`<li>${x}</li>`).join("")}</ul>
        </div>
        <div class="netext">
          <img src="${p.obrazek_uvodni}" alt="${p.nazev}" data-aos="fade-left">
          <div class="navice"><div class="vice"  data-aos="fade-left">
            <a href="#" onclick="zobrazDetail('${p.id}')">Vidět více</a>
          </div></div>
        </div>
      </div>
    `);
    document.body.insertAdjacentHTML("beforeend", `
      <div class="napodrobnosti" id="popup-${p.id}" style="display:none;">
        <div class="bilepozadi"></div>
        <img src="img/cross.png" class="krizek" onclick="zavritDetail('${p.id}')">
        <div class="podrobnosti">
          <div class="neobrazky">
            <h2>${p.nazev}</h2>
            <div class="druh">
              <div>${p.puvod}</div>
              <div>${p.rok}</div>
              <div>${p.typ}</div>
            </div>
            <ul>${p.popis_dlouhy.map(x=>`<li>${x}</li>`).join("")}</ul>
          </div>
          <div class="naobrazky">
            <div class="doprostreddavac">
              <img src="${p.obrazky_detail[0]}">
              <div class="navisku">
                <img src="${p.obrazky_detail[1]}">
                <img src="${p.obrazky_detail[2]}">
              </div>
              <img src="${p.obrazky_detail[3]}">
              </div>
          </div>
        </div>
      </div>
    `);
  });

  window.requestAnimationFrame(() => scrollToHashIfNeeded());
}

function zobrazDetail(id) {
  document.getElementById(`popup-${id}`).style.display = "block";
  document.body.style.overflow = 'hidden';


  window.location.hash = id; // ← TOHLE ZAJISTÍ, ŽE PO OTEVŘENÍ DETAILU SE HASH V URL UPRAVÍ
  window.requestAnimationFrame(scrollToHashIfNeeded);
}
function zavritDetail(id) {
  document.getElementById(`popup-${id}`).style.display = "none";
  document.body.style.overflow = 'auto';
}