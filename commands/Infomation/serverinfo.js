const { EmbedBuilder, SlashCommandBuilder, ChannelType } = require("discord.js");

module.exports = {
    category: "Information",
    data: new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Gets information about the server"),

    async execute(interaction, client) {
        let boosts = interaction.guild.premiumSubscriptionCount;
        var boostlevel = 0;
        if (boosts >= 2) boostlevel = "1";
        if (boosts >= 7) boostlevel = "2";
        if (boosts >= 14) boostlevel = "3";

        const embed = new EmbedBuilder()
            .setColor(client.config.colorDefault)
            .setAuthor({
                name: `Server: ${interaction.guild.name}`,
                iconURL: client.user.displayAvatarURL(),
            })
            .setDescription(interaction.guild.description || "No description")
            .setThumbnail(interaction.guild.iconURL())
            .addFields(
                {
                    name: "> Name",
                    value: interaction.guild.name,
                    inline: true,
                },
                {
                    name: "> ID",
                    value: interaction.guild.id,
                    inline: true,
                },
                {
                    name: "> Boost",
                    value: `${boostlevel}[${boosts}]`,
                    inline: true,
                },
                {
                    name: "> Owner",
                    value: `${interaction.client.users.cache.get(
                        interaction.guild.ownerId
                    )}`,
                    inline: true,
                },
                {
                    name: "> Members",
                    value: `Totals: ${interaction.guild.memberCount}\nUsers: ${
                        interaction.guild.members.cache.filter(
                            (m) => !m.user.bot
                        ).size
                    }\nBot: ${
                        interaction.guild.members.cache.filter(
                            (m) => m.user.bot
                        ).size
                    }`,
                    inline: true,
                },
                {
                    name: "> Other",
                    value: `Roles: ${interaction.guild.roles.cache.size}\nEmojis: ${interaction.guild.emojis.cache.size}\n Stickers: ${interaction.guild.stickers.cache.size}`,
                    inline: true,
                },
                {
                    name: "> Channels",
                    value: `Category: ${
                        interaction.guild.channels.cache.filter(
                            (channel) =>
                                channel.type == ChannelType.GuildCategory
                        ).size
                    }\nText Channel: ${
                        interaction.guild.channels.cache.filter(
                            (channel) => channel.type == ChannelType.GuildText
                        ).size
                    }\nVoice Channel: ${
                        interaction.guild.channels.cache.filter(
                            (channel) => channel.type == ChannelType.GuildVoice
                        ).size
                    }\nStage: ${
                        interaction.guild.channels.cache.filter(
                            (channel) =>
                                channel.type == ChannelType.GuildStageVoice
                        ).size
                    }`,
                    inline: true,
                },
                {
                    name: "> Join Discord",
                    value: `<t:${parseInt(
                        interaction.guild.createdAt / 1000
                    )}:F>(<t:${parseInt(
                        interaction.guild.createdAt / 1000
                    )}:R>)`,
                    inline: true,
                }
            );

            interaction.reply({ embeds: [embed] });
    },
};
