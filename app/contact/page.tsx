import { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm, ContactBackLink } from "@/components/sections/contact-form";

export const metadata: Metadata = {
  title: "Contact — Léo Hengebaert",
  description:
    "Parlez-moi de votre projet. Je réponds sous 24h avec une proposition adaptée.",
};

export default function ContactPage() {
  return (
    <div className="pt-28 pb-24 layout-container">
      <Suspense fallback={null}>
        <ContactBackLink />
      </Suspense>

      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <p className="text-xs font-semibold text-accent uppercase tracking-[0.4em] mb-4">
            Contact
          </p>
          <h1 className="text-5xl font-black tracking-tighter text-white leading-[0.95] mb-6">
            Parlons de
            <br />
            <span className="text-accent">votre projet.</span>
          </h1>
          <p className="text-base text-white/70 leading-relaxed max-w-lg">
            Remplissez le formulaire ci-dessous. Je vous réponds sous 24h avec une
            proposition adaptée à votre activité et votre budget.
          </p>
        </div>

        <Suspense fallback={null}>
          <ContactForm />
        </Suspense>
      </div>
    </div>
  );
}
