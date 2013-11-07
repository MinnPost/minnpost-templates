'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

// Generator object
var MinnpostApplicationGenerator = module.exports = function MinnpostApplicationGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({
      skipInstall: options['skip-install'],
      skipMessage: options['skip-install-message']
    });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

// Inherit from Yeoman
util.inherits(MinnpostApplicationGenerator, yeoman.generators.Base);

// Ask for steps
MinnpostApplicationGenerator.prototype.askFor = function askFor() {
  var done = this.async();
  var directory = process.cwd().split('/')[process.cwd().split('/').length - 1];
  var title = directory.replace(/-/g, ' ').replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
  var prompts = [];

  // Yeoman greet the user.
  console.log(this.yeoman);

  // Name of project
  prompts.push({
    type: 'input',
    name: 'projectName',
    message: 'The name of the project, usually in the form of "minnpost-sweet-app"',
    default: directory,
    validate: function(input) {
      return (input.indexOf('minnpost-') === 0) ? true : 'Please prefix your application with "minnpost-"';
    }
  });
  // Title of project
  prompts.push({
    type: 'input',
    name: 'projectTitle',
    message: 'The title of the project, something like MinnPost Sweetness',
    default: title,
  });
  // Description of project
  prompts.push({
    type: 'input',
    name: 'projectDescription',
    message: 'A short description of the project',
    default: title,
  });

  // Call prompt
  this.prompt(prompts, function(props) {
    var i;
    var thisYeoman = this;

    // Attach all inputs
    for (i in props) {
      this[i] = props[i];
    }
    done();
  }.bind(this));
};

// Process git files
MinnpostApplicationGenerator.prototype.git = function git() {
  this.copy('gitignore', '.gitignore');
};

// Process project files
MinnpostApplicationGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};

// Process application
MinnpostApplicationGenerator.prototype.app = function app() {
  this.mkdir('app');
  this.mkdir('app/templates');

  this.copy('_package.json', 'package.json');
  this.copy('_bower.json', 'bower.json');
};
