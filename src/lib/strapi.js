import { strapi } from "@strapi/client";

const client = strapi({
  baseURL: `${import.meta.env.VITE_STRAPI_URL}/api`,
  auth: import.meta.env.VITE_STRAPI_API_TOKEN,
});

export const homePage = client.single("home-page");
export const contactSubmissions = client.collection("contact-submissions");
export const globalSettings = client.single("global");
