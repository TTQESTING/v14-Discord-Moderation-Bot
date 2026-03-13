# Discord Moderation Bot

V14 slash komutlu moderasyon bot'u. Timeout, kick, ban komutlarında günlük sınırlamalar vardır.

## 📋 Kurulum

### 1. Bağımlılıkları Yükle
```bash
npm install
```

### 2. .env Dosyasını Düzenle
```
TOKEN=YOUR_DISCORD_BOT_TOKEN
CLIENT_ID=YOUR_CLIENT_ID
GUILD_ID=YOUR_GUILD_ID
```

### 3. Config.js Dosyasını Düzenle
`config.js` dosyasındaki rol ID'lerini, limitlerini ve log kanallarını ayarlayın:

```javascript
const roleIds = {
  'rehber': 'ROL_ID_1',
  'moderator': 'ROL_ID_2',
  'yönetici': 'ROL_ID_3'
};

const roleLimits = {
  'rehber': {
    timeout: 1,
    kick: 1,
    ban: 0
  },
  'moderator': {
    timeout: 5,
    kick: 3,
    ban: 2
  },
  'yönetici': {
    timeout: 999,
    kick: 999,
    ban: 999
  }
};

const logChannels = {
  timeout: 'TIMEOUT_LOG_KANAL_ID',
  kick: 'KICK_LOG_KANAL_ID',
  ban: 'BAN_LOG_KANAL_ID'
};
```

### 4. Komutları Kaydet
```bash
node register-commands.js
```

### 5. Bot'u Başlat
```bash
npm start
```

## 🔧 Komutlar

### Moderasyon Komutları

- **/timeout** - Üyeyi belirtilen süre için timeout yap
- **/kick** - Üyeyi sunucudan at
- **/ban** - Üyeyi sunucudan yasakla
- **/mute** - Üyeyi ses kanallarında sustur
- **/unmute** - Üyenin susturmasını kaldır

### Diğer Komutlar

- **/afk** - AFK durumunu ayarla
- **/ping** - Bot'un gecikme süresini göster

## ⚙️ Günlük Limitler

Moderasyon komutlarının günlük limitleri rol bazında ayarlanır:
- Her gün sıfırlanır
- Limitlere ulaşıldığında komut çalıştırılamaz
- Limitler `config.js` dosyasından özelleştirilebilir

## 📊 Log Sistemi

Tüm moderasyon komutları otomatik olarak kendi log kanallarına kaydedilir:

**Timeout Logları:**
- Sarı renkli embed ile kaydedilir
- Timeout işlem detayları

**Kick Logları:**
- Kırmızı renkli embed ile kaydedilir
- Kick işlem detayları

**Ban Logları:**
- Koyu kırmızı renkli embed ile kaydedilir
- Ban işlem detayları

Her log embedi şunları içerir:
- 👤 Komutu kullanan kişi
- ⚠️ Hedef kişi
- 📝 İşlem sebebi
- ⏰ Zaman damgası
- 📊 Kalan günlük limit

Log kanal ID'lerini `config.js` dosyasında ayarlayın.

## 📂 Dosya Yapısı

```
bilgebot/
├── commands/          # Slash komutları
├── events/           # Bot eventleri
├── data/             # Kullanıcı limitleri (otomatik oluşturulur)
├── config.js         # Rol ve limit ayarları
├── index.js          # Ana bot dosyası
├── register-commands.js  # Komut kayıt scripti
├── package.json
├── .env
└── README.md
```

## 🚀 Discord Bot Permissions

Bot'a aşağıdaki izinleri verin:
- Manage Members (Üyeleri Yönet)
- Kick Members (Üyeleri At)
- Ban Members (Üyeleri Yasakla)
- Moderate Members (Üyeleri Moderate Et)
- Manage Channels (Kanalları Yönet)
- Send Messages (Mesaj Gönder)

## 📝 Notlar

- Timeout, kick, ban komutu sadece izin sahibi roller tarafından kullanılabilir
- Günlük limitler `data/limits.json` dosyasında tutulur
- Her kullanıcının günlük limitleri ayrı ayrı takip edilir
