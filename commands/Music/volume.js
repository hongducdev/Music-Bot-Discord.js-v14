const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    category: "Music",
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription(
            "Change the volume of the currently playing song (0-200)!"
        )
        .addIntegerOption((option) =>
            option
                .setName("volume")
                .setDescription("Âm lượng của bài hát (0-200)!")
                .setMaxValue(200)
                .setMinValue(0)
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const volume = interaction.options.getNumber("volume");
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

        if (volume < 0 || volume > 200) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.colorError)
                        .setDescription(
                            `🚫 | The volume value must be from 0 to 200!`
                        ),
                ],
                ephemeral: true,
            });
        }

        queue.setVolume(volume);
        const msg = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.colorDefault)
                    .setDescription(
                        `✅ | The volume has been changed to: ${volume}%/200%`
                    ),
            ],
        });
    },
};
