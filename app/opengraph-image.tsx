import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/lib/data";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default async function Image() {
  const [font, photo] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/Geist-Regular.ttf")),
    readFile(join(process.cwd(), "public/images/profile_image.png"), "base64"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#060708",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          color: "#eceef0",
          fontFamily: "Geist",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, color: "#8b929b" }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, background: "#c8ff2e" }} />
            {`${profile.location.toUpperCase()} · ${profile.coords}`}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 92, letterSpacing: -3, lineHeight: 1 }}>{profile.name}</div>
            <div style={{ fontSize: 40, color: "#c8ff2e", marginTop: 20 }}>{profile.role}</div>
            <div style={{ fontSize: 28, color: "#8b929b", marginTop: 28 }}>
              Flutter · Node.js · Google Cloud · AI agents
            </div>
          </div>

          <div style={{ display: "flex", gap: 40, fontSize: 22, color: "#565c64" }}>
            <span>4+ years shipping</span>
            <span>25+ apps released</span>
            <span>Team lead of 15</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", marginLeft: 48 }}>
          <img
            src={`data:image/png;base64,${photo}`}
            width={340}
            height={340}
            style={{
              objectFit: "cover",
              borderRadius: 24,
              border: "2px solid rgba(255,255,255,0.16)",
            }}
          />
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Geist", data: font, style: "normal", weight: 400 }] }
  );
}
