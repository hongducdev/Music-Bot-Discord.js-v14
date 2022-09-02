const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const {
    ButtonStyle,
    ChannelType,
    InviteTargetType
} = require ("discord-api-types/v10");

module.exports = {
    category: "Activities",
    data: new SlashCommandBuilder()
        .setName("activity")
        .setDescription("Sets the bot's activity")
        .addStringOption((option) =>
            option
                .setName("activity")
                .setDescription("The activity to set")
                .setRequired(true)
                .addChoices(
                    {
                        name: "youtube",
                        value: "880218394199220334",
                    },
                    {
                        name: "poker",
                        value: "755827207812677713",
                    },
                    {
                        name: "betrayal",
                        value: "773336526917861400",
                    },
                    {
                        name: "fishing",
                        value: "814288819477020702",
                    },
                    {
                        name: "chess",
                        value: "832012774040141894",
                    },
                    {
                        name: "lettertile",
                        value: "879863686565621790",
                    },
                    {
                        name: "wordsnack",
                        value: "879863976006127627",
                    },
                    {
                        name: "doodlecrew",
                        value: "878067389634314250",
                    },
                    {
                        name: "awkword",
                        value: "879863881349087252",
                    },
                    {
                        name: "spellcast",
                        value: "852509694341283871",
                    },
                    {
                        name: "checkers",
                        value: "832013003968348200",
                    },
                    {
                        name: "puttparty",
                        value: "763133495793942528",
                    },
                    {
                        name: "sketchyartist",
                        value: "879864070101172255",
                    }
                )
        ),

    async execute(interaction, client) {
        const voiceChannel = interaction.member.voice.channel;
        const choose = interaction.options.getString("activity");
        console.log(choose);
        if (!voiceChannel) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.colorError)
                        .setAuthor({
                            name: "Error",
                            iconURL: client.user.avatarURL(),
                        })
                        .setDescription(
                            "You need to join a voice channel to use this command!"
                        ),
                ],
                ephemeral: true,
            });
        }
        const invite = await voiceChannel
            .createInvite({
                maxAge: 86400,
                maxUses: 0,
                unique: true,
                targetApplication: choose,
                targetType: InviteTargetType.EmbeddedApplication,
            })
            .then((invite) => {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.config.colorDefault)
                            .setAuthor({
                                name: "Activity Invite",
                                iconURL: client.user.avatarURL(),
                            })
                            .setDescription(
                                `Link to join the activity **${choose.name}**: [Link](${invite.url})`
                            ),
                    ],
                });
            })
            .catch((err) => {
                console.log(err);
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.config.colorError)
                            .setAuthor({
                                name: "Error",
                                iconURL: client.user.avatarURL(),
                            })
                            .setDescription(
                                "An error occurred while creating the invite!"
                            ),
                    ],
                    ephemeral: true,
                });
            });
    },
};
