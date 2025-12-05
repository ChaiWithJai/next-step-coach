/**
 * Transcript Parser Utilities
 *
 * Parses WebVTT (.vtt) and SubRip (.srt) subtitle formats into plain text,
 * stripping timestamps and formatting metadata.
 */

/**
 * Parse WebVTT format content
 * Removes WEBVTT header, timestamps, cue identifiers, and styling
 */
export function parseVTT(content: string): string {
  const lines = content.split("\n");
  const textLines: string[] = [];

  let inCue = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip WEBVTT header and metadata
    if (trimmed.startsWith("WEBVTT") || trimmed.startsWith("NOTE")) {
      continue;
    }

    // Skip timestamp lines (e.g., "00:00:00.000 --> 00:00:02.000")
    if (trimmed.includes("-->")) {
      inCue = true;
      continue;
    }

    // Skip cue identifiers (numeric or named)
    if (/^\d+$/.test(trimmed) || /^[a-zA-Z][\w-]*$/.test(trimmed)) {
      continue;
    }

    // Skip empty lines (they separate cues)
    if (trimmed === "") {
      inCue = false;
      continue;
    }

    // Collect text content
    if (inCue || textLines.length > 0) {
      // Remove VTT styling tags like <v Speaker>, <c.class>, etc.
      const cleanLine = trimmed
        .replace(/<v\s+[^>]*>/gi, "")
        .replace(/<\/v>/gi, "")
        .replace(/<c\.[^>]*>/gi, "")
        .replace(/<\/c>/gi, "")
        .replace(/<[^>]+>/g, "");

      if (cleanLine) {
        textLines.push(cleanLine);
      }
    }
  }

  return textLines.join("\n");
}

/**
 * Parse SubRip (.srt) format content
 * Removes sequence numbers, timestamps, and formatting tags
 */
export function parseSRT(content: string): string {
  const lines = content.split("\n");
  const textLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip sequence numbers
    if (/^\d+$/.test(trimmed)) {
      continue;
    }

    // Skip timestamp lines (e.g., "00:00:00,000 --> 00:00:02,000")
    if (trimmed.includes("-->")) {
      continue;
    }

    // Skip empty lines
    if (trimmed === "") {
      continue;
    }

    // Remove HTML-style formatting tags often used in SRT
    const cleanLine = trimmed
      .replace(/<[^>]+>/g, "")
      .replace(/\{[^}]+\}/g, ""); // Remove ASS-style tags

    if (cleanLine) {
      textLines.push(cleanLine);
    }
  }

  return textLines.join("\n");
}

/**
 * Auto-detect format and parse transcript
 * Falls back to returning content as-is for plain text files
 */
export function parseTranscript(content: string, fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "vtt":
      return parseVTT(content);
    case "srt":
      return parseSRT(content);
    case "txt":
    default:
      // For plain text, just return as-is (trimmed)
      return content.trim();
  }
}
