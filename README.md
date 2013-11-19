# MinnPost Template: News Application [![Build Status](https://secure.travis-ci.org/MinnPost/minnpost-template-application.png?branch=master)](https://travis-ci.org/MinnPost/minnpost-template-application)

A generator for [Yeoman](http://yeoman.io).

The template created from this generator is a Grunt, RequireJS, and Bower powered front-end application.  It will get compiled into a bit of embeddable HTML that links to CSS and JS files that are uploaded to S3.

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

### Create an application

1. In a new folder: `mkdir ../minnpost-sweet-new-app && cd ../minnpost-sweet-new-app`
1. Currently the link process does not provide a nicely usable Yeoman generator name, so use the following to copy the full name of the generator, which will look like the path to where the code (`Users:name:something:minnpost-template-application`): `yo --help`
1. Create the application, use the path copied above: `yo <minnpost-template-application>`

