const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    category: "Music",
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip!")
        .addNumberOption((option) =>
            option
                .setName("id")
                .setDescription("ID")
                .setRequired(false)
                .setAutocomplete(true)
        ),

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

        const id = await interaction.options.getNumber("id");

        if (!id) {
            queue.skip();
            const msg = await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.colorDefault)
                        .setDescription(`⏩ | Skipped!`),
                ],
            });
        }

        if (id) {
            await client.distube.jump(interaction, parseInt(id - 1));
            try {
                const songSkip = queue.songs[parseInt(id - 1)];
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.config.colorDefault)
                            .setDescription(
                                `⏩ | Moved to song with ID: ${id}: **${songSkip.name}**!`
                            ),
                    ],
                });
            } catch (err) {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.config.colorError)
                            .setDescription(
                                `🚫 | Songs with ID not found: ${id}!`
                            ),
                    ],
                    ephemeral: true,
                });
            }
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
