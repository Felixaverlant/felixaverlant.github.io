import type { Metadata } from 'next';
import { resolveLang, type Lang } from './utils';

export function withLangMetadata(
  params: { lang: string } | Promise<{ lang: string }>,
  build: (lang: Lang) => Metadata
): Metadata | Promise<Metadata> {
  if (params instanceof Promise) {
    return params.then((p) => build(resolveLang(p)));
  }
  return build(resolveLang(params));
}
