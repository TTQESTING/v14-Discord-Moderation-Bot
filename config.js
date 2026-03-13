// Rol bazlı günlük sınırlamalar
// Her rol için timeout, kick ve ban limitlerini belirleyin
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

// Rol ID'sini buraya ekleyin: 'ROL_ADI': 'ROL_ID'
const roleIds = {
  'rehber': '1234567890123456789',
  'moderator': '1234567890123456789',
  'yönetici': '1234567890123456789'
};

// Log kanalları (her komut için ayrı kanal)
const logChannels = {
  timeout: '1234567890123456789',  // Timeout logları
  kick: '1234567890123456789',     // Kick logları
  ban: '1234567890123456789'       // Ban logları
};

module.exports = { roleLimits, roleIds, logChannels };
