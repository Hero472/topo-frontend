// src/components/language/LanguageSelector.tsx
import { setLanguage, useLanguage, type Language } from "../../i18n";
import { Select, SelectItem } from "../ui/Select";

const languages: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
];

export default function LanguageSelector() {
  const currentLanguage = useLanguage();

  const GlobeIcon = (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="w-4 h-4" 
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );

  return (
    <Select
      size="sm"
      value={currentLanguage}
      onValueChange={(value) => setLanguage(value as Language)}
      aria-label="Language"
      leftIcon={GlobeIcon}
      className="w-auto min-w-[120px]"
    >
      {languages.map((language) => (
        <SelectItem key={language.code} value={language.code}>
          {language.label}
        </SelectItem>
      ))}
    </Select>
  );
}