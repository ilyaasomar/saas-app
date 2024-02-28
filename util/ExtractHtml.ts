export function extractHtml(text: string | null) {
  const htmlPattern = /<\!DOCTYPE html>[\s\s]*<\/html>/i;

  const match = text?.match(htmlPattern);

  return match ? match[0] : null;
}
