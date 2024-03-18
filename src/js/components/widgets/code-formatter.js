class CodeFormatter {
  constructor(slide) {
    _.each(slide.utils.findAll('pre code'), block => {
      hljs.highlightBlock(block);
    });
  }
}
