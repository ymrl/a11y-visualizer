import { SmallTargetInfo } from "../detector/targetDetector";
import { TargetEnlargerSettings } from "../settings/types";

export class IframeManager {
  private processedIframes = new WeakSet<HTMLIFrameElement>();
  private iframeObservers = new Map<HTMLIFrameElement, MutationObserver>();

  constructor(
    private onTargetsFound: (
      targets: SmallTargetInfo[],
      isIframe?: boolean,
    ) => void,
    private settings: TargetEnlargerSettings,
  ) {}

  public async scanForIframes(document: Document): Promise<SmallTargetInfo[]> {
    const iframes = document.querySelectorAll("iframe");
    const allTargets: SmallTargetInfo[] = [];

    for (const iframe of iframes) {
      try {
        // iframe自体が非表示の場合はスキップ
        const { isElementVisible } = await import(
          "../utils/viewportAdjustment"
        );
        if (!isElementVisible(iframe)) {
          continue;
        }

        const iframeTargets = await this.processIframe(iframe);
        allTargets.push(...iframeTargets);
      } catch (error) {
        console.debug("Cannot access iframe:", error);
      }
    }

    return allTargets;
  }

  private async processIframe(
    iframe: HTMLIFrameElement,
  ): Promise<SmallTargetInfo[]> {
    if (this.processedIframes.has(iframe)) {
      return [];
    }

    try {
      const iframeDoc = iframe.contentDocument;
      const iframeWindow = iframe.contentWindow;

      if (!iframeDoc || !iframeWindow) {
        throw new Error("Cannot access iframe document");
      }

      // Same-origin iframeの場合、直接操作可能
      const targets = await this.detectTargetsInIframe(
        iframe,
        iframeDoc,
        iframeWindow,
      );

      // iframe内の変更を監視
      this.observeIframeChanges(iframe, iframeDoc);

      this.processedIframes.add(iframe);
      return targets;
    } catch {
      // Cross-origin iframeの場合、postMessageで通信を試みる
      return this.handleCrossOriginIframe(iframe);
    }
  }

  private async detectTargetsInIframe(
    iframe: HTMLIFrameElement,
    iframeDoc: Document,
    iframeWindow: Window,
  ): Promise<SmallTargetInfo[]> {
    const { detectSmallTargets } = await import("../detector/targetDetector");
    const targets = detectSmallTargets(
      iframeDoc,
      iframeWindow,
      this.settings.minTargetSize,
    );

    // iframe内の座標をメインドキュメントの座標に変換
    const transformedTargets = targets.map((target): SmallTargetInfo => {
      const transformedPosition = this.transformIframeCoordinates(
        target.position,
        iframe,
        iframeWindow,
      );

      return {
        ...target,
        position: transformedPosition,
      };
    });

    // メインドキュメントのビューポートに表示されている要素のみをフィルタリング
    return transformedTargets.filter((targetInfo) => {
      // iframe内の要素だが、メインドキュメントのビューポート座標で判定
      // transformedPositionを使って仮想的なrectを作成して判定
      const rect = {
        top: targetInfo.position.y,
        left: targetInfo.position.x,
        bottom: targetInfo.position.y + targetInfo.position.height,
        right: targetInfo.position.x + targetInfo.position.width,
        width: targetInfo.position.width,
        height: targetInfo.position.height,
      };

      // ビューポート判定（margin: 50px）
      return (
        rect.top >= -50 &&
        rect.left >= -50 &&
        rect.bottom <= window.innerHeight + 50 &&
        rect.right <= window.innerWidth + 50
      );
    });
  }

  private transformIframeCoordinates(
    iframePosition: {
      x: number;
      y: number;
      absoluteX: number;
      absoluteY: number;
      width: number;
      height: number;
    },
    iframe: HTMLIFrameElement,
    iframeWindow: Window,
  ) {
    // iframeのメインドキュメント内での位置（ビューポート座標）
    const iframeRect = iframe.getBoundingClientRect();

    // メインドキュメントのスクロール位置
    const mainScrollX = window.scrollX;
    const mainScrollY = window.scrollY;

    // iframe内要素のビューポート座標を取得
    // iframePosition.absoluteXはiframe内での絶対座標（スクロール込み）なので、
    // iframe内のスクロールを引いてビューポート座標に変換
    const iframeViewportX = iframePosition.absoluteX - iframeWindow.scrollX;
    const iframeViewportY = iframePosition.absoluteY - iframeWindow.scrollY;

    // メインドキュメント内での最終的な座標を計算
    const mainViewportX = iframeViewportX + iframeRect.left;
    const mainViewportY = iframeViewportY + iframeRect.top;
    const mainAbsoluteX = mainViewportX + mainScrollX;
    const mainAbsoluteY = mainViewportY + mainScrollY;

    return {
      // ビューポート座標（スクロールなし）
      x: mainViewportX,
      y: mainViewportY,
      // 絶対座標（スクロール込み）- オーバーレイの配置に使用
      absoluteX: mainAbsoluteX,
      absoluteY: mainAbsoluteY,
      // サイズはそのまま
      width: iframePosition.width,
      height: iframePosition.height,
    };
  }

  private observeIframeChanges(
    iframe: HTMLIFrameElement,
    iframeDoc: Document,
  ): void {
    if (this.iframeObservers.has(iframe)) {
      return;
    }

    const observer = new MutationObserver(async () => {
      try {
        const targets = await this.detectTargetsInIframe(
          iframe,
          iframeDoc,
          iframe.contentWindow!,
        );
        this.onTargetsFound(targets, true);
      } catch (error) {
        console.debug("Error observing iframe changes:", error);
      }
    });

    observer.observe(iframeDoc.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    this.iframeObservers.set(iframe, observer);

    // iframe削除時のクリーンアップ
    const parentObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
          if (node === iframe) {
            this.cleanupIframe(iframe);
          }
        });
      });
    });

    parentObserver.observe(document.body, { childList: true, subtree: true });
  }

  private handleCrossOriginIframe(
    iframe: HTMLIFrameElement,
  ): SmallTargetInfo[] {
    // Cross-origin iframeの場合の処理
    const rect = iframe.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    // iframe自体が小さい場合は拡大対象とする
    // ただし、iframe自体が表示されている場合のみ
    if (
      rect.width < this.settings.minTargetSize ||
      rect.height < this.settings.minTargetSize
    ) {
      return [
        {
          element: iframe,
          position: {
            x: rect.x + scrollX,
            y: rect.y + scrollY,
            absoluteX: rect.x + scrollX,
            absoluteY: rect.y + scrollY,
            width: rect.width,
            height: rect.height,
          },
          recommendedSize: {
            width: Math.max(rect.width, this.settings.minTargetSize),
            height: Math.max(rect.height, this.settings.minTargetSize),
          },
        },
      ];
    }

    // iframe内部のコンテンツに対してpostMessageで通信を試みる
    this.attemptIframeCommunication(iframe);

    return [];
  }

  private attemptIframeCommunication(iframe: HTMLIFrameElement): void {
    try {
      // iframe内のTarget Enlargerに検出を依頼
      // iframe自身の位置情報も送信
      const iframeRect = iframe.getBoundingClientRect();
      iframe.contentWindow?.postMessage(
        {
          type: "TARGET_ENLARGER_SCAN",
          settings: this.settings,
          iframeRect: {
            left: iframeRect.left,
            top: iframeRect.top,
            width: iframeRect.width,
            height: iframeRect.height,
          },
        },
        "*",
      );

      // レスポンスリスナーを設定（既に設定済みの場合は重複しない）
      if (!this.messageListenerSet) {
        window.addEventListener("message", this.handleIframeMessage.bind(this));
        this.messageListenerSet = true;
      }
    } catch (error) {
      console.debug("Failed to communicate with iframe:", error);
    }
  }

  private messageListenerSet = false;

  private handleIframeMessage(event: MessageEvent): void {
    if (event.data.type !== "TARGET_ENLARGER_TARGETS") {
      return;
    }

    try {
      const { targets, iframeRect } = event.data;

      // iframe座標系からメイン座標系に変換
      // この場合はpostMessage経由なので、iframe内でビューポート座標として送られてきたものを変換
      const convertedTargets: SmallTargetInfo[] = targets.map(
        (target: SmallTargetInfo) => {
          // targetsはiframe内でのビューポート座標として送信されている前提
          const mainScrollX = window.scrollX;
          const mainScrollY = window.scrollY;

          // メインドキュメント内での座標を計算
          const mainViewportX = target.position.x + iframeRect.left;
          const mainViewportY = target.position.y + iframeRect.top;
          const mainAbsoluteX = mainViewportX + mainScrollX;
          const mainAbsoluteY = mainViewportY + mainScrollY;

          return {
            ...target,
            position: {
              ...target.position,
              x: mainViewportX,
              y: mainViewportY,
              absoluteX: mainAbsoluteX,
              absoluteY: mainAbsoluteY,
            },
          };
        },
      );

      this.onTargetsFound(convertedTargets, true);
    } catch (error) {
      console.debug("Failed to process iframe message:", error);
    }
  }

  private cleanupIframe(iframe: HTMLIFrameElement): void {
    const observer = this.iframeObservers.get(iframe);
    if (observer) {
      observer.disconnect();
      this.iframeObservers.delete(iframe);
    }
    this.processedIframes.delete(iframe);
  }

  public cleanup(): void {
    this.iframeObservers.forEach((observer) => observer.disconnect());
    this.iframeObservers.clear();
  }
}
