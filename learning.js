// Import the necessary modules
import { Client, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Listen for messages
client.on('messageCreate', message => {
  if (message.content === 'ping') {
    message.channel.send('pong');
  }
});

// Login to Discord with your app's token
client.login(process.env.TOKEN);