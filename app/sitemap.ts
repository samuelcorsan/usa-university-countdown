import universities from "@/data/universities";

export default async function sitemap() {
  const baseUrl = "https://collegedecision.us";

  const universityRoutes = universities.map((university) => ({
    url: `${baseUrl}/${university.domain}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const routes = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  return [...routes, ...universityRoutes];
}
