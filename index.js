import ora from 'ora'
import yargs from 'yargs';
import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import inquirer from 'inquirer';
// import clui from 'clui'

const defaults = {
  font: 'ANSI Shadow',
  color: '#FFFFFF', // purple
  title: 'CLI Wizard',
  caption: '',
  errorMessage: 'Unknown Error!',
  restartMessage: 'Would you like to perform another action?',
  exitMessage: '👋 Venture forth and be awesome! 👋',
  // TODO: redefine CLI args
  args: {}, // yargs.option('verbose', { alias: 'v', default: false }).argv,
  actions: {
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
};

class CLI {
  constructor(options = {}) {
    this.spinner = new ora();
    this.args = options.argv || defaults.args;
    this.font = options.font || defaults.font;
    this.title = options.title || defaults.title;
    this.color = options.color || defaults.color;
    this.actions = options.actions || defaults.actions;
    this.caption = options.caption || defaults.caption;
    this.endOnError = options.endOnError || defaults.endOnError;
    this.verbose = this.args.verbose || options.verbose || false;
    this.mode = (this.verbose ? `Mode: ${chalk.blue('VERBOSE')} |`: '');

    this.messages = {
      onError : options.errorMessage || defaults.errorMessage,
      onExit: options.exitMessage || defaults.exitMessage,
      onRestart: options.restartMessage || defaults.restartMessage
    };
    
    this.header = chalk
      .hex(this.color)
      .bold(
        figlet.textSync(this.title, {
          //font: 'Larry 3D'
          //font: 'Stronger Than All'
          font: this.font
        }).trimRight()
      );

    this.log = {
      verbose : (message) => this.verbose && console.info(chalk.blue('VERBOSE:'), message),
      info    : (message) => console.info(chalk.blue('INFO:'), message),
      warning : (message) => console.warn(chalk.yellow('WARNING:'), message),
      error   : (message) => console.error(chalk.bgRed.black('ERROR:'), chalk.red(message || this.messages.onError)),
      success : (message) => console.log(chalk.green('SUCCESS:'), message)
    };

    this.print = {
      separator: (length = 80) => '─'.repeat(length),
      header: () => {
        console.log('\n');
        console.log(this.header);
        console.log(this.print.separator());
        console.log(this.mode, this.caption);
        console.log(this.print.separator());
      },
      actions: () => {
        return this.select(
          'Select an action:',
          Object.keys(this.actions)
        ).then((response) => this.actions[response.action](this));
      }
    };
  }
  register(action) {
    this.actions[action.name] = action.handler;
  }
  clear() {
    return clear();
  }
  error(e) {
    this.log.error(e.message);

    if(this.verbose) {
      console.error(e.stack);
    }

    this.restart();
  }
  input(message, validate) {
    return inquirer.prompt({
      type: 'input',
      name: 'action',
      message,
      validate
    }).catch(this.error);
  }
  confirm(message) {
    return inquirer.prompt({
      type: 'confirm',
      name: 'confirm',
      message
    }).catch(this.error);
  }
  select(message, choices) {
    return inquirer.prompt({
      type: 'rawlist',
      name: 'action',
      message,
      choices
    }).catch(this.error);
  }
  start() {
    this.clear();
    this.print.header();
    this.print.actions();
  }
  restart(message) {
    this.confirm(message || this.messages.onRestart)
      .then((input) => input.confirm? this.start() : this.quit());
  }
  quit(message) {
    this.log.success(message || this.messages.onExit);
    process.exitCode = 1;
  }
}

export default CLI;
