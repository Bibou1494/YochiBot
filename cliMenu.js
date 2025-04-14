const { spawn } = require('child_process');
const { Select } = require('enquirer');

const prompt = new Select({
  name: 'choice',
  message: 'CLI Menu:',
  choices: [
    'Run main.mjs',
    'Run register.mjs'
  ]
});

prompt.run()
  .then(answer => {
    let script;
    switch (answer) {
      case 'Run main.mjs':
        script = spawn('node', ['main.mjs']);
        break;
      case 'Run register.mjs':
        script = spawn('node', ['command register.mjs']);
        break;
      default:
        console.log('Invalid choice.');
        return;
    }

    script.stdout.on('data', data => {
      console.log(`${data}`);
    });

    script.stderr.on('data', data => {
      console.error(`${data}`);
    });

    script.on('close', code => {
      console.log(`Child process exited with code ${code}`);
    });
  })
  .catch(console.error);