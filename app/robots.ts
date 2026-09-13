import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
      // Search Engines
      {
        userAgent: ["Googlebot", "Bingbot", "Applebot", "Yandex"],
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
      // AI Answer Engines & LLM Search Agents (AEO Optimization)
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "PerplexityBot",
          "cohere-ai",
          "Google-Extended",
        ],
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
