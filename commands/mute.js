const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Bir üyeyi sustur')
    .addUserOption(option => 
      option.setName('üye')
        .setDescription('Susturulacak üye')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('sebep')
        .setDescription('Susturma sebebi')
        .setRequired(false)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('üye');
    const reason = interaction.options.getString('sebep') || 'Sebep belirtilmemiş';

    const targetMember = await interaction.guild.members.fetch(targetUser.id);

    try {
      // Tüm ses kanallarında izni kapat
      const channels = interaction.guild.channels.cache;
      
      for (const channel of channels.values()) {
        if (channel.isVoiceBased()) {
          await channel.permissionOverwrites.edit(targetUser, {
            Speak: false
          });
        }
      }

      return interaction.reply({
        content: `✅ ${targetUser} susturuldu!\n**Sebep:** ${reason}`,
        ephemeral: false
      });
    } catch (error) {
      return interaction.reply({
        content: '❌ Üye susturulurken bir hata oluştu!',
        ephemeral: true
      });
    }
  }
};
