// questionConfig.js
// Maps page_param values to their questionnaire question sets.
// Each question defines: key (formData key), question (translated label),
// questionShort (optional short label for Review), type, and optionally: options, instructions, required.

export const WAIVER_PARAMS = ["waiver-ca-contactform", "waiver-us-contactform"];
export const CITIZENSHIP_PARAMS = ["citizenship-descent-contactform"];

export const ALL_QUESTIONNAIRE_PARAMS = [
  ...WAIVER_PARAMS,
  ...CITIZENSHIP_PARAMS,
];

export function getQuestionSet(pageParam) {
  if (WAIVER_PARAMS.includes(pageParam)) return "waiver";
  if (CITIZENSHIP_PARAMS.includes(pageParam)) return "citizenship";
  return null; // No questionnaire — submit after contact form
}

// Each question set returns a function that takes (t, i18n, getCountryOptions, PREFERRED_COUNTRIES)
// and returns the questions array. This lets us resolve translations and dynamic options at render time.

export const questionSets = {
  waiver: (t, i18n, getCountryOptions, PREFERRED_COUNTRIES, pageParam) => {
    const isUS = pageParam === "waiver-us-contactform";
    const country = isUS ? t("us") : t("canada");
    const border = isUS ? t("us_border") : t("canadian_border");
    return [
      {
        key: "question1",
        question: t("q1", { country }),
        questionShort: null,
        required: true,
        options: [
          { label: t("q1_business"), value: "Business" },
          { label: t("q1_work"), value: "Work" },
          { label: t("q1_study"), value: "Study" },
          { label: t("q1_tourism"), value: "Tourism" },
          { label: t("q1_family"), value: "Family Visit" },
          { label: t("q1_other"), value: "Other" },
        ],
      },
      {
        key: "question2",
        question: t("q2"),
        questionShort: null,
        instructions: t("q2Instructions"),
        type: "text",
        required: true,
      },
      {
        key: "question3",
        question: t("q3"),
        questionShort: null,
        required: true,
        options: [
          { label: t("q3_land"), value: "By land" },
          { label: t("q3_air"), value: "By air" },
          { label: t("q3_unsure"), value: "Not sure yet" },
        ],
      },
      {
        key: "question4",
        question: t("q4"),
        questionShort: null,
        required: true,
        options: [
          ...getCountryOptions(i18n.language, PREFERRED_COUNTRIES),
          { label: t("other"), value: "Other" },
        ],
      },
      {
        key: "question5",
        question: t("q5", { border }),
        questionShort: t("q5Short"),
        instructions: t("q5Instructions"),
        required: true,
        options: [
          { label: t("q5_no"), value: "No" },
          { label: t("q5_yes"), value: "Yes" },
          { label: t("q5_prefer"), value: "Prefer not to say" },
        ],
      },
      {
        key: "question6",
        question: t("q6"),
        questionShort: t("q6Short"),
        type: "textarea",
        required: false,
      },
    ];
  },

  citizenship: (t, i18n, getCountryOptions, PREFERRED_COUNTRIES) => [
    {
      key: "question1",
      question: t("cit_q1"),
      questionShort: null,
      required: true,
      options: [
        ...getCountryOptions(i18n.language, PREFERRED_COUNTRIES),
        { label: t("other"), value: "Other" },
      ],
    },
    {
      key: "question2",
      question: t("cit_q2"),
      questionShort: null,
      required: true,
      options: [
        { label: t("cit_q2_parent"), value: "Canadian parent" },
        { label: t("cit_q2_grandparent"), value: "Canadian grandparent" },
        { label: t("cit_q2_ancestor"), value: "Canadian ancestor" },
      ],
    },
    {
      key: "question3",
      question: t("cit_q3"),
      questionShort: null,
      required: true,
      options: [
        { label: t("cit_q3_yes"), value: "Yes" },
        { label: t("cit_q3_no"), value: "No" },
        { label: t("cit_q3_unsure"), value: "In progress/Unsure" },
      ],
    },
    {
      key: "question4",
      question: t("cit_q4"),
      questionShort: null,
      required: true,
      options: [
        { label: t("cit_q4_yes"), value: "Yes" },
        { label: t("cit_q4_no"), value: "No" },
      ],
    },
    {
      key: "question5",
      question: t("cit_q5"),
      questionShort: null,
      required: true,
      options: [
        { label: t("cit_q5_myself"), value: "Myself only" },
        { label: t("cit_q5_child"), value: "My child" },
        { label: t("cit_q5_both"), value: "Myself and my child" },
      ],
    },
    {
      key: "question6",
      question: t("q6"),
      questionShort: t("q6Short"),
      type: "textarea",
      required: false,
    },
  ],
};

// Build the initial formData keys for a question set (all null/empty)
export function getInitialQuestionData(setName) {
  if (setName === "waiver") {
    return {
      question1: null,
      question2: "",
      question3: null,
      question4: null,
      question5: null,
      question6: "",
    };
  }
  if (setName === "citizenship") {
    return {
      question1: null,
      question2: null,
      question3: null,
      question4: null,
      question5: null,
      question6: "",
    };
  }
  return {};
}

// Get the plain-text question labels for the payload (keyed by set)
export const questionnairePayloadLabels = {
  waiver: (pageParam) => {
    const isUS = pageParam === "waiver-us-contactform";
    return [
      `What is the purpose of your intended travel to ${isUS ? "the US" : "Canada"}?`,
      "What is the intended duration of your stay? Please indicate an approximate timeline (e.g. one week, several months, long-term).",
      "What is your planned method of entry?",
      "What is your citizenship?",
      `Have you previously been denied entry or had issues at the ${isUS ? "US" : "Canadian"} border? If yes, please provide a brief description in the next question:`,
      "Is there anything else we should know before the consultation? You can also include any specific questions or concerns you'd like us to address.",
    ];
  },
  citizenship: () => [
    "Where were you born?",
    "Do you have a Canadian parent or Canadian grandparent?",
    "Do you have proof of their birth in Canada (birth certificate, parish record, etc.)?",
    "Have you ever applied for proof of Canadian citizenship?",
    "Who are you seeking citizenship eligibility for?",
    "Is there anything else we should know before the consultation? You can also include any specific questions or concerns you'd like us to address.",
  ],
};
