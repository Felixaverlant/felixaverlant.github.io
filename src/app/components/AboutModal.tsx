'use client';

import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import CtaLink from './CtaLink';
import { translations } from '../lib/translations';

type AboutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  whoIAm: string;
  whatIWant: string;
  lang: 'fr' | 'en';
  profileImage?: string;
};

export default function AboutModal({ isOpen, onClose, whoIAm, whatIWant, lang, profileImage }: AboutModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const modal = (
    <div
      className="fixed inset-0 z-100 flex flex-col bg-theme-bg text-theme-dark"
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'fr' ? 'À propos' : 'About'}
    >
      <button
        onClick={onClose}
        className="close-btn-hover group absolute top-6 right-6 z-10 flex size-20 items-center justify-center text-theme-dark focus:outline-none focus:ring-2 focus:ring-theme-dark/50 md:top-8 md:right-8 md:size-28"
        aria-label={lang === 'fr' ? 'Fermer' : 'Close'}
      >
        <svg
          className="close-btn-draw size-20 md:size-28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path pathLength="1" d="M18 6 6 18" />
          <path pathLength="1" d="m6 6 12 12" />
        </svg>
      </button>

      <div className="flex flex-1 flex-col overflow-y-auto px-6 py-8 pt-24 md:px-12 md:py-12 md:pt-28">
        <div className="mx-auto w-full max-w-2xl">
          {profileImage && (
            <div className="mb-10 flex justify-start">
              <Image
                src={profileImage}
                alt="Félix Averlant"
                width={160}
                height={160}
                className="size-32 rounded-full object-cover md:size-40"
                unoptimized
              />
            </div>
          )}
          <section className="mb-12">
            <h2 className="mb-4 text-base font-semibold uppercase tracking-wider text-theme-dark/70">
              {lang === 'fr' ? 'Qui je suis' : 'Who I am'}
            </h2>
            <p className="text-2xl leading-relaxed md:text-3xl">{whoIAm}</p>
          </section>
          <section className="mb-12">
            <h2 className="mb-4 text-base font-semibold uppercase tracking-wider text-theme-dark/70">
              {lang === 'fr' ? "Ce que je cherche" : 'What I want'}
            </h2>
            <p className="text-2xl leading-relaxed md:text-3xl">{whatIWant}</p>
          </section>
          <hr className="border-0 border-b border-theme-dark/25 w-full shrink-0 mb-0" />
          <div>
            <CtaLink
              href={translations[lang].linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 text-base md:text-lg text-theme-dark/90 leading-relaxed !font-bold"
            >
              {translations[lang].bioHeadingCta}{' '}
              <span className="!font-bold">{translations[lang].contactMe}</span>
            </CtaLink>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modal, document.body) : modal;
}
