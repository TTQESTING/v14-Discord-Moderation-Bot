const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Bir üyeyi sunucudan at')
    .addUserOption(option => 
      option.setName('üye')
        .setDescription('Atılacak üye')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('sebep')
        .setDescription('Atılma sebebi')
        .setRequired(false)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('üye');
    const reason = interaction.options.getString('sebep') || 'Sebep belirtilmemiş';

    const targetMember = await interaction.guild.members.fetch(targetUser.id);

    // Kick uygulanacak kişi bot'tan daha yüksek role sahip olamaz
    if (targetMember.roles.highest.position >= interaction.member.roles.highest.position) {
      return interaction.reply({
        content: '❌ Bu üyeyi sunucudan atamazsın!',
        ephemeral: true
      });
    }

    try {
      await targetMember.kick(reason);
      return interaction.reply({
        content: `✅ ${targetUser} sunucudan atıldı!\n**Sebep:** ${reason}`,
        ephemeral: false
      });
    } catch (error) {
      return interaction.reply({
        content: '❌ Üye atılırken bir hata oluştu!',
        ephemeral: true
      });
    }
  }
};
