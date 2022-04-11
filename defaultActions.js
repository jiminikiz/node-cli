export const DefaultActions = {
  'Go Fish!': (cli) => {
    cli.spinner.start('Reeling in the line...');
    setTimeout(() => {
      cli.spinner.stop();
      cli.log.success(">><((((('>");
      cli.restart();
    }, 2000);
  },
  'Fetch me Exaclibur!': (cli) => {
    cli.spinner.start('Removing the sword from the stone...');
    setTimeout(() => {
      cli.spinner.stop();
      cli.log.success('@xxx[{::::::::::>');
      cli.restart();
    }, 2500);
  },
  'Which came first, the chicken or the egg?': (cli) => {
    cli.spinner.start('Thinking....');
    setTimeout(() => {
      cli.spinner.stop();
      cli.log.success('¯\\_(ツ)_/¯');
      cli.restart();
    }, 3000);
  },
  'Squares.': (cli) => {
    cli.input('Enter a number:', (userInput) => {
      return !isNaN(Number(userInput)) ? true : false;
    }).then((input) => {
      let number = Number(input.action);
      cli.log.success(`The square of ${number} is ${Math.pow(number,2)}.`);
      cli.restart();
    }).catch(console.error);
  },
  'Exit.': (cli) => {
    cli.confirm('Are you sure you wanna exit the program?')
      .then((input) => input.confirm? cli.quit() : cli.start());
  }
}

export default DefaultActions