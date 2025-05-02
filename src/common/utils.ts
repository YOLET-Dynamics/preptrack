export function formatError(input: string): string {
  if (!input) return "";

  const trimmedInput = input.trim();
  if (trimmedInput.length === 0) return "";

  const firstChar = trimmedInput.charAt(0).toUpperCase();
  const restOfString = trimmedInput.slice(1);

  let result = firstChar + restOfString;

  if (!result.endsWith(".")) {
    result += ".";
  }

  return result;
}
