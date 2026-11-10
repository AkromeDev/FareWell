import manifest from 'src/assets/images/responsive.json';

/**
 * Responsive variants of the large images (tools/responsive-images.mjs writes
 * them and src/assets/images/responsive.json). Templates bind
 * [attr.srcset]="srcsetOf(path)" and the intrinsic size for width/height, so
 * the browser picks a small file on a phone and reserves the right space.
 */
interface Entry {
  width: number;
  height: number;
  variants: { src: string; width: number }[];
}

const ENTRIES = manifest.responsive as Record<string, Entry>;
const SIZES = manifest.sizes as Record<string, { width: number; height: number }>;

/** The manifest keys are relative to src/; templates use both forms. */
function keyOf(path: string): string {
  let key = (path ?? '').replace(/^\//, '');
  try {
    key = decodeURIComponent(key);
  } catch {
    // Keep the path as it is.
  }
  return key;
}

function entryOf(path: string): Entry | undefined {
  return ENTRIES[keyOf(path)];
}

/** `srcset` for a known image, or null so Angular leaves the attribute out. */
export function srcsetOf(path: string): string | null {
  const entry = entryOf(path);
  if (!entry) return null;
  return entry.variants.map((v) => `/${v.src} ${v.width}w`).join(', ');
}

/**
 * Intrinsic size of an image in src/assets/images. An image the manifest does
 * not know (added later, from elsewhere) gets a 4:3 hint until
 * tools/responsive-images.mjs runs again.
 */
export function sizeOf(path: string): { width: number; height: number } {
  const entry = entryOf(path) ?? SIZES[keyOf(path)];
  return entry ? { width: entry.width, height: entry.height } : { width: 1600, height: 1200 };
}
