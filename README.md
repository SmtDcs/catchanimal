# CatchCat • Monad

Kameranı aç → AI ile tespit et → Minigame ile yakala → Fotoğraflı NFT olarak sahiplen.

**Kediler + Köpekler • Sadece canlı kamera • Komik isimler • Vahşi spawn'lar**

Şu anda tamamen client-side demo + gerçeğe yakın AI + interaktif minigame.

## Mevcut Durum
- ✅ Canlı kamera + gerçek TensorFlow.js (COCO-SSD) ile kedi/köpek tespiti
- ✅ Sürükle-bırak mama fırlatma minigame
- ✅ Yakalananlar koleksiyonda (localStorage demo)
- ✅ Keşfet / Wild spawn'lar
- 🔜 Gerçek mint (Monad testnet'te CatNFT kontratı + IPFS)

## Geliştirme Akışı (Git + Vercel)

Her değişiklikten sonra:

```bash
git add .
git commit -m "feat: ..."
git push
```

Vercel otomatik build yapacak ve sana yeni link verecek. Telefonunda o linkle test et.

## Vercel'de Görüntüleme

- Repo GitHub'a pushlandıktan sonra Vercel'den import et
- **Root Directory** = `frontend`
- Deploy olunca public HTTPS link alırsın (kamera için ideal)

## Yerel Geliştirme

```bash
cd frontend
npm run dev
```

## Klasör Yapısı

```
catchcat-monad/
├── contracts/          # Hardhat (CatNFT + diğerleri)
├── frontend/           # Next.js uygulaması (burası Vercel'e deploy)
│   └── src/
├── hardhat.config.ts
└── scripts/
```

## Telefon Testi

Vercel linkini telefon tarayıcısında aç → Kamera izni ver → Oyun oyna.

## Monad Testnet

Cüzdan ekle:
- RPC: https://testnet-rpc.monad.xyz
- Chain ID: 10143
- Faucet: https://faucet.monad.xyz

---

Her şeyi düzenli push'layıp Vercel'de görelim. Değişiklikleri küçük küçük yap, güzel commit mesajları yaz. Hazır mısın? Bir sonraki özelliği mi koyalım yoksa repo'yu mu oluşturalım?
