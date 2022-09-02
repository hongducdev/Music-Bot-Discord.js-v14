const { InteractionType } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const { commands } = client;
            const { commandName } = interaction;

            const command = commands.get(commandName);
            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.log(error);
                await interaction.reply({
                    content: `An error has occurred!\n\`\`\`${error}\`\`\``,
                    ephemeral: true,
                });
            }
        } else if (interaction.isButton()) {
            const { buttons } = client;
            const { customId } = interaction;
            const button = buttons.get(customId);

            if (!button) return;
            try {
                await button.execute(interaction, client);
            } catch (error) {
                console.log(error);
                await interaction.reply({
                    content: `An error has occurred!\n\`\`\`${error}\`\`\``,
                    ephemeral: true,
                });
            }
        } else if (interaction.isSelectMenu()) {
            const { selectMenus } = client;
            const { customId } = interaction;
            const selectMenu = selectMenus.get(customId);

            if (!selectMenu) return;
            try {
                await selectMenu.execute(interaction, client);
            } catch (error) {
                console.log(error);
                await interaction.reply({
                    content: `An error has occurred!\n\`\`\`${error}\`\`\``,
                    ephemeral: true,
                });
            }
        } else if (interaction.isContextMenuCommand()) {
            const { commands } = client;
            const { commandName } = interaction;

            const contextCommand = commands.get(commandName);
            if (!contextCommand) return;

            try {
                await contextCommand.execute(interaction, client);
            } catch (error) {
                console.log(error);
                await interaction.reply({
                    content: `An error has occurred!\n\`\`\`${error}\`\`\``,
                    ephemeral: true,
                });
            }
        } else if (
            interaction.type === InteractionType.ApplicationCommandAutocomplete
        ) {
            const { commands } = client;
            const { commandName } = interaction;

            const command = commands.get(commandName);
            if (!command) return;

            try {
                await command.autocomplete(interaction, client);
            } catch (error) {
                console.log(error);
                await interaction.reply({
                    content: `An error has occurred!\n\`\`\`${error}\`\`\``,
                    ephemeral: true,
                });
            }
        }
    },
};
