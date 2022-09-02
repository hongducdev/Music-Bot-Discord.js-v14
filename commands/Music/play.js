const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");

module.exports = {
    category: "Music",
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song")
        .addStringOption((option) =>
            option
                .setName("keyword or URL")
                .setDescription("The keyword or URL of the song to play")
                .setRequired(true)
                .setAutocomplete(true)
        ),

    async execute(interaction, client) {
        const keyword = interaction.options.getString(
            "keyword or URL"
        );

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
                ephemeral: true,
            });
        }

        if (queue) {
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
                    ephemeral: true,
                });
            }
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.colorDefault)
                    .setDescription(`🔍 | Looking for a song...`),
            ],
            ephemeral: true,
        });

        client.distube.play(voiceChannel, keyword, {
            textChannel: interaction.channel,
            member: interaction.member,
        });
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.colorDefault)
                    .setDescription(`🔍 | Successful search!`),
            ],
            ephemeral: true,
        });
    },
};
