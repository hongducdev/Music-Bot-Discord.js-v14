const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    category: "Music",
    data: new SlashCommandBuilder()
        .setName("back")
        .setDescription("Playback the played song!"),

    run: async (client, interaction, args) => {
        const voiceChannel = interaction.member.voice.channel;
        const queue = await client.distube.getQueue(interaction);
        if (!voiceChannel) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color.colorError)
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
                        .setColor(client.color.colorError)
                        .setDescription(
                            `🚫 | You need to be on the same voice channel as the Bot!`
                        ),
                ],
            });
        }
        try {
            await client.distube.previous(interaction);
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.colorDefault)
                        .setAuthor({
                            name: "Playback",
                            iconURL: client.user.displayAvatarURL(),
                        })
                        .setDescription(`🎵 | Playback the played song!`),
                ],
            });
        } catch (err) {
            console.log(err);
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color.colorError)
                        .setAuthor({
                            name: "Error",
                            iconURL: client.user.displayAvatarURL(),
                        })
                        .setDescription(
                            `🚫 | The previous song in the playlist cannot be played back!`
                        ),
                ],
                ephemeral: true,
            });
        }
    },
};
