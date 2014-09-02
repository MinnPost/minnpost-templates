# <%= projectTitle || projectName %>

<%= projectDescription || '*Description goes here*' %>

You can see this project in action at *[published story link goes here]()*.

*Unless otherwise noted, MinnPost projects on [Github](https://github.com/minnpost) are story-driven and meant for transparency sake and not focused on re-use.  For a list of our more reusable projects, go to [code.minnpost.com](http://code.minnpost.com).*

## Data

*Describe the data sources here.  Use links and URLs to show where the data came from.  Put small sized originals or modified data sources in the ```data/original``` folder and ensure to update the `.gitignore` file*

## Development and running locally

### Prerequisites

All commands are assumed to be on the [command line](http://en.wikipedia.org/wiki/Command-line_interface), often called the Terminal, unless otherwise noted.  The following will install technologies needed for the other steps and will only needed to be run once on your computer so there is a good chance you already have these technologies on your computer.

1. Install [Git](http://git-scm.com/).
    * On a Mac, install [Homebrew](http://brew.sh/), then do: `brew install git`
1. Install [NodeJS](http://nodejs.org/).
    * On a Mac, do: `brew install node`
1. Optionally, for development, install [Grunt](http://gruntjs.com/): `npm install -g grunt-cli`
1. Install [Bower](http://bower.io/): `npm install -g bower`
<% if (projectPrerequisites.useRuby || projectPrerequisites.useSass) { %>1. Install [Ruby](http://www.ruby-lang.org/en/downloads/), though it is probably already installed on your system.
1. Install [Bundler](http://gembundler.com/): `gem install bundler`<% } %>
<% if (projectPrerequisites.usePython) { %>1. Install [Python](http://www.python.org/getit/), though it is probably already installed on your system.
1. Install [pip](https://pypi.python.org/pypi/pip): `easy_install pip`
1. Optional, use [virtualenv](http://www.virtualenv.org/en/latest/), where `.env` an environment name that you can change if you want.
    1. `easy_install virtualenv`
    1. `virtualenv .env`
    1. `cd .env && source bin/activiate; cd -;` <% } %>
<% if (projectPrerequisites.useCompass) { %>1. Install [Sass](http://sass-lang.com/): `gem install sass`
    * On a Mac do: `sudo gem install sass`
1. Install [Compass](http://compass-style.org/): `gem install compass`
    * On a Mac do: `sudo gem install compass`<% } %>
<% if (typeof filteredComponentMap.leaflet != 'undefined') { %>1. Because Leaflet comes unbuilt, we need to build it with Jake: `npm install -g jake`<% } %>

### Get code and install packages

Get the code for this project and install the necessary dependency libraries and packages.

1. Check out this code with [Git](http://git-scm.com/): `git clone https://github.com/MinnPost/<%= projectName %>.git`
1. Go into the template directory: `cd <%= projectName %>`
1. Install NodeJS packages: `npm install`
1. Install Bower components: `bower install`
<% if (projectPrerequisites.useRuby) { %>1. Install Ruby gems: `bundle install`<% } %>
<% if (projectPrerequisites.usePython) { %>1. Install python packages: `pip install -r requirements.txt` <% } %>
<% if (typeof filteredComponentMap.leaflet != 'undefined') { %>1. Because Leaflet comes unbuilt, we need to build it: `cd bower_components/leaflet/ && npm install && jake; cd -;`<% } %>
<% if (typeof filteredComponentMap['mapbox.js'] != 'undefined') { %>1. Because Mapbox comes unbuilt, we need to build it: `cd bower_components/mapbox.js/ && npm install && make; cd -;`<% } %>

### Data processing

The `Makefile` runs tasks such as downloading sources and converting data.

1. Run: `make`

### Running locally

1. Run: `grunt server`
    * This will run a local webserver for development and you can view the application in your web browser at [http://localhost:<%= serverPort %>](http://localhost:<%= serverPort %>).
1. By default, running a local server will show you the local development version.  But there are other builds that you can view by changing the query parameters.  Do note that you may have to run the build and deploy things for things to work normally.
    * Local build: http://localhost:<%= serverPort %>/?mpDeployment=build
    * Build deployed on S3: http://localhost:<%= serverPort %>/?mpDeployment=deploy
    * Embedded version with local build: http://localhost:<%= serverPort %>/?mpDeployment=build&mpEmbed=true
    * Embedded version with S3 build: http://localhost:<%= serverPort %>/?mpDeployment=deploy&mpEmbed=true

### Developing

Development will depend on what libraries are used.  But here are a few common parts.

* `js/app.js` is the main application and will contain the top logic.

Adding libraries is not difficult, but there are a few steps.

1. User bower to install the appropriate library: `bower install library --save`
1. Add the appropriate reference in `js/config.js` so that RequireJS knows about it.
1. Add an entry in the `dependencyMap` object in `bower.json`.  This is used to automatically collect resources in the build process.  It is possible, like with `minnpost-styles` that multiple entries will need to be made, one ber `.js` file.  Here is an example:

```
// Should be bower identifier.  Order matters for build, meaning that any dependencies should come first.
"library": {
  // Name used for reference in RequireJS (some modules expect dependencies with specific case, otherwise its arbitrary and you can just use the library name from above).
  // If this is not a JS library, do not include.
  "rname": "library",
  // (optional) Path to un-minified JS files within bower_components excluding .js suffix.
  "js": ["library/dist/library"],
  // (optional) Path to un-minified CSS files within bower_components excluding .css suffix.
  "css": ["library/dist/css/library"],
  // (optional) Path to un-minified IE-specific CSS files within bower_components excluding .css suffix.
  "ie": ["library/dist/css/library.ie"],
  // What is expected to be returned when using as a RequireJS dependency.  Some specific libraries, like jQuery use $, or backbone returns the Backbone class.
  // If this is not a JS library, do not include.
  "returns": "Library"
}
```

### Testing

Unfortunately there are no tests at the moment.

### Build

To build or compile all the assets together for easy and efficient deployment, do the following.  It will create all the files in the `dist/` folder.

1. Run: `grunt`

### Deploy

Deploying will push the relevant files up to Amazon's AWS S3 so that they can be easily referenced on the MinnPost site.  This is specific to MinnPost, and your deployment might be different.

1. Run: `grunt deploy`
    * This will output a bit of HTML to if you want to use the project as an embed.

There are to main ways to include the necessary HTML in a page in order to run the project.

1. Copy the relevant parts from `index.html`.
    * This has the benefit of showing messages to users that have older browsers or have Javascript turned off.  This also uses the build that separates out the third-party libraries that are used and are less likely to change; this gains a bit of performance for users.
1. Copy the embed output from `grunt deploy` (still in development).

## Hacks

*List any hacks used in this project, such as forked repos.  Link to pull request or repo and issue.*

## About Us

MinnData, the MinnPost data team, is Alan, Tom, and Kaeti and all the awesome contributors to open source projects we utilize.  See our work at [minnpost.com/data](http://minnpost.com/data).

```

                                                   .--.
                                                   `.  \
                                                     \  \
                                                      .  \
                                                      :   .
                                                      |    .
                                                      |    :
                                                      |    |
      ..._  ___                                       |    |
     `."".`''''""--..___                              |    |
     ,-\  \             ""-...__         _____________/    |
     / ` " '                    `""""""""                  .
     \                                                      L
     (>                                                      \
    /                                                         \
    \_    ___..---.                                            L
      `--'         '.                                           \
                     .                                           \_
                    _/`.                                           `.._
                 .'     -.                                             `.
                /     __.-Y     /''''''-...___,...--------.._            |
               /   _."    |    /                ' .      \   '---..._    |
              /   /      /    /                _,. '    ,/           |   |
              \_,'     _.'   /              /''     _,-'            _|   |
                      '     /               `-----''               /     |
                      `...-'                                       `...-'

```
