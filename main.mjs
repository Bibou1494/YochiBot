import { Client, Events, GatewayIntentBits, PermissionsBitField, ChannelType } from 'discord.js';
import 'dotenv/config';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.displayName}!`);

  // Define Rich Presence activities
  const activities = [
    {
      name: 'les vidéos de @yochi160',
      type: 3
    },
    {
      name: 'Modère le serveur',
      type: 0
    }
  ];

  let currentActivity = 0;

  // Function to update Rich Presence
  const updatePresence = () => {
    readyClient.user.setPresence({
      activities: [activities[currentActivity]],
      status: 'online',
    });
    currentActivity = (currentActivity + 1) % activities.length;
  };

  // Update Rich Presence every 5 seconds
  updatePresence();
  setInterval(updatePresence, 5000);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'dev') {
    console.log('Developer command detected, replying with developer information...');
    await interaction.reply('Le developpeur de ce bot est <@1202607585136476185>, son GitHub avec tout ses projet un peu farfelu est https://github.com/Bibou1494');
    console.log('Successfully replied with developer information command message');
    }
  
  if (interaction.commandName === 'status') {
    console.log('Status command detected, replying with status information...');
    await interaction.reply('Test d\'operationnalité du bot reussi le bot marche maintenant, allez laisse moi maintenant.');
    console.log('Successfully replied with status information command message');
  }

  if (interaction.commandName === 'embed') {

    await interaction.deferReply({ ephemeral: true });

    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const color = interaction.options.getInteger('color'); // Retrieve as an integer

    setTimeout(async () => {
        const channel = await client.channels.fetch(interaction.channelId); // Fetch the channel object
        if (channel) {
            await channel.send({
                content: `Envoyé par <@${interaction.user.id}>`,
                embeds: [
                    {
                        color: color,
                        title: title,
                        description: description,
                    }
                ]
            });
            await interaction.followUp({ content: "✅ Embed envoyé avec succès !" });
        } else {
            await interaction.followUp({ content: "❌ Erreur : Impossible d'envoyer l'embed en DM.", ephemeral: true });
        }
    }, 3000);
}
});

client.on(Events.MessageCreate, async message => {
  if (message.author.bot) return; // Ignore bot messages
  const channelName = message.channel.name || 'DM'; // Get the channel name or 'DM' if it's a direct message
  const serverName = message.guild ? message.guild.name : 'DM'; // Get the server name or 'DM' if it's a direct message
  console.log(`Received message in #${channelName} on ${serverName} by ${message.author.displayName}: ${message.content}`); // Log the received message content with channel name and server name

  // Check if the message content is empty
  if (!message.content) {
    console.log('Message content is empty, skipping...');
    return;
  }

  const greetings = ['bonjour', 'salut', 'yo', 'coucou', 'slt', 'cc', 'bjr', 'bonsoir', 'bonjoir'];
  const greetingRegex = new RegExp(`\\b(${greetings.join('|')})\\b`, 'i');
  if (greetingRegex.test(message.content)) {
    console.log('Greeting detected, reacting with 👋');
    message.react('👋')
      .then(() => console.log('Reacted with 👋'))
      .catch(error => console.error('Failed to react with 👋:', error));
  }
  if (message.content.toLowerCase().includes('kakou kakou')) {
    console.log('Special phrase detected, reacting with 🤬');
    message.react('🤬')
      .then(() => console.log('Reacted with 🤬'))
      .catch(error => console.error('Failed to react with 🤬:', error));
  }

  const bannable = ['ta mer', 'ta mere', 'ta mère', 'ta gueule', 'tg', 'fdp', 'connard', 'salope', 'pute', 'enculé', 'fils de pute', 'encule', 'enculer', 'enfoiré', 'enfoire', 'enfoirée', 'enfoirer', 'batard', 'bâtard', 'batar']; // Add more banned words here
  const bannableRegex = new RegExp(`\\b(${bannable.join('|')})\\b`, 'i');
  if (bannableRegex.test(message.content)) {
    console.log('Bannable content detected, deleting message...');
    try {
      await message.delete();
      console.log('Deleted message');
      console.log('Timing out user...');
      await message.member.timeout(28 * 24 * 60 * 60 * 1000, 'Propos inapproprié'); // 28 days in milliseconds
      console.log(`Timed out user ${message.author.tag} for inappropriate content`);

      // Check if a channel with the name `timeout-${message.author.username}` already exists
      let channel = message.guild.channels.cache.find(ch => ch.name === `timeout-${message.author.username}`);
      if (!channel) {
        // Create a new channel
        channel = await message.guild.channels.create({
          name: `timeout-${message.author.username}`,
          type: ChannelType.GuildText,
          permissionOverwrites: [
            {
              id: message.guild.id,
              deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
              id: message.author.id,
              allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory],
              deny: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AddReactions, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.UseExternalEmojis, PermissionsBitField.Flags.MentionEveryone, PermissionsBitField.Flags.UsePublicThreads, PermissionsBitField.Flags.UsePrivateThreads, PermissionsBitField.Flags.UseExternalStickers, PermissionsBitField.Flags.SendTTSMessage, PermissionsBitField.Flags.react],
            },
          ],
        });
      }

      // Send a message in the channel
      await channel.send({
        embeds: [
          {
            title: "❌ Sanction",
            description: `<@${message.author.id}> Vous avez été mis en timeout pendant 28 jours pour propos inapproprié`,
            color: 16711680,
            fields: []
          }
        ]
      });
    } catch (error) {
      console.error('Failed to delete message or timeout user:', error);
    }
  }
});

client.login(process.env.TOKEN);
