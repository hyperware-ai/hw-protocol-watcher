# @hyperware-ai/hw-protocol-watcher

Event listener for `hw://` protocol links that communicates with parent frames via postMessage.

## Installation

```bash
npm install @hyperware-ai/hw-protocol-watcher
```

## Usage

### Auto-start (Default)

The watcher automatically starts when the module is loaded:

```javascript
import '@hyperware-ai/hw-protocol-watcher';

// Now any hw:// links will be handled automatically
```

### Manual Control

```javascript
import { startWatching, stopWatching, HWProtocolWatcher } from '@hyperware-ai/hw-protocol-watcher';

// Start watching
startWatching();

// Stop watching
stopWatching();

// Or use the class directly for more control
const watcher = new HWProtocolWatcher();
watcher.start();
watcher.stop();
```

## How it Works

1. **Link Detection**: Listens for clicks on anchor tags (`<a>`) with `href` attributes starting with `hw://`
2. **Iframe Check**: Only processes links when running inside an iframe (`window.parent !== window`)
3. **Message Format**: Sends a postMessage to the parent window with:
   ```javascript
   {
     type: 'HW_LINK_CLICKED',
     url: '/some-app-name:some-publisher.os/optional-path/etcetc'
   }
   ```

## Example

Given a link like:
```html
<a href="hw://some-app-name:some-publisher.os/optional-path/etcetc">Open App</a>
```

When clicked inside an iframe, it will send:
```javascript
{
  type: 'HW_LINK_CLICKED',
  url: '/some-app-name:some-publisher.os/optional-path/etcetc'
}
```

## TypeScript Support

Full TypeScript support included with type definitions for the message format:

```typescript
interface HWLinkMessage {
  type: 'HW_LINK_CLICKED';
  url: string;
}
```

## License

MIT