"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { sendCateringInquiry } from "@/app/catering/actions";
import { cateringEventOptions, cateringMealOptions } from "@/content/catering";
import type { CateringFormMode, CateringFormState } from "@/lib/catering/types";
import { site } from "@/config/site";
import { CateringMenuSelector } from "./CateringMenuSelector";
import { trackEvent } from "@/lib/analytics";

const idleState: CateringFormState = { status: "idle" };

export function CateringInquiryForm({
  mode,
  externalUrl,
  previewState,
}: {
  mode: CateringFormMode;
  externalUrl?: string;
  previewState?: "success" | "error";
}) {
  const [startedAt] = useState(() => Date.now());
  const seeded = previewState
    ? {
        status: previewState,
        message:
          previewState === "success"
            ? "Thank you. Your catering inquiry has been received."
            : "We could not send your inquiry.",
        errors:
          previewState === "error"
            ? { fullName: "Enter a name between 2 and 80 characters." }
            : undefined,
      }
    : idleState;
  const [state, action, pending] = useActionState(sendCateringInquiry, seeded);
  const statusRef = useRef<HTMLDivElement>(null);
  const successTracked = useRef(false);
  useEffect(() => {
    if (state.status !== "idle") statusRef.current?.focus();
    if (
      state.status === "success" &&
      !previewState &&
      !successTracked.current
    ) {
      successTracked.current = true;
      trackEvent("catering_submit", { form_name: "catering_inquiry" });
    }
  }, [previewState, state.status]);

  if (state.status === "success")
    return (
      <div
        className="catering-form-status success"
        ref={statusRef}
        tabIndex={-1}
        aria-live="polite"
      >
        <span aria-hidden="true">✓</span>
        <h3>Thank you. Your catering inquiry has been received.</h3>
        <p>The Namak team will contact you using the information provided.</p>
        <div className="button-row">
          <Link className="button" href="/">
            Return Home
          </Link>
          <Link className="button button-quiet" href="/menu">
            View Menu
          </Link>
        </div>
      </div>
    );

  const errors = state.errors ?? {};
  const value = (name: string) => {
    const candidate = state.values?.[name];
    return typeof candidate === "string" ? candidate : "";
  };

  return (
    <form action={action} className="catering-inquiry-form" noValidate>
      <input type="hidden" name="startedAt" value={startedAt} />
      <div className="catering-honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state.status === "error" && (
        <div
          className="catering-form-status error"
          ref={statusRef}
          tabIndex={-1}
          role="alert"
        >
          <h3>We could not send your inquiry.</h3>
          <p>
            {errors.form ??
              "Please review the highlighted fields or call Namak directly at 214-730-0047."}
          </p>
          <a
            href={site.phoneHref}
            data-analytics-event="call_click"
            data-analytics-placement="catering-error"
          >
            Call Namak
          </a>
        </div>
      )}
      <div className="catering-form-grid">
        <Field label="Full Name" name="fullName" error={errors.fullName}>
          <input
            id="fullName"
            name="fullName"
            required
            minLength={2}
            maxLength={80}
            defaultValue={value("fullName")}
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
          />
        </Field>
        <Field label="Email" name="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            defaultValue={value("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
        </Field>
        <Field label="Phone Number" name="phone" error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            minLength={7}
            maxLength={25}
            autoComplete="tel"
            defaultValue={value("phone")}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
        </Field>
        <Field label="Event Date" name="eventDate" error={errors.eventDate}>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            required
            defaultValue={value("eventDate")}
            aria-invalid={!!errors.eventDate}
            aria-describedby={errors.eventDate ? "eventDate-error" : undefined}
          />
        </Field>
        <Field
          label="Event Category"
          name="eventType"
          error={errors.eventType}
          full
        >
          <select
            id="eventType"
            name="eventType"
            required
            defaultValue={value("eventType")}
            aria-invalid={!!errors.eventType}
            aria-describedby={errors.eventType ? "eventType-error" : undefined}
          >
            <option value="">Choose an event category</option>
            {cateringEventOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Specific Function or Ceremony Name"
          name="specificFunction"
          optional
          help="Share the specific celebration or function if applicable."
          error={errors.specificFunction}
          full
        >
          <input
            id="specificFunction"
            name="specificFunction"
            maxLength={100}
            placeholder="For example: Sangeet, Griha Pravesh, Sweet 16 or company lunch"
            defaultValue={value("specificFunction")}
            aria-invalid={!!errors.specificFunction}
            aria-describedby="specificFunction-help"
          />
        </Field>
        <Field
          label="Event Location or ZIP Code"
          name="eventLocation"
          optional
          error={errors.eventLocation}
        >
          <input
            id="eventLocation"
            name="eventLocation"
            maxLength={150}
            defaultValue={value("eventLocation")}
            aria-invalid={!!errors.eventLocation}
            aria-describedby={
              errors.eventLocation ? "eventLocation-error" : undefined
            }
          />
        </Field>
        <Field
          label="Estimated Guest Count"
          name="guestCount"
          error={errors.guestCount}
        >
          <input
            id="guestCount"
            name="guestCount"
            type="number"
            required
            min={1}
            max={10000}
            step={1}
            inputMode="numeric"
            defaultValue={value("guestCount")}
            aria-invalid={!!errors.guestCount}
            aria-describedby={
              errors.guestCount ? "guestCount-error" : undefined
            }
          />
        </Field>
      </div>

      <fieldset
        className="meal-preference"
        aria-describedby={
          errors.mealPreference ? "mealPreference-error" : undefined
        }
      >
        <legend>Food Preference</legend>
        <div className="meal-preference-grid">
          {cateringMealOptions.map((option) => (
            <label key={option.value}>
              <input
                type="radio"
                name="mealPreference"
                value={option.value}
                required
                defaultChecked={value("mealPreference") === option.value}
              />
              <span aria-hidden="true">✓</span>
              <strong>{option.label}</strong>
            </label>
          ))}
        </div>
        {errors.mealPreference && (
          <p className="field-error" id="mealPreference-error">
            {errors.mealPreference}
          </p>
        )}
      </fieldset>

      <div className="menu-interest-field">
        <h3>
          Menu Items of Interest <span>Optional</span>
        </h3>
        <p>
          Select a few dishes you are interested in, or choose “Not sure yet”
          and our team can discuss options with you.
        </p>
        <CateringMenuSelector
          defaultSelected={
            Array.isArray(state.values?.menuItemIds)
              ? state.values.menuItemIds
              : []
          }
        />
        {errors.menuItemIds && (
          <p className="field-error">{errors.menuItemIds}</p>
        )}
        <p className="form-note">
          Menu selections are preferences only. Availability and catering
          pricing will be confirmed by the Namak team.
        </p>
      </div>

      <Field
        label="Additional Details"
        name="notes"
        optional
        help="Tell us anything else that would help our team understand the occasion."
        error={errors.notes}
        full
      >
        <textarea
          id="notes"
          name="notes"
          maxLength={1000}
          rows={5}
          defaultValue={value("notes")}
          aria-invalid={!!errors.notes}
          aria-describedby="notes-help"
        />
      </Field>

      <div className="catering-submit-area">
        {mode === "webhook" ? (
          <button className="button" type="submit" disabled={pending}>
            {pending ? "Sending inquiry…" : "Send Catering Inquiry"}
          </button>
        ) : mode === "external" && externalUrl ? (
          <a className="button" href={externalUrl}>
            Open Catering Inquiry Form
          </a>
        ) : (
          <div className="catering-disabled-fallback">
            <strong>Online inquiries are being prepared.</strong>
            <p>Please call our team to discuss your event.</p>
            <a
              className="button"
              href={site.phoneHref}
              data-analytics-event="call_click"
              data-analytics-placement="catering-disabled"
            >
              Call {site.phone}
            </a>
          </div>
        )}
        <p>
          Prefer to speak directly?{" "}
          <a
            href={site.phoneHref}
            data-analytics-event="call_click"
            data-analytics-placement="catering-form"
          >
            Call {site.phone}.
          </a>
        </p>
        <small>
          Submitting this form does not confirm availability or a catering
          booking. Menu options, service details, and catering pricing will be
          confirmed by the Namak team.
        </small>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  optional,
  help,
  error,
  full,
  children,
}: {
  label: string;
  name: string;
  optional?: boolean;
  help?: string;
  error?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`catering-field ${full ? "field-full" : ""}`}>
      <label htmlFor={name}>
        {label}
        {optional && <span>Optional</span>}
      </label>
      {children}
      {help && (
        <p className="field-help" id={`${name}-help`}>
          {help}
        </p>
      )}
      {error && (
        <p className="field-error" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
