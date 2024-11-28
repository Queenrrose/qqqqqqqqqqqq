// interactions/addmem_kikmem.js

// Import necessary libraries
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

// Function to handle the addmem_kikmem interaction
async function handleAddMemKikMem(interaction, hasClaimPermission) {
    if (!hasClaimPermission(interaction.member)) {
        await interaction.reply({ content: 'You do not have permission to perform this action', ephemeral: true });
        return;
    }

    // Create the embed message
    const embed = new MessageEmbed()
        .setColor('#2c2c34')
        .setTitle('> Choose the action you want')
        .setDescription("- `Add Member` - Adds a specific member to the ticket using their ID\n- `Remove Member` - Removes a specific member from the ticket using their ID");

    // Send a message to choose the desired action
    await interaction.reply({
        embeds: [embed], ephemeral: true,
        components: [
            new MessageActionRow().addComponents(
                new MessageButton().setCustomId('remove-mem-button').setLabel('Remove Member').setStyle('DANGER').setEmoji('<:ejpic1026:1254328498668044331>'),
                new MessageButton().setCustomId('add_member').setLabel('Add Member').setStyle('SUCCESS').setEmoji('<:ejpic1029:1254328507799179305>')
            )
        ]
    });
}

// Export the function to handle the addmem_kikmem interaction
module.exports = {
    handleAddMemKikMem
};
