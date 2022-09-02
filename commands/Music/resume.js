const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    category: "Music",
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resume!"),

    async execute(interaction, client) {
        const voiceChannel = interaction.member.voice.channel;
        const queue = await client.distube.getQueue(interaction);
        if (!voiceChannel) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.colorError)
                        .setDescription(
                            `🚫 | You must be in a voice channel to use this command!`
                        ),
                ],
            });
        }
        if (
            interaction.guild.members.me.voice.channelId !==
            interaction.member.voice.channelId
        ) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.colorError)
                        .setDescription(
                            `🚫 | You need to be on the same voice channel as the Bot!`
                        ),
                ],
            });
        }

        queue.resume();
        const msg = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.colorDefault)
                    .setAuthor({
                        name: "Resume",
                        iconURL: client.user.displayAvatarURL(),
                    })
                    .setDescription(`⏯️ | Resume playing current song!`),
            ],
        });
    },
};
