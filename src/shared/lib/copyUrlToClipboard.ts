import { toUrlSafeB64 } from '.';

export async function copyUrlToClipboard(text: string) {
  const params = new URLSearchParams({ code: toUrlSafeB64(text) });
  const toCopy = `${location.origin}?${params.toString()}`;

  await navigator.clipboard.writeText(toCopy);
}
