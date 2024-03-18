/**
 * For use with SvgTween and CssTween.
 */
class AnimationRenderer {
  /**
   * create an AnimationRenderer
   * @param {Array} initialAnimations - array of SVG and CSS 'tweens'
   */
  constructor(initialAnimations, options) {
    options = _.defaults(_.clone(options), { repeat: false, initialDelay: 0 });
    this.tweens = initialAnimations || [];
    this.isStarted = false;
    this.isDone = false;
    this.startTime = null;
    this.repeat = options.repeat;
    this.initialDelay = options.initialDelay;
    this.onComplete = options.onComplete || function() {};
  }

  /**
   * add a tween to the animation
   * @param {SvgTween/CssTween} tween - SvgTween or CssTween to add to animation
   */
  addTween(tween) {
    this.tweens.push(tween);
  }

  /**
   * single frame request
   * @param  {Number} timestamp - timestamp passed by window.requestAnimationFrame
   * @return {Boolean}          - returns 'true' if animation is finished
   */
  animateStep(timestamp) {
    if (this.isDone) return true;
    if (!this.startTime) this.startTime = timestamp;
    var timeElapsed = timestamp - this.startTime;

    _.each(this.tweens, tween => {
      var progress = (timeElapsed - tween.delay) / tween.duration;
      if (progress < 0) return false;
      if (progress < 1) {
        tween.executeStep(progress);
        return false;
      } else {
        tween.end();
        return true;
      }
    });

    if (_.every(this.tweens, 'isDone')) {
      this.isDone = true;
      if (this.repeat) {
        this.reset();
        window.requestAnimationFrame(this.animateStep.bind(this));
      } else {
        this.onComplete();
      }
    } else {
      window.requestAnimationFrame(this.animateStep.bind(this));
    }
  }

  /**
   * begin animation
   */
  start() {
    if (this.isStarted || this.isDone) return;
    _.delay(() => {
      this.isStarted = true;
      window.requestAnimationFrame(this.animateStep.bind(this));
    }, this.initialDelay);
  }

  reset() {
    this.isDone = false;
    this.startTime = null;
    _.each(this.tweens, tween => tween.reset());
  }

  /**
   * jump animation to final frame
   */
  end() {
    if (this.isDone) return;
    this.isStarted = true;
    this.isDone = true;

    _.each(this.tweens, tween => {
      tween.end();
    });
  }

  /**
   * set all tweens to starting value
   */
  setInitialState() {
    _.each(this.tweens, tween => {
      tween.executeStep(0);
    });
  }
}
