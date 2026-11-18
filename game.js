/* Kâşif Aras · Paragraf Rotası */
(() => {
  "use strict";

  const KAYIT = "paragrafRotasi_aras_v1";
  const SURE = 30;               // 30 saniyelik taktik
  const PUAN = 10, BONUS = 5;
  const GECME = 3;               // 4 sorudan en az 3 doğru
  const HARF = ["A", "B", "C", "D"];
  // Seviye görsellerinin doğal boyu ve yüz merkezleri (görsele göre oran)
  const GORSEL = [
    { w: 282, h: 790, fx: .53, fy: .20 },
    { w: 298, h: 790, fx: .58, fy: .28 },
    { w: 290, h: 790, fx: .53, fy: .19 },
    { w: 325, h: 790, fx: .47, fy: .19 },
    { w: 386, h: 790, fx: .47, fy: .19 }
  ];

  const $ = s => document.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const kar = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const kacis = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- durum ---------- */
  const bos = () => ({ acik: 0, en: {}, ses: true });
  let D = bos();
  try { const k = JSON.parse(localStorage.getItem(KAYIT)); if (k && typeof k.acik === "number") D = Object.assign(bos(), k); } catch (e) { /* kayıt yok */ }
  const kaydet = () => { try { localStorage.setItem(KAYIT, JSON.stringify(D)); } catch (e) { /* gizli pencere */ } };

  const toplamMurekkep = () => Object.values(D.en).reduce((t, r) => t + (r.murekkep || 0), 0);
  const seviye = () => D.acik >= DURAKLAR.length ? SEVIYELER.length - 1 : DURAK_SEVIYE[D.acik];

  /* ---------- ses ---------- */
  let ac;
  function ton(notalar) {
    if (!D.ses) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      let t = ac.currentTime;
      notalar.forEach(([f, sure, tip]) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = tip || "triangle"; o.frequency.value = f;
        g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.18, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + sure);
        o.connect(g).connect(ac.destination); o.start(t); o.stop(t + sure + .02); t += sure * .8;
      });
    } catch (e) { /* ses yok */ }
  }
  const SES = {
    dogru: () => ton([[660, .12], [880, .2]]),
    yanlis: () => ton([[220, .22, "sawtooth"], [180, .25, "sawtooth"]]),
    tik: () => ton([[520, .06]]),
    kazan: () => ton([[523, .12], [659, .12], [784, .12], [1047, .32]]),
    seviye: () => ton([[392, .14], [523, .14], [659, .14], [784, .14], [1047, .45]])
  };

  /* ---------- konfeti ---------- */
  const kv = $("#konfeti"), kc = kv.getContext("2d");
  let parca = [], kosuyor = false;
  function konfeti(n = 140) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    kv.width = innerWidth; kv.height = innerHeight;
    const renk = ["#E3A72F", "#1F5C5B", "#C4472D", "#22304A", "#F6D58A"];
    for (let i = 0; i < n; i++) parca.push({ x: innerWidth / 2 + (Math.random() - .5) * 200, y: innerHeight * .35, vx: (Math.random() - .5) * 14, vy: -Math.random() * 14 - 4, r: Math.random() * 6 + 4, a: Math.random() * 6, c: renk[i % renk.length], o: 1 });
    if (!kosuyor) { kosuyor = true; requestAnimationFrame(ciz); }
  }
  function ciz() {
    kc.clearRect(0, 0, kv.width, kv.height);
    parca.forEach(p => { p.vy += .35; p.x += p.vx; p.y += p.vy; p.a += .15; p.o -= .006; kc.save(); kc.globalAlpha = Math.max(p.o, 0); kc.translate(p.x, p.y); kc.rotate(p.a); kc.fillStyle = p.c; kc.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); kc.restore(); });
    parca = parca.filter(p => p.y < kv.height + 20 && p.o > 0);
    if (parca.length) requestAnimationFrame(ciz); else { kosuyor = false; kc.clearRect(0, 0, kv.width, kv.height); }
  }

  /* ---------- yüz kırpma ---------- */
  function yuz(e, lv) {
    const g = GORSEL[lv], b = e.clientWidth || 54;
    const s = (b * .95) / (g.w * .42);           // yüz ve saç kutuya sığar
    const W = g.w * s, H = g.h * s;
    e.style.backgroundImage = `url(${SEVIYELER[lv].gorsel})`;
    e.style.backgroundSize = `${W}px ${H}px`;
    e.style.backgroundPosition = `${b / 2 - g.fx * W}px ${b / 2 - (g.fy + .02) * H}px`;
  }

  /* ---------- ekranlar ---------- */
  function ekran(id) { document.querySelectorAll(".ekran").forEach(s => s.classList.toggle("aktif", s.id === id)); window.scrollTo(0, 0); }

  function giris() {
    const basladi = D.acik > 0 || Object.keys(D.en).length > 0;
    $("#baslaBtn").textContent = basladi ? "Maceraya Devam Et" : "Maceraya Başla";
    $("#sifirlaBtn").hidden = !basladi;
    ekran("giris");
  }

  function hud() {
    const lv = seviye();
    yuz($("#hudAvatar"), lv);
    $("#hudSeviyeNo").textContent = `SEVİYE ${lv + 1}`;
    $("#hudSeviyeAd").textContent = SEVIYELER[lv].ad;
    $("#hudMurekkep").textContent = toplamMurekkep();
    const ek = $("#hudEkipman"); ek.innerHTML = "";
    DURAKLAR.forEach((d, i) => {
      const s = el("span", "slot " + (i < D.acik ? "dolu" : "bos"), d.ekipman.ikon);
      s.title = i < D.acik ? d.ekipman.ad : `${i + 1}. durakta açılır`;
      ek.appendChild(s);
    });
    $("#sesBtn").textContent = D.ses ? "🔊" : "🔇";
  }

  function harita() {
    hud();
    document.documentElement.style.setProperty('--hud', $('.hud').offsetHeight + 'px');
    const k = $("#duraklar"); k.innerHTML = "";
    DURAKLAR.forEach((d, i) => {
      const durum = i < D.acik ? "gecildi" : i === D.acik ? "siradaki" : "kilitli";
      const b = el("button", "durak " + durum, i + 1);
      b.style.left = d.x + "%"; b.style.top = d.y + "%";
      b.setAttribute("aria-label", `${i + 1}. durak: ${d.ad}${durum === "kilitli" ? " (kilitli)" : ""}`);
      if (durum !== "kilitli") b.onclick = () => { SES.tik(); sandik(i); };
      else b.onclick = () => { b.animate([{ transform: "translate(-50%,-50%) rotate(-8deg)" }, { transform: "translate(-50%,-50%) rotate(8deg)" }, { transform: "translate(-50%,-50%)" }], 260); };
      k.appendChild(b);
      const r = D.en[i];
      const yil = r ? `<span class="yil">${"★".repeat(r.yildiz)}<span style="opacity:.3">${"★".repeat(3 - r.yildiz)}</span></span>` : "";
      const t = el("div", "etiket" + (durum === "kilitli" ? " kilitli" : ""), yil + kacis(d.ad));
      t.style.left = d.x + "%"; t.style.top = `calc(${d.y}% + clamp(24px,2.4vw,34px))`;
      k.appendChild(t);
    });
    const hedef = DURAKLAR[Math.min(D.acik, DURAKLAR.length - 1)];
    const pin = $("#pin");
    pin.style.left = hedef.x + "%"; pin.style.top = `calc(${hedef.y}% - clamp(22px,2vw,30px))`;
    ekran("harita");
    document.documentElement.style.setProperty('--hud', $('.hud').offsetHeight + 'px');
    yuz($("#pinYuz"), seviye());
    // mobilde sıradaki durağı görünür yap
    const kaydir = $(".harita-kaydir");
    if (kaydir.scrollWidth > kaydir.clientWidth) kaydir.scrollLeft = (hedef.x / 100) * kaydir.scrollWidth - kaydir.clientWidth / 2;
  }

  /* ---------- katman ---------- */
  const katman = $("#katman"), kart = $("#kart");
  let zamanlayici = null;
  function ac_(html) { kart.innerHTML = html; katman.hidden = false; kart.scrollTop = 0; const f = kart.querySelector("button.btn, .sik"); if (f) f.focus({ preventScroll: true }); }
  function kapat() { clearInterval(zamanlayici); katman.hidden = true; harita(); }
  katman.addEventListener("click", e => { if (e.target === katman && !aktifSoru) kapat(); });
  document.addEventListener("keydown", e => {
    if (katman.hidden) return;
    if (e.key === "Escape" && !aktifSoru) kapat();
    if (aktifSoru && !aktifSoru.cevaplandi && /^[1-4a-dA-D]$/.test(e.key)) {
      const i = isNaN(e.key) ? "abcd".indexOf(e.key.toLowerCase()) : +e.key - 1;
      const b = kart.querySelectorAll(".sik")[i]; if (b && !b.disabled) b.click();
    }
  });

  /* ---------- gizli sandık ---------- */
  function sandik(i) {
    const d = DURAKLAR[i], li = a => a.map(x => `<li>${kacis(x)}</li>`).join("");
    ac_(`
      <button class="kapat" aria-label="Kapat">✕</button>
      <div class="kart-ust">${i + 1}. DURAK · GİZLİ SANDIK</div>
      <h2>${kacis(d.ad)}</h2>
      <div class="alt">${kacis(d.konu)}</div>
      <div class="sandik-grid">
        <div class="sandik-kutu k-hap"><h3>💡 3 HAP BİLGİ</h3><ul>${li(d.hap)}</ul></div>
        <div class="sandik-kutu k-tuzak"><h3>⚠️ TUZAK ALAN</h3><ul>${li(d.tuzak)}</ul></div>
        <div class="sandik-kutu k-taktik"><h3>⏱️ 30 SANİYELİK TAKTİK</h3><ul>${li(d.taktik)}</ul></div>
      </div>
      <div class="sandik-alt">
        <p>4 soru, 3 fener. En az 3 doğru yaparsan <b>${d.ekipman.ikon} ${kacis(d.ekipman.ad)}</b> senin olur.</p>
        <button class="btn btn-ana" id="hazirBtn">Hazırım, başla</button>
      </div>`);
    kart.querySelector(".kapat").onclick = kapat;
    $("#hazirBtn").onclick = () => tur(i);
  }

  /* ---------- soru turu ---------- */
  let aktifSoru = null, T = null;
  function tur(i) {
    T = { durak: i, sira: 0, sonuc: [], fener: 3, joker: 1, murekkep: 0, hizli: 0 };
    soru();
  }

  function gorselHtml(q) {
    if (q.grafik) {
      const max = Math.max(...q.grafik.veri.map(v => v[1]));
      const c = q.grafik.veri.map(v => `<div class="cubuk"><span>${v[1]}</span><i style="height:${(v[1] / max) * 82}%"></i></div>`).join("");
      const a = q.grafik.veri.map(v => `<span>${kacis(v[0])}</span>`).join("");
      return `<div class="grafik"><h5>${kacis(q.grafik.baslik)}</h5><div class="cubuklar">${c}</div><div class="cubuk-ad">${a}</div></div>`;
    }
    if (q.tablo) {
      const th = q.tablo.basliklar.map(h => `<th>${kacis(h)}</th>`).join("");
      const tr = q.tablo.satirlar.map(r => `<tr>${r.map(c => `<td>${kacis(c)}</td>`).join("")}</tr>`).join("");
      return `<div class="tablo-k"><h5>${kacis(q.tablo.baslik)}</h5><table><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table></div>`;
    }
    return "";
  }

  function soru() {
    const d = DURAKLAR[T.durak], q = d.sorular[T.sira];
    const sira = kar(q.siklar.map((s, k) => ({ s, dogru: k === q.d })));
    aktifSoru = { q, sira, cevaplandi: false, bas: performance.now() };
    const ilerleme = d.sorular.map((_, k) => `<i class="${k < T.sonuc.length ? (T.sonuc[k] ? "d" : "y") : k === T.sira ? "s" : ""}"></i>`).join("");
    const fener = [0, 1, 2].map(k => `<span class="${k < T.fener ? "" : "sondu"}">🏮</span>`).join("");
    ac_(`
      <div class="kart-ust">${T.durak + 1}. DURAK · ${kacis(d.ad.toLocaleUpperCase("tr"))} · SORU ${T.sira + 1}/${d.sorular.length}</div>
      <div class="soru-ust">
        <div class="ilerleme">${ilerleme}</div>
        <div class="fenerler" aria-label="${T.fener} fener kaldı">${fener}</div>
        <div class="sure" aria-hidden="true"><i id="sureCubuk"></i></div>
        <div class="sure-etk" id="sureEtk">+5 BONUS</div>
      </div>
      ${gorselHtml(q)}
      ${q.metin ? `<div class="metin">${kacis(q.metin)}</div>` : ""}
      <div class="soru-koku">${kacis(q.soru)}</div>
      <div class="siklar">${sira.map((o, k) => `<button class="sik" data-k="${k}"><b>${HARF[k]}</b><span>${kacis(o.s)}</span></button>`).join("")}</div>
      <div id="isaretYer"></div>
      <div class="soru-alt">
        <button class="joker" id="jokerBtn" ${T.joker ? "" : "disabled"}>✨ Gizli İşaret <small>(${T.joker})</small></button>
        <span></span>
      </div>
      <div id="geriYer"></div>`);
    kart.querySelectorAll(".sik").forEach(b => b.onclick = () => cevapla(+b.dataset.k));
    $("#jokerBtn").onclick = joker;
    // süre çubuğu
    const cubuk = $("#sureCubuk");
    clearInterval(zamanlayici);
    zamanlayici = setInterval(() => {
      const gecen = (performance.now() - aktifSoru.bas) / 1000;
      const kalan = Math.max(0, 1 - gecen / SURE);
      cubuk.style.transform = `scaleX(${kalan})`;
      if (kalan <= 0) { clearInterval(zamanlayici); $("#sureEtk").textContent = "BONUS BİTTİ"; cubuk.parentElement.style.opacity = .4; }
    }, 100);
  }

  function joker() {
    if (!T.joker || aktifSoru.cevaplandi) return;
    T.joker--; SES.tik();
    const q = aktifSoru.q;
    const yanlislar = [...kart.querySelectorAll(".sik")].filter(b => !aktifSoru.sira[+b.dataset.k].dogru && !b.disabled);
    const e = yanlislar[Math.floor(Math.random() * yanlislar.length)];
    if (e) { e.classList.add("elendi"); e.disabled = true; }
    $("#isaretYer").innerHTML = `<div class="isaret-kutu"><b>✨ Haritadaki gizli işaret:</b> ${kacis(q.isaret)}</div>`;
    $("#jokerBtn").disabled = true;
  }

  function cevapla(k) {
    if (aktifSoru.cevaplandi) return;
    aktifSoru.cevaplandi = true;
    clearInterval(zamanlayici);
    const q = aktifSoru.q, dogru = aktifSoru.sira[k].dogru;
    const gecen = (performance.now() - aktifSoru.bas) / 1000;
    const butonlar = [...kart.querySelectorAll(".sik")];
    butonlar.forEach(b => { b.disabled = true; if (aktifSoru.sira[+b.dataset.k].dogru) b.classList.add("dogru"); });
    let kazanc = 0;
    if (dogru) { kazanc = PUAN + (gecen <= SURE ? BONUS : 0); if (gecen <= SURE) T.hizli++; T.murekkep += kazanc; SES.dogru(); }
    else { butonlar[k].classList.add("yanlis"); T.fener--; SES.yanlis(); }
    T.sonuc.push(dogru);
    $("#jokerBtn").disabled = true;
    const son = T.sira === DURAKLAR[T.durak].sorular.length - 1 || T.fener === 0;
    const baslik = dogru ? `Doğru! +${kazanc} 💧${kazanc > PUAN ? " (hızlı bonus)" : ""}` : (T.fener === 0 ? "Fenerlerin söndü" : "Bu kez olmadı, bir fener söndü");
    $("#geriYer").innerHTML = `
      <div class="geri ${dogru ? "iyi" : "kotu"}">
        <div class="baslik">${baslik}</div>
        <h4>🔑 BU SORUNUN KİLİDİ</h4><div>${kacis(q.kilit)}</div>
        <h4>🧭 BU SORUDA İZLEMEN GEREKEN ROTA</h4><ul>${q.rota.map(r => `<li>${kacis(r)}</li>`).join("")}</ul>
      </div>
      <div class="soru-alt"><span></span><button class="btn btn-ana" id="ileriBtn">${son ? "Sonucu gör" : "Sonraki soru →"}</button></div>`;
    $("#ileriBtn").onclick = () => { if (son) bitir(); else { T.sira++; soru(); } };
    $("#ileriBtn").focus({ preventScroll: true });
    $("#geriYer").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /* ---------- durak sonu ---------- */
  function bitir() {
    aktifSoru = null;
    const i = T.durak, d = DURAKLAR[i];
    const dogruSay = T.sonuc.filter(Boolean).length;
    const gecti = dogruSay >= GECME;
    const yildiz = !gecti ? 0 : dogruSay === 4 ? (T.hizli === 4 ? 3 : 2) : 1;
    const ilkKez = gecti && i === D.acik;
    const onceki = D.en[i];
    if (gecti && (!onceki || T.murekkep > onceki.murekkep || yildiz > onceki.yildiz)) {
      D.en[i] = { murekkep: Math.max(T.murekkep, onceki ? onceki.murekkep : 0), yildiz: Math.max(yildiz, onceki ? onceki.yildiz : 0) };
    }
    const eskiSeviye = seviye();
    if (ilkKez) D.acik = i + 1;
    kaydet();
    const yeniSeviye = seviye();
    const lv = eskiSeviye; // yeni görünüm seviye ekranında açılır

    if (gecti) { SES.kazan(); konfeti(90); } else SES.yanlis();
    const yil = `<div class="yildizlar">${[0, 1, 2].map(k => `<span class="${k < yildiz ? "" : "bos"}">⭐</span>`).join("")}</div>`;
    ac_(`
      <button class="kapat" aria-label="Kapat">✕</button>
      <div class="sonuc">
        <div class="sonuc-gorsel"><img class="kgorsel" src="${SEVIYELER[lv].gorsel}" alt="Aras"></div>
        <div>
          <div class="kart-ust">${i + 1}. DURAK · ${kacis(d.ad.toLocaleUpperCase("tr"))}</div>
          <h2>${gecti ? (i === DURAKLAR.length - 1 ? "Hazine açıldı!" : "Durak geçildi!") : "Bu durak biraz daha iz istiyor"}</h2>
          ${gecti ? yil : ""}
          <div class="istat"><span>✅ ${dogruSay}/4 doğru</span><span>💧 +${T.murekkep}</span><span>⏱️ ${T.hizli} hızlı cevap</span></div>
          ${gecti ? `<div class="kazanim"><span class="ikon">${d.ekipman.ikon}</span><div><small>${ilkKez ? "YENİ EKİPMAN" : "EKİPMANIN"}</small><b>${kacis(d.ekipman.ad)}</b></div></div>`
                  : `<p style="margin:10px 0 18px">Geçmek için en az ${GECME} doğru gerekiyor. Gizli Sandık'a bir kez daha göz at, sonra tekrar dene.</p>`}
          <div class="btn-dizi">
            ${gecti ? `<button class="btn btn-ana" id="devamBtn">${i === DURAKLAR.length - 1 ? "Hazineye bak" : "Haritaya dön"}</button>`
                    : `<button class="btn btn-ana" id="tekrarBtn">Tekrar dene</button><button class="btn btn-ince" id="haritaBtn">Haritaya dön</button>`}
          </div>
        </div>
      </div>`);
    kart.querySelector(".kapat").onclick = kapat;
    if (gecti) $("#devamBtn").onclick = () => {
      if (ilkKez && i === DURAKLAR.length - 1) final();
      else if (ilkKez && yeniSeviye > eskiSeviye) seviyeAtla(eskiSeviye, yeniSeviye);
      else kapat();
    };
    else { $("#tekrarBtn").onclick = () => sandik(i); $("#haritaBtn").onclick = kapat; }
  }

  function seviyeAtla(eski, yeni) {
    SES.seviye(); konfeti(180);
    ac_(`
      <div class="seviye-atla">
        <div class="kart-ust" style="justify-content:center">SEVİYE ATLADIN</div>
        <h2>Aras artık bir ${kacis(SEVIYELER[yeni].ad)}!</h2>
        <div class="ciftler">
          <img class="kgorsel eski" src="${SEVIYELER[eski].gorsel}" alt="${kacis(SEVIYELER[eski].ad)}">
          <span class="ok">➜</span>
          <img class="kgorsel yeni" src="${SEVIYELER[yeni].gorsel}" alt="${kacis(SEVIYELER[yeni].ad)}">
        </div>
        <p>${kacis(SEVIYELER[yeni].aciklama)}</p>
        <button class="btn btn-altin" id="tamamBtn">Yola devam</button>
      </div>`);
    $("#tamamBtn").onclick = kapat;
  }

  function final() {
    SES.seviye(); konfeti(260);
    const yildiz = Object.values(D.en).reduce((t, r) => t + r.yildiz, 0);
    ac_(`
      <div class="sonuc">
        <div class="sonuc-gorsel"><img class="kgorsel" src="${SEVIYELER[4].gorsel}" alt="Hazine Ustası Aras"></div>
        <div>
          <div class="kart-ust">STRATEJİ MEYDANI · HAZİNE</div>
          <h2>Aras bir Hazine Ustası!</h2>
          <p style="font-size:17px;margin:8px 0 14px">Dokuz durağın hepsini geçtin. Paragrafın konusundan sözel mantığa kadar bütün rotayı yürüdün; anahtar artık sende.</p>
          <div class="istat"><span>💧 ${toplamMurekkep()} mürekkep</span><span>⭐ ${yildiz}/27 yıldız</span><span>🎒 9/9 ekipman</span></div>
          <p style="font-size:15px;margin-bottom:16px">Eksik yıldızların varsa haritadaki duraklara dönüp tekrar oynayabilirsin. 3 yıldız için 4 soruyu da 30 saniyenin içinde doğru cevapla.</p>
          <div class="btn-dizi"><button class="btn btn-altin" id="tamamBtn">Haritaya dön</button></div>
        </div>
      </div>`);
    $("#tamamBtn").onclick = kapat;
  }

  /* ipucu yazısı birkaç saniye sonra kaybolur */
  setTimeout(() => { const n = $(".harita-not"); if (n) n.style.opacity = 0; }, 9000);

  /* ---------- başlat ---------- */
  $("#baslaBtn").onclick = () => { SES.tik(); harita(); };
  $("#sifirlaBtn").onclick = () => {
    if (!$("#sifirlaBtn").dataset.emin) { $("#sifirlaBtn").dataset.emin = 1; $("#sifirlaBtn").textContent = "Emin misin? Tüm ilerleme silinir"; return; }
    const ses = D.ses; D = bos(); D.ses = ses; kaydet(); delete $("#sifirlaBtn").dataset.emin; $("#sifirlaBtn").textContent = "Baştan başla"; giris();
  };
  $("#sesBtn").onclick = () => { D.ses = !D.ses; kaydet(); hud(); };
  $("#hudAvatar").onclick = () => {
    const lv = seviye();
    ac_(`<button class="kapat" aria-label="Kapat">✕</button>
      <div class="sonuc"><div class="sonuc-gorsel"><img class="kgorsel" src="${SEVIYELER[lv].gorsel}" alt="Aras"></div>
      <div><div class="kart-ust">SEVİYE ${lv + 1}</div><h2>${kacis(SEVIYELER[lv].ad)}</h2>
      <p style="font-size:17px;margin:8px 0 16px">${kacis(SEVIYELER[lv].aciklama)}</p>
      <div class="istat"><span>💧 ${toplamMurekkep()}</span><span>🎒 ${D.acik}/9 ekipman</span></div>
      <button class="btn btn-ana" id="tamamBtn">Haritaya dön</button></div></div>`);
    kart.querySelector(".kapat").onclick = kapat; $("#tamamBtn").onclick = kapat;
  };
  addEventListener("resize", () => { if ($("#harita").classList.contains("aktif")) { yuz($("#hudAvatar"), seviye()); yuz($("#pinYuz"), seviye()); } });
  giris();
})();
