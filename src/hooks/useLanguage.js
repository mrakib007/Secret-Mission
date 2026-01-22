import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { initializeLanguage, changeLanguageWithPersistence } from '../utils/languageUtils';

export const useLanguage = () => {
  const { i18n, t } = useTranslation();
  const { user } = useSelector((state) => state.auth);

  // Check if user is admin or student (not tutor)
  const canUseLanguageSwitch = user?.user_type === 'admin' || user?.user_type === 'student';

  // Initialize language on component mount
  useEffect(() => {
    if (user?.user_type) {
      initializeLanguage(i18n, user.user_type);
    }
  }, [i18n, user?.user_type]);

  const changeLanguage = (lng) => {
    if (canUseLanguageSwitch) {
      changeLanguageWithPersistence(i18n, lng, user?.user_type);
    }
  };

  const getCurrentLanguage = () => {
    return i18n.language;
  };

  const getCurrentLanguageName = () => {
    switch (i18n.language) {
      case 'en':
        return t('english');
      case 'jp':
        return t('japanese');
      default:
        return t('japanese');
    }
  };

  return {
    changeLanguage,
    getCurrentLanguage,
    getCurrentLanguageName,
    canUseLanguageSwitch,
    t
  };
};
