import { strapi } from "@strapi/client";

const client = strapi({
  baseURL: `${import.meta.env.VITE_STRAPI_URL}/api`,
  auth: import.meta.env.VITE_STRAPI_API_TOKEN,
});

export const homePage = client.single("home-page");
export const globalSettings = client.single("global");

export async function submitContactForm(data) {
  const res = await fetch(
    `${import.meta.env.VITE_STRAPI_URL}/api/contact-submissions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    },
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err?.error?.message ?? `Request failed with status ${res.status}`,
    );
  }
  return res.json();
}
