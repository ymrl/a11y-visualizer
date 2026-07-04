export type AlertHandlerOptions = {
  /**
   * Whether the alert can be announced right now (visible, not busy, not
   * suppressed by a modal, etc.).
   */
  isRenderable: (element: Element) => boolean;
  /** Announce the alert. Called at most once per element. */
  announce: (element: Element) => void;
};

export type AlertTracker = {
  /**
   * Evaluate an alert element. Announces it when it is renderable and has not
   * been announced yet. When it is not renderable yet, the element is kept as
   * pending so it can be re-evaluated later via {@link recheckPending}.
   */
  handle: (element: Element, options: AlertHandlerOptions) => void;
  /**
   * Re-evaluate all pending alerts (those previously skipped because they were
   * not renderable). Attribute/style changes such as toggling `display:none`
   * do not reach a childList/characterData observer, so visibility must be
   * re-checked on each scan. Disconnected elements are discarded.
   */
  recheckPending: (options: AlertHandlerOptions) => void;
};

export const createAlertTracker = (): AlertTracker => {
  const processed = new WeakSet<Element>();
  const pending = new Set<Element>();

  const handle = (element: Element, options: AlertHandlerOptions) => {
    if (processed.has(element)) {
      pending.delete(element);
      return;
    }
    if (!options.isRenderable(element)) {
      // Keep watching so it can be announced once it becomes renderable.
      pending.add(element);
      return;
    }
    processed.add(element);
    pending.delete(element);
    options.announce(element);
  };

  const recheckPending = (options: AlertHandlerOptions) => {
    pending.forEach((element) => {
      if (!element.isConnected) {
        pending.delete(element);
        return;
      }
      handle(element, options);
    });
  };

  return { handle, recheckPending };
};
