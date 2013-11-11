'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var request = require('request');
var cheerio = require('cheerio');

// Helper functions
var getMinnPostResources = function(done) {
  var url = 'http://minnpost.com/data';
  console.log('Retrieving CSS/JS resource from MinnPost site to include in template.');

  request(url, function(err, resp, body) {
    var resources = {};
    var $ = cheerio.load(body);

    $('html head link[type="text/css"]').each(function(i, elem) {
      resources.css = resources.css || [];
      resources.css.push($(elem).clone().parent().html());
    });

    $('html head script[type="text/javascript"]').each(function(i, elem) {
      resources.js = resources.js || [];
      resources.js.push($(elem).clone().parent().html());
    });

    done(resources);
  });
};

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
  var prompts = [];
  var defaultBowerComponents = 'jquery#~1.9 underscore#~1.5.2 backbone#~1.1.0 ractive#~0.3.7 ractive-backbone#~0.1.0 unsemantic';
  var separators = { bowerComponents: '#', nodeModules: '@', rubyGems: '@', pythonDependencies: '@'};
  var validateRequired = function(input) {
    return (input) ? true : 'Please provide a value';
  };

  // Yeoman greet the user.
  console.log(this.yeoman);

  // See inquirer.js for how prompt works
  // https://github.com/SBoudrias/Inquirer.js

  // Name of project
  directory = (directory.indexOf('minnpost-') !== 0) ? 'minnpost-' + directory : directory;
  prompts.push({
    type: 'input',
    name: 'projectName',
    message: 'The name of the project, usually in the form of "minnpost-sweet-app":',
    default: directory,
    validate: function(input) {
      return (input.indexOf('minnpost-') === 0) ? true : 'Please prefix your application with "minnpost-"';
    }
  });
  // Title of project
  prompts.push({
    type: 'input',
    name: 'projectTitle',
    message: 'The title of the project, something like MinnPost Sweetness:',
    validate: validateRequired,
    default: function(props) {
      return props.projectName.replace(/-/g, ' ').replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    },
  });
  // Description of project
  prompts.push({
    type: 'input',
    name: 'projectDescription',
    message: 'A short description of the project:',
    validate: validateRequired,
    default: ''
  });
  // Project defaults
  prompts.push({
    type: 'confirm',
    name: 'projectDefaults',
    message: 'The whole kitten caboodle (sass, compass, default bower components, etc):',
    default: true
  });
  // If not project defaults
  prompts.push({
    type: 'checkbox',
    name: 'projectPrerequisites',
    message: 'Preqequisite technologies that are needed:',
    choices: [
      { name: 'SASS', value: 'useSass' },
      { name: 'Compass', value: 'useCompass' },
      { name: 'Python', value: 'usePython' },
      { name: 'Ruby', value: 'useRuby' }
    ],
    when: function(props) {
      return !props.projectDefaults;
    }
  });
  // Bower libraries
  prompts.push({
    type: 'input',
    name: 'bowerComponents',
    message: 'Bower components, something like library#1.2.3 other#~1.2.3:',
    default: defaultBowerComponents,
    when: function(props) {
      return !props.projectDefaults;
    }
  });
  // Node libraries
  prompts.push({
    type: 'input',
    name: 'nodeModules',
    message: 'Node modules, something like library@1.2.3 other@~1.2.3:',
    default: '',
    when: function(props) {
      return !props.projectDefaults;
    }
  });
  // Ruby libraries
  prompts.push({
    type: 'input',
    name: 'rubyGems',
    message: 'Ruby gems, something like library@1.2.3 other@~>1.2.3:',
    default: '',
    when: function(props) {
      return !props.projectDefaults && props.projectPrerequisites.indexOf('useRuby') >= 0;
    }
  });
  // Python libraries
  prompts.push({
    type: 'input',
    name: 'pythonDependencies',
    message: 'Python dependencies, something like library@==1.2.3 other@>=1.2.3:',
    default: '',
    when: function(props) {
      return !props.projectDefaults && props.projectPrerequisites.indexOf('usePython') >= 0;
    }
  });
  // Features
  prompts.push({
    type: 'checkbox',
    name: 'projectFeatures',
    message: 'Sets of features',
    choices: [
      { name: 'Maps', value: 'hasMaps' },
      { name: 'Dates', value: 'hasDates' },
      { name: 'Form inputs', value: 'hasInputs' },
      { name: 'Sticky horizontal menu', value: 'hasHMenu' }
      // Sticky menu (vertical)
    ]
  });

  // Call prompt
  this.prompt(prompts, function(props) {
    var i;
    var thisYeoman = this;

    // Change choice list to objects
    ['projectPrerequisites', 'projectFeatures'].forEach(function(p) {
      var newProp = {};
      if (props[p] !== undefined) {
        props[p].forEach(function(v) {
          newProp[v] = true;
        });
        props[p] = newProp;
      }
    });

    // Handle the defualt prop
    if (props.projectDefaults === true) {
      props.projectPrerequisites = {
        useSass: true,
        useCompass: true
      }
      props.bowerComponents = defaultBowerComponents;
    }

    // Handle project features
    if (props.projectFeatures['hasMaps'] === true) {
      // Attach leaflet
      props.bowerComponents += ' leaflet#~0.6.4';
    }
    if (props.projectFeatures['hasDates'] === true) {
      // Attach moment
      props.bowerComponents += ' moment#~2.4.0';
    }
    if (props.projectFeatures['hasInputs'] === true) {
      // Attach placeholder.js
      props.bowerComponents += ' Placeholders.js#~3.0.1';
    }
    if (props.projectFeatures['hasHMenu'] === true) {
      // Attach sticky menu
      props.bowerComponents += ' sticky-kit#~1.0.1';
    }

    // Process library fields into a real object for
    // templates
    for (i in separators) {
      var dependencies = [];
      props[i] = (props[i] !== undefined) ? props[i].trim() : '';
      props[i].split(' ').forEach(function(l) {
        if (l.split(separators[i])[0]) {
          dependencies.push({
            name: l.split(separators[i])[0],
            version: (l.split(separators[i])[1]) ? l.split(separators[i])[1] : '*'
          });
        }
      });
      props[i] = dependencies;
    }

    // Attach all inputs so that they can be referenced in
    // templates.
    for (i in props) {
      this[i] = props[i];
    }

    // Get the MinnPost resources for putting into templates
    getMinnPostResources(function(resources) {
      thisYeoman.minnpostResources = resources;
      done();
    });
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

// Process README
MinnpostApplicationGenerator.prototype.readme = function readme() {
  this.template('_README.md', 'README.md');
};

// Process LICENSE
MinnpostApplicationGenerator.prototype.license = function license() {
  this.copy('LICENSE.txt', 'LICENSE.txt');
};

// Process data and data processing
MinnpostApplicationGenerator.prototype.data = function data() {
  this.mkdir('data');
  this.mkdir('data-processing');
};

// Process python
MinnpostApplicationGenerator.prototype.python = function python() {
  if (this.projectPrerequisites.usePython) {
    this.template('_requirements.txt', 'requirements.txt');
  }
};

// Process ruby
MinnpostApplicationGenerator.prototype.ruby = function ruby() {
  if (this.projectPrerequisites.useRuby) {
    this.template('_Gemfile', 'Gemfile');
  }
};

// Process styling
MinnpostApplicationGenerator.prototype.styles = function styles() {
  if (this.projectPrerequisites.useSass || this.projectPrerequisites.useCompass) {
    this.mkdir('sass');
  }
  else {
    this.mkdir('css');
  }
};

// Process javascript application stuff
MinnpostApplicationGenerator.prototype.app = function app() {
  this.mkdir('js');
  this.mkdir('js/templates');

  this.template('_package.json', 'package.json');
  this.template('_bower.json', 'bower.json');
};
