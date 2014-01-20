# <%= projectTitle || projectName %>

<%= projectDescription || '*Description goes here*' %>

*Unless otherwise noted, MinnPost projects on [Github](https://github.com/minnpost) are story-driven and meant for transparency sake and not focused on re-use.  For a list of our more reusable projects, go to [code.minnpost.com](http://code.minnpost.com).*

## Data

*Describe the data sources here.  Use links and URLs to show where the data came from.  Put small sized originals or modified data sources in the ```data``` folder*

*For larger data sources that may need to be processed, provide instructions on how to download.  For instance:  ```cd data && wget blah.txt```.  Also, make sure to put an entry in the ```.gitignore```.*

## Data processing

The following describes how the data was processed and is not necessarily needed to run or install the application, but more included for reference, transparency, and development.

*Describe data processing here, include commands.  Put data processing scripts or configurations in the ```data-processing``` folder.*

## Development and running locally

### Prerequisites

All commands are assumed to on the [command line](http://en.wikipedia.org/wiki/Command-line_interface), often called the Terminal, unless otherwise noted.  The following will install technologies needed for the other steps and will only needed to be run once on your computer so there is a good chance you already have these technologies on your computer.

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

### Running

1. Run: `grunt server`
    * This will run a local webserver for development and you can view the application in your web browser at [http://localhost:<%= serverPort %>](http://localhost:<%= serverPort %>).
    * Utilize `index.html` for development, while `index-deploy.html` is used for the deployed version, and `index-build.html` is used to test the build before deployment.
    * The server runs `grunt watch` which will watch for linting JS files and compiling SASS.  If you have your own webserver, feel free to use that with just this command.

### Build

To build or compile all the assets together for easy and efficient deployment, do the following.  It will create all the files in the `dist/` folder.

1. Run: `grunt`

### Deploy

Deploying will push the relevant files up to Amazon's AWS S3 so that they can be easily referenced on the MinnPost site.  This is specific to MinnPost, and your deployment might be different.

1. Run: `grunt deploy`
<% if (isInline) { %>1. This will output a bit of HTML to embed in your article.<% } %>

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
