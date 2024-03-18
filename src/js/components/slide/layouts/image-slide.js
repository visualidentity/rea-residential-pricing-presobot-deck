class ImageSlide extends Slide {
  constructor(options) {
    super({
      pageContainer: options.pageContainer,
      onRendered: function() {
        this.pageContainer.style.setProperty(
          '--slide-img',
          `url("${window.deckBaseURL}css/img/image-slides/${this.id}.${this.imageFormat}")`
        );
        this.pageContainer.style.setProperty(
          '--slide-img-retina',
          `url("${window.deckBaseURL}css/img/image-slides/${this.id}-retina.${this.imageFormat}")`
        );
      },
      onReady: function() {}
    });
    this.imageFormat = options.imageFormat || 'jpg';
  }
}
