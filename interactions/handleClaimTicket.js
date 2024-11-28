const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Function to handle the claim_ticket interaction
async function handleClaimTicket(interaction, hasClaimPermission) {
    try {
        // Check if the member has permission to claim
        const member = interaction.member;
        if (!hasClaimPermission(member)) {
            await interaction.reply({ content: 'You do not have the authority to take this action.', ephemeral: true });
            return;
        }

        let currentTime = new Date();
        currentTime.setHours(currentTime.getHours() + 1);

        const claimTicket = interaction.user;
        const startTimestamp = Math.floor(Date.now() / 1000) - 87;
        const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
        const egyptianDate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });

        // Send a confirmation message in the chat with embed
        const embed = interaction.message.embeds[0];
        const ticketOwnerField = embed.fields.find(field => field.name === 'Ticket Creator');
        const ticketOwnerValue = ticketOwnerField ? ticketOwnerField.value : 'Unknown';
        const ticketOwnerField2 = embed.fields.find(field => field.name === 'Ticket Department');
        const ticketOwnerValue2 = ticketOwnerField2 ? ticketOwnerField2.value : 'Unknown';
        const ticketOwnerField3 = embed.fields.find(field => field.name === 'Support Needed');
        const ticketOwnerValue3 = ticketOwnerField3 ? ticketOwnerField3.value : 'Unknown';

        const customEmbed = new MessageEmbed()
            .setTitle("> ✅ Support is now available")
            .setColor('#2c2c34')
            .setThumbnail(claimTicket.displayAvatarURL({ dynamic: true, size: 4096 }))
            .addFields(
                { name: '\u2003', value: '\u2003', inline: false },
                { name: 'Person ID', value: `\`${claimTicket.id}\``, inline: true },
                { name: 'Ticket Claim Date', value: `\`${egyptianDate2},${egyptianDate}\``, inline: true },
                { name: 'Support Needed', value: `${ticketOwnerValue3}`, inline: true },
                { name: 'Ticket Claimed By', value: `${claimTicket}`, inline: true },
                { name: 'Ticket Department', value: `\`${ticketOwnerValue2}\``, inline: true },
                { name: 'Ticket Claimed Since', value: `<t:${startTimestamp}:R>`, inline: true }
            );


        await interaction.channel.send({ content: `||${claimTicket} - ${ticketOwnerValue}||`, embeds: [customEmbed] });

        // Defer the interaction to prevent timeout
        await interaction.deferUpdate();

        // Send a confirmation message and edit the existing embed
        const fieldToUpdate = embed.fields.find(field => field.name === 'Ticket Claimed');
        if (fieldToUpdate) {
            fieldToUpdate.name = 'Ticket Claimed By'; // Update the name of the field
            fieldToUpdate.value = `${claimTicket}`; // Update the value of the field
        }

        await interaction.editReply({ embeds: [embed], ephemeral: true });

        // Disable the claim button to prevent further claims
        const components = interaction.message.components; // Get existing components
        const rowIdx = components.findIndex(row => row.components.some(component => component.customId === 'claim_ticket')); // Find the row index containing the claim button
        if (rowIdx !== -1) {
            const row = components[rowIdx];
            const buttons = row.components.map(component => { // Map over components to update claim button
                if (component.customId === 'claim_ticket') {
                    return new MessageButton()
                        .setCustomId('claim_ticket')
                        .setLabel('Ticker Claimed')
                        .setEmoji('🛡️')
                        .setStyle('SUCCESS') // Change button style to secondary (greyed out)
                        .setDisabled(true); // Disable the button
                } else {
                    return component;
                }
            });
            components[rowIdx] = new MessageActionRow().addComponents(...buttons); // Create a new row with updated buttons
            await interaction.editReply({ components });
        }

        // Prepare data to write to claim-data.json
        const claimData = {
            room_id: interaction.channelId,
            claim_user_id: claimTicket.id,
            claim_user_name: claimTicket.username,
            claim_date: `${egyptianDate2},${egyptianDate}`,
            ticket_name: ticketOwnerValue2 // Assuming ticketOwnerValue2 is the name of the ticket
        };

        // Write claimData to claim-data.json
        const claimDataPath = path.join(__dirname, '..', 'claim-data.json'); // Adjust the path as per your project structure
        fs.writeFileSync(claimDataPath, JSON.stringify(claimData, null, 2));

        console.log('Claim data saved successfully.');

    } catch (error) {
        console.error("Error handling claim ticket interaction: ", error);
    }
}

// Export the function to handle claim_ticket interaction
module.exports = {
    handleClaimTicket
};
