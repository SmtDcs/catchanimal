# CatchCat • Monad

Kameranı aç → AI tespit et → Minigame ile yakala → Fotoğraflı NFT kart olarak sahiplen.

Kediler + Köpekler. Sadece canlı kamera. Komik isimler. Harita ile keşfet.

**Şu an:** Aşama 1 (Temel altyapı + test mint)

## Hızlı Başlangıç

```bash
# 1. Bağımlılıklar (root + frontend)
npm install
cd frontend && npm install

# 2. Monad Testnet'e deploy (hardhat)
npx hardhat run scripts/deploy.ts --network monadTestnet

# 3. Frontend
cd frontend
npm run dev
```

Cüzdanını Monad Testnet'e ekle:
- RPC: https://testnet-rpc.monad.xyz
- Chain ID: 10143
- Faucet: https://faucet.monad.xyz

## Mevcut Durum (Aşama 1)
- ✅ Monad Testnet entegrasyonu
- ✅ Wallet connect
- ✅ Basit test mint (dummy)
- 🔜 Aşama 2: Gerçek AI + canlı kamera

Proje aşama aşama ilerliyor. Her aşama bittiğinde bir sonraki için devam.

## Klasör Yapısı
- `contracts/` — CatNFT.sol (ve ileride diğerleri)
- `frontend/` — Next.js + wagmi
- `scripts/deploy.ts`

Daha fazlası için plan dosyasını veya geliştiriciye sor.
