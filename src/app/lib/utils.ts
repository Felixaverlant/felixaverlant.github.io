export type Lang = 'fr' | 'en';

export function resolveLang(params: { lang: string }): Lang {
  return params.lang === 'fr' || params.lang === 'en' ? params.lang : 'fr';
}

export async function resolveParams<T>(params: T | Promise<T>): Promise<T> {
  return params instanceof Promise ? await params : params;
}
