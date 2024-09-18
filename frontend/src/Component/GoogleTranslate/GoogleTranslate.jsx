import React, { useEffect } from 'react';

const GoogleTranslate = () => {
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
      }

      window.googleTranslateElementInit = () => {
        setTimeout(() => {
          if (window.google && window.google.translate) {
            new window.google.translate.TranslateElement({
              pageLanguage: 'en',
              includedLanguages: 'en,si,ta',
              layout: google.translate.TranslateElement.InlineLayout.SIMPLE
            }, 'google_translate_element');
          }
        }, 500);
      };
    };

    addGoogleTranslateScript();
  }, []);

  return (
    <div id="google_translate_element"></div>
  );
};

export default GoogleTranslate;
