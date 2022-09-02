const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    category: "Music",
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("See the list of songs in the queue!"),

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

        const q = queue.songs
            .map(
                (song, i) =>
                    `${i === 0 ? "Playing:" : `${i}.`} ${song.name} - \`${
                        song.formattedDuration
                    }\``
            )
            .join("\n");

        const tracks = queue.songs.map(
            (song, i) => `**${i + 1}** - [${song.name}](${song.url}) | ${
                song.formattedDuration
            }
        Request by: ${song.user}`
        );

        const songs = queue.songs.length;
        const nextSongs =
            songs > 10
                ? `And **${songs - 10}** songs...`
                : `Playlist **${songs}** songs...`;

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.colorDefault)
                    .setAuthor({
                        name: "Queue",
                        iconURL: client.user.displayAvatarURL(),
                    })
                    .setDescription(
                        `${tracks.slice(0, 10).join("\n")}\n\n${nextSongs}`
                    )
                    .addFields([
                        {
                            name: "> Playing:",
                            value: `[${queue.songs[0].name}](${queue.songs[0].url}) - ${queue.songs[0].formattedDuration} | Request by bởi: ${queue.songs[0].user}`,
                            inline: true,
                        },
                        {
                            name: "> Total times:",
                            value: `${queue.formattedDuration}`,
                            inline: true,
                        },
                        {
                            name: "> Total songs:",
                            value: `${songs}`,
                            inline: true,
                        },
                    ]),
            ],
        });
    },
};
