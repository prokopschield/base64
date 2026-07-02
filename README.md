# @prokopschield/base64

### Installation

```
npm install @prokopschield/base64
pnpm install @prokopschield/base64
yarn add @prokopschield/base64
```

### Usage

```typescript
import { encode, decode } from '@prokopschield/base64';

encode(/* any buffer */); // base-64 string
decode(/* base64 str */); // Uint8Array
```

`encode()` produces unpadded URL-safe Base-64, using `~` for value 62 and `_` for value 63.

`decode()` accepts output of `encode()`, as well as standard (`+`, `/`) and URL-safe (`-`, `_`) Base-64; padding and whitespace are ignored, so padded and MIME-wrapped input decode correctly.

### Command-line tools

The package installs two executables:

```sh
base64-encode < input.bin > output.b64
base64-decode < input.b64 > output.bin
```

`base64-encode` reads bytes from stdin and writes Base-64 to stdout in 80-character lines. `base64-decode` reads Base-64 from stdin, ignoring padding, whitespace, and other non-alphabet characters, and writes the decoded bytes to stdout.
