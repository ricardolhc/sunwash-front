import { TextDecoder, TextEncoder } from 'util';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
(globalThis as typeof globalThis & { __VITE_USE_HTTP__?: boolean }).__VITE_USE_HTTP__ = false;
(globalThis as typeof globalThis & { __VITE_USE_HTTP_AUTH__?: boolean }).__VITE_USE_HTTP_AUTH__ = false;
(globalThis as typeof globalThis & { __VITE_ADMIN_API_TOKEN__?: string }).__VITE_ADMIN_API_TOKEN__ = '';

if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = TextEncoder;
}

if (typeof globalThis.TextDecoder === 'undefined') {
  globalThis.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;
}
