export interface HWLinkMessage {
  type: 'HW_LINK_CLICKED';
  url: string;
}

export class HWProtocolWatcher {
  private isListening = false;

  constructor() {
    this.handleClick = this.handleClick.bind(this);
  }

  start(): void {
    if (this.isListening) {
      return;
    }

    document.addEventListener('click', this.handleClick, true);
    console.log('[hw-protocol-watcher] initialized');
    this.isListening = true;
  }

  stop(): void {
    if (!this.isListening) {
      return;
    }

    document.removeEventListener('click', this.handleClick, true);
    this.isListening = false;
  }

  private handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const anchor = target.closest('a');

    if (!anchor || !anchor.href) {
      return;
    }

    if (!anchor.href.startsWith('hw://')) {
      return;
    }

    console.log('event occurred')

    event.preventDefault();
    event.stopPropagation();

    // Check if we're in an iframe
    if (window.parent === window) {
      // Not in an iframe, do nothing
      return;
    }

    // Extract the path from hw://some-app-name:some-publisher.os/optional-path/etcetc
    const url = anchor.href.replace('hw://', '/');

    const message: HWLinkMessage = {
      type: 'HW_LINK_CLICKED',
      url: url
    };

    window.parent.postMessage(message, '*');
  }
}

// Auto-start functionality
let globalWatcher: HWProtocolWatcher | null = null;

export function startWatching(): HWProtocolWatcher {
  if (!globalWatcher) {
    globalWatcher = new HWProtocolWatcher();
  }
  globalWatcher.start();
  return globalWatcher;
}

export function stopWatching(): void {
  if (globalWatcher) {
    globalWatcher.stop();
  }
}

// Auto-start when module is loaded (can be disabled by calling stopWatching)
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => startWatching());
  } else {
    startWatching();
  }
}
