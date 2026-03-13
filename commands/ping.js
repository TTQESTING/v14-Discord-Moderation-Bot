const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Bot\'un gecikme süresini göster'),

  async execute(interaction) {
    const latency = interaction.client.ws.ping;
    
    return interaction.reply({
      content: `🏓 **Pong!**\nBot Gecikmesi: **${latency}ms**`,
      ephemeral: false
    });
  }
};
