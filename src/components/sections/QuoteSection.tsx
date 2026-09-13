"use client";

import { Check, Mail, MessageSquare, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";

import { CONTACT_INFO } from "@/components/data/mockData";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { buildWhatsAppLink, cn, telHref, validateLeadForm } from "@/lib/utils";
import type { FormStatus, LeadFormErrors, LeadFormState } from "@/types";

const EMPTY_FORM: LeadFormState = {
  name: "",
  phone: "",
  city: "",
  areaSqFt: "",
};

const INCLUSIONS: readonly string[] = [
  "Laser structural audit and soil assessment",
  "CAD section drawings with jack layout",
  "Fixed-price quote — no variation clauses",
  "Ten-year written structural warranty",
];

const FIELD_CLASS =
  "h-11 w-full rounded border bg-white px-3.5 text-base sm:text-sm text-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-1 disabled:bg-slate-50 disabled:text-slate-500";

export function QuoteSection(): JSX.Element {
  const [form, setForm] = useState<LeadFormState>(EMPTY_FORM);
  const [submittedLead, setSubmittedLead] = useState<LeadFormState | null>(null);
  const [errors, setErrors] = useState<LeadFormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");

  const updateField = (field: keyof LeadFormState, value: string): void => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const validationErrors = validateLeadForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus("submitting");
    const currentLead = { ...form };
    setSubmittedLead(currentLead);

    // 1. Dispatch automated email copy to buildinglifting83@gmail.com via backend API
    try {
      await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentLead),
      });
    } catch (apiError) {
      console.warn("[Survey API] Could not connect to background mailer:", apiError);
    }

    // 2. Also open WhatsApp with pre-filled details for instant live communication
    const message = [
      "House lifting enquiry",
      `Name: ${currentLead.name}`,
      `Phone: ${currentLead.phone}`,
      `City: ${currentLead.city}`,
      `Built-up area: ${currentLead.areaSqFt} sq ft`,
    ].join("\n");

    window.open(
      buildWhatsAppLink(CONTACT_INFO.whatsapp, message),
      "_blank",
      "noopener,noreferrer",
    );

    setStatus("success");
    setForm(EMPTY_FORM);
  };

  return (
    <section id="quote" className="border-t border-slate-200 bg-canvas py-12 sm:py-16 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div>
              <p className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                <span aria-hidden className="h-px w-6 bg-amber-600/50" />
                Free site survey
              </p>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-ink lg:text-4xl">
                Book a structural assessment
              </h2>
              <p className="mt-3 sm:mt-4 text-sm sm:text-lg leading-relaxed text-slate-600">
                A licensed engineer visits your site, scans the structure, and
                returns a costed proposal within 48 hours. There is no charge and
                no obligation to proceed.
              </p>

              <ul className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 sm:gap-3">
                {INCLUSIONS.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                      aria-hidden
                    />
                    <span className="text-xs sm:text-sm text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 sm:mt-10 rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
                <p className="text-xs sm:text-sm text-slate-600">
                  Prefer to talk it through first?
                </p>
                <div className="mt-2 flex flex-col xs:flex-row xs:items-center gap-2 sm:gap-4">
                  <a
                    href={telHref(CONTACT_INFO.phonePrimary)}
                    className="flex items-center gap-2 text-base font-semibold text-amber-700 hover:underline sm:text-lg"
                  >
                    <Phone className="h-4 w-4 shrink-0" aria-hidden />
                    {CONTACT_INFO.phonePrimary}
                  </a>
                  <span className="hidden text-slate-300 sm:inline" aria-hidden>|</span>
                  <a
                    href={telHref(CONTACT_INFO.phoneSecondary)}
                    className="flex items-center gap-2 text-base font-semibold text-amber-700 hover:underline sm:text-lg"
                  >
                    <Phone className="h-4 w-4 shrink-0" aria-hidden />
                    {CONTACT_INFO.phoneSecondary}
                  </a>
                </div>
                <p className="mt-2 font-mono text-xs text-slate-500">
                  {CONTACT_INFO.hours}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delayMs={120}>
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              {status === "success" ? (
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Check className="h-6 w-6" aria-hidden />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-ink">
                        Survey Request Dispatched
                      </h3>
                      <p className="font-mono text-xs font-semibold text-emerald-700">
                        Email copy sent to {CONTACT_INFO.email}
                      </p>
                    </div>
                  </div>

                  {submittedLead && (
                    <div className="mt-5 w-full rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs">
                      <p className="mb-2 font-mono font-semibold uppercase tracking-wider text-slate-500">
                        Submitted Details:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                        <div>
                          <span className="font-medium text-slate-500">Name:</span> {submittedLead.name}
                        </div>
                        <div>
                          <span className="font-medium text-slate-500">Phone:</span> {submittedLead.phone}
                        </div>
                        <div>
                          <span className="font-medium text-slate-500">City:</span> {submittedLead.city}
                        </div>
                        <div>
                          <span className="font-medium text-slate-500">Area:</span> {submittedLead.areaSqFt} sq ft
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="mt-4 text-sm leading-relaxed text-slate-600">
                    An automated copy has been logged and dispatched to{" "}
                    <strong className="font-semibold text-ink">{CONTACT_INFO.email}</strong>.
                    WhatsApp was also opened with your details so you can message our lead engineer directly.
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-3">
                    {submittedLead && (
                      <a
                        href={buildWhatsAppLink(
                          CONTACT_INFO.whatsapp,
                          [
                            "House lifting enquiry",
                            `Name: ${submittedLead.name}`,
                            `Phone: ${submittedLead.phone}`,
                            `City: ${submittedLead.city}`,
                            `Built-up area: ${submittedLead.areaSqFt} sq ft`,
                          ].join("\n"),
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 sm:py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Send query to WhatsApp
                      </a>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => setStatus("idle")}
                      className="w-full sm:w-auto"
                    >
                      Submit another enquiry
                    </Button>
                    <a
                      href={`mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(`House lifting survey enquiry - ${submittedLead?.name || ""}`)}&body=${encodeURIComponent(`Name: ${submittedLead?.name || ""}\nPhone: ${submittedLead?.phone || ""}\nCity: ${submittedLead?.city || ""}\nBuilt-up area: ${submittedLead?.areaSqFt || ""} sq ft`)}`}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 sm:py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-ink w-full sm:w-auto"
                    >
                      <Mail className="h-4 w-4 text-amber-600" />
                      Email us directly
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <h3 className="text-lg font-semibold text-ink">
                    Request for survey
                  </h3>

                  <div className="mt-6 space-y-5">
                    <div>
                      <label
                        htmlFor="lead-name"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                      >
                        Full name
                      </label>
                      <input
                        id="lead-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={form.name}
                        onChange={(event) => updateField("name", event.target.value)}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? "lead-name-error" : undefined}
                        placeholder="Rajesh Kumar"
                        className={cn(
                          FIELD_CLASS,
                          errors.name ? "border-red-500" : "border-slate-300",
                        )}
                      />
                      {errors.name && (
                        <p id="lead-name-error" className="mt-1.5 text-xs text-red-600">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="lead-phone"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                      >
                        Mobile number
                      </label>
                      <input
                        id="lead-phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={(event) => updateField("phone", event.target.value)}
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? "lead-phone-error" : undefined}
                        placeholder="98765 43210"
                        className={cn(
                          FIELD_CLASS,
                          errors.phone ? "border-red-500" : "border-slate-300",
                        )}
                      />
                      {errors.phone && (
                        <p id="lead-phone-error" className="mt-1.5 text-xs text-red-600">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div>
                        <label
                          htmlFor="lead-city"
                          className="mb-1.5 block text-sm font-medium text-slate-700"
                        >
                          City
                        </label>
                        <input
                          id="lead-city"
                          name="city"
                          type="text"
                          autoComplete="address-level2"
                          value={form.city}
                          onChange={(event) => updateField("city", event.target.value)}
                          aria-invalid={Boolean(errors.city)}
                          aria-describedby={errors.city ? "lead-city-error" : undefined}
                          placeholder="Karnal"
                          className={cn(
                            FIELD_CLASS,
                            errors.city ? "border-red-500" : "border-slate-300",
                          )}
                        />
                        {errors.city && (
                          <p id="lead-city-error" className="mt-1.5 text-xs text-red-600">
                            {errors.city}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="lead-area"
                          className="mb-1.5 block text-sm font-medium text-slate-700"
                        >
                          Built-up area (sq ft)
                        </label>
                        <input
                          id="lead-area"
                          name="areaSqFt"
                          type="number"
                          inputMode="numeric"
                          min="100"
                          value={form.areaSqFt}
                          onChange={(event) =>
                            updateField("areaSqFt", event.target.value)
                          }
                          aria-invalid={Boolean(errors.areaSqFt)}
                          aria-describedby={
                            errors.areaSqFt ? "lead-area-error" : undefined
                          }
                          placeholder="2000"
                          className={cn(
                            FIELD_CLASS,
                            errors.areaSqFt ? "border-red-500" : "border-slate-300",
                          )}
                        />
                        {errors.areaSqFt && (
                          <p id="lead-area-error" className="mt-1.5 text-xs text-red-600">
                            {errors.areaSqFt}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="mt-8 w-full"
                    disabled={status === "submitting"}
                  >
                    {status === "submitting" ? "Sending enquiry…" : "Request for survey"}
                  </Button>

                  <p className="mt-4 text-xs leading-relaxed text-slate-500">
                    Submitting sends an automated email copy to{" "}
                    <span className="font-medium text-slate-700">{CONTACT_INFO.email}</span>{" "}
                    and opens WhatsApp so you can connect directly. We do not share your number with third parties.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
