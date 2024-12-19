import universities from "@/universities";

export default async function sitemap() {
  const baseUrl = "https://count.nyurejects.com";

  // Get university routes
  const universityRoutes = universities.map((university) => ({
    url: `${baseUrl}/${university.domain}`,
    lastModified: new Date().toISOString(),
  }));

  // Add other routes
  const routes = [""].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes, ...universityRoutes];
}
