const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bir üyeyi sunucudan yasakla')
    .addUserOption(option => 
      option.setName('üye')
        .setDescription('Yasaklanacak üye')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('sebep')
        .setDescription('Yasak sebebi')
        .setRequired(false)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('üye');
    const reason = interaction.options.getString('sebep') || 'Sebep belirtilmemiş';

    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    // Ban uygulanacak kişi bot'tan daha yüksek role sahip olamaz
    if (targetMember && targetMember.roles.highest.position >= interaction.member.roles.highest.position) {
      return interaction.reply({
        content: '❌ Bu üyeyi yasaklayamazsın!',
        ephemeral: true
      });
    }

    try {
      await interaction.guild.members.ban(targetUser, { reason });
      return interaction.reply({
        content: `✅ ${targetUser} sunucudan yasaklandı!\n**Sebep:** ${reason}`,
        ephemeral: false
      });
    } catch (error) {
      return interaction.reply({
        content: '❌ Üye yasaklanırken bir hata oluştu!',
        ephemeral: true
      });
    }
  }
};
