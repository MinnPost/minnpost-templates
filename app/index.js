'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var request = require('request');
var cheerio = require('cheerio');
var exec = require('child_process').exec;

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

// Exec output
var execOutput = function(error, stdout, stderr) {
  console.log('stdout: ' + stdout);
  console.log('stderr: ' + stderr);
  if (error !== null) {
    console.log('exec error: ' + error);
  }
};

// Generator object
var MinnpostApplicationGenerator = module.exports = function MinnpostApplicationGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({
      skipInstall: options['skip-install'],
      skipMessage: options['skip-install-message'],
      callback: function() {
        // Put all the commands together
        var commands = 'echo "";';
        if (typeof this.filteredComponentMap.leaflet !== 'undefined') {
          commands += ' npm install -g jake; cd bower_components/leaflet/ && npm install && jake; cd -;';
        }
        if (typeof this.filteredComponentMap['mapbox.js'] !== 'undefined') {
          commands += ' cd bower_components/mapbox.js/ && npm install && make; cd -;';
        }

        console.log('Some finishing touches...');
        exec(commands, execOutput);
      }.bind(this)
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
  var separators = { bowerComponents: '#', nodeModules: '@', rubyGems: '@', pythonDependencies: '@'};
  var validateRequired = function(input) {
    return (input) ? true : 'Please provide a value';
  };

  // Map of resource for library parts, keyed by their bower
  // package name.  rname is the requireJS module name.  For files
  // leave off the extension name.  Order matters
  var componentMap = {
    requirejs: {
      rname: 'requirejs',
      js: ['requirejs/require']
    },
    text: {
      rname: 'text',
      js: ['text/text']
    },
    jquery: {
      rname: 'jquery',
      js: ['jquery/jquery.min'],
      returns: '$'
    },
    underscore: {
      rname: 'underscore',
      js: ['underscore/underscore-min'],
      returns: '_'
    },
    backbone: {
      rname: 'Backbone',
      js: ['backbone/backbone-min'],
      returns: 'Backbone'
    },
    ractive: {
      rname: 'Ractive',
      js: ['ractive/build/Ractive-legacy.min'],
      returns: 'Ractive'
    },
    'ractive-backbone': {
      rname: 'Ractive-Backbone',
      js: ['ractive-backbone/Ractive-Backbone.min'],
      returns: 'RactiveBackbone'
    },
    'ractive-events-tap': {
      rname: 'Ractive-events-tap',
      js: ['ractive-events-tap/Ractive-events-tap.min'],
      returns: 'RactiveEventsTap'
    },
    'ractive-events-hover': {
      rname: 'Ractive-events-hover',
      js: ['ractive-events-tap/Ractive-events-hover.min'],
      returns: 'RactiveEventsHover'
    },
    moment: {
      rname: 'moment',
      js: ['moment/min/moment.min'],
      returns: 'moment'
    },
    'Placeholder.js': {
      rname: 'placeholder',
      js: ['Placeholder.js/lib/adapters/placeholders.jquery'],
      returns: 'placeholder'
    },
    unsemantic: {
      css: ['unsemantic/assets/stylesheets/unsemantic-grid-responsive-tablet'],
      ie: ['unsemantic/assets/stylesheets/ie'],
      rname: 'unsemantic'
    },
    leaflet: {
      js: ['leaflet/dist/leaflet'],
      css: ['leaflet/dist/leaflet'],
      rname: 'Leaflet',
      returns: 'L'
    },
    highcharts: {
      js: ['highcharts/highcharts'],
      rname: 'Highcharts',
      returns: 'Highcharts'
    },
    // Using a local copy of Mapbox does not play
    // nice with requireJS optimizer.  But, the current
    // workflow in place is not meant for remote
    // resources.
    // TODO: Fix this
    'mapbox.js': {
      js: ['mapbox.js/dist/mapbox'],
      css: ['mapbox.js/dist/mapbox'],
      images: ['mapbox.js/dist/images'],
      rname: 'mapbox',
      returns: 'L'
    },
    datatables: {
      js: ['datatables/media/js/jquery.dataTables'],
      css: ['datatables/media/css/jquery.dataTables'],
      rname: 'datatables',
      returns: 'dataTable'
    },
    'jquery-csv': {
      js: ['jquery-csv/src/jquery.csv'],
      rname: 'jqueryCSV',
      returns: 'jqueryCSV'
    }
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
  // The type of project
  prompts.push({
    type: 'list',
    name: 'projectType',
    message: 'The type of project:',
    choices: [
      { name: 'Application (uses more HTML, intended for full page articles)', value: 'application' },
      { name: 'Inline (uses widget approach, intended for within articles)', value: 'inline' }
    ]
  });
  // Features
  prompts.push({
    type: 'checkbox',
    name: 'projectFeatures',
    message: 'Application features (will include necessary libraries):',
    choices: [
      { name: 'Backbone', value: 'hasBackbone' },
      { name: 'CSS grid', value: 'hasGrid' },
      { name: 'Leaflet map', value: 'hasLeaflet' },
      { name: 'Mapbox map', value: 'hasMapbox' },
      { name: 'Datatable', value: 'hasDatatables' },
      { name: 'CSV', value: 'hasCSVs' },
      { name: 'Highcharts', value: 'hasHighcharts' },
      { name: 'Dates', value: 'hasDates' },
      { name: 'Form inputs', value: 'hasInputs' },
      { name: 'jQuery', value: 'hasjQuery', checked: true },
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

  // Call prompt
  this.prompt(prompts, function(props) {
    var i;
    var thisYeoman = this;
    var bowerFeatureMap = {};

    // Mark as inline or application
    props.isInline = (props.projectType === 'inline');
    props.isApplication = (props.projectType === 'application');

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

    // Handle project features
    bowerFeatureMap = {
      'hasGrid': 'unsemantic',
      'hasLeaflet': 'leaflet#~0.7.2',
      'hasMapbox': 'mapbox.js#~1.6.1',
      'hasDatatables': 'datatables#~1.9.4',
      'hasCSVs': 'jquery-csv#*',
      'hasHighcharts': 'highcharts#~3.0.9',
      'hasDates': 'moment#~2.5.1',
      'hasInputs': 'Placeholders.js#~3.0.1',
      'hasjQuery': 'jquery#~1.11',
      'hasRactive': 'ractive#~0.3.9 ractive-events-tap#~0.1.0',
      'hasBackbone': 'backbone#~1.1.1'
    };
    for (var fi in props.projectFeatures) {
      if (props.projectFeatures[fi] === true && bowerFeatureMap[fi]) {
        props.bowerComponents += ' ' + bowerFeatureMap[fi];
      }
    }

    // Add requireJS and underscore manually as this is needed
    props.bowerComponents += ' requirejs#~2.1.11 text#~2.0.10 underscore#~1.6.0';

    // Process library fields into a real object for
    // templates
    for (i in separators) {
      var dependencies = [];
      props[i] = (props[i] !== undefined) ? props[i].trim() : '';
      props[i].split(' ').forEach(function(l) {
        if (l.split(separators[i])[0] && l.split(separators[i])[0] !== undefined) {
          dependencies.push({
            name: l.split(separators[i])[0],
            version: (l.split(separators[i])[1]) ? l.split(separators[i])[1] : '*'
          });
        }
      });
      props[i] = dependencies;
    }

    // Add componenet map and provide filtered version
    props.componentMap = componentMap;
    props.filteredComponentMap = {};
    for (i in componentMap) {
      props.bowerComponents.forEach(function(b) {
        if (i === b.name) {
          props.filteredComponentMap[i] = componentMap[i];
        }
      });
    }

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
  this.mkdir('data-processing');

  if (this.projectFeatures['hasCSVs'] === true) {
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
    this.template('styles/__variables.scss', 'styles/_variables.scss');
    this.template('styles/__styles.scss', 'styles/_styles.scss');
    this.template('styles/__mixins.scss', 'styles/_mixins.scss');
    this.template('styles/_main.scss', 'styles/main.scss');
    this.template('styles/_main.ie.scss', 'styles/main.ie.scss');
  }
  else {
    this.template('styles/_styles.css', 'styles/styles.css');
    this.template('styles/_styles.ie.css', 'styles/styles.ie.css');
  }
};

// Process javascript application stuff
MinnpostApplicationGenerator.prototype.app = function app() {
  this.mkdir('js');
  this.mkdir('js/templates');

  // Package files
  this.template('_package.json', 'package.json');
  this.template('_bower.json', 'bower.json');

  // Common parts
  this.template('js/_helpers.js', 'js/helpers.js');
  this.copy('js/wrapper.start.js');
  this.copy('js/wrapper.end.js');

  // Application files
  if (this.isApplication) {
    this.template('js/_config.js', 'js/config.js');
    this.template('js/_app.js', 'js/app.js');
  }
  else {
    this.template('js/_app-inline.js', 'js/app.js');
  }

  // Ractive
  if (this.projectFeatures['hasRactive'] === true) {
    this.template('js/templates/_application.mustache', 'js/templates/application.mustache');
    this.copy('js/templates/loading.mustache');
  }
  else {
    this.template('js/templates/_application.underscore', 'js/templates/application.underscore');
    this.copy('js/templates/loading.mustache', 'js/templates/loading.underscore');
  }

  // Data tables
  if (this.projectFeatures['hasDatatables'] === true) {
    this.copy('js/templates/datatables-filter-links.underscore');
    this.copy('js/datatables-plugins.js');
  }

  // Backbone
  if (this.projectFeatures['hasBackbone'] === true) {
    this.copy('js/models.js');
    this.copy('js/collections.js');
    this.copy('js/views.js');
    this.copy('js/routers.js');
  }

  // Grunt stuff
  this.template('_Gruntfile.js', 'Gruntfile.js');

  // Create a JSON file of the enabled components so
  // that it can be reused in multiple places
  this.write('bower_map.json', JSON.stringify(this.filteredComponentMap, null, '  '));
};

// Process images
MinnpostApplicationGenerator.prototype.images = function images() {
  this.copy('images/loader.gif');

  if (this.projectFeatures['hasDatatables'] === true) {
    this.directory('images/datatables');
  }
};

// Process HTML
MinnpostApplicationGenerator.prototype.html = function html() {
  this.template('_index.html', 'index.html');
  this.template('_index-build.html', 'index-build.html');
  this.template('_index-deploy.html', 'index-deploy.html');
};
