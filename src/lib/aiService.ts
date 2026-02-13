const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export interface ToxicityResult {
  is_toxic: boolean;
  reason: string;
  severity: "none" | "mild" | "moderate" | "severe";
}

export async function checkToxicity(text: string, authorName?: string): Promise<ToxicityResult> {
  try {
    const resp = await fetch(`${SUPABASE_URL}/functions/v1/check-toxicity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({ text, authorName }),
    });

    if (!resp.ok) {
      console.error("Toxicity check failed:", resp.status);
      return { is_toxic: false, reason: "Check unavailable", severity: "none" };
    }

    return await resp.json();
  } catch (e) {
    console.error("Toxicity check error:", e);
    return { is_toxic: false, reason: "Check unavailable", severity: "none" };
  }
}

// Auto-warn: saves warning to localStorage
const WARNINGS_KEY = "echoroom_warnings";

export function autoWarnUser(userKey: string, reason: string) {
  try {
    const stored = localStorage.getItem(WARNINGS_KEY);
    const warnings: Record<string, string[]> = stored ? JSON.parse(stored) : {};
    if (!warnings[userKey]) warnings[userKey] = [];
    warnings[userKey].push(`${new Date().toLocaleDateString()}: [AI Auto-Warn] ${reason}`);
    localStorage.setItem(WARNINGS_KEY, JSON.stringify(warnings));
  } catch {}
}

type Msg = { role: "user" | "assistant"; content: string };

export async function streamAdminChat({
  messages,
  communityContext,
  onDelta,
  onDone,
}: {
  messages: Msg[];
  communityContext: string;
  onDelta: (text: string) => void;
  onDone: () => void;
}) {
  const resp = await fetch(`${SUPABASE_URL}/functions/v1/admin-chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify({ messages, communityContext }),
  });

  if (!resp.ok || !resp.body) {
    const errData = await resp.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to start chat stream");
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);

      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") {
        streamDone = true;
        break;
      }

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  // Final flush
  if (textBuffer.trim()) {
    for (let raw of textBuffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (raw.startsWith(":") || raw.trim() === "") continue;
      if (!raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {}
    }
  }

  onDone();
}
