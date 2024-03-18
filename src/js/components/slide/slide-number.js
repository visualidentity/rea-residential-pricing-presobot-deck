class SectionNumber {
  constructor(slide) {
    this.slide = slide;
    this.node =
      this.slide.pageContainer.querySelector('.js-section-number') || {};
    this.id = this.slide.id;
    // Only fetch number if a node has been found
    if (this.node) {
      this.node.innerText = this.sectionNumber;
    }
  }

  get sectionNumber() {
    const activeSections = this.slide.utils.activeSections;
    let num = null;
    _.each(activeSections, (section, ix) => {
      if (_.last(section.path.split('/')) === this.id) {
        num = ix + 1;
      }
      _.each(section.slides, slide => {
        if (_.last(slide.path.split('/')) === this.id) {
          num = ix + 1;
        }
      });
    });

    return `${num}`.padStart(2, '0'); // pad start with a 0 if num < 10
  }
}
