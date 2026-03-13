const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Bir üyenin susturmasını kaldır')
    .addUserOption(option => 
      option.setName('üye')
        .setDescription('Susturması kaldırılacak üye')
        .setRequired(true)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('üye');

    try {
      // Tüm ses kanallarında izni aç
      const channels = interaction.guild.channels.cache;
      
      for (const channel of channels.values()) {
        if (channel.isVoiceBased()) {
          const overwrite = channel.permissionOverwrites.cache.get(targetUser.id);
          if (overwrite) {
            await channel.permissionOverwrites.delete(targetUser);
          }
        }
      }

      return interaction.reply({
        content: `✅ ${targetUser} susturması kaldırıldı!`,
        ephemeral: false
      });
    } catch (error) {
      return interaction.reply({
        content: '❌ Üyenin susturması kaldırılırken bir hata oluştu!',
        ephemeral: true
      });
    }
  }
};
