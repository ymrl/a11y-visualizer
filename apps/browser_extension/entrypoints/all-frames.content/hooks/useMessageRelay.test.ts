import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { isA11yVisualizerMessage } from "../../content/shared/protocol";

// Test the relay logic directly without React hooks
// The browser test environment doesn't allow setting `source` in MessageEvent constructor
// with arbitrary objects, so we test the filtering logic via an iframe approach.

describe("useMessageRelay logic", () => {
  const originalParent = Object.getOwnPropertyDescriptor(window, "parent");
  let listener: ((event: MessageEvent) => void) | undefined;

  function setupRelay(
    forwardMode: "postMessage" | "self",
    parentWindow?: Window,
  ) {
    if (forwardMode !== "postMessage") return;
    const parent = parentWindow ?? window.parent;
    if (parent === window) return;

    listener = (event: MessageEvent) => {
      if (event.source === window) return;
      if (!isA11yVisualizerMessage(event.data)) return;
      parent.postMessage(event.data, "*");
    };

    window.addEventListener("message", listener);
  }

  beforeEach(() => {
    listener = undefined;
  });

  afterEach(() => {
    if (listener) {
      window.removeEventListener("message", listener);
    }
    if (originalParent) {
      Object.defineProperty(window, "parent", originalParent);
    }
  });

  test("does not relay non-a11y-visualizer messages", () => {
    const mockPostMessage = vi.fn();
    const mockParent = { postMessage: mockPostMessage } as unknown as Window;

    setupRelay("postMessage", mockParent);

    // Messages without source set (source = null, not window) but invalid data
    window.dispatchEvent(
      new MessageEvent("message", {
        data: { type: "other-message", data: {} },
      }),
    );
    window.dispatchEvent(
      new MessageEvent("message", {
        data: "just a string",
      }),
    );
    window.dispatchEvent(
      new MessageEvent("message", {
        data: null,
      }),
    );

    expect(mockPostMessage).not.toHaveBeenCalled();
  });

  test("relays a11y-visualizer keystroke messages", () => {
    const mockPostMessage = vi.fn();
    const mockParent = { postMessage: mockPostMessage } as unknown as Window;

    setupRelay("postMessage", mockParent);

    const message = {
      type: "a11y-visualizer:keystroke",
      data: { id: 1, keys: "Tab", timestamp: 123 },
    };

    // source defaults to null (not window), so it passes the source check
    window.dispatchEvent(new MessageEvent("message", { data: message }));

    expect(mockPostMessage).toHaveBeenCalledWith(message, "*");
  });

  test("relays a11y-visualizer live-region messages", () => {
    const mockPostMessage = vi.fn();
    const mockParent = { postMessage: mockPostMessage } as unknown as Window;

    setupRelay("postMessage", mockParent);

    const message = {
      type: "a11y-visualizer:live-region",
      data: {
        content: "Hello",
        level: "polite",
        duration: 5000,
        timestamp: 123,
      },
    };

    window.dispatchEvent(new MessageEvent("message", { data: message }));

    expect(mockPostMessage).toHaveBeenCalledWith(message, "*");
  });

  test("does not set up listener when forwardMode is 'self'", () => {
    const mockPostMessage = vi.fn();
    const mockParent = { postMessage: mockPostMessage } as unknown as Window;

    setupRelay("self", mockParent);

    const message = {
      type: "a11y-visualizer:keystroke",
      data: { id: 1, keys: "Tab", timestamp: 123 },
    };
    window.dispatchEvent(new MessageEvent("message", { data: message }));

    expect(mockPostMessage).not.toHaveBeenCalled();
  });

  test("does not set up listener when parent === window (top frame)", () => {
    setupRelay("postMessage", window);
    expect(listener).toBeUndefined();
  });

  test("does not relay messages from own window (via iframe)", async () => {
    const mockPostMessage = vi.fn();
    const mockParent = { postMessage: mockPostMessage } as unknown as Window;

    setupRelay("postMessage", mockParent);

    // Dispatch with source = window (simulating own window sending)
    // In real browser, source is set by the runtime; here we verify
    // that when source IS window, the message is not relayed.
    // We use postMessage to self which sets source to window.
    const received = new Promise<void>((resolve) => {
      const handler = () => {
        window.removeEventListener("message", handler);
        resolve();
      };
      // Add a second listener to know when the event was processed
      window.addEventListener("message", handler);
    });

    window.postMessage(
      {
        type: "a11y-visualizer:keystroke",
        data: { id: 99, keys: "Enter", timestamp: 999 },
      },
      "*",
    );

    await received;
    expect(mockPostMessage).not.toHaveBeenCalled();
  });
});
