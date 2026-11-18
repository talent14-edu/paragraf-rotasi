// Paragraf Rotası - durak ve soru verisi.
// Sorular "Paragrafın Hazinesi" kitabındaki soru tiplerine, tuzaklara ve
// taktiklere göre bu oyun için özgün olarak yazıldı; kitaptan aynen alınmadı.
// d: doğru şıkkın dizideki yeri (0 tabanlı). Şıklar oyunda karıştırılır.

const SEVIYELER = [
  { ad: "Çırak", gorsel: "img/aras1.webp", aciklama: "Elinde bir harita ve küçük bir fener. Yolculuk başlıyor." },
  { ad: "İz Sürücü", gorsel: "img/aras2.webp", aciklama: "Pusula belinde, büyüteç elinde. Artık izleri okuyabiliyor." },
  { ad: "Kâşif", gorsel: "img/aras3.webp", aciklama: "Şapkası, yapboz çantası ve onay kalkanıyla yolda." },
  { ad: "Kaptan", gorsel: "img/aras4.webp", aciklama: "Dümen armalı ceket, pelerin ve tüy kalem. Rotayı o çiziyor." },
  { ad: "Hazine Ustası", gorsel: "img/aras5.webp", aciklama: "Altın işlemeli kıyafet ve hazinenin anahtarı." }
];

// Hangi durakta hangi seviye: 1 / 2-3 / 4-5 / 6-8 / 9
const DURAK_SEVIYE = [0, 1, 1, 2, 2, 3, 3, 3, 4];

const DURAKLAR = [
  {
    ad: "Haritanın Merkezi", konu: "Konu · Başlık · Anahtar Sözcük",
    x: 13.35, y: 83.8, ekipman: { ad: "Harita ve Fener", ikon: "🗺️" },
    hap: [
      "Konu, metnin çerçevesidir: \"Ne anlatılıyor?\" sorusunun cevabı.",
      "Başlık metnin tamamını kapsar; ne çok dar ne de metnin dışında olur.",
      "Anahtar sözcük, metnin merkezindeki kavramdır. Her geçen kelime anahtar değildir."
    ],
    tuzak: [
      "Ayrıntı içeren ama kulağa mantıklı gelen başlıklar.",
      "Örnek olarak geçen kelimeyi anahtar sözcük sanmak.",
      "Ana düşünceyi (mesajı) konu sanmak."
    ],
    taktik: [
      "Metni tek cümleyle zihninde özetle.",
      "Şıklarda en geniş çerçeveyi ara, daraltan ifadeleri ele."
    ],
    sorular: [
      {
        metin: "Bal arıları yiyecek bulduklarında kovana döner ve özel bir dans yapar. Dansın yönü çiçeklerin güneşe göre konumunu, süresi ise uzaklığını gösterir. Kovandaki diğer arılar bu dansı izleyerek yiyeceğin yerini bulur. Bilim insanları bu davranışı, hayvanlar dünyasındaki en gelişmiş iletişim yollarından biri olarak görür.",
        soru: "Bu metnin konusu aşağıdakilerden hangisidir?",
        siklar: ["Bal arılarının dansla iletişim kurması", "Bal arılarının çiçeklerden bal yapması", "Kovandaki arıların iş bölümü", "Bilim insanlarının arıları gözlemlemesi"],
        d: 0,
        kilit: "Konu, \"Ne anlatılıyor?\" sorusunun cevabıdır ve metnin tamamını kapsar.",
        isaret: "Metnin her cümlesi aynı davranışın etrafında dönüyor: dans ve dansın taşıdığı bilgi.",
        rota: ["Metni tek cümleyle özetle.", "Her cümlede tekrar eden kavramı bul: dans.", "Metinde hiç geçmeyen (bal yapma, iş bölümü) şıkları ele."]
      },
      {
        metin: "Eskiden kütüphaneler yalnızca kitap ödünç alınan sessiz yerlerdi. Bugün pek çok kütüphanede robotik kodlama atölyeleri, söyleşiler ve film gösterimleri düzenleniyor. Bazı kütüphaneler öğrencilerin birlikte çalışabileceği proje odaları bile açtı. Kısacası kütüphaneler, kitabın yanında öğrenmenin her türlüsüne kapısını açan canlı merkezlere dönüşüyor.",
        soru: "Bu metne en uygun başlık aşağıdakilerden hangisidir?",
        siklar: ["Kütüphanelerin Değişen Yüzü", "Kütüphanelerde Robotik Kodlama", "Sessiz Okuma Salonları", "Kitap Ödünç Almanın Kuralları"],
        d: 0,
        kilit: "Başlık metnin tamamını kapsamalı; tek bir ayrıntıyı ya da metinde olmayan bir bilgiyi değil.",
        isaret: "\"Eskiden... Bugün...\" karşıtlığı, metnin bir değişimi anlattığını gösteriyor.",
        rota: ["Metnin ilk ve son cümlesini karşılaştır.", "Robotik kodlama yalnızca bir örnek: çok dar.", "Metinde geçmeyen kuralları ele."]
      },
      {
        metin: "Bir müzik aletini çalmayı öğrenmek zaman ister. İlk haftalarda parmaklar yorulur, çıkan sesler kulağa hoş gelmez. Pek çok kişi bu aşamada vazgeçer. Oysa her gün kısa da olsa çalışmaya devam edenler, birkaç ay sonra en sevdikleri şarkıyı çalabildiklerini fark eder. Müzikte olduğu gibi her yeni beceride başarının anahtarı sabırdır.",
        soru: "Bu metnin anahtar sözcüğü aşağıdakilerden hangisidir?",
        siklar: ["sabır", "müzik", "şarkı", "parmak"],
        d: 0,
        kilit: "Anahtar sözcük metnin merkezindeki kavramdır; örnek olarak geçen kelimeler anahtar değildir.",
        isaret: "Son cümle \"Müzikte olduğu gibi\" diyor: müzik yalnızca bir örnek.",
        rota: ["Metnin vardığı yargıyı bul.", "Örnek olarak verilen alanı (müzik) ele.", "Yargının merkezindeki kavramı seç."]
      },
      {
        metin: "Yatmadan hemen önce telefon ya da tablet ekranına bakmak, uykuya dalmayı zorlaştırır. Ekranlardan yayılan mavi ışık, beynimize hâlâ gündüz olduğu mesajını verir. Bu yüzden vücut, uykuyu getiren hormonu daha geç salgılar. Uzmanlar, uyumadan en az bir saat önce ekranları kapatmayı öneriyor.",
        soru: "Bu metinde ele alınan konu aşağıdakilerden hangisidir?",
        siklar: ["Ekran ışığının uykuya etkisi", "Uyumadan bir saat önce ekranlar kapatılmalıdır.", "Gündüz ve gece arasındaki farklar", "Telefonların gençler arasında yaygınlaşması"],
        d: 0,
        kilit: "Konu alanı gösterir, ana düşünce mesajı verir. Yargı bildiren bir cümle konu olamaz.",
        isaret: "\"...kapatılmalıdır\" bir öneri, yani mesaj. Konu ise bir başlık gibi kısa bir alandır.",
        rota: ["\"Ne anlatılıyor?\" diye sor.", "Yargı ya da öneri bildiren şıkkı konu olarak seçme.", "Metinde geçmeyen yaygınlaşma bilgisini ele."]
      }
    ]
  },
  {
    ad: "Yön Bulma Noktası", konu: "Ana Düşünce · Ana Duygu",
    x: 43.9, y: 84.6, ekipman: { ad: "Pusula", ikon: "🧭" },
    hap: [
      "Ana düşünce, metnin vermek istediği temel mesajdır; olay değil, olaydan çıkan sonuç.",
      "En kapsamlı yargı metnin tamamını içine alan ifadedir. Parçayı değil bütünü düşün.",
      "Ana duygu şiirin ruh hâlidir. Konuyu değil, hissettirdiğini bul."
    ],
    tuzak: [
      "Metindeki bir örneği ana düşünce sanmak.",
      "\"Sadece, yalnızca, her zaman\" gibi daraltan ya da genişleten sözleri fark etmemek.",
      "İlk cümleyi ana düşünce sanmak."
    ],
    taktik: [
      "Metni tek cümleyle özetle.",
      "En genel ve kapsayıcı ifadeyi ara; ayrıntı içeren şıkları ele."
    ],
    sorular: [
      {
        metin: "Mert, okulun satranç turnuvasına hazırlanmak için her akşam birkaç maç oynadı. Kaybettiği her oyundan sonra hamlelerini deftere yazdı ve nerede hata yaptığını buldu. Turnuva günü kendisinden çok daha deneyimli bir rakiple karşılaştı. Rakibi hızlı oynuyordu ama Mert, defterine not aldığı bir hatayı onun da yaptığını fark etti ve maçı kazandı.",
        soru: "Bu metinde verilmek istenen ana düşünce aşağıdakilerden hangisidir?",
        siklar: ["Hatalarından ders çıkaran kişi başarıya ulaşır.", "Satranç, dikkat gerektiren bir oyundur.", "Hızlı oynayan oyuncular sonunda kaybeder.", "Deneyimli rakipler her zaman daha güçlüdür."],
        d: 0,
        kilit: "Ana düşünce metnin verdiği derstir. Olayı değil, olaydan çıkan sonucu ara.",
        isaret: "Mert'i kazandıran şey hızı ya da deneyimi değil, hatalarını not alıp incelemesi.",
        rota: ["\"Bu hikâye bana ne öğretiyor?\" diye sor.", "\"Her zaman\" gibi genelleme yapan şıkları ele.", "Metnin mesajı olmayan genel bilgileri (satranç dikkat ister) ele."]
      },
      {
        metin: "Ormanlar yalnızca ağaçlardan oluşan alanlar değildir. Binlerce hayvan türüne yuva olur, toprağın kaymasını engeller, havadaki karbondioksidi tutar ve yağmur suyunun toprağa sızmasını sağlar. Bir ormanın kaybolması, bu görevlerin hepsinin aynı anda ortadan kalkması demektir.",
        soru: "Bu metinde asıl anlatılmak istenen aşağıdakilerden hangisidir?",
        siklar: ["Ormanlar doğada pek çok önemli görev üstlenir.", "Ormanlar yalnızca hayvanlara yuva olduğu için önemlidir.", "Toprak kayması yalnızca ormansız bölgelerde görülür.", "Yağmur suyu her zaman ormanlar sayesinde toprağa ulaşır."],
        d: 0,
        kilit: "\"Asıl anlatılmak istenen\" sorularında metnin bütününü kapsayan yargı aranır.",
        isaret: "Metin dört ayrı görev sayıyor; doğru cevap bunların hepsini kapsamalı.",
        rota: ["\"Yalnızca\" diyen şıkkın metni daralttığını fark et.", "\"Her zaman\" diyen şıkkın metni aştığını fark et.", "Bütün görevleri kapsayan şıkkı seç."]
      },
      {
        metin: "Penceremde bir serçe, yine seni sordu bugün,\nBahçedeki erik ağacı açmadı sen gidince.\nNe zaman bir tren geçse kalbim istasyona koşar,\nDönüş yolunu gözlerim, akşam olup gün dönünce.",
        soru: "Bu dizelerde baskın olan duygu aşağıdakilerden hangisidir?",
        siklar: ["Özlem", "Pişmanlık", "Hayranlık", "Öfke"],
        d: 0,
        kilit: "Ana duygu şiirin ruh hâlidir. Anlatılan olaya değil, sezdirilen duyguya bak.",
        isaret: "\"Sen gidince\", \"istasyona koşar\", \"dönüş yolunu gözlerim\": giden birinin yolu bekleniyor.",
        rota: ["Şairin kimi ya da neyi beklediğini bul.", "Duygu bildiren sözleri işaretle.", "Metinde ipucu olmayan duyguları ele."]
      },
      {
        metin: "Bazı insanlar kitap okumayı yalnızca ders çalışmanın bir parçası olarak görür. Oysa bir romanın sayfalarında başka ülkeleri gezer, hiç tanımadığımız insanların duygularını anlarız. Bir bilim kitabı evrenin sırlarını, bir şiir kitabı ise kelimelerin gücünü gösterir. Okumak, dünyaya açılan en geniş penceredir.",
        soru: "Bu metnin ana düşüncesi aşağıdakilerden hangisidir?",
        siklar: ["Okumak, insanın dünyasını genişletir.", "Kitap okumak ders çalışmanın bir parçasıdır.", "Romanlar bilim kitaplarından daha öğreticidir.", "Şiir kitapları kelimelerin gücünü gösterir."],
        d: 0,
        kilit: "Ana düşünce çoğu zaman metnin sonunda netleşir. İlk cümle her zaman ana düşünce değildir.",
        isaret: "İlk cümledeki görüş \"Oysa\" ile çürütülüyor. Yazarın asıl yargısı son cümlede.",
        rota: ["\"Oysa, ama, fakat\" gibi karşıtlık sözlerini yakala.", "Tek bir örneği anlatan şıkkı ele.", "Metinde olmayan karşılaştırmayı ele."]
      }
    ]
  },
  {
    ad: "İz Takibi", konu: "Yardımcı Düşünce · Değinilmeyen Bilgi",
    x: 74.0, y: 83.8, ekipman: { ad: "Büyüteç", ikon: "🔍" },
    hap: [
      "\"Ulaşılamaz / Değinilmemiştir\" sorularında metinde açıkça olmayan bilgi doğru cevaptır.",
      "\"Her zaman, tümü, tamamen, daima\" gibi sözler çoğu zaman metnin sınırını aşar.",
      "Zıtlığa dikkat: Metindeki durumun tam tersi şıklarda verilmiş olabilir."
    ],
    tuzak: [
      "\"Metinde ima var, o hâlde çıkarılır\" yanılgısı.",
      "Hafızaya güvenip metne geri dönmemek."
    ],
    taktik: [
      "Soru kökünü sonuna kadar oku: \"değinilmemiştir\" mi, \"söylenebilir\" mi?",
      "Şıkları tek tek metinle eşleştir; karşılığı olmayanı işaretle."
    ],
    sorular: [
      {
        metin: "Kapadokya'daki peri bacaları, milyonlarca yıl önce yanardağlardan çıkan küllerin katmanlar hâlinde birikmesiyle oluştu. Yağmur, rüzgâr ve sıcaklık farkları yumuşak kayaları zamanla aşındırdı; üstteki sert kaya parçaları ise şapka gibi korunarak bugünkü şekilleri ortaya çıkardı. Bölgede insanlar, bu yumuşak kayaları oyarak evler ve güvercinlikler yapmıştır.",
        soru: "Bu metinde aşağıdakilerden hangisine değinilmemiştir?",
        siklar: ["Peri bacalarını her yıl kaç turistin ziyaret ettiğine", "Peri bacalarının nasıl oluştuğuna", "Aşınmaya yol açan doğal etkenlere", "İnsanların kayaları nasıl kullandığına"],
        d: 0,
        kilit: "\"Değinilmemiştir\" sorularında metinde hiç geçmeyen bilgi aranır.",
        isaret: "Metinde tek bir sayı bile yok; turistlerden de hiç söz edilmiyor.",
        rota: ["Her şıkkın metindeki karşılığını bul.", "Oluşum: ilk cümle. Etkenler: ikinci cümle. Kullanım: son cümle.", "Karşılığı olmayan şıkkı seç."]
      },
      {
        metin: "Ahmet Usta otuz yıldır aynı sokakta ayakkabı tamir ediyor. Dükkânına gelenlerin çoğu, yeni ayakkabı almak yerine eskisini onarmayı seçen mahalle sakinleri. Usta, son yıllarda gençlerin de dükkâna uğramaya başladığını, bazılarının ise zanaatı öğrenmek için yanında çırak olarak çalışmak istediğini söylüyor.",
        soru: "Bu metinden aşağıdakilerden hangisine ulaşılamaz?",
        siklar: ["Gençlerin tamamı eski eşyalarını onarmayı tercih etmektedir.", "Ahmet Usta mesleğini uzun süredir yapmaktadır.", "Dükkânın müşterileri arasında mahalle sakinleri vardır.", "Zanaata ilgi duyan gençler bulunmaktadır."],
        d: 0,
        kilit: "\"Tamamı, hepsi, her zaman\" gibi sözler metnin söylediğini genişletir; bu genişleme metinden çıkarılamaz.",
        isaret: "Metin \"bazıları\" diyor; şıklardan biri bunu \"tamamı\" yapmış.",
        rota: ["Metindeki miktar sözlerini işaretle: çoğu, bazıları.", "Şıklardaki miktar sözleriyle karşılaştır.", "Kapsamı genişleten şıkkı seç."]
      },
      {
        metin: "Kutup ayıları, kalın bir yağ tabakası ve iki katlı kürkleri sayesinde çok düşük sıcaklıklara dayanabilir. Siyah renkli derileri güneşin sıcaklığını emer; beyaz görünen tüyleri ise aslında renksizdir ve ışığı yansıtır. Ancak deniz buzullarının her yıl daha erken erimesi, fok avlamak için buza ihtiyaç duyan bu hayvanları zor durumda bırakıyor.",
        soru: "Bu metne göre aşağıdakilerden hangisi doğrudur?",
        siklar: ["Kutup ayılarının tüyleri aslında renksizdir.", "Kutup ayılarının derisi beyazdır.", "Kutup ayıları yalnızca balıkla beslenir.", "Deniz buzulları her yıl daha geç erimektedir."],
        d: 0,
        kilit: "Zıtlık tuzağı: Metindeki bilginin tersi şıklarda verilebilir. Her şıkkı metinle tek tek karşılaştır.",
        isaret: "Deri siyah, tüyler renksiz. Buzullar daha erken eriyor.",
        rota: ["Renk bilgisini metinde bul ve karşılaştır.", "\"Yalnızca balık\": metinde fok geçiyor, balık geçmiyor.", "\"Erken\" ile \"geç\" arasındaki zıtlığı yakala."]
      },
      {
        metin: "Düzenli spor yapmak kalbi güçlendirir ve kan dolaşımını hızlandırır. Spor sırasında salgılanan bazı maddeler, kişinin kendini mutlu hissetmesini sağlar. Takım sporları ise arkadaşlık bağlarını kuvvetlendirir, birlikte hareket etmeyi öğretir.",
        soru: "Bu metinde düzenli sporun aşağıdaki faydalarından hangisine yer verilmemiştir?",
        siklar: ["Uyku düzenini iyileştirmesine", "Kalbi güçlendirmesine", "Mutluluk duygusunu artırmasına", "Birlikte hareket etmeyi öğretmesine"],
        d: 0,
        kilit: "Yardımcı düşünceler ana düşünceyi destekleyen ayrıntılardır; metinde açıkça yer almayan fayda cevap olur.",
        isaret: "Sporun uykuyla bir ilgisi doğru olabilir ama bu metinde geçmiyor.",
        rota: ["Metindeki faydaları say: kalp, mutluluk, birlikte hareket.", "Bildiğin ama metinde olmayan bilgiyi ekleme.", "Listede olmayan faydayı seç."]
      }
    ]
  },
  {
    ad: "Kayıp Parçalar", konu: "Paragrafın Yapısı · Tamamlama · Sıralama",
    x: 79.9, y: 50.3, ekipman: { ad: "Yapboz Çantası", ikon: "🧩" },
    hap: [
      "Giriş bölümü konuya hazırlar; ayrıntıya ve sonuca girmez.",
      "Sonuç bölümü anlatılanları toparlar, çoğu zaman genel bir yargı içerir.",
      "Süreç anlatan metinlerde adımlar zaman sırasıyla ilerler."
    ],
    tuzak: [
      "\"Ayrıca, çünkü, bu nedenle\" gibi bağlaçları görüp acele karar vermek. Önce anlam ilişkisini kur.",
      "Kulağa hoş gelen ama akışı ileri taşımayan cümleyi seçmek."
    ],
    taktik: [
      "Soru türünü belirle: bölüm mü, sıralama mı, boşluk mu, akışı bozan cümle mi?",
      "Metnin ana izini bul: zaman sırası mı, neden-sonuç mu, genel yargı mı?"
    ],
    sorular: [
      {
        metin: "",
        soru: "Aşağıdakilerden hangisi bir metnin sonuç bölümünde yer alabilir?",
        siklar: ["Bu proje sayesinde öğrenciler, küçük alışkanlıkların bile doğaya büyük katkı sağlayabileceğini öğrendi.", "Okulumuzda geçen ay \"Atık Değil Kaynak\" adlı bir geri dönüşüm projesi başlatıldı.", "Her sınıfa kâğıt, plastik ve cam için üç ayrı kutu yerleştirildi.", "Öğrenciler toplanan atıkları her cuma tartıp sonuçları panoya astı."],
        d: 0,
        kilit: "Sonuç bölümü anlatılanları toparlar ve genellikle genel bir yargı ya da mesaj verir.",
        isaret: "Bir şık olayı anlatmıyor; projenin öğrencilere kattığını özetliyor.",
        rota: ["Şıklarda ayrıntı mı (kutular, tartım) yoksa değerlendirme mi var, bak.", "\"Başlatıldı\" bir başlangıç: giriş.", "Genelleyen yargıyı seç."]
      },
      {
        metin: "(I) Ardından fidanı çukura yerleştirip köklerini toprakla örtün.\n(II) Önce fidanın kökleri sığacak genişlikte bir çukur kazın.\n(III) Son olarak toprağı hafifçe bastırıp bol su verin.\n(IV) Çukurun dibine biraz gübreli toprak serpin.",
        soru: "Numaralanmış cümlelerle anlamlı bir paragraf oluşturulmak istenirse sıralama nasıl olmalıdır?",
        siklar: ["II - IV - I - III", "IV - II - I - III", "II - I - IV - III", "I - II - IV - III"],
        d: 0,
        kilit: "Süreç anlatan metinlerde adımlar zaman sırasıyla ilerler. Bağlaçlar yardımcı olur ama tek başına yetmez.",
        isaret: "IV. cümlede bağlaç yok; ama gübre, fidan çukura girmeden önce serpilmeli.",
        rota: ["\"Önce\" ile başlayan cümleyi başa al.", "Bağlaçsız cümlenin yerini anlamla bul.", "\"Son olarak\" ile biten cümleyi sona koy."]
      },
      {
        metin: "(I) Zürafalar dünyanın en uzun boylu kara hayvanlarıdır. (II) Uzun boyunları sayesinde diğer hayvanların ulaşamadığı yüksek dallardaki yaprakları yiyebilirler. (III) Afrika'da yaşayan filler ise her gün çok miktarda su içer. (IV) Zürafaların kalbi, kanı bu uzun boyundan başa pompalayabilmek için oldukça güçlüdür. (V) Bir zürafa, gününün büyük bölümünü beslenerek geçirir.",
        soru: "Bu metinde numaralanmış cümlelerden hangisi düşüncenin akışını bozmaktadır?",
        siklar: ["III", "II", "IV", "V"],
        d: 0,
        kilit: "Akışı bozan cümle, metnin konusundan ayrılan cümledir.",
        isaret: "Metnin tamamı zürafaları anlatıyor; bir cümle başka bir hayvana geçiyor.",
        rota: ["Metnin konusunu belirle: zürafalar.", "Her cümlenin bu konuya bağlı olup olmadığına bak.", "Konunun dışına çıkan cümleyi seç."]
      },
      {
        metin: "Ebru, kitreyle koyulaştırılmış suyun yüzeyine boyaların serpilmesiyle yapılan geleneksel bir sanattır. Sanatçı, fırçayla serptiği boyaları ince bir çubukla yönlendirerek desenler oluşturur. ---- Bu yüzden her ebru eseri, bir benzeri daha yapılamayan özgün bir çalışmadır.",
        soru: "Bu metinde boş bırakılan yere aşağıdakilerden hangisi getirilmelidir?",
        siklar: ["Su yüzeyindeki boyalar her seferinde farklı biçimde dağıldığından aynı deseni ikinci kez elde etmek mümkün değildir.", "Ebru yapmak için en çok kırmızı ve mavi boyalar tercih edilir.", "Günümüzde ebru kursları pek çok şehirde açılmaktadır.", "Kitre, bazı bitkilerden elde edilen doğal bir maddedir."],
        d: 0,
        kilit: "Boşluktan sonraki cümle bir sonuç bildiriyorsa boşluğa o sonucun nedeni gelir.",
        isaret: "\"Bu yüzden her eser özgündür\": peki neden? Boşluk bu sorunun cevabı.",
        rota: ["Boşluktan önceki ve sonraki cümleyi oku.", "\"Bu yüzden\" sözünün neyi bağladığını bul.", "Akışı ileri taşıyan, sadece ayrıntı vermeyen şıkkı seç."]
      }
    ]
  },
  {
    ad: "İz Doğrulama", konu: "Paragraf Karşılaştırma",
    x: 47.3, y: 53.7, ekipman: { ad: "Kalkan", ikon: "🛡️" },
    hap: [
      "\"Ortak özellik değildir\" sorularında önce iki metnin ortak ifadelerini bul.",
      "\"Hangi soruya cevap verilemez\" sorularında metinde hiç geçmeyen bilgiyi ara.",
      "\"Yol açar, neden olur\" sonucu sorar; sebep cümlesini işaretleme."
    ],
    tuzak: [
      "Bir metni yeterince incelemeden ortak özellik kararı vermek.",
      "Yalnızca bir metinde geçen bilgiyi ikisine de ait sanmak."
    ],
    taktik: [
      "İki metni yan yana koy, her şık için iki metinde de karşılık ara.",
      "Son kontrol: Bu seçenek metindeki bilgiyi aynen karşılıyor mu?"
    ],
    sorular: [
      {
        metin: "I. Metin: Çay bitkisi, bol yağış alan ve nemli iklimleri sever. Türkiye'de en çok Doğu Karadeniz kıyılarında yetiştirilir. Taze yapraklar mayıs ayından ekime kadar elle ya da makasla toplanır.\n\nII. Metin: Fındık, Karadeniz'in nemli ve ılıman ikliminde iyi yetişen bir üründür. Ağustos ayında olgunlaşan fındıklar, çoğunlukla aile bireylerinin birlikte çalışmasıyla elle toplanır.",
        soru: "İki metinde de aşağıdakilerden hangisine değinilmiştir?",
        siklar: ["Ürünün yetiştiği iklimin özelliklerine", "Ürünün makasla toplandığına", "Ürünün ağustos ayında olgunlaştığına", "Ürünün Türkiye'ye hangi yıl geldiğine"],
        d: 0,
        kilit: "Ortak özellik iki metinde de açıkça bulunmalıdır.",
        isaret: "\"Nemli\" sözcüğü iki metinde de geçiyor.",
        rota: ["Makas: yalnızca I. metin.", "Ağustos: yalnızca II. metin.", "Geliş yılı: hiçbir metinde yok."]
      },
      {
        metin: "I. Metin: Kirpiler gece hareketli olan hayvanlardır. Gündüzleri yapraklar arasında saklanır, karanlık çökünce böcek ve solucan aramaya çıkarlar. Kışı uykuda geçirirler.\n\nII. Metin: Yarasalar geceleri avlanır. Karanlıkta yollarını, çıkardıkları seslerin yankısını dinleyerek bulurlar. Pek çok yarasa türü kışı mağaralarda uyuyarak geçirir.",
        soru: "Aşağıdakilerden hangisi iki metnin ortak özelliklerinden biri değildir?",
        siklar: ["Hayvanın yolunu sesin yankısıyla bulması", "Hayvanın gece hareketli olması", "Hayvanın besin aramaya karanlıkta çıkması", "Hayvanın kışı uykuyla geçirmesi"],
        d: 0,
        kilit: "\"Ortak özellik değildir\" sorularında doğru cevap genellikle yalnızca bir metinde verilen bilgidir.",
        isaret: "Yankı bilgisi yalnızca yarasaları anlatan metinde var.",
        rota: ["Önce ortakları işaretle: gece, karanlıkta beslenme, kış uykusu.", "Sonra bu listede olmayan şıkkı bul.", "O bilginin yalnızca bir metinde olduğunu doğrula."]
      },
      {
        metin: "Türkiye'nin en uzun nehri olan Kızılırmak, Sivas'taki Kızıldağ'ın eteklerinden doğar. Yaklaşık 1355 kilometre yol aldıktan sonra Bafra yakınlarında Karadeniz'e dökülür. Nehir, adını sularına renk veren kırmızımsı topraktan alır.",
        soru: "Bu metinde aşağıdaki sorulardan hangisinin cevabı yoktur?",
        siklar: ["Kızılırmak üzerinde kaç baraj bulunmaktadır?", "Kızılırmak nereden doğar?", "Kızılırmak'ın uzunluğu ne kadardır?", "Kızılırmak adını nereden alır?"],
        d: 0,
        kilit: "\"Hangi soruya cevap yoktur\" sorularında metinde hiç geçmeyen bilgiyi isteyen soru doğru cevaptır.",
        isaret: "Metinde barajlardan hiç söz edilmiyor.",
        rota: ["Doğduğu yer: ilk cümle.", "Uzunluk: ikinci cümle.", "Ad: son cümle. Kalan soru cevapsız."]
      },
      {
        metin: "Şehirlerde ağaçların azalması ve binaların sıklaşması, yaz aylarında şehir merkezlerinin çevredeki kırsal alanlardan birkaç derece daha sıcak olmasına yol açar. Beton ve asfalt gün boyu güneş ışığını emer, gece ise bu ısıyı yavaşça geri verir.",
        soru: "Bu metne göre ağaçların azalması ve binaların sıklaşması neye yol açar?",
        siklar: ["Şehir merkezlerinin kırsal alanlardan daha sıcak olmasına", "Betonun güneş ışığını emmesine", "Kırsal alanların serinlemesine", "Gece sıcaklıklarının düşmesine"],
        d: 0,
        kilit: "\"Yol açar\" sorusu sonucu ister. Sebebi ya da işleyişi anlatan cümleyi işaretleme.",
        isaret: "\"...olmasına yol açar\" ifadesi cevabı aynı cümlede veriyor.",
        rota: ["Sebebi bul: ağaç azalması, bina sıklaşması.", "Sonucu bul: \"yol açar\"dan önceki kısım.", "İşleyişi anlatan beton-asfalt cümlesini ele."]
      }
    ]
  },
  {
    ad: "Anlatım Pusulası", konu: "Hikâye Unsurları · Anlatıcı",
    x: 12.6, y: 52.1, ekipman: { ad: "Dümen Ceketi", ikon: "☸️" },
    hap: [
      "Hikâye unsurları dörttür: Kişi, Yer, Zaman, Olay. Var sayılması için metinde açık ipucu gerekir.",
      "I. kişi anlatım \"ben, biz\" ile; III. kişi anlatım \"o\" ve dış gözlemle yapılır.",
      "İlahi bakış açısında anlatıcı, kahramanın içinden geçenleri de bilir."
    ],
    tuzak: [
      "\"Uzak diyarlarda\" gibi ifadeleri zaman sanmak. Bu bir mekândır.",
      "Gözlemci bakışı ilahi bakışla karıştırmak.",
      "Betimlemeyi olay sanmak. Olay hareket ve değişim içerir."
    ],
    taktik: [
      "Metni dört renkle tara: kişi, yer, zaman, olay.",
      "\"Ben, biz\" zamirlerini ara; içten geçenler söyleniyor mu, bak."
    ],
    sorular: [
      {
        metin: "",
        soru: "Aşağıdakilerin hangisinde I. kişi ağzından anlatım vardır?",
        siklar: ["Sabah erkenden kalkıp dedemin bahçesine koştum. Domatesleri birlikte toplarken bana çocukluğunu anlattı.", "Elif, bisikletini kapının önüne bıraktı. Annesinin seslendiğini duyunca koşarak içeri girdi.", "Köyün en yaşlı çınarı yüzyıllardır meydanda dimdik duruyordu. Gölgesinde her akşam çocuklar oynardı.", "Balıkçılar ağlarını topladığında güneş çoktan batmıştı. Hepsi yorgun ama mutluydu."],
        d: 0,
        kilit: "I. kişi anlatımda anlatıcı olayın içindedir ve \"ben, biz\" ağzından konuşur.",
        isaret: "\"Koştum\", \"dedemin\": anlatıcı kendisini anlatıyor.",
        rota: ["Fiillerin sonundaki kişi eklerine bak: -dım, -dik.", "\"Ben, benim, biz\" ifadelerini ara.", "Dışarıdan anlatılan şıkları ele."]
      },
      {
        metin: "Kerem, dedesinin köydeki ahşap evinin tavan arasına çıktı. Tozlu bir sandığın kapağını açtığında içinden eski bir pusula çıktı. Pusulayı eline alıp merdivenlerden koşarak indi ve dedesine nereden geldiğini sordu.",
        soru: "Bu metinde hikâye unsurlarından hangisine yer verilmemiştir?",
        siklar: ["Zaman", "Kişi", "Yer", "Olay"],
        d: 0,
        kilit: "Bir unsurun var sayılması için metinde açık bir ipucu bulunmalıdır.",
        isaret: "Ne bir saat, ne bir mevsim, ne de \"bir gün, akşam\" gibi bir zaman sözü var.",
        rota: ["Kişi: Kerem, dede.", "Yer: köydeki ahşap ev, tavan arası.", "Olay: sandık açılıyor, pusula bulunuyor. Zaman ipucu yok."]
      },
      {
        metin: "Uzak diyarlarda, yedi dağın ardında bir köy varmış. Bu köyde, herkesin sözünü dinlediği bilge bir nine yaşarmış.",
        soru: "Bu masal girişinde hikâye unsurlarından hangileri verilmiştir?",
        siklar: ["Yer ve kişi", "Yer ve zaman", "Zaman ve olay", "Kişi ve olay"],
        d: 0,
        kilit: "Masal girişleri genellikle yer ve kişi verir; zaman çoğu zaman belirsizdir.",
        isaret: "\"Uzak diyarlarda\" bir zaman değil, bir yer anlatıyor.",
        rota: ["\"Uzak diyarlar, yedi dağın ardı, köy\": mekân.", "\"Bilge nine\": kişi.", "Henüz hareket yok, yani olay başlamamış."]
      },
      {
        metin: "",
        soru: "Aşağıdakilerin hangisinde anlatıcı, kahramanın içinden geçenleri de bilmektedir?",
        siklar: ["Selin kapıyı çaldı. İçeridekilerin onu affetmeyeceğinden korkuyordu ama bunu kimseye belli etmemeye kararlıydı.", "Selin kapıyı çaldı. Bir süre bekledi, sonra çantasını yere bırakıp kapıyı tekrar çaldı.", "Kapıyı çaldım. İçeriden ses gelmeyince çantamı yere bıraktım.", "Selin'in çaldığı kapı sokağın en eski evine aitti. Yeşil boyası yer yer dökülmüştü."],
        d: 0,
        kilit: "İlahi bakış açısında anlatıcı her şeyi bilir: kahramanın korkularını, kararlarını, düşüncelerini.",
        isaret: "Bir şıkta anlatıcı Selin'in korkusunu ve kararını biliyor; bunlar dışarıdan görünmez.",
        rota: ["Yalnızca görüleni anlatan şık: gözlemci bakış.", "\"Ben\" ağzından anlatan şık: I. kişi.", "Duygu ve düşünceyi bilen şık: ilahi bakış."]
      }
    ]
  },
  {
    ad: "Anlatım Rotası", konu: "Anlatım Biçimleri · Düşünceyi Geliştirme Yolları",
    x: 15.5, y: 22.3, ekipman: { ad: "Pelerin", ikon: "🧣" },
    hap: [
      "Açıklama bilgi vermek, tartışma bir görüşü savunmak, betimleme tasvir yapmak, öyküleme olay anlatmak için kullanılır.",
      "Tanımlama \"Nedir?\" sorusuna cevap verir; örneklendirme soyutu somutlaştırır.",
      "Karşılaştırma iki şeyi benzerlik ya da farklılık yönüyle ele alır: \"daha, kadar, -e göre, ise\"."
    ],
    tuzak: [
      "\"-dır, -dir\" görünce düşünmeden tanımlama demek.",
      "Karşıt görüş geçince hemen tartışma demek; ikna amacı yoksa açıklama olabilir.",
      "Kısa bir tasviri görüp olay anlatan metne betimleme demek."
    ],
    taktik: [
      "\"Yazar bu metni hangi amaçla yazmış?\" diye sor.",
      "Teknik metnin tamamına mı yayılmış, yoksa tek bir cümlede mi geçiyor?"
    ],
    sorular: [
      {
        metin: "",
        soru: "Aşağıdakilerin hangisinde betimleme ağır basmaktadır?",
        siklar: ["Gölün kıyısındaki söğütler yeşil saçlarını suya bırakmış gibiydi. Sabahın serin rüzgârı, suyun üzerinde gümüş rengi kırışıklar oluşturuyordu.", "Göller, tatlı su kaynaklarının önemli bir bölümünü oluşturur. Ülkemizde yüzlerce doğal göl bulunur.", "Bence her okulun bir bahçesi olmalı; çünkü öğrenciler doğayla iç içe olduklarında daha iyi öğrenir.", "Ali sabah erkenden kalktı, oltasını aldı ve göle doğru yürüdü. Kıyıya vardığında ilk balığını tuttu."],
        d: 0,
        kilit: "Betimleme, okurun gözünde bir tablo canlandırır: renk, ses, biçim, duyu ayrıntıları.",
        isaret: "Bir şıkta \"yeşil\", \"serin\", \"gümüş rengi\" gibi duyusal ayrıntılar var.",
        rota: ["Bilgi veren şık: açıklama.", "Görüş savunan şık: tartışma.", "Olay anlatan şık: öyküleme. Tablo çizen şık: betimleme."]
      },
      {
        metin: "Kaplumbağaların bazı türleri yüz yılı aşkın yaşayabilirken bir karasineğin ömrü yalnızca birkaç haftadır. Fillerde yavrunun doğması yaklaşık iki yıl sürer; farelerde ise bu süre üç haftayı bile bulmaz.",
        soru: "Bu metinde aşağıdaki düşünceyi geliştirme yollarından hangisi kullanılmıştır?",
        siklar: ["Karşılaştırma", "Tanımlama", "Tanık gösterme", "Benzetme"],
        d: 0,
        kilit: "Karşılaştırmada iki varlık benzerlik ya da farklılık yönüyle ele alınır; \"-ken, ise\" gibi sözler ipucudur.",
        isaret: "Kaplumbağa ile sinek, fil ile fare yan yana konmuş.",
        rota: ["Metinde bir şeyin ne olduğu anlatılıyor mu? Hayır: tanımlama yok.", "Birinin sözü aktarılıyor mu? Hayır: tanık gösterme yok.", "İki şey yan yana mı? Evet: karşılaştırma."]
      },
      {
        metin: "",
        soru: "Aşağıdakilerin hangisinde tanımlama yapılmıştır?",
        siklar: ["Pusula, yön bulmaya yarayan ve iğnesi kuzeyi gösteren bir araçtır.", "Pusula çok kullanışlı bir araçtır.", "Pusulam, dedemin bana bıraktığı en değerli hediyedir.", "Pusulanın iğnesi, bir kaptanın sadık arkadaşı gibidir."],
        d: 0,
        kilit: "Tanımlama \"Nedir?\" sorusuna cevap verir. Her \"-dır, -dir\" ile biten cümle tanım değildir.",
        isaret: "Yalnızca bir şık pusulanın ne olduğunu ve ne işe yaradığını anlatıyor.",
        rota: ["\"Çok kullanışlı\" bir yargı, tanım değil.", "\"Dedemin hediyesi\" kişisel bir bilgi.", "\"...gibidir\" bir benzetme."]
      },
      {
        metin: "Bazı insanlar ödevlerin gereksiz olduğunu düşünür. Ben bu görüşe katılmıyorum. Ödevler, derste öğrendiklerimizi tekrar etmemizi ve eksiklerimizi görmemizi sağlar. Üstelik düzenli ödev yapan öğrenciler zamanlarını planlamayı da öğrenir. Bu nedenle ödevler eğitimin vazgeçilmez bir parçası olmalıdır.",
        soru: "Bu metinde ağır basan anlatım biçimi aşağıdakilerden hangisidir?",
        siklar: ["Tartışma", "Açıklama", "Öyküleme", "Betimleme"],
        d: 0,
        kilit: "Tartışmada yazar bir görüşü savunur, karşı görüşü çürütmeye ve okuru ikna etmeye çalışır.",
        isaret: "\"Ben bu görüşe katılmıyorum\" ve \"olmalıdır\": yazar okuru ikna etmeye çalışıyor.",
        rota: ["Karşı görüşü bul: ödevler gereksiz.", "Yazarın kendi görüşünü ve gerekçelerini bul.", "İkna amacı varsa tartışma."]
      }
    ]
  },
  {
    ad: "Üslup Şifresi", konu: "Yazılış Amacı · Dil ve Anlatım · Medya Metinleri",
    x: 44.4, y: 22.3, ekipman: { ad: "Tüy Kalem", ikon: "🪶" },
    hap: [
      "Yazılış amacında metnin genel tonuna bak: bilgi mi veriyor, ikna mı ediyor, olay mı anlatıyor, kültür mü tanıtıyor?",
      "Bilgilendirici metinlerde tanım, sayısal veri ve nesnel anlatım bulunur.",
      "Reklam metinleri abartılı sözler ve acele ettiren ifadelerle satın almaya yönlendirir."
    ],
    tuzak: [
      "Bir benzetme görünce metne hemen betimleme demek.",
      "\"Söylenemez\" sorusunu \"söylenir\" gibi okumak."
    ],
    taktik: [
      "Metnin kenarına küçük notlar düş: tanım, örnek, sayı, duygu.",
      "Son kontrol: Bu şık metinde açıkça var mı, yoksa ben mi yorum katıyorum?"
    ],
    sorular: [
      {
        metin: "Hıdırellez, her yıl 5 Mayıs'ı 6 Mayıs'a bağlayan gece kutlanan bir bahar bayramıdır. Bu gece insanlar dileklerini kâğıtlara yazıp gül ağaçlarının dallarına asar. Sabah erkenden kırlara çıkılır, birlikte yemekler yenir. Hıdırellez, UNESCO'nun Somut Olmayan Kültürel Miras listesinde yer almaktadır.",
        soru: "Bu metnin yazılış amacı aşağıdakilerden hangisidir?",
        siklar: ["Geleneksel bir kutlamayı tanıtmak", "Okuru bir görüşe ikna etmek", "Yaşanmış bir anıyı paylaşmak", "Bilimsel bir olayı açıklamak"],
        d: 0,
        kilit: "Kültürel bir değeri, geleneği ya da bayramı tanıtan metinlerin amacı kültür aktarmaktır.",
        isaret: "Metin bir bayramın ne zaman ve nasıl kutlandığını anlatıyor; kimseyi ikna etmeye çalışmıyor.",
        rota: ["Metinde \"ben\" ve anı var mı? Hayır.", "Savunulan bir görüş var mı? Hayır.", "Bir gelenek tanıtılıyor mu? Evet."]
      },
      {
        metin: "Sabah alarm çaldığında yataktan çıkmak istemedim. Pencereden baktığımda her yer bembeyazdı; kar, gece boyunca sessizce yağmıştı. Okulların tatil edildiği haberini duyunca sevinçten zıpladım.",
        soru: "Bu metinle ilgili aşağıdakilerden hangisi söylenemez?",
        siklar: ["Karşılaştırmaya başvurulmuştur.", "I. kişi ağzından anlatılmıştır.", "Öyküleyici anlatımdan yararlanılmıştır.", "Duygulara yer verilmiştir."],
        d: 0,
        kilit: "\"Söylenemez\" sorularında metinde olanı değil, olmayanı ararsın.",
        isaret: "Metinde iki şey yan yana konup kıyaslanmıyor.",
        rota: ["\"İstemedim, zıpladım\": I. kişi var.", "Sabahtan habere uzanan olay akışı var: öyküleme.", "\"Sevinçten zıpladım\": duygu var. Kıyaslama yok."]
      },
      {
        metin: "YENİ! Süper Uzay Kalemi ile ödevlerin artık çok daha kolay! Sınıfının en iyisi olmak istiyorsan hemen sen de al! Stoklar tükenmeden acele et!",
        soru: "Bu medya metniyle ilgili aşağıdakilerden hangisi doğrudur?",
        siklar: ["Okuru bir ürünü satın almaya yönlendirmektedir.", "Okura tarafsız bir haber sunmaktadır.", "Bilimsel bir buluşu açıklamaktadır.", "Kalemin nasıl üretildiğini anlatmaktadır."],
        d: 0,
        kilit: "Reklam metinleri abartılı vaatler, ünlemler ve acele ettiren sözlerle satın almaya yönlendirir.",
        isaret: "\"Hemen al\", \"acele et\", \"en iyisi ol\": bunlar bir haberin değil reklamın sözleri.",
        rota: ["Metin bir şey satıyor mu? Evet.", "Kanıt ya da bilgi veriyor mu? Hayır, yalnızca vaat ediyor.", "Medya metninde amacı sorgula: kim, neden yazdı?"]
      },
      {
        metin: "Arılar bir fabrikanın işçileri gibi çalışır. Bir kovanda yaşayan on binlerce arı arasında kusursuz bir iş bölümü vardır: Kimi nektar toplar, kimi kovanı temizler, kimi de yavrulara bakar.",
        soru: "Bu metnin yazılış amacı ve anlatımıyla ilgili aşağıdakilerden hangisi doğrudur?",
        siklar: ["Bilgi vermek amaçlanmış, benzetmeden de yararlanılmıştır.", "Bir manzarayı betimlemek amaçlanmıştır.", "Okur bir görüşe ikna edilmeye çalışılmıştır.", "Bir olay, kişi ağzından anlatılmıştır."],
        d: 0,
        kilit: "Bir benzetme metni betimleme yapmaz. Metnin genel amacına bak.",
        isaret: "\"Fabrikanın işçileri gibi\" bir benzetme; ama metnin işi arılar hakkında bilgi vermek.",
        rota: ["Benzetmeyi işaretle: \"gibi\".", "Metnin geri kalanı bilgi mi veriyor? Evet.", "İkna, anı, manzara yok."]
      }
    ]
  },
  {
    ad: "Strateji Meydanı", konu: "Grafik · Tablo · Sözel Mantık",
    x: 77.9, y: 23.4, ekipman: { ad: "Altın Anahtar", ikon: "🔑" },
    hap: [
      "Grafik ve tablo sorularında yalnızca verilen veriler üzerinden konuşulur.",
      "Sözel mantık sorularında kişi ve durumları bir tablo hâline getirmek işi kolaylaştırır.",
      "\"Kesinlikle, yalnızca, en az, en çok\" gibi sözler sorunun kilit noktalarıdır."
    ],
    tuzak: [
      "Grafikte olmayan bir bilgiyi (mevsim, tür, neden) grafikten çıkarmaya çalışmak.",
      "Bir öncülü yerleştirmeden diğerine geçmek."
    ],
    taktik: [
      "İlk kesin bilgiden başla, öncülleri tek tek yerleştir.",
      "Sonunda tüm öncüllerin tabloyla uyumlu olduğunu kontrol et."
    ],
    sorular: [
      {
        grafik: { baslik: "Bir haftada ödünç alınan kitap sayısı", veri: [["5-A", 12], ["5-B", 8], ["6-A", 15], ["6-B", 10]] },
        metin: "",
        soru: "Bu grafiğe göre aşağıdaki sorulardan hangisine cevap verilemez?",
        siklar: ["Öğrenciler en çok hangi türde kitap okumuştur?", "En çok kitabı hangi sınıf ödünç almıştır?", "6-A ve 6-B toplam kaç kitap ödünç almıştır?", "5-B, 5-A'dan kaç kitap az almıştır?"],
        d: 0,
        kilit: "Grafik sorularında yalnızca grafikte verilen bilgiler kullanılır.",
        isaret: "Grafik sınıfları ve kitap sayılarını gösteriyor; kitapların türü hiçbir yerde yok.",
        rota: ["En çok: sütunları karşılaştır (6-A).", "Toplam: 15 + 10 = 25.", "Fark: 12 - 8 = 4. Tür bilgisi grafikte yok."]
      },
      {
        tablo: { baslik: "Sınıf gezisi için oylar", basliklar: ["", "Müze", "Hayvanat Bahçesi", "Gözlemevi"], satirlar: [["5-A", 10, 8, 6], ["5-B", 7, 12, 5], ["5-C", 9, 6, 11]] },
        metin: "",
        soru: "Bu tabloya göre aşağıdakilerden hangisi doğrudur?",
        siklar: ["Müze ve hayvanat bahçesi eşit sayıda oy almıştır.", "En az oyu müze almıştır.", "5-C'de en çok oyu hayvanat bahçesi almıştır.", "En çok oyu gözlemevi almıştır."],
        d: 0,
        kilit: "Tablo sorularında önce satır ve sütun toplamlarını çıkar, sonra şıkları tek tek dene.",
        isaret: "Müze: 10 + 7 + 9 = 26. Hayvanat bahçesi: 8 + 12 + 6 = 26.",
        rota: ["Her sütunu topla: 26, 26, 22.", "5-C satırında en büyük sayı 11: gözlemevi.", "Toplamları şıklarla karşılaştır."]
      },
      {
        metin: "Ada, Bora, Can ve Duru bir konserde yan yana dört sandalyede oturuyor. Her biri farklı bir çalgı çalıyor: keman, gitar, flüt ve davul.\n• Davul çalan en sağda oturuyor.\n• Ada, keman çalanın hemen solunda oturuyor.\n• Can flüt çalıyor ve en solda oturuyor.\n• Bora, Duru'nun sağında oturuyor.",
        soru: "Buna göre aşağıdakilerden hangisi kesinlikle doğrudur?",
        siklar: ["Duru keman çalar.", "Ada flüt çalar.", "Bora gitar çalar.", "Ada en sağda oturur."],
        d: 0,
        kilit: "Sözel mantıkta ilk kesin bilgiden başla ve öncülleri bir tabloya tek tek yerleştir.",
        isaret: "Can 1. sırada, davul 4. sırada. Ada 3. sırada olsaydı keman 4. sırada olurdu; ama orada davul var.",
        rota: ["Sıra: 1 Can (flüt), 4 davul.", "Ada 2. sırada, keman 3. sırada; Ada gitar çalar.", "Bora Duru'nun sağında: Duru 3 (keman), Bora 4 (davul)."]
      },
      {
        metin: "Bir okulda pazartesiden perşembeye her gün bir kulüp toplanıyor: satranç, robotik, tiyatro ve resim.\n• Robotik, tiyatrodan hemen sonraki gün toplanıyor.\n• Satranç pazartesi toplanmıyor.\n• Resim perşembe toplanıyor.",
        soru: "Buna göre salı günü hangi kulüp toplanır?",
        siklar: ["Robotik", "Tiyatro", "Satranç", "Resim"],
        d: 0,
        kilit: "Yerleştirme sorularında kesin bilgiyi yerleştir, sonra kalan seçenekleri öncüllerle dene.",
        isaret: "Resim perşembe. Satranç pazartesi olamıyor; tiyatro-robotik ise art arda iki gün istiyor.",
        rota: ["Perşembe: resim.", "Pazartesi satranç olamaz, robotik de olamaz (öncesinde tiyatro gerekir): pazartesi tiyatro.", "Salı robotik, çarşamba satranç."]
      }
    ]
  }
];
