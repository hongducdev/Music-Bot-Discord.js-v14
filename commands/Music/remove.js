const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    category: "Music",
    data: new SlashCommandBuilder()
        .setName("remove")
        .setDescription("Remove song!")
        .addNumberOption((option) =>
            option
                .setName("id")
                .setDescription("ID")
                .setRequired(false)
                .setAutocomplete(true)
        ),

    async execute(interaction, client) {
        try {
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
            if (!queue) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.config.colorError)
                            .setDescription(
                                `🚫 | There are no songs in the playlist!`
                            ),
                    ],
                });
            }

            const id = interaction.options.getNumber("id");
            // let track = queue.songs[args[0]];
            let song = queue.songs.splice(id - 1, 1);
            const msg = await queue.textChannel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.colorDefault)
                        .setAuthor({
                            name: "Removed song",
                            iconURL: client.user.displayAvatarURL(),
                        })
                        .setDescription(
                            `🎵 | Removed ${song[0].name} from the playlist!`
                        ),
                ],
            });
            setTimeout(() => {
                msg.delete();
            }, 5000);
        } catch (err) {
            console.log(err);
            const msg = await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.colorError)
                        .setAuthor({
                            name: "Error",
                            iconURL: client.user.displayAvatarURL(),
                        })
                        .setDescription(
                            `🚫 | Error!\n\`\`\`${err}\`\`\``
                        ),
                ],
                ephemeral: true,
            });
        }
    },

    async autocomplete(interaction, client) {
        const focusedValue = interaction.options.getFocused();
        const queue = await client.distube.getQueue(interaction);

        if (queue.songs.length > 25) {
            const tracks = queue.songs
                .map((song, i) => {
                    return {
                        name: `${i + 1}. ${song.name}`,
                        value: i + 1,
                    };
                })
                .slice(0, 25);
            const filtered = tracks.filter((track) =>
                track.name.startsWith(focusedValue)
            );
            await interaction.respond(
                filtered.map((track) => ({
                    name: track.name,
                    value: track.value,
                }))
            );
        } else {
            const tracks = queue.songs
                .map((song, i) => {
                    return {
                        name: `${i + 1}. ${song.name}`,
                        value: i + 1,
                    };
                })
                .slice(0, queue.songs.length);
            const filtered = tracks.filter((track) =>
                track.name.startsWith(focusedValue)
            );
            await interaction.respond(
                filtered.map((track) => ({
                    name: track.name,
                    value: track.value,
                }))
            );
        }
    },
};
