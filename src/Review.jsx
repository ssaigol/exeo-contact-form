import { Pencil } from "lucide-react";
import { defaultCountries, parseCountry } from "react-international-phone";

function Review({ formData, t, setPage, setCurrentQuestion }) {
  const questionnaireQuestions = [
    t("q1"),
    t("q2Short"),
    t("q3"),
    t("q4"),
    t("q5Short"),
    t("q6Short"),
  ];

  const country = defaultCountries.find(
    (c) => parseCountry(c).iso2 === formData.country,
  );
  const phone = formData.phone
    ? "+" + parseCountry(country).dialCode + formData.phone
    : "";
  const contactFields = [
    { label: t("firstName"), value: formData.firstName },
    { label: t("lastName"), value: formData.lastName },
    { label: t("email"), value: formData.email },
    { label: t("phone"), value: phone || "—" },
  ];

  return (
    <div className="flex flex-col gap-7 px-8">
      <h1 className="text-xl font-medium ">{t("reviewTitle")}</h1>

      <hr className="text-gray-200" />

      {/* Contact Info */}
      <div className="flex flex-row-reverse gap-5">
        <button
          type="button"
          onClick={() => setPage("contact")}
          className="self-start cursor-pointer flex items-center gap-1 text-sm text-gray-400 hover:underline hover:text-gray-500"
          aria-label="Edit contact information"
        >
          <Pencil className="w-4 h-4" />
          {t("edit")}
        </button>
        <div className="flex-1 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {contactFields.map(({ label, value }) => (
              <div key={label} className="flex flex-col">
                <span className="text-gray-500 text-xs">{label}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className="text-gray-200" />

      {/* Questionnaire Answers */}
      <div className="flex flex-col gap-5">
        <button
          type="button"
          onClick={() => {
            setCurrentQuestion(0);
            setPage("questionnaire");
          }}
          className="self-end cursor-pointer flex items-center gap-1 text-sm text-gray-400 hover:underline hover:text-gray-500"
          aria-label="Edit questionnaire"
        >
          <Pencil className="w-4 h-4" />
          {t("edit")}
        </button>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            {questionnaireQuestions.map((question, i) => {
              const answer = formData[`question${i + 1}`];
              const display =
                typeof answer === "string"
                  ? answer || "—"
                  : (answer?.label ?? "—");
              return (
                <div key={i} className="flex flex-col gap-2">
                  <span className="text-gray-500 text-xs">{question}</span>
                  <span className="ml-1">{display}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Review;
