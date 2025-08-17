import { ImageResponse } from "next/og";
import universities from "@/data/universities";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");

    if (!domain) {
      return new ImageResponse(
        (
          <div
            style={{
              background: "#000000",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 32,
              fontWeight: 500,
            }}
          >
            Domain parameter required
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    const university = universities.find(
      (uni) => uni.domain.toLowerCase() === domain.toLowerCase()
    );

    if (!university) {
      return new ImageResponse(
        (
          <div
            style={{
              background: "#000000",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 32,
              fontWeight: 500,
            }}
          >
            University Not Found
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    const formatDate = (dateStr: string) => {
      const [day, month, year] = dateStr.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    const earlyDate = formatDate(university.notificationEarly);
    const regularDate = formatDate(university.notificationRegular);

    return new ImageResponse(
      (
        <div
          style={{
            background:
              "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#1e293b",
            padding: "60px",
            fontFamily: "Inter, system-ui, sans-serif",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
              opacity: 0.6,
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "24px",
              marginBottom: "40px",
              zIndex: 2,
            }}
          >
            <img
              src={
                university.fileExists
                  ? `https://collegedecision.us/logos/${university.domain}.jpg`
                  : `https://logo.clearbit.com/${university.domain}?size=80`
              }
              alt={`${university.name} logo`}
              width="80"
              height="80"
              style={{
                borderRadius: "16px",
                border: "3px solid #ffffff",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
              }}
            />

            <div
              style={{
                width: "2px",
                height: "60px",
                background:
                  "linear-gradient(to bottom, transparent, #64748b, transparent)",
              }}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "900",
                  color: "#000000",
                  letterSpacing: "-0.02em",
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                collegedecision.us
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                }}
              >
                Decision Tracker
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: "56px",
              fontWeight: "800",
              marginBottom: "16px",
              textAlign: "center",
              lineHeight: "1.1",
              letterSpacing: "-0.03em",
              maxWidth: "900px",
              zIndex: 2,
            }}
          >
            {university.name}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "50px",
              zIndex: 2,
            }}
          >
            <div
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#64748b",
              }}
            >
              ⏰
            </div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: "600",
                color: "#475569",
                letterSpacing: "0.02em",
              }}
            >
              Decision Date Countdown
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "40px",
              marginBottom: "50px",
              justifyContent: "center",
              zIndex: 2,
            }}
          >
            {university.showEarly && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "28px 36px",
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
                  border: "3px solid #10b981",
                  borderRadius: "20px",
                  minWidth: "220px",
                  boxShadow: "0 8px 32px rgba(16, 185, 129, 0.15)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-8px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#10b981",
                    color: "white",
                    padding: "4px 16px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Early
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    marginBottom: "12px",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginTop: "8px",
                  }}
                >
                  Decision
                </div>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "800",
                    color: "#1e293b",
                    textAlign: "center",
                  }}
                >
                  {earlyDate}
                </div>
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "28px 36px",
                background: "linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)",
                border: "3px solid #3b82f6",
                borderRadius: "20px",
                minWidth: "220px",
                boxShadow: "0 8px 32px rgba(59, 130, 246, 0.15)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-8px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#3b82f6",
                  color: "white",
                  padding: "4px 16px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Regular
              </div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: "12px",
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginTop: "8px",
                }}
              >
                Decision
              </div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "800",
                  color: "#1e293b",
                  textAlign: "center",
                }}
              >
                {regularDate}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "20px 32px",
              background: "rgba(255, 255, 255, 0.8)",
              borderRadius: "16px",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              backdropFilter: "blur(10px)",
              zIndex: 2,
            }}
          >
            <div
              style={{
                fontSize: "16px",
                color: "#475569",
                fontWeight: "500",
              }}
            >
              Track your countdown at
            </div>
            <div
              style={{
                fontSize: "16px",
                color: "#1e293b",
                fontWeight: "700",
                letterSpacing: "0.02em",
              }}
            >
              collegedecision.us
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
