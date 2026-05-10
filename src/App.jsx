import { useState, useEffect, useRef } from "react";
import { homePage, globalSettings, submitContactForm } from "./lib/strapi";
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
      await submitContactForm(form);
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
      className={`hero min-h-[85vh] ${bgSrc ? "" : "bg-base-200"}`}
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
      {bgSrc && <div className="hero-overlay bg-opacity-60 rounded-none" />}
      <div className="hero-content text-center max-w-3xl relative z-10">
        <div>
          {block.subHeading && (
            <p
              className={`text-sm font-semibold uppercase tracking-widest mb-4 ${bgSrc ? "text-white/80" : "text-primary"}`}
            >
              {block.subHeading}
            </p>
          )}
          <h1
            className={`text-6xl font-bold leading-tight tracking-tight ${bgSrc ? "text-white" : "text-base-content"}`}
          >
            {block.heading}
          </h1>
          {block.content && (
            <p
              className={`mt-6 text-lg leading-relaxed max-w-xl mx-auto ${bgSrc ? "text-white/75" : "text-base-content/60"}`}
            >
              {block.content}
            </p>
          )}
          <button
            className="btn btn-primary btn-lg mt-8 font-semibold tracking-wide"
            onClick={onContactOpen}
          >
            {block.ctaText || "Get a Free Quote"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FeaturesBlock({ block }) {
  return (
    <section className="py-24 px-6 bg-base-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-2">
            What We Offer
          </p>
          <h2 className="text-3xl font-bold text-base-content">
            Built Right. Built to Last.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {block.features?.map((feature, i) => (
            <div
              key={i}
              className="card bg-base-100 border border-base-300 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <div className="card-body gap-3">
                <div className="w-10 h-1 bg-primary rounded-full" />
                <h2 className="card-title text-base-content font-bold">
                  {feature.title}
                </h2>
                <p className="text-base-content/60 text-sm leading-relaxed">
                  {feature.description}
                </p>
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
    <section className="py-24 px-6 bg-neutral">
      <div className="max-w-5xl mx-auto">
        {block.heading && (
          <div className="text-center mb-10">
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-2">
              Our Work
            </p>
            <h2 className="text-3xl font-bold text-neutral-content">
              {block.heading}
            </h2>
          </div>
        )}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={src}
            alt={img.alternativeText || img.name || `Project ${current + 1}`}
            className="object-cover w-full max-h-120"
          />
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 btn btn-circle btn-neutral opacity-80 hover:opacity-100"
          >
            &#8249;
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-circle btn-neutral opacity-80 hover:opacity-100"
          >
            &#8250;
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
            {current + 1} / {images.length}
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                i === current
                  ? "bg-primary w-6"
                  : "bg-neutral-content/30 hover:bg-neutral-content/60"
              }`}
            />
          ))}
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
    <div className="min-h-screen" data-theme="rbc">
      {/* Navbar */}
      <nav className="navbar bg-neutral text-neutral-content px-6 shadow-md">
        <div className="flex-1">
          <img
            src={roderBuiltLogo}
            alt={page.title}
            className="h-10 w-auto invert brightness-200"
          />
        </div>
        <div className="hidden md:flex">
          <span className="font-semibold tracking-wide text-neutral-content/80">
            {page.title}
          </span>
        </div>
        <div className="flex-none ml-4">
          <button
            className="btn btn-primary btn-sm font-semibold tracking-wide"
            onClick={() => setContactOpen(true)}
          >
            Get a Quote
          </button>
        </div>
      </nav>

      {/* Contact bar */}
      {(siteGlobal?.phone || siteGlobal?.email) && (
        <div className="bg-primary text-primary-content flex flex-wrap items-center justify-center gap-6 py-2 px-6 text-sm font-medium">
          {siteGlobal.phone && (
            <a
              href={`tel:${siteGlobal.phone.replace(/\D/g, "")}`}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.25 1.01l-2.2 2.22z" />
              </svg>
              {siteGlobal.phone}
            </a>
          )}
          {siteGlobal.email && (
            <a
              href={`mailto:${siteGlobal.email}`}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 2l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" />
              </svg>
              {siteGlobal.email}
            </a>
          )}
        </div>
      )}

      {/* Fallback hero if no hero block is set in Strapi */}
      {!hasHero && (
        <div className="hero min-h-[75vh] bg-base-200">
          <div className="hero-content text-center max-w-3xl">
            <div>
              <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">
                Licensed &amp; Local
              </p>
              <h1 className="text-6xl font-bold leading-tight tracking-tight text-base-content">
                {page.title}
              </h1>
              <p className="mt-6 text-lg text-base-content/60 max-w-xl mx-auto leading-relaxed">
                {page.description}
              </p>
              <button
                className="btn btn-primary btn-lg mt-8 font-semibold tracking-wide"
                onClick={() => setContactOpen(true)}
              >
                Get a Free Quote
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
      <footer className="bg-neutral text-neutral-content px-8 py-6 flex items-center justify-between flex-wrap gap-4 text-sm">
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
                className="btn btn-ghost btn-square btn-sm text-lg text-neutral-content/70 hover:text-neutral-content"
              >
                <Icon />
              </a>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-neutral-content/60">
          {siteGlobal?.phone && (
            <a
              href={`tel:${siteGlobal.phone.replace(/\D/g, "")}`}
              className="hover:text-primary transition-colors"
            >
              {siteGlobal.phone}
            </a>
          )}
          {" • "}
          {siteGlobal?.email && (
            <a
              href={`mailto:${siteGlobal.email}`}
              className="hover:text-primary transition-colors"
            >
              {siteGlobal.email}
            </a>
          )}
          {" • "}
          <span>
            &copy; {new Date().getFullYear()} {page.title}. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
