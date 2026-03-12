import { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { Triangle } from "lucide-react";

function Questionnaire({
  formData,
  setFormData,
  currentQuestion,
  setCurrentQuestion,
  skipIntro,
  questions,
}) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);
  const [direction, setDirection] = useState("forward");
  const [error, setError] = useState("");
  const [continueVisible, setContinueVisible] = useState(false);
  const [showIntro, setShowIntro] = useState(!skipIntro);
  const textInputRef = useRef(null);

  const total = questions.length;
  const current = questions[currentQuestion];
  const isLast = currentQuestion === total - 1;

  // Focus text input when question changes
  useEffect(() => {
    if (textInputRef.current) {
      setTimeout(() => textInputRef.current?.focus(), 300);
    }
  }, [currentQuestion]);

  function transition(fn, dir = "forward") {
    setDirection(dir);
    setVisible(false);
    setError("");
    setTimeout(() => {
      fn();
      setVisible(true);
    }, 250);
  }

  function goForward() {
    transition(() => setCurrentQuestion((q) => q + 1), "forward");
  }

  function goBackward() {
    transition(() => setCurrentQuestion((q) => q - 1), "backward");
  }

  function handleSelectChange(option) {
    setFormData((prev) => ({ ...prev, [current.key]: option }));
    setError("");
    // Auto-advance after short delay so user sees selection register
    setTimeout(() => {
      transition(() => {
        if (!isLast) setCurrentQuestion((q) => q + 1);
      }, "forward");
    }, 400);
  }

  function handleTextChange(e) {
    setFormData((prev) => ({ ...prev, [current.key]: e.target.value }));
    if (e.target.value.length > 3) {
      setContinueVisible(true);
    } else {
      setContinueVisible(false);
    }
    setError("");
  }

  function handleContinue() {
    const value = formData[current.key];
    const isEmpty =
      !value ||
      (typeof value === "string" && !value.trim()) ||
      (typeof value === "object" && !value?.value);
    if (!isLast && isEmpty) {
      setError(t("fieldRequired"));
      return;
    }
    setContinueVisible(false);
    goForward();
  }

  const translateY = direction === "forward" ? "8px" : "-8px";

  // Determine if the current question is a text/textarea or select type
  const isTextareaType = current?.type === "textarea";
  const isSelect = !!current?.options;

  if (showIntro) {
    return (
      <div className="flex flex-col gap-7 px-8 h-56 justify-center items-center text-center">
        <p className="text-gray-600">{t("questionnaireIntro")}</p>
        <button
          type="button"
          onClick={() => {
            setVisible(false);
            setTimeout(() => {
              setShowIntro(false);
              setVisible(true);
            }, 250);
          }}
          className="text-sm text-primary2 cursor-pointer hover:underline"
        >
          {t("continue")} →
        </button>
      </div>
    );
  } else
    return (
      <div className="flex flex-col gap-7 px-8 h-56">
        {/* Counter & Next/Back */}
        <div className="flex gap-2.5 self-end items-center text-gray-400">
          <button
            onClick={goBackward}
            type="button"
            tabIndex={!currentQuestion ? -1 : 0}
            aria-label="Previous question"
            className={`${!currentQuestion ? "invisible pointer-events-none" : "visible  cursor-pointer"}  `}
          >
            <Triangle className="-rotate-90 w-3.5 h-3.5" />
          </button>
          <span className="text-xs">
            {currentQuestion + 1} / {total}
          </span>
          <button
            tabIndex={isLast ? -1 : 0}
            onClick={handleContinue}
            type="button"
            aria-label="Next question"
            className={`${isLast ? "invisible pointer-events-none" : "visible cursor-pointer"}   `}
          >
            <Triangle className="rotate-90 w-3.5 h-3.5" />
          </button>
        </div>

        {/* Animated question */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : `translateY(${translateY})`,
            transition: "opacity 250ms ease, transform 250ms ease",
          }}
          className={`flex flex-col ${currentQuestion >= total - 2 ? "pt-0" : "pt-7"} gap-7 justify-start flex-1`}
        >
          <label
            className={
              current.required
                ? "after:content-['*'] after:text-red-600 after:ml-0.5"
                : ""
            }
          >
            {current.question}
          </label>
          {current.instructions && (
            <p className="-my-3 text-sm italic text-gray-500">
              {current.instructions}
            </p>
          )}

          {isSelect ? (
            <div className="flex flex-col gap-1">
              <Select
                key={current.key}
                options={current.options}
                value={formData[current.key]}
                onChange={handleSelectChange}
                placeholder={t("selectPlaceholder")}
                menuPortalTarget={document.body}
                aria-label={current.question}
                styles={{
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
                classNames={{
                  menuList: () => "!max-h-28 sm:!max-h-35",
                  option: () => "!py-1",
                }}
                formatOptionLabel={(option) => {
                  if (option.value === "__divider__") {
                    return (
                      <div
                        style={{
                          borderTop: "1px solid #e5e7eb",
                          margin: "4px 0",
                        }}
                      />
                    );
                  }
                  return option.label;
                }}
              />
            </div>
          ) : isTextareaType ? (
            <div className="flex flex-col gap-2">
              <textarea
                ref={textInputRef}
                value={formData[current.key]}
                onChange={handleTextChange}
                className="border border-[#cccccc] p-2 resize-none h-20"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <input
                ref={textInputRef}
                type="text"
                value={formData[current.key]}
                onChange={handleTextChange}
                className="border border-[#cccccc] p-1 pl-3"
              />

              <button
                type="button"
                onClick={handleContinue}
                className={`text-sm self-end text-primary2 pr-5 cursor-pointer transition-opacity duration-1000 ease-in-out ${continueVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              >
                {t("continue")} →
              </button>
            </div>
          )}
          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
      </div>
    );
}

export default Questionnaire;
