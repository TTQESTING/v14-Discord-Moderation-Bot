const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Bir üyeyi timeout yap')
    .addUserOption(option => 
      option.setName('üye')
        .setDescription('Timeout yapılacak üye')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('süre')
        .setDescription('Timeout süresi (saniye)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('sebep')
        .setDescription('Timeout sebebi')
        .setRequired(false)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('üye');
    const duration = interaction.options.getInteger('süre');
    const reason = interaction.options.getString('sebep') || 'Sebep belirtilmemiş';

    const targetMember = await interaction.guild.members.fetch(targetUser.id);

    // Timeout uygulanacak kişi bot'tan daha yüksek role sahip olamaz
    if (targetMember.roles.highest.position >= interaction.member.roles.highest.position) {
      return interaction.reply({
        content: '❌ Bu üyeye timeout uygulayamazsın!',
        ephemeral: true
      });
    }

    try {
      await targetMember.timeout(duration * 1000, reason);
      return interaction.reply({
        content: `✅ ${targetUser} **${duration}** saniye timeout yedi!\n**Sebep:** ${reason}`,
        ephemeral: false
      });
    } catch (error) {
      return interaction.reply({
        content: '❌ Timeout uygulanırken bir hata oluştu!',
        ephemeral: true
      });
    }
  }
};
