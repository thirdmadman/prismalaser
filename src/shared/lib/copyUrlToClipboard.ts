import LZString from 'lz-string';

export async function copyUrlToClipboard(text: string) {
  const compressed = LZString.compressToEncodedURIComponent(text);
  const params = new URLSearchParams({ data: compressed });
  const toCopy = `${location.origin}?${params.toString()}`;

  await navigator.clipboard.writeText(toCopy);
}
