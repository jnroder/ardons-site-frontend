import { useState, useEffect, useRef } from "react";
import { homePage, contactSubmissions, globalSettings } from "./lib/strapi";
import roderBuiltLogo from "./assets/roder-built-logo.svg";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
  FaYoutube,
  FaTiktok,
  FaPinterest,
  FaGithub,
  FaLink,
} from "react-icons/fa6";
import "./App.css";

const SOCIAL_ICONS = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  twitter: FaXTwitter,
  x: FaXTwitter,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  pinterest: FaPinterest,
  github: FaGithub,
};

function ContactModal({ open, onClose }) {
  const dialogRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      await contactSubmissions.create({ data: form });
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err?.message ?? "Something went wrong. Please try again.");
    }
  }

  function handleClose() {
    setStatus(null);
    setErrorMsg("");
    onClose();
  }

  return (
    <dialog ref={dialogRef} className="modal" onClose={handleClose}>
      <div className="modal-box max-w-lg">
        <h3 className="font-bold text-lg mb-4">Get in touch</h3>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="text-success text-5xl">✓</div>
            <p className="text-center">Thanks! Your message has been sent.</p>
            <button className="btn btn-primary" onClick={handleClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {status === "error" && (
              <div className="alert alert-error text-sm">{errorMsg}</div>
            )}
            <label className="form-control">
              <div className="label">
                <span className="label-text">Name</span>
              </div>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="input input-bordered w-full"
                required
              />
            </label>
            <label className="form-control">
              <div className="label">
                <span className="label-text">Email</span>
              </div>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input input-bordered w-full"
                required
              />
            </label>
            <label className="form-control">
              <div className="label">
                <span className="label-text">Subject</span>
              </div>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="What's this about?"
                className="input input-bordered w-full"
              />
            </label>
            <label className="form-control">
              <div className="label">
                <span className="label-text">Message</span>
              </div>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your message…"
                className="textarea textarea-bordered w-full h-32"
                required
              />
            </label>
            <div className="modal-action mt-2">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleClose}
                disabled={status === "loading"}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Send message"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}

function HeroBlock({ block, onContactOpen }) {
  const strapiUrl = import.meta.env.VITE_STRAPI_URL;
  const bg = block.backgroundImage;
  const bgSrc = bg
    ? bg.url?.startsWith("http")
      ? bg.url
      : `${strapiUrl}${bg.url}`
    : null;
  return (
    <div
      className="hero min-h-[70vh]"
      style={
        bgSrc
          ? {
              backgroundImage: `url(${bgSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}
      }
    >
      {bgSrc && <div className="hero-overlay bg-opacity-50 rounded-none" />}
      <div className="hero-content text-center max-w-2xl relative z-10">
        <div>
          <h1 className={`text-5xl font-bold${bgSrc ? " text-white" : ""}`}>
            {block.heading}
          </h1>
          {block.subHeading && (
            <p
              className={`py-4 text-xl font-medium${bgSrc ? " text-white/90" : " text-primary"}`}
            >
              {block.subHeading}
            </p>
          )}
          {block.content && (
            <p
              className={`py-2${bgSrc ? " text-white/75" : " text-base-content/70"}`}
            >
              {block.content}
            </p>
          )}
          <button className="btn btn-primary mt-4" onClick={onContactOpen}>
            Get in touch
          </button>
        </div>
      </div>
    </div>
  );
}

function FeaturesBlock({ block }) {
  return (
    <section className="py-20 px-6 bg-base-100">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {block.features?.map((feature, i) => (
            <div key={i} className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h2 className="card-title">{feature.title}</h2>
                <p className="text-base-content/70">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialLinksBlock({ block }) {
  return (
    <section className="py-16 px-6 bg-base-100">
      <div className="max-w-3xl mx-auto text-center">
        {block.heading && (
          <h2 className="text-2xl font-bold mb-8">{block.heading}</h2>
        )}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {block.links?.map((link, i) => {
            const Icon = SOCIAL_ICONS[link.platform?.toLowerCase()] ?? FaLink;
            return (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label ?? link.platform}
                className="btn btn-outline btn-primary btn-square text-xl"
              >
                <Icon />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function GalleryBlock({ block }) {
  const strapiUrl = import.meta.env.VITE_STRAPI_URL;
  const images = block.images ?? [];
  const [current, setCurrent] = useState(0);
  if (!images.length) return null;
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);
  const img = images[current];
  const src = img.url?.startsWith("http") ? img.url : `${strapiUrl}${img.url}`;
  return (
    <section className="py-16 px-6 bg-base-200">
      <div className="max-w-5xl mx-auto">
        {block.heading && (
          <h2 className="text-2xl font-bold text-center mb-8">
            {block.heading}
          </h2>
        )}
        <div className="flex flex-col items-center gap-4">
          <img
            src={src}
            alt={img.alternativeText || img.name || `Project ${current + 1}`}
            className="rounded-box object-cover w-full max-h-120"
          />
          <div className="flex items-center gap-4">
            <button className="btn btn-outline btn-sm" onClick={prev}>
              &#8249; Prev
            </button>
            <span className="text-sm text-base-content/50">
              {current + 1} / {images.length}
            </span>
            <button className="btn btn-outline btn-sm" onClick={next}>
              Next &#8250;
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`btn btn-xs btn-circle ${
                  i === current ? "btn-primary" : "btn-ghost"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function App() {
  const [page, setPage] = useState(null);
  const [siteGlobal, setSiteGlobal] = useState(null);
  const [error, setError] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    homePage
      .find({
        populate: {
          blocks: {
            on: {
              "blocks.hero": { populate: ["images", "backgroundImage"] },
              "blocks.features": { populate: { features: true } },
              "blocks.social-links": { populate: { links: true } },
              "blocks.gallery": { populate: { images: true } },
            },
          },
        },
      })
      .then((res) => setPage(res?.data ?? res))
      .catch((err) => {
        if (err?.name === "AbortError") return;
        console.error("Strapi fetch error:", err);
        setError(err?.message ?? String(err));
      });

    globalSettings
      .find({ populate: { socialLinks: true } })
      .then((res) => {
        console.log("Global response:", JSON.stringify(res, null, 2));
        setSiteGlobal(res?.data ?? res);
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        console.warn("Global settings not available:", err?.message);
      });
  }, []);

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error max-w-md">{error}</div>
      </div>
    );

  if (!page)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  const hasHero = page.blocks?.some((b) => b.__component === "blocks.hero");

  return (
    <div className="min-h-screen" data-theme="light">
      {/* Navbar */}
      <nav className="flex justify-between navbar bg-base-100 border-b border-base-200 px-6">
        <div>
          <img src={roderBuiltLogo} alt={page.title} className="h-10 w-auto" />
        </div>
        <div>
          <span className="font-bold text-lg ml-2">{page.title}</span>
        </div>
        <div className="justify-end">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setContactOpen(true)}
          >
            Contact
          </button>
        </div>
      </nav>

      {/* Fallback hero if no hero block is set in Strapi */}
      {!hasHero && (
        <div className="hero min-h-[70vh] bg-base-200">
          <div className="hero-content text-center max-w-2xl">
            <div>
              <h1 className="text-5xl font-bold">{page.title}</h1>
              <p className="py-6 text-base-content/70">{page.description}</p>
              <button
                className="btn btn-primary"
                onClick={() => setContactOpen(true)}
              >
                Get in touch
              </button>
            </div>
          </div>
        </div>
      )}

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />

      {/* Dynamic blocks */}
      {page.blocks?.map((block, i) => {
        if (block.__component === "blocks.hero")
          return (
            <HeroBlock
              key={i}
              block={block}
              onContactOpen={() => setContactOpen(true)}
            />
          );
        if (block.__component === "blocks.features")
          return <FeaturesBlock key={i} block={block} />;
        if (block.__component === "blocks.gallery")
          return <GalleryBlock key={i} block={block} />;
        return null;
      })}

      {/* Footer */}
      <footer className="footer px-8 py-5 bg-base-200 text-base-content/60 text-sm border-t border-base-300 mt-auto flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1">
          {siteGlobal?.socialLinks?.map((link, i) => {
            const Icon = SOCIAL_ICONS[link.platform?.toLowerCase()] ?? FaLink;
            return (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label ?? link.platform}
                className="btn btn-ghost btn-square btn-sm text-lg"
              >
                <Icon />
              </a>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {siteGlobal?.phone && (
            <a
              href={`tel:${siteGlobal.phone.replace(/\D/g, "")}`}
              className="hover:text-primary transition-colors"
            >
              {siteGlobal.phone}
            </a>
          )}
          {siteGlobal?.email && (
            <a
              href={`mailto:${siteGlobal.email}`}
              className="hover:text-primary transition-colors"
            >
              {siteGlobal.email}
            </a>
          )}
          <span>
            © {new Date().getFullYear()} {page.title}. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
