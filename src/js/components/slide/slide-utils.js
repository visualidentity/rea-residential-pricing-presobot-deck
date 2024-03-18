/**
 * Class which contains slide utility functions
 */
class SlideUtils {
  /**
   * Check if current viewing platform is CDK
   *
   * @return {Boolean} - viewing platform is CDK
   */
  static isCDK() {
    var isCDK = $('body > #cdk').length > 0;
    return isCDK;
  }

  /**
   * Create SlideUtils
   *
   * @param {Slide} slide - The current slide
   */
  constructor(slide) {
    this.slide = slide;
  }

  /**
   * toggle deck navigation on/off
   *
   * @param {boolean} toggle - navigation on/off
   */
  toggleNav(toggle) {
    Bridge.Navigation.allowNav(toggle);
  }

  /**
   * get the agenda of the current deck
   *
   * @return {Object} - the agenda of the deck
   */
  getAgenda() {
    return Bridge.Context.getAgenda();
  }

  /**
   * get the context at a path
   *
   * @param {String} path - jQuery like path to the context object
   * @param {*} fallback - The value to use in case no match is found
   * @return {*} - Either the matched part of the context or the fallback
   */
  getContext(path, fallback) {
    return Bridge.Context.match(path, fallback);
  }

  /**
   * find an element in the current slide
   *
   * @param {String} selector jQuery-style selector
   * @return {Object} HTML node
   *
   */
  findEl(selector) {
    return this.slide.pageContainer.querySelector(selector);
  }

  /**
   * find all elements that match the selector in current slide
   *
   * @param {String} selector jQuery-style selector
   * @return {Array} array of found HTML nodes
   */
  findAll(selector) {
    return this.slide.pageContainer.querySelectorAll(selector);
  }

  /**
   * Returns an underscore template function
   * Uses findEl and supplied selector to grab the template HTML
   *
   * @param {String} selector jQuery-style selector
   * @return {function} Underscore-style template function
   */
  templateFromEl(selector) {
    var el = this.findEl(selector);
    if (!el) return null;
    return _.template(el.innerText, null, { variable: 'data' });
  }

  /**
   * decode an html string
   *
   * @param {String} input a string containing html
   * @return {String} a string with the html removed
   *
   */
  htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, 'text/html');
    return doc.documentElement.textContent;
  }

  /**
   * go to the specified slide, leave the section blank for another slide in the same section
   * leave the slide blank to go to a section header, leave both blank to go to the welcome slide
   *
   * @param {String} slide the slide key
   * @param {String} section the section key
   */
  goToSlide(slide, section) {
    if (slide && section) {
      Bridge.Navigation.gotoSlide('{{deck}}/' + section + '/' + slide);
    } else if (!slide && section) {
      Bridge.Navigation.gotoSlide('{{deck}}/' + section);
    } else if (slide) {
      Bridge.Navigation.gotoSlide('{{deck}}/{{section}}/' + slide);
    } else {
      Bridge.Navigation.gotoSlide('{{deck}}');
    }
  }

  /**
   * make an async request and run the onSuccess function when a response is returned
   *
   * @param {Object} options
   * @param {function} options.onSuccess - the function to run on a successful response
   * @param {function} options.onError - the function to run if an error is encountered
   * @param {String} options.url - the url to make the request to
   * @param {String} options.method - the request method (create, update, partialUpdate, get, delete)
   * @param {?Object} options.data - the data to send with the request
   * @param {Object} options.options - the request options
   * @param {String} options.options.query - the URL query parameters
   * @param {String} options.options.encoding - Encoding type
   * @returns {Promise} - returns a SuperAgentRequest promise
   */
  request(options) {
    if (!options.onError) {
      console.error('onError function is required');
      return;
    }
    if (!options.onSuccess) {
      console.error('onSuccess function is required');
      return;
    }
    if (!options.method) {
      console.error('method is required');
      return;
    }
    if (!options.options) {
      console.error('request options are required');
      return;
    }
    return Bridge.Request[options.method](options.url, options.options)
      .then(options.onSuccess)
      .catch(options.onError);
  }

  /**
   * sets up links at the bottom of each slide if in CDK
   *
   * @param {String} pageId - id of current slide
   */
  setupCdkFileLink(pageId) {
    if (SlideUtils.isCDK()) {
      var $pageContainer = $('#' + pageId);
      var deckPath = window.controller.getState('cdk.projectFile.src');
      var isMac = deckPath.indexOf('/') > -1;
      var del = isMac ? '/' : '\\';

      var slidePath = Bridge.Navigation.getSlidePath().split('/');

      /* html, scss, js */
      var fullSlidePath;

      if (slidePath.length == 1) {
        // title slide
        fullSlidePath = [deckPath];
      } else if (slidePath[1] && slidePath[1].indexOf('template-') == 0) {
        fullSlidePath = [
          deckPath,
          'templates',
          slidePath[1].substr('template-'.length)
        ];
      } else {
        fullSlidePath = [deckPath, 'sections', slidePath[1]];
        if (slidePath[2]) fullSlidePath.push('slides', slidePath[2]);
      }
      fullSlidePath = fullSlidePath.join(del) + del;
      var $fileLinkHTML = $('<a>')
        .addClass('c-cdk-utils__link')
        .attr('href', fullSlidePath + 'index.html')
        .html('index.html');
      var $fileLinkJS = $('<a>')
        .addClass('c-cdk-utils__link')
        .attr('href', fullSlidePath + 'slide.js')
        .html('slide.js');
      var $fileLinkSCSS = $('<a>')
        .addClass('c-cdk-utils__link')
        .attr('href', fullSlidePath + 'slide.scss')
        .html('slide.scss');
      var $outer = $('<div class="c-cdk-utils"/>');
      var $links = $(
        '<div class="c-cdk-utils__inner"><span class="c-cdk-utils__title">#' +
          this.slide.id +
          '</span>&nbsp;&nbsp;</div>'
      )
        .append($fileLinkHTML)
        .append($fileLinkJS)
        .append($fileLinkSCSS);
      $outer.append($links);

      /*  injections */
      var allNodes = $.merge(
        $pageContainer.parent().contents(),
        $pageContainer.find('*').contents()
      );
      var commentNodes = allNodes.filter(function() {
        return this.nodeType == 8;
      });

      var injections;
      if (!_.isEmpty(commentNodes)) {
        injections = _.compact(
          _.uniq(
            _.map(commentNodes, function(comment) {
              var commentSplit = comment.nodeValue.trim().split(':');
              if (
                !commentSplit ||
                commentSplit[0].trim().indexOf('inject') != 0
              )
                return false;
              var pathComponents = commentSplit[1].split('/');
              if (pathComponents[pathComponents.length - 1] == 'slide.js')
                return false;
              return { type: commentSplit[0].trim(), path: commentSplit[1] };
            }),
            'path'
          )
        );
      }
      if (!_.isEmpty(injections)) {
        $links.append(
          ' <span class="c-cdk-utils__subsection-heading">injects:</span> '
        );
      }
      _.each(injections, function(injection, index) {
        var pathComponents = injection.path.split('/');
        if (pathComponents[0] == '') pathComponents.shift();
        if (pathComponents[0] == 'src') pathComponents.shift();
        var fileName = pathComponents[pathComponents.length - 1];
        var fullInjectionPath;
        if (injection.type == 'injectRelative') {
          fullInjectionPath = [
            deckPath,
            'sections',
            slidePath[1],
            'slides',
            slidePath[2]
          ];
          fullInjectionPath.push(pathComponents.join(del));
          fullInjectionPath = fullInjectionPath.join(del);
        } else {
          fullInjectionPath = [deckPath];
          fullInjectionPath.push(pathComponents.join(del));
          fullInjectionPath = fullInjectionPath.join(del);
        }

        var $link = $('<a>')
          .addClass('c-cdk-utils__link')
          .attr('href', fullInjectionPath)
          .html(fileName);
        $links.append($link);
        if (index < injections.length - 1) $links.append(' | ');
      });

      $('#' + pageId).append($outer);

      $('#' + pageId + ' .c-cdk-utils a').on('click', function(e) {
        e.preventDefault();
        const clickedPath = $(this).attr('href');
        console.log(clickedPath);
        nw.Shell.openItem(clickedPath);
      });
    }
  }

  injectDataValues(
    $searchContainer,
    sourceObj,
    keys,
    formattingFunction,
    subSelector,
    onlyIfEmpty
  ) {
    subSelector = !subSelector ? '' : ' ' + subSelector;
    if (_.isNull(onlyIfEmpty)) onlyIfEmpty = false;
    // just iterate everything
    _.each(sourceObj, (value, dataKey) => {
      if (keys && !_.contains(keys, dataKey)) return;
      var selector = '[data-injectable="' + dataKey + '"]' + subSelector;
      var $domNode = $searchContainer.find(selector);
      if ($domNode.length) {
        if (onlyIfEmpty && $domNode.html()) return;
        var prettyVal = formattingFunction ? formattingFunction(value) : value;
        $domNode.html(prettyVal);
      } else {
        if (SlideUtils.isCDK()) console.error(`node '${selector}' not found`);
      }
    });
  }

  /**
   * Returns an array of all active sections
   * Useful for creating an agenda
   *
   * @return {Array} - list of sections
   */
  get activeSections() {
    let welcomeSlide = Bridge.Slides.getSlide('{{deck}}');
    let deckKey = welcomeSlide.key;
    let deckAgenda = _.find(this.getAgenda(), { path: deckKey }) || {
      sections: []
    };

    return _.filter(deckAgenda.sections, section => {
      return section.visible || _.some(section.slides, slide => slide.visible);
    });
  }
}
