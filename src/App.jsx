import { useState, useEffect } from "react";
import { homePage } from "./lib/strapi";
import "./App.css";

function HeroBlock({ block }) {
  return (
    <div className="hero min-h-[70vh] bg-base-200">
      <div className="hero-content text-center max-w-2xl">
        <div>
          <h1 className="text-5xl font-bold">{block.heading}</h1>
          {block.subHeading && (
            <p className="py-4 text-xl font-medium text-primary">
              {block.subHeading}
            </p>
          )}
          {block.content && (
            <p className="py-2 text-base-content/70">{block.content}</p>
          )}
          <button className="btn btn-primary mt-4">Get in touch</button>
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

function App() {
  const [page, setPage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    homePage
      .find({ populate: { blocks: { populate: "*" } } })
      .then((res) => {
        setPage(res?.data ?? res);
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        console.error("Strapi fetch error:", err);
        setError(err?.message ?? String(err));
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
      <nav className="navbar bg-base-100 border-b border-base-200 px-6">
        <div className="flex-1">
          <span className="text-xl font-bold">{page.title}</span>
        </div>
        <div className="flex-none">
          <button className="btn btn-primary btn-sm">Contact</button>
        </div>
      </nav>

      {/* Fallback hero if no hero block is set in Strapi */}
      {!hasHero && (
        <div className="hero min-h-[70vh] bg-base-200">
          <div className="hero-content text-center max-w-2xl">
            <div>
              <h1 className="text-5xl font-bold">{page.title}</h1>
              <p className="py-6 text-base-content/70">{page.description}</p>
              <button className="btn btn-primary">Get in touch</button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic blocks */}
      {page.blocks?.map((block, i) => {
        if (block.__component === "blocks.hero")
          return <HeroBlock key={i} block={block} />;
        if (block.__component === "blocks.features")
          return <FeaturesBlock key={i} block={block} />;
        return null;
      })}

      {/* Footer */}
      <footer className="footer footer-center p-6 bg-base-200 text-base-content/60 text-sm border-t border-base-300 mt-auto">
        <p>
          © {new Date().getFullYear()} {page.title}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
