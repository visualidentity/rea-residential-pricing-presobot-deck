<!-- @format -->

# REA Residential Deck

This is based off of the default starting point deck 🃏, utilising ES6 & class-based Javascript.

Docs: https://developers.salespreso.com/

##### Build tools

1. [Installation and build](#installation-and-build)
2. [deck-gulp-tasks](#deck-gulp-tasks)
3. [Default library inclusions](#default-library-inclusions)
4. [Lodash vs. Underscore](#lodash-vs-underscore)
5. [ES6 compilation](#es6-compilation)
6. [Editor config](#editor-config)

##### Getting started

1. [Deck fundamentals](#deck-fundamentals)

##### Uploading deck versions:

1. [Uploading deck versions](#uploading-deck-versions-1)

##### Deck keeping:

1. [Audits and general deck keepings](#deck-keeping-1)

---

# Build tools

## installation and build

1. Install the Developer CDK
   https://developers.livepreso.com/docs/developer-docs/install-and-start#install-the-developer-cdk

2. Ensure node version = 10
3. Install gulp globally: `npm install gulp -g`
4. Install node_modules: `npm install`

5. Run `gulp` to compile the dist directories and set up a watcher for both the deck and docs

6. Now boot up the Developer CDK, browse to your deck's project.yaml file and select it. You should be able to see the slides.
7. Check the `test_data` directory for test data context you can use!

### Build for upload

```
gulp build --target=production
```

---

## deck-gulp-tasks

This project allows you to compile your LivePreso deck projects.

Features include:

- ES6 compilation of hooks and deck.js
- Sass compilation
- Nunjucks compilation
- HTML inject
- Watcher etc.

See the deck-gulp-tasks NPM package page for more information on the available features:
https://www.npmjs.com/package/@salespreso/deck-gulp-tasks

## Default library inclusions

The following libraries are available to the deck by default - deck.js and individual slide.js files. You do not need to import or add these libraries to your deck, any libraries outside of this list will need to be added to `src > js` for compilation into the common deck.js file by gulp.

- jQuery
- underscore.js
- moment.js

The following libraries can be imported into hooks files:

- lodash.js
- moment.js

The following libraries are passed to fieldsets as options:

- moment
- superagent

## Lodash vs. Underscore

Lodash and underscore are both available to the deck, however, due to versioning limitations each library is restricted to particular components of the deck.

Lodash.js:

- Hooks - fieldsets, selections etc.
  (https://developers.salespreso.com/docs/cdk/sections/guides/hooks/index.html)

Underscore.js:

- deck.js
- Individual slide.js files

## ES6 compilation

ES6 compilation is run on hooks files (fieldsets, selections etc.) and deck.js, but not slides' slide.js files. For the majority of functionality this isn't a problem as modern browsers support a lot of the functionality we like to use, however, there are a couple that can trip you up.

The app shell provided to Carsales uses Chromium 83.0.4103.116, use this version number when checking the compatibility of ES6 features.

If you are unsure, make sure to break components out into js files that will be compiled into deck.js, and keep the bare minimum in your individual slide.js files.

---

# Getting started

## Deck fundamentals

### JavaScript

#### Slide class

Rather than defining and attaching `onRendered` and `onReady` events to the current slide's DOM element, the deck makes use of a Slide class that wraps much of this functionality in a cleaner structure. This can optionally define event listeners for the above events (and others, such as `onSubslideChange` and `onClosed`).

#### BridgeState class

Rather than manually adding unique client / master Bridge listeners to handle interactions in the context of a RemotePreso, the deck uses a class (BridgeState) to seamlessly handle state changes, either at a whole-slide level (ie. each Slide class has a BridgeState) or within individual components (Forms, Accordians, Disclaimers). By utilising update handlers, it provides a simple, consistent means to maintain visual state across both master and client, transparently, greatly reducing the amount of boilerplate code that needs to be written.

---

# Uploading deck versions

## CDK Publish

Follow the pattern `<server>-v<dv>`. For example, the commit uploaded as deck version 23 on production would be tagged `production-v23`. This is done so LivePreso's support team are able to easily identify the deck in question is an error were to occur.

## Git tags & Branch conventions

When generating a new branch, have it based on master and follow the pattern `<job-number>-d`, similar to our other web-development projects. In the event of a larger build, we may use staging branches to help facilitate what is and isn't still in progress. If this is the case, then we'll generate a staging branch with the pattern `<job-number>-s`. 

Once a deck preview has been approved and ready to go live, then the working branch is merged into `master`. From here, we generate a new deck onto the production server.

# Deck keeping

As with any project, the more developers that interact with a build, the more iddentities are formed. Be mindful of existing logic within the deck, and the basic fundamentals provided by LivePreso.

## Removal of old logic and slides

With deck upgrades comes redundant code modules and slides. It's best we remain on top of this and remove any additional clutter. Doing so can help improve deck optimisation and reflects in agent presentation creation time. This is also impacted by the use of assets.

### Asset optimisation

When referencing new assets, ensure that they are compressed. In the past, we've found assets in PNG format consist of >5mb file size - this isn't necessary. It is often not essential to use PNG formats to begin with; using JPG is generally enough to illustrate a slide build. In any case, when referencing assets please use sites such as [https://tinyjpg.com/](https://tinyjpg.com/) to ensure assets remain low in size.