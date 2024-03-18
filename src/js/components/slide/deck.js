/**
 * Deck class, primarily to hold Slide objects and access to some useful utilities
 * @class Deck
 */
class Deck {
  /**
   * Gives access to SlideModes to check the current 'mode' of the Deck.
   * @readonly
   * @static
   * @memberof Deck
   */
  static get modes() {
    return new SlideModes();
  }

  static get dimensions() {
    return {
      width: 1920,
      height: 1080
    };
  }

  /**
   * Static method to retrieve the deck's ColourMap
   * @readonly
   * @static
   * @memberof Deck
   */
  static get colourMap() {
    return new ColourMap({
      white: '#ffffff',
      black: '#000000',
      // place deck specific colours here
      charcoal: '#333333',
      blue: '#487ff7'
    });
  }

  /**
   * Gets pixel measurement irregardless of current presenter scaling
   * Allows for LivePreso rescaling
   *
   * @param {Object} values - values keyed by property - eg. { top: 124, width: 500 }
   */
  static generateMeasurementFunction() {
    return function(values) {
      const currSlide = Bridge.Slides.getArticle()[0];
      // Apply modifier to top and left values
      // Allows for LivePreso rescaling
      var pageContainer = (currSlide && currSlide.getBoundingClientRect()) || {
        width: Deck.dimensions.width,
        height: Deck.dimensions.height
      };

      var modifier = pageContainer.width / Deck.dimensions.width;

      return _.reduce(
        values,
        function(modifiedValues, value, key) {
          modifiedValues[key] = value / modifier;

          return modifiedValues;
        },
        {}
      );
    };
  }
}
