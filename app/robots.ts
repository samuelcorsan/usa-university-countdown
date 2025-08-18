import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/static/"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/logos/", "/icons/"],
      },
    ],
    sitemap: "https://collegedecision.us/sitemap.xml",
  };
}
