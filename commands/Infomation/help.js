const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { stripIndent } = require("common-tags");
const { execute } = require("../Music/loop");

module.exports = {
    category: "Information",
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Hiển thị danh sách các command có trong bot")
        .addStringOption((option) =>
            option
                .setName("command")
                .setDescription("Tên command")
                .setRequired(false)
                .setAutocomplete(true)
        ),

    async autocomplete(interaction, client) {
        const focusedValue = interaction.options.getFocused();
        const choices = client.commands.map((c) => c.data.name);
        const filtered = choices.filter((choice) =>
            choice.startsWith(focusedValue)
        );
        await interaction.respond(
            filtered.map((choice) => ({ name: choice, value: choice }))
        );
    },

    async execute(interaction, client) {
        const command = interaction.options.get("command");
        if (command) {
            getCommand(client, interaction);
        } else {
            getAll(client, interaction);
        }
    },
};

const getAll = (client, interaction) => {
    const embed = new EmbedBuilder()
        .setAuthor({ name: `Danh sách các lệnh`, iconURL: client.user.displayAvatarURL() })
        .setColor(client.config.colorDefault)
        .setDescription(`> Tổng số lượng lệnh: ${client.commands.size}`)
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter({ text: ` Sửa dụng /help + tên lệnh để xem chi tiết!` })

    const categories = client.commands
        .map((c) => c.category)
        .filter((c, i, a) => a.indexOf(c) === i);
    categories.forEach((category) => {
        const commands = client.commands.filter((c) => c.category === category);
        embed.addFields({
            name: `> ${category}[${commands.size}] `,
            value: commands.map((c) => `\`\\${c.data.name}\``).join(" "),
        });
    });

    interaction.reply({ embeds: [embed] });
};

const getCommand = (client, interaction) => {
    const command = interaction.options.get("command");
    const commandData = client.commands.find(
        (c) => c.data.name === command.value
    );
    if (!commandData) {
        interaction.reply("Không tìm thấy command");
        return;
    }
    const embed = new EmbedBuilder()
        .setAuthor({ name: `Thông tin chi tiết về lệnh`, iconURL: client.user.displayAvatarURL() })
        .setTitle(`Thông tin về command \`${command.value}\``)
        .setColor(client.config.colorDefault)
        .setThumbnail(client.user.displayAvatarURL())
        .addFields(
            {
                name: "> Tên command",
                value: commandData.data.name,
                inline: true,
            },
            {
                name: "> Danh mục",
                value: commandData.category,
                inline: true,
            },
            {
                name: "> Mô tả",
                value: commandData.data.description,
                inline: true,
            }
        );
    interaction.reply({ embeds: [embed] });
};