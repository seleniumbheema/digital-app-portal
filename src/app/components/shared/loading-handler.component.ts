import * as bowser from 'bowser';

/**
 * Any components that need to show or hide the loading indicator should extend this one.
 */
export abstract class LoadingHandlerComponent {

  /** Name of the css class to apply to indicate the nav has ended and so loading indicator should be hidden. */
  private navEndedClass = 'navEnded';

  /* istanbul ignore next */
  protected showLoader() {
    const load = this.getLoadingIndicator();
    if (load) {
      const classes = load.classList;
      // Remove the navEnded class
      load.classList.remove(this.navEndedClass);
      // Delay the showing of it, if the navEnded class has been added within the timeout value, then we don't need to show the loading indicator
      setTimeout(
        () => {
          if (!classes.contains(this.navEndedClass)) {
            load.style.display = 'block';
          }
        },
        ESURE_GLOBALS.LOADING_SPRITE_DELAY);
    }
  }

  /* istanbul ignore next */
  protected hideLoader() {
    const load = this.getLoadingIndicator();
    if (load) {
      load.classList.add(this.navEndedClass);
      load.style.display = 'none';
    }
  }

  /**
   * This should take the user to the top global messages area, however there are complications with trying to go to the exact
   * div containing the error, so for now just scrolls to the top. This is to be used on the logged in pages only.
   *
   * @protected
   * @memberof LoadingHandlerComponent
   */
  protected scrollToGlobalFormError(): void {
    /* istanbul ignore next */
    if (this.canUseScrollIntoView()) {
      this.scrollIntoView('mta');
    } else {
      // Has to be scroll-container, nothing else will work, so take off 125 from top to at least remove the header and policy heading
      /* istanbul ignore next */
      document.getElementById('scroll-container').scrollTop = 125;
    }
  }

  protected scrollToGlobalFormErrorUnauth(): void {
    this.scrollIntoView('auth-create-acc');
  }

  /* istanbul ignore next */
  protected scrollToHeader(): void {
    this.scrollIntoView('header');
  }

  /* istanbul ignore next */
  public backToTop(): void {
    setTimeout(
      () => {
        if (this.canUseScrollIntoView()) {
          this.scrollIntoView('scroll-anchor');
        } else {
          // Has to be scroll-container, using scroll-anchor does not seem to work
          /* istanbul ignore next */
          document.getElementById('scroll-container').scrollTop = 0;
        }
      },
      250);
  }

  private getLoadingIndicator(): HTMLElement {
    return document.getElementById('loading-indicator');
  }

  /**
   * Scroll an element by ID into view.
   *
   * @private
   * @param {string} id element ID, without the hash
   * @memberof LoadingHandlerComponent
   */
  private scrollIntoView(id: string): void {
    const element = document.getElementById(id);
    /* istanbul ignore next */
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
  }

  /**
   * Internet Explorer 11 has a bug with scrollIntoView that we see happening when the sidebar is open.
   * https://github.com/tidal-engineering/ie11-scroll-into-view
   * Therefore, we use scrollTop instead if we detect this browser and version.
   *
   * @private
   * @returns {boolean}
   * @memberof LoadingHandlerComponent
   */
  /* istanbul ignore next */
  private canUseScrollIntoView(): boolean {
    return !(bowser.name === 'Internet Explorer' && bowser.version === '11.0');
  }
}
