import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export async function POST(request: Request) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "unknown";

  try {
    await limiter.check(5, ip); // 5 requests per minute per IP
  } catch {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const { suggestion } = await request.json();

    if (!suggestion || typeof suggestion !== "string") {
      return NextResponse.json(
        { error: "Invalid suggestion" },
        { status: 400 }
      );
    }

    // Send to Discord webhook
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      throw new Error("Discord webhook URL not configured");
    }

    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [
          {
            title: "🎓 New University Suggestion",
            description: suggestion,
            color: 0x4a90e2, // Nice blue color
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Suggestion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
