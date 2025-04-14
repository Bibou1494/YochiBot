import { REST, Routes } from 'discord.js';
import 'dotenv/config';

const commands = [
  {
    name: 'dev',
    description: 'A propos du développeur du bot',
    },
    {
      name: 'status',
      description: 'Test d\'operationnalité du bot'
    },
    {
    name: 'embed',
    description: 'Envoie un embed personnalisé. COMMANDE RESERVEE AU ADMIN',
    options: [
      {
        type: 3,
        name: 'title',
        description: 'Le titre de l\'embed',
        required: true,
      },
      {
        type: 3,
        name: 'description',
        description: 'La description de l\'embed',
        required: true, // Le code secret est obligatoire
      },
      {
        type: 4,
        name: 'color',
        description: 'Couleur de la barre de l\'embed',
        required: false,
      }
    ],
  }
  ];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationCommands(process.env.CLIENTID), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}