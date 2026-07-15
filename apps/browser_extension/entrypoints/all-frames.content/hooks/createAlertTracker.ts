export type AlertHandlerOptions = {
  /**
   * Whether the alert can be announced right now (visible, not busy, not
   * suppressed by a modal, etc.).
   */
  isRenderable: (element: Element) => boolean;
  /** Announce the alert. Called at most once per renderable transition. */
  announce: (element: Element) => void;
};

export type AlertTracker = {
  /**
   * Evaluate an alert element. Announces it when it is renderable and has not
   * been announced since it last became renderable. When it is not renderable
   * yet, the element is kept tracked so it can be re-evaluated later via
   * {@link recheckPending}.
   */
  handle: (element: Element, options: AlertHandlerOptions) => void;
  /**
   * Re-evaluate every tracked alert. Attribute/style changes such as toggling
   * `display:none` do not reach a childList/characterData observer, so
   * visibility must be re-checked on each scan. An alert that has become
   * non-renderable has its announced state reset so it will be announced again
   * once it becomes renderable — mirroring screen readers, which re-announce a
   * `role="alert"` element each time it (re)appears. Disconnected elements are
   * discarded.
   */
  recheckPending: (options: AlertHandlerOptions) => void;
};

export const createAlertTracker = (): AlertTracker => {
  // All alert elements currently being tracked. The boolean records whether the
  // alert has already been announced while in its current renderable state.
  // When an alert becomes non-renderable, the flag is reset to `false` so a
  // later hidden→visible transition re-announces it.
  const tracked = new Map<Element, boolean>();

  const evaluate = (element: Element, options: AlertHandlerOptions) => {
    if (options.isRenderable(element)) {
      if (!tracked.get(element)) {
        tracked.set(element, true);
        options.announce(element);
      }
      return;
    }
    // Not renderable yet: keep watching so it can be announced once it becomes
    // renderable, and reset the announced flag for hidden→visible transitions.
    tracked.set(element, false);
  };

  const handle = (element: Element, options: AlertHandlerOptions) => {
    evaluate(element, options);
  };

  const recheckPending = (options: AlertHandlerOptions) => {
    tracked.forEach((_announced, element) => {
      if (!element.isConnected) {
        tracked.delete(element);
        return;
      }
      evaluate(element, options);
    });
  };

  return { handle, recheckPending };
};
