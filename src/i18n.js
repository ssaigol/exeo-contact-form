import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const params = new URLSearchParams(window.location.search);
const lang = params.get("lang") || "en";

i18n.use(initReactI18next).init({
  lng: lang,
  fallbackLng: "en",
  resources: {
    en: {
      translation: {
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email",
        phone: "Phone",
        newsletter:
          "Subscribe to the monthly newsletter to be informed on the latest immigration news.",
        submit: "Submit",
        success: "Thank you! We will contact you soon.",
        q1: "What is the purpose of your intended travel to {{country}}?",
        canada: "Canada",
        us: "the US",
        q1_business: "Business",
        q1_work: "Work",
        q1_study: "Study",
        q1_tourism: "Tourism",
        q1_family: "Family Visit",
        q1_other: "Other",
        q2: "What is the intended duration of your stay?",
        q2Instructions:
          "Please indicate an approximate timeline (e.g. one week, several months, long-term).",
        q2Short: "What is the intended duration of your stay?",
        q3: "What is your planned method of entry?",
        q3_land: "By land",
        q3_air: "By air",
        q3_unsure: "Not sure yet",
        q4: "What is your citizenship?",
        other: "Other",
        q5: "Have you previously been denied entry or had issues at the {{border}}?",
        q5Instructions:
          "If yes, please provide a brief description in the next question.",
        canadian_border: "Canadian border",
        us_border: "US border",
        q5Short:
          "Have you previously been denied entry or had issues at the {{border}}?",
        q5_no: "No",
        q5_yes: "Yes",
        q5_prefer: "Prefer not to say",
        q6: "Is there anything else we should know before the consultation? You can also include any specific questions or concerns you'd like us to address.",
        q6Short: "Additional comments:",
        selectPlaceholder: "Select an option...",
        privacyPolicy: "Privacy Policy",
        privacy: "I have read and agree to the",
        next: "Next",
        back: "Back",
        review: "Review",
        reviewTitle: "Review before submitting",
        fieldRequired: "Please answer this question to continue.",
        edit: "Edit",
        continue: "Continue",
        questionnaireIntro:
          "Thank you for your submission! Please answer the following questions so we can better prepare for your consultation.",

        // Citizenship by descent questions
        cit_q1: "Where were you born?",
        cit_q2:
          "Do you have a Canadian parent, Canadian grandparent, or an older Canadian ancestor?",
        cit_q2_parent: "Canadian parent",
        cit_q2_grandparent: "Canadian grandparent",
        cit_q2_ancestor: "Older Canadian ancestor",
        cit_q3:
          "Do you have proof of their birth in Canada (birth certificate, parish record, etc.)?",
        cit_q3_yes: "Yes",
        cit_q3_no: "No",
        cit_q3_unsure: "In progress/Unsure",
        cit_q4: "Have you ever applied for proof of Canadian citizenship?",
        cit_q4_yes: "Yes",
        cit_q4_no: "No",
        cit_q5: "Who are you seeking citizenship eligibility for?",
        cit_q5_myself: "Myself only",
        cit_q5_child: "My child",
        cit_q5_both: "Myself and my child",
      },
    },
    fr: {
      translation: {
        firstName: "Prénom",
        lastName: "Nom",
        email: "Courriel",
        phone: "Tél.",
        newsletter:
          "Abonnez-vous à l'infolettre mensuelle pour être informé des dernières actualités en matière d'immigration.",
        submit: "Soumettre",
        success: "Merci! Nous vous contacterons prochainement.",
        q1: "Quel est le but de votre voyage prévu {{country}}?",
        canada: "au Canada",
        us: "aux États-Unis",
        q1_business: "Affaires",
        q1_work: "Travail",
        q1_study: "Études",
        q1_tourism: "Tourisme",
        q1_family: "Visite familiale",
        q1_other: "Autre",
        q2: "Quelle est la durée prévue de votre séjour ?",
        q2Instructions:
          "Veuillez indiquer une estimation (par exemple : une semaine, plusieurs mois, long terme).",
        q2Short: "Quelle est la durée prévue de votre séjour ?",
        q3: "Quel est votre mode d'entrée prévu?",
        q3_land: "Par voie terrestre",
        q3_air: "Par voie aérienne",
        q3_unsure: "Pas encore sûr(e)",
        q4: "Quelle est votre citoyenneté?",
        other: "Autre",
        q5: "Vous a-t-on déjà refusé l'entrée ou avez-vous eu des problèmes à la frontière {{border}} ?",
        canadian_border: "canadienne",
        us_border: "américaine",
        q5Instructions:
          "En cas de réponse affirmative, veuillez fournir une brève description à la question suivante.",
        q5Short:
          "Vous a-t-on déjà refusé l'entrée ou avez-vous eu des problèmes à la frontière {{border}} ?",
        q5_no: "Non",
        q5_yes: "Oui",
        q5_prefer: "Préfère ne pas répondre",
        q6: "Y a-t-il autre chose que nous devrions savoir avant la consultation ? Vous pouvez également inclure des questions spécifiques ou des préoccupations que vous aimeriez que nous abordions.",
        q6Short: "Commentaires supplémentaires :",
        selectPlaceholder: "Sélectionner une option...",
        privacyPolicy: "Politique de confidentialité",
        privacy: "J'ai lu et j'accepte la",
        next: "Suivant",
        back: "Retour",
        review: "Vérifier",
        reviewTitle: "Vérifier avant de soumettre",
        fieldRequired: "Veuillez répondre à cette question pour continuer.",
        edit: "Modifier",
        continue: "Continuer",
        questionnaireIntro:
          "Merci pour votre soumission ! Veuillez répondre aux questions suivantes afin que nous puissions mieux préparer votre consultation.",

        // Citizenship by descent questions
        cit_q1: "Où êtes-vous né(e) ?",
        cit_q2:
          "Avez-vous un parent canadien, un grand-parent canadien ou un ancêtre canadien plus âgé ?",
        cit_q2_parent: "Parent canadien",
        cit_q2_grandparent: "Grand-parent canadien",
        cit_q2_ancestor: "Ancêtre canadien plus âgé",
        cit_q3:
          "Avez-vous une preuve de leur naissance au Canada (certificat de naissance, registre paroissial, etc.) ?",
        cit_q3_yes: "Oui",
        cit_q3_no: "Non",
        cit_q3_unsure: "En cours/Incertain",
        cit_q4:
          "Avez-vous déjà fait une demande de preuve de citoyenneté canadienne ?",
        cit_q4_yes: "Oui",
        cit_q4_no: "Non",
        cit_q5:
          "Pour qui cherchez-vous à établir l'admissibilité à la citoyenneté ?",
        cit_q5_myself: "Moi seulement",
        cit_q5_child: "Mon enfant",
        cit_q5_both: "Moi et mon enfant",
      },
    },
  },
});

export default i18n;
