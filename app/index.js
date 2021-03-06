'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');

// Helper functions
var getMinnPostResources = function(done) {
  var url = 'http://minnpost.com/data';
  console.log('Retrieving CSS/JS resource from MinnPost site to include in template.');

  request(url, function(err, resp, body) {
    var resources = {};
    var $ = cheerio.load(body);

    $('html head link[type="text/css"]').each(function(i, elem) {
      resources.css = resources.css || [];
      resources.css.push($.html($(elem)));
    });

    $('html head script[type="text/javascript"]').each(function(i, elem) {
      resources.js = resources.js || [];
      resources.js.push($.html($(elem)));
    });

    done(resources);
  });
};

// Generator object
var MinnpostApplicationGenerator = module.exports = function MinnpostApplicationGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    // Manually install bower and npm to use force on bower
    this.bowerInstall(null, { force: true });
    this.npmInstall(null, null);

    /*
    this.installDependencies({
      skipInstall: options['skip-install'],
      skipMessage: options['skip-install-message'],
      callback: function() {

      }.bind(this)
    });
    */
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
  var separators = { bowerComponents: '#', nodeModules: '@', rubyGems: '@', pythonDependencies: '@' };
  var validateRequired = function(input) {
    return (input) ? true : 'Please provide a value';
  };

  // Bower map is a map of packages and paths to the resources we will be
  // using.  This will be attached to the bower.json for the project
  // so that it can be tracked as well.
  var componentMap = JSON.parse(this.readFileAsString(path.join(__dirname, 'bower-map.json')));

  // Yeoman greet the user.
  console.log(this.yeoman);

  // See inquirer.js for how prompt works
  // https://github.com/SBoudrias/Inquirer.js

  // Name of project
  directory = (directory.indexOf('minnpost-') !== 0) ? 'minnpost-' + directory : directory;
  prompts.push({
    type: 'input',
    name: 'projectName',
    message: 'The name of the project.  This should be all lowercase, start with minnpost, use dashes for spaces, and be unique across all projects (ex. minnpost-sweet-app):',
    default: directory,
    validate: function(input) {
      return (input.indexOf('minnpost-') === 0) ? true : 'Please prefix your application with "minnpost-"';
    }
  });
  // Title of project
  prompts.push({
    type: 'input',
    name: 'projectTitle',
    message: 'The title of the project (ex. MinnPost Sweetness):',
    validate: validateRequired,
    default: function(props) {
      return props.projectName.replace(/-/g, ' ').replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }
  });
  // Description of project
  prompts.push({
    type: 'input',
    name: 'projectDescription',
    message: 'A short description of the project:',
    validate: validateRequired,
    default: ''
  });
  // Features
  prompts.push({
    type: 'checkbox',
    name: 'projectFeatures',
    message: 'Application features (will include necessary libraries):',
    choices: [
      { name: 'Complex modeling', value: 'hasModeling' },
      { name: 'Leaflet map', value: 'hasLeaflet' },
      { name: 'Mapbox map', value: 'hasMapbox' },
      { name: 'Datatable', value: 'hasDatatables' },
      { name: 'CSV', value: 'hasCSVs' },
      { name: 'Highcharts', value: 'hasHighcharts' },
      { name: 'Dates', value: 'hasDates' },
      { name: 'Form inputs', value: 'hasInputs' },
      { name: 'Navigation menu', value: 'hasNav' },
      { name: 'Ractive', value: 'hasRactive', checked: true }
    ]
  });
  // Technologies needed
  prompts.push({
    type: 'checkbox',
    name: 'projectPrerequisites',
    message: 'Preqequisite technologies that are needed (Node and Bower assumed):',
    choices: [
      { name: 'Compass', value: 'useCompass', checked: true },
      { name: 'Python', value: 'usePython' },
      { name: 'Ruby', value: 'useRuby' }
    ]
  });
  // Bower libraries
  prompts.push({
    type: 'input',
    name: 'bowerComponents',
    message: 'Other Bower components (ex. library#1.2.3):',
    default: ''
  });
  // Node libraries
  prompts.push({
    type: 'input',
    name: 'nodeModules',
    message: 'Node modules (ex. library@1.2.3 other@~1.2.3):',
    default: ''
  });
  // Ruby libraries
  prompts.push({
    type: 'input',
    name: 'rubyGems',
    message: 'Ruby gems (ex. library@1.2.3 other@~>1.2.3):',
    default: '',
    when: function(props) {
      return !props.projectDefaults && props.projectPrerequisites.indexOf('useRuby') >= 0;
    }
  });
  // Python libraries
  prompts.push({
    type: 'input',
    name: 'pythonDependencies',
    message: 'Python dependencies (ex. library@==1.2.3 other@>=1.2.3):',
    default: '',
    when: function(props) {
      return !props.projectDefaults && props.projectPrerequisites.indexOf('usePython') >= 0;
    }
  });
  // Include examples
  prompts.push({
    type: 'confirm',
    name: 'includeExamples',
    message: 'Include examples for features:',
    default: 'y'
  });

  // Call prompt
  this.prompt(prompts, function(props) {
    var i;
    var thisYeoman = this;
    var bowerFeatureMap = {};
    var components;

    // Change choice list to objects
    ['projectPrerequisites', 'projectFeatures'].forEach(function(p) {
      var newProp = {};
      if (props[p] !== undefined) {
        props[p].forEach(function(v) {
          newProp[v] = true;
        });
        props[p] = newProp;
      }
      else {
        props[p] = {};
      }
    });

    // Handle project features.  There are bower components to install,
    // as well as extra components that are sub components of others.
    bowerFeatureMap = {
      'hasLeaflet': {
        lib: 'leaflet#~0.7.3',
        extras: 'mpMaps'
      },
      'hasMapbox': {
        // 2.x has some odd issue of not allowing JSONP but the Mapbox
        // API still uses it ??
        lib: 'mapbox.js#~1.6.4',
        extras: 'mpMaps'
      },
      'hasDatatables': {
        lib: 'datatables#~1.10.2',
        extras: 'mpDatatables'
      },
      'hasNav': {
        extras: 'mpNav'
      },
      'hasCSVs': { lib: 'jquery-csv#*' },
      'hasHighcharts': {
        lib: 'highcharts.com#~4.0.4',
        extras: 'mpHighcharts'
      },
      'hasDates': { lib: 'moment#~2.8.3' },
      'hasInputs': { lib: 'Placeholders.js#~3.0.2' },
      'hasRactive': { lib: 'ractive#~0.5.6 ractive-events-tap#~0.1.1 ractive-backbone#~0.1.1' }
    };
    // List of components to install
    _.each(props.projectFeatures, function(p, pi) {
      props.bowerComponents += (p === true && bowerFeatureMap[pi] && bowerFeatureMap[pi].lib) ?
        ' ' + bowerFeatureMap[pi].lib : '';
    });
    // List of components to include but not install (multiple includes per library)
    props.bowerComponentsInclude = '';
    _.each(props.projectFeatures, function(p, pi) {
      props.bowerComponentsInclude += (p === true && bowerFeatureMap[pi] && bowerFeatureMap[pi].extras) ?
        ' ' + bowerFeatureMap[pi].extras : '';
    });

    // Add constant dependencies
    props.bowerComponents += ' requirejs#~2.1.15 almond#~0.3.0 text#~2.0.12 underscore#~1.7.0 jquery#~1.11.1 backbone#~1.1.2 rgrove-lazyload minnpost-styles#master';
    // Add constant includes
    props.bowerComponentsInclude += ' mpConfig mpFormatters';

    // Process library fields into a real object for templating
    _.each(separators, function(s, prop) {
      var dependencies = [];
      props[prop] = (props[prop] !== undefined) ? props[prop].trim() : '';
      props[prop].split(' ').forEach(function(l) {
        if (l.split(s)[0] && l.split(s)[0] !== undefined) {
          dependencies.push({
            name: l.split(s)[0],
            version: (l.split(s)[1]) ? l.split(s)[1] : '*'
          });
        }
      });
      props[prop] = dependencies;
    });

    // Add componenet map to props and and provide filtered version
    // of the map for inclusion (this combines installed and extra libs).
    // Note that this is combined in this way to preserve order which is
    // important for our build process.
    var components = _.union(_.pluck(props.bowerComponents, 'name'), props.bowerComponentsInclude.trim().split(' '));
    props.componentMap = componentMap;
    props.filteredComponentMap = {};
    _.each(props.componentMap, function(c, ci) {
      if (components.indexOf(ci) !== -1) {
        props.filteredComponentMap[ci] = c
      }
    });

    // Determine what kind of templates we are using
    props.templateExt = (props.projectFeatures.hasRactive === true) ? 'mustache' : 'underscore';

    // Make a server port
    props.serverPort = 8800 + Math.floor(Math.random() * 100);

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
  this.mkdir('data/original');
  this.mkdir('data/build');
  this.mkdir('data/processing');

  if (this.projectFeatures.hasCSVs === true) {
    this.copy('data/example.csv');
  }
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
  this.mkdir('styles');
  if (this.projectPrerequisites.useCompass) {
    this.mkdir('.tmp/css');
    this.template('styles/__styles.scss', 'styles/_styles.scss');
    this.template('styles/__mixins.scss', 'styles/_mixins.scss');
    this.template('styles/_main.scss', 'styles/main.scss');
  }
  else {
    this.template('styles/_styles.css', 'styles/styles.css');
  }
};

// Process javascript application stuff
MinnpostApplicationGenerator.prototype.app = function app() {
  this.mkdir('js');
  this.mkdir('js/templates');

  // Package files
  this.template('_package.json', 'package.json');
  this.template('_bower.json', 'bower.json');

  // Build parts
  this.directory('js/build/');

  // App parts
  this.copy('js/base.js', 'js/base.js');
  this.template('js/_config.js', 'js/config.js');
  this.template('js/_app.js', 'js/app.js');

  // Ractive
  if (this.projectFeatures.hasRactive === true) {
    this.template('js/templates/_application.mustache', 'js/templates/application.mustache');
  }
  else {
    this.template('js/templates/_application.mustache', 'js/templates/application.underscore');
  }

  // Modeling
  if (this.projectFeatures.hasModeling === true) {
    this.copy('js/models.js');
    this.copy('js/collections.js');
    this.copy('js/routers.js');
  }

  // Tests
  this.directory('tests');
  this.copy('travis.yml', '.travis.yml');

  // Grunt stuff
  this.template('_Gruntfile.js', 'Gruntfile.js');
};

// Process makefile
MinnpostApplicationGenerator.prototype.makefile = function makefile() {
  this.copy('Makefile');
};

// Process images
MinnpostApplicationGenerator.prototype.images = function images() {
  this.mkdir('images');
};

// Process HTML
MinnpostApplicationGenerator.prototype.html = function html() {
  this.template('_index.html', 'index.html');
};
