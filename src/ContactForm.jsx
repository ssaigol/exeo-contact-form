import { CountrySelector } from "react-international-phone";
import { useTranslation } from "react-i18next";
import { parsePhoneNumberFromString } from "libphonenumber-js";

function ContactForm({ formData, setFormData }) {
  function formatPhone(raw) {
    if (!raw) return "";
    const phone = parsePhoneNumberFromString(
      raw,
      formData.country.toUpperCase(),
    );
    if (!phone) return raw;
    return phone.formatNational();
  }

  const { t, i18n } = useTranslation();
  return (
    <div className="flex flex-col sm:grid sm:grid-cols-2 sm:grid-rows-[1fr_1fr_auto] sm:gap-x-5 lg:gap-x-10 gap-y-5 sm:gap-y-8 md:px-2">
      {/* First Name */}
      <div className="grid grid-cols-[1fr_1.75fr] gap-5 lg:gap-0 items-center">
        <label
          className="text-nowrap after:content-['*'] after:text-red-600 after:ml-0.5"
          htmlFor="first-name"
        >
          {t("firstName")}
        </label>
        <input
          id="first-name"
          type="text"
          autoComplete="on"
          // required={import.meta.env.PROD}
          required
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          className="bg-neutral-50 px-2 py-0.5 shadow-sm rounded-sm w-full border border-neutral-200"
        />
      </div>
      {/* Last Name */}
      <div className="grid grid-cols-[1fr_1.75fr] gap-5 lg:gap-0 items-center ">
        <label
          className="text-nowrap after:content-['*'] after:text-red-600 after:ml-0.5"
          htmlFor="last-name"
        >
          {t("lastName")}
        </label>
        <input
          id="last-name"
          type="text"
          autoComplete="on"
          // required={import.meta.env.PROD}
          required
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
          className="bg-neutral-50 px-2 py-0.5 shadow-sm rounded-sm w-full  border border-neutral-200"
        />
      </div>
      {/* Email */}
      <div className="grid grid-cols-[1fr_1.75fr] gap-5 lg:gap-0 items-center">
        <label
          className="text-nowrap after:content-['*'] after:text-red-600 after:ml-0.5"
          htmlFor="email"
        >
          {t("email")}
        </label>
        <input
          id="email"
          type="email"
          autoComplete="on"
          // required={import.meta.env.PROD}
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="bg-neutral-50 px-2 py-0.5 shadow-sm rounded-sm w-full  border border-neutral-200"
        />
      </div>
      {/* Phone */}
      <div className="grid grid-cols-[1fr_1.75fr] gap-5 lg:gap-0 items-center ">
        <label className="text-nowrap" htmlFor="phone">
          {t("phone")}
        </label>

        <div className="relative">
          <input
            type="tel"
            id="phone"
            autoComplete="on"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            onBlur={() =>
              setFormData({ ...formData, phone: formatPhone(formData.phone) })
            }
            className="bg-neutral-50 px-2 py-0.5 shadow-sm rounded-r-sm w-full  border border-neutral-200 border-l-0"
          />
          <CountrySelector
            selectedCountry={formData.country}
            onSelect={({ iso2 }) => setFormData({ ...formData, country: iso2 })}
            buttonClassName="!rounded-l-sm !shadow-sm !bg-neutral-50/20 !border-neutral-200 !border-r-0 !h-auto !py-0.5 !absolute !left-0 !bottom-0 !translate-x-[-100%]"
            preferredCountries={["ca", "us", "mx"]}
          />
        </div>

        {/* </div> */}
      </div>
      {/* Newsletter Sign Up */}
      <div className="flex flex-col gap-3 col-span-2 mt-5">
        {/* <div className="flex items-center gap-5">
          <input
            id="privacy"
            type="checkbox"
            // required={import.meta.env.PROD}
            required
            checked={formData.privacy}
            onChange={() =>
              setFormData({ ...formData, privacy: !formData.privacy })
            }
          />
          <label
            htmlFor="privacy"
            className="text-nowrap flex items-center gap-2"
          >
            {t("privacy")}
            <a
              href={
                i18n.language === "fr"
                  ? "https://www.exeo.ca/fr/politiques-de-confidentialite/"
                  : "https://www.exeo.ca/privacy-policy/"
              }
              rel="noopener noreferrer"
              target="_blank"
              className="text-primary2 underline"
            >
              {t("privacyPolicy")}
            </a>
          </label>
        </div> */}
        <div className="flex items-center gap-5">
          <input
            type="checkbox"
            id="newsletter"
            checked={formData.newsletter}
            onChange={() =>
              setFormData({ ...formData, newsletter: !formData.newsletter })
            }
          />
          <label htmlFor="newsletter">{t("newsletter")}</label>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;
