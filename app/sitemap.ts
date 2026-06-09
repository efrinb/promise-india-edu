import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://promiselandindia.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://promiselandindia.com/about",
      lastModified: new Date(),
    },
    {
      url: "https://promiselandindia.com/contact",
      lastModified: new Date(),
    },
  ];
}