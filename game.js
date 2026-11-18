/* Kâşif Aras · Paragraf Rotası */
(() => {
  "use strict";

  const KAYIT = "paragrafRotasi_aras_v1";
  const SURE = 30;               // 30 saniyelik taktik
  const PUAN = 10, BONUS = 5, SERI_BONUS = 5;
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
  const dar = () => matchMedia("(max-width:900px), (orientation:portrait)").matches;

  /* ---------- durum ---------- */
  const bos = () => ({ acik: 0, en: {}, ses: true });
  let D = bos();
  try { const k = JSON.parse(localStorage.getItem(KAYIT)); if (k && typeof k.acik === "number") D = Object.assign(bos(), k); } catch (e) { /* kayıt yok */ }
  const kaydet = () => { try { localStorage.setItem(KAYIT, JSON.stringify(D)); } catch (e) { /* gizli pencere */ } };

  const toplamMurekkep = () => Object.values(D.en).reduce((t, r) => t + (r.murekkep || 0), 0);
  const seviye = () => D.acik >= DURAKLAR.length ? SEVIYELER.length - 1 : DURAK_SEVIYE[D.acik];
  function sonrakiSeviye() {
    const lv = seviye();
    for (let j = D.acik + 1; j < DURAKLAR.length; j++) if (DURAK_SEVIYE[j] > lv) return { lv: DURAK_SEVIYE[j], kalan: j - D.acik };
    return null;
  }

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
    seri: () => ton([[660, .1], [880, .1], [1175, .22]]),
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
    const s = (b * .95) / (g.w * .42);
    const W = g.w * s, H = g.h * s;
    e.style.backgroundImage = `url(${SEVIYELER[lv].gorsel})`;
    e.style.backgroundSize = `${W}px ${H}px`;
    e.style.backgroundPosition = `${b / 2 - g.fx * W}px ${b / 2 - (g.fy + .02) * H}px`;
  }

  /* ---------- ekranlar ---------- */
  function ekran(id) { document.querySelectorAll(".ekran").forEach(s => s.classList.toggle("aktif", s.id === id)); window.scrollTo(0, 0); }

  function giris() {
    const basladi = D.acik > 0 || Object.keys(D.en).length > 0;
    const lv = seviye();
    $("#baslaBtn").textContent = basladi ? "Maceraya Devam Et" : "Maceraya Başla";
    $("#sifirlaBtn").hidden = !basladi;
    $("#girisGorsel").src = SEVIYELER[lv].gorsel;
    $("#syEtk").textContent = basladi ? `SEVİYE ${lv + 1}/5 · ${SEVIYELER[lv].ad.toLocaleUpperCase("tr")}` : "5 SEVİYE SENİ BEKLİYOR";
    ekran("giris");
    const yol = $("#seviyeYolu"); yol.innerHTML = "";
    SEVIYELER.forEach((s, k) => {
      const kap = el("div", "sy-kap"), kutu = el("div", "sy " + (k <= lv ? "acik" : "kapali"));
      kutu.title = s.ad; kap.appendChild(kutu);
      if (k > lv) kap.appendChild(el("span", "sy-kilit", "🔒"));
      yol.appendChild(kap); yuz(kutu, k);
    });
  }

  function hud() {
    const lv = seviye();
    yuz($("#hudAvatar"), lv);
    $("#hudSeviyeNo").textContent = `SEVİYE ${lv + 1}`;
    $("#hudSeviyeAd").textContent = SEVIYELER[lv].ad;
    $("#hudMurekkep").textContent = toplamMurekkep();
    $("#rotaSol").innerHTML = `ROTA <b>${D.acik}/9</b> DURAK`;
    const sn = sonrakiSeviye();
    $("#rotaSag").innerHTML = D.acik >= 9 ? "<b>HAZİNE AÇILDI</b>" : sn ? `SONRAKİ SEVİYE: <b>${kacis(SEVIYELER[sn.lv].ad.toLocaleUpperCase("tr"))}</b> · ${sn.kalan} DURAK` : "SON DURAK: <b>HAZİNE</b>";
    const sr = $("#rotaSerit"); sr.innerHTML = "";
    const dol = el("div", "dolum"); sr.appendChild(dol);
    DURAKLAR.forEach((d, i) => {
      const durum = i < D.acik ? "dolu" : i === D.acik ? "siradaki" : "bos";
      const s = el("span", "slot " + durum, durum === "bos" ? "🔒" : d.ekipman.ikon);
      s.title = i < D.acik ? `${d.ekipman.ad} (kazanıldı)` : `${i + 1}. durakta açılır: ${d.ekipman.ad}`;
      sr.appendChild(s);
    });
    requestAnimationFrame(() => { const w = sr.clientWidth - 36; dol.style.width = Math.max(0, Math.min(1, D.acik / 8)) * w + "px"; });
    $("#sesBtn").textContent = D.ses ? "🔊" : "🔇";
    document.documentElement.style.setProperty("--hud", $(".hud").offsetHeight + "px");
  }

  function harita(murekkepArtti) {
    ekran("harita");
    hud();
    const k = $("#duraklar"); k.innerHTML = "";
    DURAKLAR.forEach((d, i) => {
      const durum = i < D.acik ? "gecildi" : i === D.acik ? "siradaki" : "kilitli";
      const b = el("button", "durak " + durum, durum === "kilitli" ? `🔒<small>${i + 1}</small>` : i + 1);
      b.style.left = d.x + "%"; b.style.top = d.y + "%";
      b.setAttribute("aria-label", `${i + 1}. durak: ${d.ad}${durum === "kilitli" ? " (kilitli)" : ""}`);
      if (durum !== "kilitli") b.onclick = () => { SES.tik(); sandik(i); };
      else b.onclick = () => { b.animate([{ transform: "translate(-50%,-50%) rotate(-10deg)" }, { transform: "translate(-50%,-50%) rotate(10deg)" }, { transform: "translate(-50%,-50%)" }], 280); };
      k.appendChild(b);
      const r = D.en[i];
      const yil = r ? `<span class="yil">${"★".repeat(r.yildiz)}<span style="opacity:.3">${"★".repeat(3 - r.yildiz)}</span></span>` : "";
      const t = el("div", "etiket " + durum, yil + kacis(d.ad));
      t.style.left = d.x + "%"; t.style.top = `calc(${d.y}% + clamp(26px,2.6vw,38px))`;
      k.appendChild(t);
    });
    const hedef = DURAKLAR[Math.min(D.acik, DURAKLAR.length - 1)];
    const pin = $("#pin");
    pin.style.left = hedef.x + "%"; pin.style.top = `calc(${hedef.y}% - clamp(26px,2.4vw,36px))`;
    yuz($("#pinYuz"), seviye());
    const sb = $("#siradakiBtn");
    if (D.acik < DURAKLAR.length) { sb.textContent = `▶  ${D.acik + 1}. Durak · ${DURAKLAR[D.acik].ad}`; sb.onclick = () => { SES.tik(); sandik(D.acik); }; }
    else { sb.textContent = "🏆  Hazine açıldı · Özeti gör"; sb.onclick = final; }
    // sıradaki durağı ekranın ortasına getir
    requestAnimationFrame(() => {
      const kz = $("#haritaKaydir"), a = $("#haritaAlan");
      kz.scrollLeft = (hedef.x / 100) * a.clientWidth - kz.clientWidth / 2;
      kz.scrollTop = (hedef.y / 100) * a.clientHeight - kz.clientHeight / 2;
    });
    if (murekkepArtti) { const m = $("#hudMurekkepKutu"); m.classList.remove("zipla"); void m.offsetWidth; m.classList.add("zipla"); }
  }

  // fareyle sürükleyerek haritayı kaydır
  (() => {
    const kz = $("#haritaKaydir"); let bas = null;
    kz.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse" || e.target.closest("button")) return; bas = { x: e.clientX, y: e.clientY, l: kz.scrollLeft, t: kz.scrollTop }; kz.classList.add("surukle"); });
    addEventListener("pointermove", e => { if (!bas) return; kz.scrollLeft = bas.l - (e.clientX - bas.x); kz.scrollTop = bas.t - (e.clientY - bas.y); });
    addEventListener("pointerup", () => { bas = null; kz.classList.remove("surukle"); });
  })();

  /* ---------- katman ---------- */
  const katman = $("#katman"), kart = $("#kart");
  let zamanlayici = null;
  function ac_(html, sinif) {
    kart.className = "kart" + (sinif ? " " + sinif : "");
    kart.innerHTML = html; katman.hidden = false; kart.scrollTop = 0;
    const f = kart.querySelector("button.btn, .sik"); if (f) f.focus({ preventScroll: true });
  }
  function kapat(artti) { clearInterval(zamanlayici); aktifSoru = null; katman.hidden = true; harita(artti === true); }
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
      <div class="sandik-bas"><div class="rozet">${d.ekipman.ikon}</div><div>
        <div class="kart-ust">${i + 1}. DURAK · GİZLİ SANDIK</div>
        <h2>${kacis(d.ad)}</h2>
        <div class="alt" style="margin:0">${kacis(d.konu)}</div></div></div>
      <div class="sandik-sek">
        <button class="sekme aktif" data-k="0">💡 Hap Bilgi</button><button class="sekme" data-k="1">⚠️ Tuzak</button><button class="sekme" data-k="2">⏱️ Taktik</button>
      </div>
      <div class="sandik-grid">
        <div class="sandik-kutu k-hap aktif"><h3>💡 3 HAP BİLGİ</h3><ul>${li(d.hap)}</ul></div>
        <div class="sandik-kutu k-tuzak"><h3>⚠️ TUZAK ALAN</h3><ul>${li(d.tuzak)}</ul></div>
        <div class="sandik-kutu k-taktik"><h3>⏱️ 30 SANİYELİK TAKTİK</h3><ul>${li(d.taktik)}</ul></div>
      </div>
      <div class="sandik-alt">
        <p>4 soru, 3 fener. En az 3 doğru yaparsan <b>${d.ekipman.ikon} ${kacis(d.ekipman.ad)}</b> senin olur.</p>
        <button class="btn btn-altin nabiz" id="hazirBtn">Hazırım, başla</button>
      </div>`);
    kart.querySelector(".kapat").onclick = () => kapat();
    const kutular = kart.querySelectorAll(".sandik-kutu"), sek = kart.querySelectorAll(".sandik-sek .sekme");
    sek.forEach(b => b.onclick = () => { sek.forEach(x => x.classList.toggle("aktif", x === b)); kutular.forEach((k, n) => k.classList.toggle("aktif", n === +b.dataset.k)); });
    $("#hazirBtn").onclick = () => tur(i);
  }

  /* ---------- soru turu ---------- */
  let aktifSoru = null, T = null;
  function tur(i) {
    T = { durak: i, sira: 0, sonuc: [], fener: 3, joker: 1, murekkep: 0, hizli: 0, seri: 0 };
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

  // yazıyı kutuya sığdır: kaydırma çubuğu yerine yazı boyutu küçülür
  function sigdir() {
    if (!kart.classList.contains("soru-kart")) return;
    const ust = Math.round(Math.min(dar() ? 21 : 25, innerHeight / (dar() ? 38 : 34), innerWidth / (dar() ? 20 : 56)));
    kart.querySelectorAll(".sigdir").forEach(k => {
      if (!k.offsetParent) return;
      const ic = k.firstElementChild; let fs = ust;
      k.style.setProperty("--fs", fs + "px");
      while (ic.scrollHeight > k.clientHeight && fs > 11) { fs -= .5; k.style.setProperty("--fs", fs + "px"); }
    });
  }
  addEventListener("resize", () => { sigdir(); if ($("#harita").classList.contains("aktif")) hud(); });

  function gorunum(g) {
    kart.classList.remove("g-metin", "g-soru", "g-cozum");
    kart.classList.add("g-" + g);
    kart.querySelectorAll("[data-g]").forEach(b => b.classList.toggle("aktif", b.dataset.g === g || (!dar() && g === "soru" && b.dataset.g === "metin")));
    sigdir();
  }

  function soru() {
    const d = DURAKLAR[T.durak], q = d.sorular[T.sira];
    const sira = kar(q.siklar.map((s, k) => ({ s, dogru: k === q.d })));
    const metinVar = !!(q.metin || q.grafik || q.tablo);
    aktifSoru = { q, sira, cevaplandi: false, bas: performance.now(), metinVar };
    const ilerleme = d.sorular.map((_, k) => `<i class="${k < T.sonuc.length ? (T.sonuc[k] ? "d" : "y") : k === T.sira ? "s" : ""}"></i>`).join("");
    const fener = [0, 1, 2].map(k => `<span class="${k < T.fener ? "" : "sondu"}">🏮</span>`).join("");
    const solIc = metinVar ? `${gorselHtml(q)}${q.metin ? `<div class="metin"${q.grafik || q.tablo ? ' style="margin-top:.6em"' : ""}>${kacis(q.metin)}</div>` : ""}` : `<div class="kok-buyuk">${kacis(q.soru)}</div>`;
    ac_(`
      <div class="s-bas">
        <div class="kart-ust">${T.durak + 1}. DURAK · ${kacis(d.ad.toLocaleUpperCase("tr"))} · SORU ${T.sira + 1}/${d.sorular.length}</div>
        <div class="ilerleme">${ilerleme}</div>
        <div class="fenerler" aria-label="${T.fener} fener kaldı">${fener}</div>
        ${T.seri >= 2 ? `<span class="seri">🔥 ${T.seri} seri</span>` : ""}
      </div>
      <div class="sure-sat"><div class="sure" aria-hidden="true"><i id="sureCubuk"></i></div><div class="sure-etk" id="sureEtk">⏱️ +5 BONUS</div></div>
      <div class="sekmeler">
        ${metinVar ? `<button class="sekme" data-g="metin">📜 Metin</button>` : ""}
        <button class="sekme s-soru" data-g="soru">❓ Soru</button>
        <button class="sekme" data-g="cozum" hidden>🔑 Çözüm</button>
      </div>
      <div class="s-govde">
        <div class="panel p-sol">
          <div class="panel-bas"><span class="etk">${metinVar ? "METNİ OKU" : "SORU"}</span>
            <button class="sekme" data-g="metin" hidden>${metinVar ? "📜 Metin" : "❓ Soru"}</button><button class="sekme" data-g="cozum" hidden>🔑 Çözüm</button></div>
          <div class="sigdir v-metin"><div>${solIc}</div></div>
          <div class="sigdir v-cozum"><div id="cozumIc"></div></div>
        </div>
        <div class="panel p-sag">
          <div class="panel-bas"><span class="etk">CEVABINI SEÇ</span></div>
          <div class="sigdir"><div>
            <div class="soru-koku kok-sag ${metinVar ? "" : "gizle"}">${kacis(q.soru)}</div>
            <div class="siklar">${sira.map((o, k) => `<button class="sik" data-k="${k}"><b>${HARF[k]}</b><span>${kacis(o.s)}</span></button>`).join("")}</div>
            <div id="isaretYer"></div>
          </div></div>
        </div>
      </div>
      <div class="s-alt">
        <button class="joker" id="jokerBtn" ${T.joker ? "" : "disabled"}>✨ Gizli İşaret <small>(${T.joker})</small></button>
        <button class="btn btn-ana" id="gecBtn" hidden>Soruya geç →</button>
        <button class="btn btn-altin" id="ileriBtn" hidden></button>
      </div>`, "soru-kart");
    kart.querySelectorAll(".sik").forEach(b => b.onclick = () => cevapla(+b.dataset.k));
    kart.querySelectorAll("[data-g]").forEach(b => b.onclick = () => gorunum(b.dataset.g));
    $("#jokerBtn").onclick = joker;
    const gec = $("#gecBtn");
    gec.onclick = () => { gorunum("soru"); gec.hidden = true; };
    gec.hidden = !(metinVar && dar());
    gorunum(metinVar ? "metin" : "soru");
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sigdir);
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
    $("#isaretYer").innerHTML = `<div class="isaret-kutu"><b>✨ Gizli işaret:</b> ${kacis(q.isaret)}</div>`;
    $("#jokerBtn").disabled = true;
    if (dar() && aktifSoru.metinVar) { gorunum("soru"); $("#gecBtn").hidden = true; } else sigdir();
  }

  function ucan(yazi, hedef) {
    const r = hedef.getBoundingClientRect(), u = el("div", "ucan", yazi);
    u.style.left = Math.max(10, r.left + r.width - 130) + "px"; u.style.top = r.top - 10 + "px";
    document.body.appendChild(u); setTimeout(() => u.remove(), 1200);
  }

  function cevapla(k) {
    if (aktifSoru.cevaplandi) return;
    aktifSoru.cevaplandi = true;
    clearInterval(zamanlayici);
    const q = aktifSoru.q, dogru = aktifSoru.sira[k].dogru;
    const gecen = (performance.now() - aktifSoru.bas) / 1000;
    const butonlar = [...kart.querySelectorAll(".sik")];
    butonlar.forEach(b => { b.disabled = true; if (aktifSoru.sira[+b.dataset.k].dogru) b.classList.add("dogru"); });
    let kazanc = 0; const notlar = [];
    if (dogru) {
      T.seri++;
      kazanc = PUAN;
      if (gecen <= SURE) { kazanc += BONUS; T.hizli++; notlar.push("hızlı"); }
      if (T.seri >= 3) { kazanc += SERI_BONUS; notlar.push(`${T.seri} seri`); }
      T.murekkep += kazanc;
      (T.seri >= 3 ? SES.seri : SES.dogru)();
      ucan(`+${kazanc} 💧`, butonlar[k]);
    } else { T.seri = 0; butonlar[k].classList.add("yanlis"); T.fener--; SES.yanlis(); }
    T.sonuc.push(dogru);
    $("#jokerBtn").disabled = true;
    const son = T.sira === DURAKLAR[T.durak].sorular.length - 1 || T.fener === 0;
    const baslik = dogru ? `Doğru! +${kazanc} 💧${notlar.length ? ` <small style="font-size:.6em">(${notlar.join(", ")})</small>` : ""}` : (T.fener === 0 ? "Fenerlerin söndü" : "Bu kez olmadı, bir fener söndü");
    $("#cozumIc").innerHTML = `
      <div class="cozum ${dogru ? "iyi" : "kotu"}">
        <div class="baslik">${baslik}</div>
        <h4>🔑 BU SORUNUN KİLİDİ</h4><div>${kacis(q.kilit)}</div>
        <h4>🧭 BU SORUDA İZLEMEN GEREKEN ROTA</h4><ul>${q.rota.map(r => `<li>${kacis(r)}</li>`).join("")}</ul>
      </div>`;
    kart.querySelectorAll("[data-g]").forEach(b => b.hidden = false);
    const ileri = $("#ileriBtn");
    ileri.hidden = false; $("#gecBtn").hidden = true;
    ileri.textContent = son ? "Sonucu gör" : "Sonraki soru →";
    ileri.onclick = () => { if (son) bitir(); else { T.sira++; soru(); } };
    setTimeout(() => { if (aktifSoru && aktifSoru.q === q) gorunum("cozum"); }, dar() ? 900 : 350);
    ileri.focus({ preventScroll: true });
  }

  /* ---------- durak sonu ---------- */
  function bitir() {
    aktifSoru = null;
    const i = T.durak, d = DURAKLAR[i];
    const dogruSay = T.sonuc.filter(Boolean).length;
    const gecti = dogruSay >= GECME;
    const yildiz = !gecti ? 0 : dogruSay === 4 ? (T.hizli === 4 ? 3 : 2) : 1;
    const ilkKez = gecti && i === D.acik;
    const onceki = D.en[i], oncekiToplam = toplamMurekkep();
    if (gecti && (!onceki || T.murekkep > onceki.murekkep || yildiz > onceki.yildiz)) {
      D.en[i] = { murekkep: Math.max(T.murekkep, onceki ? onceki.murekkep : 0), yildiz: Math.max(yildiz, onceki ? onceki.yildiz : 0) };
    }
    const eskiSeviye = seviye();
    if (ilkKez) D.acik = i + 1;
    kaydet();
    const yeniSeviye = seviye(), artti = toplamMurekkep() > oncekiToplam;

    if (gecti) { SES.kazan(); konfeti(90); } else SES.yanlis();
    const yil = `<div class="yildizlar">${[0, 1, 2].map(k => `<span class="${k < yildiz ? "" : "bos"}">⭐</span>`).join("")}</div>`;
    ac_(`
      <button class="kapat" aria-label="Kapat">✕</button>
      <div class="sonuc">
        <div class="sonuc-gorsel"><img class="kgorsel" src="${SEVIYELER[eskiSeviye].gorsel}" alt="Aras"></div>
        <div>
          <div class="kart-ust">${i + 1}. DURAK · ${kacis(d.ad.toLocaleUpperCase("tr"))}</div>
          <h2>${gecti ? (i === DURAKLAR.length - 1 ? "Hazine açıldı!" : "Durak geçildi!") : "Bu durak biraz daha iz istiyor"}</h2>
          ${gecti ? yil : ""}
          <div class="istat"><span>✅ ${dogruSay}/4 doğru</span><span>💧 +${T.murekkep}</span><span>⏱️ ${T.hizli} hızlı cevap</span></div>
          ${gecti ? `<div class="kazanim"><span class="ikon">${d.ekipman.ikon}</span><div><small>${ilkKez ? "YENİ EKİPMAN" : "EKİPMANIN"}</small><b>${kacis(d.ekipman.ad)}</b></div></div>`
                  : `<p style="margin:10px 0 18px">Geçmek için en az ${GECME} doğru gerekiyor. Gizli Sandık'a bir kez daha göz at, sonra tekrar dene.</p>`}
          <div class="btn-dizi">
            ${gecti ? `<button class="btn btn-altin nabiz" id="devamBtn">${i === DURAKLAR.length - 1 ? "Hazineye bak" : ilkKez && yeniSeviye > eskiSeviye ? "Seviye atla ✨" : "Haritaya dön"}</button>`
                    : `<button class="btn btn-altin" id="tekrarBtn">Tekrar dene</button><button class="btn btn-ince" id="haritaBtn">Haritaya dön</button>`}
          </div>
        </div>
      </div>`);
    kart.querySelector(".kapat").onclick = () => kapat(artti);
    if (gecti) $("#devamBtn").onclick = () => {
      if (ilkKez && i === DURAKLAR.length - 1) final();
      else if (ilkKez && yeniSeviye > eskiSeviye) seviyeAtla(eskiSeviye, yeniSeviye, artti);
      else kapat(artti);
    };
    else { $("#tekrarBtn").onclick = () => sandik(i); $("#haritaBtn").onclick = () => kapat(); }
  }

  function seviyeAtla(eski, yeni, artti) {
    SES.seviye(); konfeti(180);
    ac_(`
      <div class="seviye-atla">
        <div class="kart-ust" style="justify-content:center">SEVİYE ${yeni + 1} AÇILDI</div>
        <h2>Aras artık bir ${kacis(SEVIYELER[yeni].ad)}!</h2>
        <div class="ciftler">
          <img class="kgorsel eski" src="${SEVIYELER[eski].gorsel}" alt="${kacis(SEVIYELER[eski].ad)}">
          <span class="ok">➜</span>
          <img class="kgorsel yeni" src="${SEVIYELER[yeni].gorsel}" alt="${kacis(SEVIYELER[yeni].ad)}">
        </div>
        <p>${kacis(SEVIYELER[yeni].aciklama)}</p>
        <button class="btn btn-altin nabiz" id="tamamBtn">Yola devam</button>
      </div>`);
    $("#tamamBtn").onclick = () => kapat(artti);
  }

  function final() {
    SES.seviye(); konfeti(260);
    const yildiz = Object.values(D.en).reduce((t, r) => t + r.yildiz, 0);
    ac_(`
      <button class="kapat" aria-label="Kapat">✕</button>
      <div class="sonuc">
        <div class="sonuc-gorsel"><img class="kgorsel" src="${SEVIYELER[4].gorsel}" alt="Hazine Ustası Aras"></div>
        <div>
          <div class="kart-ust">STRATEJİ MEYDANI · HAZİNE</div>
          <h2>Aras bir Hazine Ustası!</h2>
          <p style="font-size:17px;margin:8px 0 14px">Dokuz durağın hepsini geçtin. Paragrafın konusundan sözel mantığa kadar bütün rotayı yürüdün; anahtar artık sende.</p>
          <div class="istat"><span>💧 ${toplamMurekkep()} mürekkep</span><span>⭐ ${yildiz}/27 yıldız</span><span>🎒 9/9 ekipman</span></div>
          <p style="font-size:15px;margin-bottom:16px">Eksik yıldızların varsa duraklara dönüp tekrar oynayabilirsin. 3 yıldız için 4 soruyu da 30 saniyenin içinde doğru cevapla.</p>
          <div class="btn-dizi"><button class="btn btn-altin" id="tamamBtn">Haritaya dön</button></div>
        </div>
      </div>`);
    kart.querySelector(".kapat").onclick = () => kapat(true);
    $("#tamamBtn").onclick = () => kapat(true);
  }

  /* ---------- başlat ---------- */
  $("#baslaBtn").onclick = () => { SES.tik(); harita(); };
  $("#sifirlaBtn").onclick = () => {
    if (!$("#sifirlaBtn").dataset.emin) { $("#sifirlaBtn").dataset.emin = 1; $("#sifirlaBtn").textContent = "Emin misin? Tüm ilerleme silinir"; return; }
    const ses = D.ses; D = bos(); D.ses = ses; kaydet(); delete $("#sifirlaBtn").dataset.emin; $("#sifirlaBtn").textContent = "Baştan başla"; giris();
  };
  $("#sesBtn").onclick = () => { D.ses = !D.ses; kaydet(); $("#sesBtn").textContent = D.ses ? "🔊" : "🔇"; };
  $("#hudAvatar").onclick = () => {
    const lv = seviye();
    ac_(`<button class="kapat" aria-label="Kapat">✕</button>
      <div class="sonuc"><div class="sonuc-gorsel"><img class="kgorsel" src="${SEVIYELER[lv].gorsel}" alt="Aras"></div>
      <div><div class="kart-ust">SEVİYE ${lv + 1}</div><h2>${kacis(SEVIYELER[lv].ad)}</h2>
      <p style="font-size:17px;margin:8px 0 16px">${kacis(SEVIYELER[lv].aciklama)}</p>
      <div class="istat"><span>💧 ${toplamMurekkep()}</span><span>🎒 ${D.acik}/9 ekipman</span></div>
      <button class="btn btn-altin" id="tamamBtn">Haritaya dön</button></div></div>`);
    kart.querySelector(".kapat").onclick = () => kapat(); $("#tamamBtn").onclick = () => kapat();
  };
  giris();
})();
