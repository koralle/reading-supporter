export function textFromMessage(message: {
  content: readonly { type: string; text?: string }[];
}): string {
  return message.content
    .filter((part) => part.type === "text")
    .map((part) => part.text ?? "")
    .join("");
}

export function createPrompt(question: string, selectedText: string): string {
  if (!selectedText.trim()) return question;
  return [
    "Selected text from the PDF:",
    "---",
    selectedText.trim(),
    "---",
    "",
    "Answer the user's question using this passage as the primary context.",
    "",
    question,
  ].join("\n");
}
