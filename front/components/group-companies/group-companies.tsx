import { ExternalLink } from "lucide-react";
import { Company, GROUP_COMPANIES } from "@/lib/companies";

// Tarjeta de una empresa hermana: imagen destacada con el nombre en overlay,
// descripción y CTA "Visitar sitio" (enlace externo seguro).
function CompanyCard({ company }: { company: Company }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <a
        href={company.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block h-48 overflow-hidden"
        style={{ backgroundColor: company.background }}
        tabIndex={-1}
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={company.image}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <h3 className="absolute bottom-4 left-4 font-display text-xl font-semibold text-white">
          {company.name}
        </h3>
      </a>

      <div className="flex flex-1 flex-col p-6">
        <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
          {company.description}
        </p>
        <a
          href={company.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label={`Visitar el sitio de ${company.name} (se abre en una pestaña nueva)`}
        >
          Visitar sitio
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}

// Sección "Sitios de interés" — las demás empresas del Grupo CorpSC.
export function GroupCompanies() {
  return (
    <section
      aria-label="Sitios de interés del Grupo CorpSC"
      className="mx-auto w-full max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-10"
    >
      <h2 className="mb-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Sitios de interés
      </h2>
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">
        Conoce las demás plataformas del Grupo CorpSC.
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {GROUP_COMPANIES.map((c) => (
          <CompanyCard key={c.slug} company={c} />
        ))}
      </div>
    </section>
  );
}
