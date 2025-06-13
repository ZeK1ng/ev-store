import { Language } from '@/contexts/LanguageContext';

interface MultilingualText {
  nameENG: string;
  nameGE: string;
  nameRUS: string;
  descriptionENG: string;
  descriptionGE: string;
  descriptionRUS: string;
}

export const getLocalizedText = (
  text: MultilingualText,
  language: Language,
  field: 'name' | 'description'
): string => {
  const engField = `${field}ENG` as keyof MultilingualText;
  const geField = `${field}GE` as keyof MultilingualText;
  const rusField = `${field}RUS` as keyof MultilingualText;

  switch (language) {
    case 'ka':
      return text[geField] as string;
    case 'ru':
      return text[rusField] as string;
    default:
      return text[engField] as string;
  }
}; 