const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: "Tools",
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Return ping!'),

    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true,
        });

        const embed = new EmbedBuilder()
            .setAuthor({
                name: "Ping",
                iconURL: client.user.displayAvatarURL(),
            })
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(client.config.colorDefault)
            .addFields([
                { name: "> API Latency", value: `${client.ws.ping}ms`, inline: true },
                { name: "> Discord Latency", value: `${message.createdTimestamp - interaction.createdTimestamp}ms`, inline: true },
                { name: "> Uptime", value: `${Math.floor(process.uptime() * 1000)}ms`, inline: true }
            ])
            .setTimestamp()

        await interaction.editReply({ embeds: [embed] });
    }
}