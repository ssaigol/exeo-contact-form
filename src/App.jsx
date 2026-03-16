import { useState, useEffect, useRef, useMemo } from "react";
import { defaultCountries, parseCountry } from "react-international-phone";
import "react-international-phone/style.css";
import countryList from "react-select-country-list";
import { useTranslation } from "react-i18next";
import { Loader, CircleCheckBig } from "lucide-react";
import * as Sentry from "@sentry/react";
import ContactForm from "./ContactForm";
import { ChevronRight } from "lucide-react";
import Questionnaire from "./Questionnaire";
import Review from "./Review";
import {
  getQuestionSet,
  questionSets,
  getInitialQuestionData,
  questionnairePayloadLabels,
} from "./questionConfig";

const pageParams = new URLSearchParams(window.location.search);
const PAGE_PARAM = pageParams.get("page") || "";
const LANG_PARAM = pageParams.get("lang") || "en";

function App() {
  const { t, i18n } = useTranslation();

  // Determine which question set (if any) to use
  const questionSetName = useMemo(() => getQuestionSet(PAGE_PARAM), []);
  const hasQuestionnaire = questionSetName !== null;

  const initialQuestionData = useMemo(
    () => getInitialQuestionData(questionSetName),
    [questionSetName],
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "us",
    phone: "",
    newsletter: false,
    ...initialQuestionData,
  });

  const [submitting, setSubmitting] = useState(false);
  const [success2, setSuccess2] = useState(false);
  const [page, setPage] = useState("contact");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [pageVisible, setPageVisible] = useState(true);
  const [editingFrom, setEditingFrom] = useState(null);
  const [success1, setSuccess1] = useState(false);

  // Pipedrive IDs from first submission
  const [pipedrivePersonId, setPipedrivePersonId] = useState(null);
  const [pipedriveDealId, setPipedriveDealId] = useState(null);

  // Snapshot of contact info at first submission for change detection
  const contactSnapshotRef = useRef(null);

  // Build the active questions array (needs t and i18n, so must be in component)
  const PREFERRED_COUNTRIES = ["US", "CA", "MX"];

  const getCountryOptions = (locale, preferredCodes = []) => {
    const displayNames = new Intl.DisplayNames([locale], { type: "region" });
    const allOptions = countryList()
      .getData()
      .map(({ value }) => ({
        value,
        label: displayNames.of(value),
      }));

    const preferred = preferredCodes
      .map((code) => allOptions.find((o) => o.value === code))
      .filter(Boolean)
      .map((o) => ({ ...o, preferred: true }));

    const rest = allOptions.filter((o) => !preferredCodes.includes(o.value));

    return [
      ...preferred,
      { label: "──────────", value: "__divider__", isDisabled: true },
      ...rest,
    ];
  };

  //Auto dismiss success1 overlay
  useEffect(() => {
    if (!success1) return;
    const timer = setTimeout(() => setSuccess1(false), 2500);
    return () => clearTimeout(timer);
  }, [success1]);

  // activeQuestions: the resolved questions array for the current set, or empty
  const activeQuestions = useMemo(() => {
    if (!hasQuestionnaire) return [];
    return questionSets[questionSetName](
      t,
      i18n,
      getCountryOptions,
      PREFERRED_COUNTRIES,
    );
  }, [questionSetName, t, i18n]);

  // Dynamic canSubmit: all required questions in the active set must be answered
  const canSubmit = useMemo(() => {
    const contactFilled =
      formData.firstName && formData.lastName && formData.email;
    if (!hasQuestionnaire) return contactFilled;

    const questionsFilled = activeQuestions
      .filter((q) => q.required)
      .every((q) => {
        const val = formData[q.key];
        if (val === null || val === undefined) return false;
        if (typeof val === "string") return val.trim().length > 0;
        if (typeof val === "object") return !!val?.value;
        return true;
      });

    return contactFilled && questionsFilled;
  }, [formData, activeQuestions, hasQuestionnaire]);

  // Payload labels for the active question set
  const payloadLabels = questionSetName
    ? questionnairePayloadLabels[questionSetName]
    : [];

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      window.parent.postMessage(
        {
          event: "contactForm.page_height",
          payload: { height: document.body.scrollHeight + "px" },
        },
        "*",
      );
    });
    observer.observe(document.body);
    return () => observer.disconnect();
  }, []);

  async function getCsrf() {
    const response = await fetch("/api/v1/csrf");
    const data = await response.json();
    const csrf = {};
    csrf[`${data.keys.name}`] = data.name;
    csrf[`${data.keys.value}`] = data.value;
    return csrf;
  }

  function buildContactPayload() {
    const firstName = formData.firstName;
    const lastName = formData.lastName.toUpperCase();
    const email = formData.email;
    const country = defaultCountries.find(
      (c) => parseCountry(c).iso2 === formData.country,
    );
    const phone = formData.phone
      ? "+" + parseCountry(country).dialCode + formData.phone.replace(/\D/g, "")
      : "";
    const newsletter = formData.newsletter ? "Yes" : "No";
    return { firstName, lastName, email, phone, newsletter };
  }

  function getContactChanges() {
    if (!contactSnapshotRef.current) return null;
    const current = buildContactPayload();
    const snapshot = contactSnapshotRef.current;
    const changes = {};
    for (const key of Object.keys(current)) {
      if (current[key] !== snapshot[key]) {
        changes[key] = current[key];
      }
    }
    return Object.keys(changes).length > 0 ? changes : null;
  }

  function transitionTo(fn) {
    setPageVisible(false);
    setTimeout(() => {
      fn();
      setPageVisible(true);
    }, 200);
  }

  function resetForm() {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      country: "us",
      phone: "",
      newsletter: false,
      ...initialQuestionData,
    });
    setPipedrivePersonId(null);
    setPipedriveDealId(null);
    contactSnapshotRef.current = null;
    setSubmitting(false);
    setSuccess2(true);
    setTimeout(() => setSuccess2(false), 4000);
    setPage("contact");
  }

  // First submission: contact info only
  async function handleContactSubmit(e) {
    e.preventDefault();
    if (page !== "contact") return;

    const form = document.getElementById("contact-form");
    if (!form.reportValidity()) return;

    setSubmitting(true);
    let payload = {};

    try {
      const csrf = import.meta.env.PROD ? await getCsrf() : {};
      const contactFields = buildContactPayload();
      payload = {
        page: PAGE_PARAM,
        lang: LANG_PARAM,
        ...contactFields,
        ...csrf,
      };

      let responseData = {};

      if (import.meta.env.PROD) {
        const response = await fetch("/api/v1/calendly/contact/assessment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          Sentry.captureException(
            new Error(`HTTP ${response.status}: ${response.statusText}`),
            { extra: { payload } },
          );
        } else {
          responseData = await response.json();
        }
      } else {
        console.log(`*DEVELOPMENT* Contact Submit:`, payload);
        responseData = {
          pipedrive_person_id: "dev_person_123",
          pipedrive_deal_id: "dev_deal_456",
        };
      }

      // If no questionnaire, go straight to success
      if (!hasQuestionnaire) {
        window.parent.postMessage({ event: "contactForm.submission1" }, "*");
        resetForm();
        return;
      }

      setPipedrivePersonId(responseData.pipedrive_person_id);
      setPipedriveDealId(responseData.pipedrive_deal_id);
      contactSnapshotRef.current = contactFields;
      window.parent.postMessage({ event: "contactForm.submission1" }, "*");

      setSuccess1(true);
      transitionTo(() => {
        setCurrentQuestion(0);
        setPage("questionnaire");
      });
    } catch (err) {
      Sentry.captureException(err, { extra: { payload } });
    } finally {
      setSubmitting(false);
    }
  }

  // Second submission: questionnaire + conditionally changed contact info
  async function handleReviewSubmit(e) {
    e.preventDefault();
    if (!canSubmit || page !== "review") return;

    setSubmitting(true);
    let payload = {};

    try {
      const csrf = import.meta.env.PROD ? await getCsrf() : {};

      const questions = {};
      payloadLabels.forEach((label, i) => {
        const answer = formData[`question${i + 1}`];
        questions[label] = typeof answer === "string" ? answer : answer?.label;
      });

      payload = {
        pipedrive_deal_id: pipedriveDealId,
        questions,
        ...csrf,
      };

      // Include changed contact fields + person ID only if edits were made
      const contactChanges = getContactChanges();
      if (contactChanges) {
        payload.pipedrive_person_id = pipedrivePersonId;
        Object.assign(payload, contactChanges);
      }

      if (import.meta.env.PROD) {
        const response = await fetch("/api/v1/calendly/contact/assessment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          Sentry.captureException(
            new Error(`HTTP ${response.status}: ${response.statusText}`),
            { extra: { payload } },
          );
        }
      } else {
        console.log(`*DEVELOPMENT* Review Submit:`, payload);
      }
    } catch (err) {
      Sentry.captureException(err, { extra: { payload } });
    } finally {
      window.parent.postMessage({ event: "contactForm.submission2" }, "*");
      resetForm();
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (page === "contact" && !editingFrom) {
      handleContactSubmit(e);
    } else if (page === "contact" && editingFrom) {
      // Enter key during edit mode — go back to review
      const form = document.getElementById("contact-form");
      if (!form.reportValidity()) return;
      setEditingFrom(null);
      transitionTo(() => setPage("review"));
    } else if (page === "review") {
      handleReviewSubmit(e);
    }
  }

  function goNext() {
    if (page === "questionnaire") {
      setEditingFrom(null);
      transitionTo(() => setPage("review"));
    }
  }

  return (
    <div className="relative w-full h-full px-7 pb-8 pt-15 flex flex-col bg-white gap-10 border border-gray-200 rounded-md rounded-t-lg z-10 shadow-md">
      {/* Overlays */}
      {success1 && (
        <div
          className={`absolute inset-0 h-full w-full z-20 bg-white/90 flex flex-col items-center justify-center gap-5 transition-opacity duration-700 ease-in-out ${
            success1 ? "opacity-100" : "opacity-0"
          }`}
        >
          <CircleCheckBig className="text-green-600/70 w-15 h-15" />
          <p className="text-gray-600 px-6 py-5 text-center bg-white">
            {t("questionnaireIntro")}
          </p>
        </div>
      )}
      {success2 && (
        <div className="absolute inset-0 h-full w-full z-20 bg-white/95 flex flex-col items-center justify-center gap-5">
          <CircleCheckBig className="text-green-600/70 w-15 h-15" />
          <p className="text-xl font-medium">{t("success")}</p>
        </div>
      )}

      <div className="absolute top-0 left-0 h-4.5 w-full bg-primary2 z-30 grid grid-cols-3 rounded-t-lg" />
      <form
        id="contact-form"
        onSubmit={handleFormSubmit}
        style={{
          opacity: pageVisible ? 1 : 0,
          transition: "opacity 200ms ease",
        }}
      >
        {page === "contact" && (
          <ContactForm formData={formData} setFormData={setFormData} t={t} />
        )}
        {page === "questionnaire" && (
          <Questionnaire
            formData={formData}
            setFormData={setFormData}
            currentQuestion={currentQuestion}
            setCurrentQuestion={setCurrentQuestion}
            skipIntro={editingFrom === "review"}
            questions={activeQuestions}
            pageParam={PAGE_PARAM}
          />
        )}
        {page === "review" && (
          <Review
            formData={formData}
            t={t}
            setPage={(p) => {
              setEditingFrom(
                p === "contact" || p === "questionnaire" ? "review" : null,
              );
              transitionTo(() => setPage(p));
            }}
            setCurrentQuestion={setCurrentQuestion}
            questions={activeQuestions}
          />
        )}
      </form>

      {/* Buttons */}
      <div className="relative flex items-center justify-between gap-3 px-5">
        {/* <button
          type="button"
          className={`${page === "questionnaire" && !currentQuestion && !canSubmit ? "visible" : "invisible pointer-events-none"} -mt-8 cursor-pointer font-light flex items-center gap-1 text-md hover:text-gray-400 text-gray-500`}
          onClick={() => {
            if (editingFrom === "review") {
              setEditingFrom(null);
              transitionTo(() => setPage("review"));
            } else {
              transitionTo(() => setPage("contact"));
            }
          }}
        >
          <CornerDownLeft className="h-5 w-5" />
          {t("back")}
        </button> */}
        <button></button>

        {/* Contact page: Submit (only during initial flow, or if no questionnaire) */}
        {page === "contact" && !editingFrom && (
          <button
            type="submit"
            form="contact-form"
            disabled={submitting}
            className="rounded-lg px-3 py-1 hover:bg-primary2/80 bg-primary2 disabled:bg-gray-400 disabled:cursor-not-allowed text-white cursor-pointer"
          >
            {t("submit")}
          </button>
        )}

        {/* Review page: Submit button */}
        {canSubmit && page === "review" && (
          <button
            type="submit"
            form="contact-form"
            disabled={submitting}
            className="rounded-lg px-3 py-1 hover:bg-primary2/80 bg-primary2 disabled:bg-gray-400 disabled:cursor-not-allowed text-white cursor-pointer"
          >
            {t("submit")}
          </button>
        )}

        {submitting && (
          <div className="absolute right-1/2 translate-x-20">
            <Loader className="animate-spin" />
          </div>
        )}

        {/* Next/Review button — only show if there IS a questionnaire */}
        {hasQuestionnaire && (
          <button
            type="button"
            className={`${
              (page === "contact" && editingFrom === "review") ||
              (page === "questionnaire" &&
                (currentQuestion === activeQuestions.length - 1 || canSubmit))
                ? "visible opacity-100"
                : "opacity-0 pointer-events-none invisible"
            } transition-opacity duration-1000 ease cursor-pointer flex items-center gap-1 text-[1.05rem] font-light hover:text-gray-400 text-gray-500`}
            onClick={() => {
              if (page === "contact" && editingFrom === "review") {
                const form = document.getElementById("contact-form");
                if (!form.reportValidity()) return;
                setEditingFrom(null);
                transitionTo(() => setPage("review"));
              } else if (canSubmit) {
                setEditingFrom(null);
                transitionTo(() => setPage("review"));
              } else {
                goNext();
              }
            }}
          >
            {canSubmit || (page === "contact" && editingFrom === "review")
              ? t("review")
              : t("next")}
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
