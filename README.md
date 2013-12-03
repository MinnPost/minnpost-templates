# MinnPost Templates

A generator for [Yeoman](http://yeoman.io).

The templates created from this generator are Grunt, RequireJS, and Bower powered front-end application.  Grunt will compile the code into a bit of embeddable HTML that links to CSS and JS files that are uploaded to S3.

There are two main types: application and inline.  Applications are meant for full page articles and inlines are more appropriate for embedding within a text filled article.

## Getting Started

### Prerequsites

All commands are assumed to on the [command line](http://en.wikipedia.org/wiki/Command-line_interface), often called the Terminal, unless otherwise noted.  The following will install technologies needed for the other steps and will only needed to be run once on your computer so there is a good chance you already have these technologies on your computer.

1. Install [Git](http://git-scm.com/).
   * On a Mac, install [Homebrew](http://brew.sh/), then do: `brew install git`.
1. Install [NodeJS](http://nodejs.org/).
   * On a Mac, do: `brew install node`.
1. Install [Yeoman](http://yeoman.io/): `npm install -g yo`

### Install generator

Get the code for this project and install the necessary dependency libraries and packages.

1. Check out this code with [Git](http://git-scm.com/): `git clone https://github.com/MinnPost/minnpost-template-application.git`
1. Go into the template directory: `cd minnpost-template-application`
1. Install NodeJS packages: `npm install`
1. Link this code base so Yeoman can see it: `npm link`

### Create an application or inline from a template

1. Make a Github repository first.  If this is an inline piece, you may want to put multiple pieces in one repository.  Repository naming:
    * For projects that are very specific to a single story or group of stories: do the following:
        * Use **lowercase** characters
        * Use **hyphens** instead of spaces or underscores
        * Prefix the repository with **`minnpost-`** or **`minnpost-inline-`**.
    * For re-usable libraries, follow naming conventions that are most appropriate given the technologies used (language and distribution system), such as NPM and Node, Python and PIP, etc.
1. Checkout your new repository or make a new directory like: `mkdir ../minnpost-sweet-new-app && cd ../minnpost-sweet-new-app`
1. Currently the link process does not provide a nicely usable Yeoman generator name, so use the following to copy the full name of the generator, which will look like the path to where you put the template code (i.e. `Users:name:something:minnpost-templates`): `yo --help`
1. Start the template process; use the path copied above: `yo <Users:name:something:minnpost-templates>`
1. Answer questions.  The template will create the necessary files in your current directory.
1. Though it should get run automatically for you, you may have to run `npm install && bower install` manually.

## General philosophies

* **Start in the open**.  This means your first step should be creating a project on Github; you can always move things around later.
* **Assume open**; even if a project is started privately, it may one day be out in the open, so make it easier for everyone.
* **Commit often**.  Large commits are harder to parse and merge.
* **Never commit passwords** or sensitive/secure information; use configuration files for this.
* **Code as little as possible**; use existing libraries and projects where applicable.
* **Document your process**; being open and documenting means that MinnPost can be transparent in how it handles data or interactive projects.
* **Documentation and code commenting** is cool; it means you and others can more easily understand a project and the decisions that were made along the way.
* **Use existing standards**; utilize existing standards for code, data, or whatever.  Making or using custom ways of doing things adds complications and more work for everyone else (though sometimes they are necessary).

### Coding standards

Coding standards can seem arbitrary, but are very important when multiple people are working on a project.  Deciding on coding standards up front will alleviate a lot of headache down the road.

* [Javascript](https://github.com/MinnPost/javascript)
