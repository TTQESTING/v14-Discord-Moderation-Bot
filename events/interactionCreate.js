const { Events, Collection, EmbedBuilder } = require('discord.js');
const { roleLimits, roleIds, logChannels } = require('../config');
const fs = require('fs');
const path = require('path');

// Günlük limitleri saklamak için dosya
const limitsFile = path.join(__dirname, '../data/limits.json');
const dataDir = path.join(__dirname, '../data');

// Veri klasörü yoksa oluştur
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Limitleri yükle
function loadLimits() {
  if (fs.existsSync(limitsFile)) {
    return JSON.parse(fs.readFileSync(limitsFile, 'utf8'));
  }
  return {};
}

// Limitleri kaydet
function saveLimits(limits) {
  fs.writeFileSync(limitsFile, JSON.stringify(limits, null, 2));
}

// Günü kontrol et ve sıfırla gerekirse
function resetIfNewDay(limits, userId) {
  const today = new Date().toDateString();
  if (!limits[userId] || limits[userId].date !== today) {
    limits[userId] = {
      date: today,
      timeout: 0,
      kick: 0,
      ban: 0
    };
  }
}

// Log mesajını gönder
async function sendLog(interaction, commandName, targetUser, reason, remaining) {
  try {
    const channelId = logChannels[commandName];
    if (!channelId) return;

    const logChannel = await interaction.guild.channels.fetch(channelId);
    if (!logChannel || !logChannel.isTextBased()) return;

    const embedColors = {
      timeout: '#FFA500',  // Turuncu
      kick: '#FF6B6B',     // Kırmızı
      ban: '#8B0000'       // Koyu kırmızı
    };

    const embed = new EmbedBuilder()
      .setColor(embedColors[commandName] || '#00FF00')
      .setTitle(`📋 ${commandName.toUpperCase()} Komutu Kullanıldı`)
      .addFields(
        { name: '👤 Kullanan', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
        { name: '⚠️ Hedef', value: `${targetUser.tag} (${targetUser.id})`, inline: true },
        { name: '📝 Sebep', value: reason || 'Belirtilmemiş', inline: false },
        { name: '⏰ Zaman', value: new Date().toLocaleString('tr-TR'), inline: true },
        { name: '📊 Kalan Limit', value: `${remaining}`, inline: true }
      )
      .setFooter({ text: 'Moderasyon Sistemi' })
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
  } catch (error) {
    console.error('Log gönderilirken hata:', error);
  }
}

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    // Timeout, kick, ban komutlarını kontrol et
    const commandName = interaction.commandName;
    const limits = loadLimits();
    const userId = interaction.user.id;

    if (['timeout', 'kick', 'ban'].includes(commandName)) {
      // Kullanıcının rollerini kontrol et
      const userRoles = interaction.member.roles.cache;
      let userRole = null;

      for (const [roleId, roleName] of Object.entries(roleIds)) {
        if (userRoles.has(roleName)) {
          userRole = roleId;
          break;
        }
      }

      if (!userRole) {
        return interaction.reply({
          content: '❌ Bu komutu kullanmak için gerekli role sahip değilsin!',
          ephemeral: true
        });
      }

      // Günü kontrol et
      resetIfNewDay(limits, userId);

      // Limitleri al
      const userLimits = roleLimits[userRole];
      if (!userLimits) {
        return interaction.reply({
          content: '❌ Rol limitleri tanımlanmamış!',
          ephemeral: true
        });
      }

      // Günlük limiti kontrol et
      if (limits[userId][commandName] >= userLimits[commandName]) {
        return interaction.reply({
          content: `❌ Günlük **${commandName}** limitine ulaştın! (**${userLimits[commandName]}** izin)\nYarın tekrar dene.`,
          ephemeral: true
        });
      }

      // Komutu çalıştır
      try {
        await command.execute(interaction);
        limits[userId][commandName]++;
        const remaining = userLimits[commandName] - limits[userId][commandName];
        saveLimits(limits);

        // Log mesajını gönder
        const targetUser = interaction.options.getUser('üye');
        const reason = interaction.options.getString('sebep') || interaction.options.getString('durum') || 'Belirtilmemiş';
        
        if (targetUser) {
          await sendLog(interaction, commandName, targetUser, reason, remaining);
        }
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: '❌ Komut çalıştırılırken bir hata oluştu!',
          ephemeral: true
        });
      }
    } else {
      // Diğer komutlar
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: '❌ Komut çalıştırılırken bir hata oluştu!',
          ephemeral: true
        });
      }
    }
  }
};
