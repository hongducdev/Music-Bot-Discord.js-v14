const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js');

module.exports = {
    category: "Context Menu",
    data: new ContextMenuCommandBuilder()
        .setName('Get Avatar')
        .setType(ApplicationCommandType.User),

    execute: async (interaction, client) => {
        const target = await interaction.guild.members.fetch(
            interaction.targetId
        );
        const serverAvatar =
            target.avatar &&
            `https://cdn.discordapp.com/guilds/${interaction.guild.id}/users/${target.id}/avatars/${target.avatar}.png?size=512`;
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `Avatar`,
                iconURL: client.user.displayAvatarURL(),
            })
            .setDescription(`> 📦 | ${target.displayName}[\`${target.id}\`]`)
            .setImage(
                serverAvatar ||
                    target.user.displayAvatarURL({ dynamic: true, size: 1024 })
            )
            .setColor(target.displayHexColor)
            .setFooter({
                text: `Request by: ${interaction.member.displayName}`,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp();
        if (serverAvatar) {
            embed.setThumbnail(
                target.user.displayAvatarURL({ dynamic: true, size: 512 })
            );
        }

        await interaction.reply({ embeds: [embed] });
    }
}