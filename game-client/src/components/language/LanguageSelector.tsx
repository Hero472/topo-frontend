import {
    setLanguage,
    useLanguage,
    type Language,
} from "../../i18n";

import "./LanguageSelector.css";

const languages: {
    code: Language;
    label: string;
}[] = [
    {
        code: "en",
        label: "English",
    },
    {
        code: "es",
        label: "Español",
    },
    {
        code: "pt",
        label: "Português",
    },
];

export default function LanguageSelector() {
    const currentLanguage = useLanguage();

    return (
        <div className="language-selector">
            <span
                className="language-icon"
                aria-hidden="true"
            >
                🌐
            </span>

            <select
                className="language-select"
                value={currentLanguage}
                onChange={(e) => {
                    setLanguage(e.target.value as Language);
                }}
                aria-label="Language"
            >
                {languages.map((language) => (
                    <option
                        key={language.code}
                        value={language.code}
                    >
                        {language.label}
                    </option>
                ))}
            </select>
        </div>
    );
}