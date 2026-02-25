'use client';

import { useState } from 'react';
import AboutModal from './AboutModal';

type AboutParagraphProps = {
  text: string;
  aboutLink: string;
  whoIAm: string;
  whatIWant: string;
  lang: 'fr' | 'en';
  profileImage?: string;
};

export default function AboutParagraph({ text, aboutLink, whoIAm, whatIWant, lang, profileImage }: AboutParagraphProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <p className="text-lg md:text-xl text-theme-dark/90 leading-relaxed pt-[30px] pb-[100px]">
        {text}
        <br />
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="link-hover-style cursor-pointer font-medium underline decoration-current underline-offset-2 text-lg md:text-xl"
        >
          {aboutLink}
        </button>
      </p>
      <AboutModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        whoIAm={whoIAm}
        whatIWant={whatIWant}
        lang={lang}
        profileImage={profileImage}
      />
    </>
  );
}
