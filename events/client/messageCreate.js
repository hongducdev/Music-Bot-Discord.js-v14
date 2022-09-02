const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "messageCreate",
    async execute (message) {
        let client = message.client;
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;
    },
};
