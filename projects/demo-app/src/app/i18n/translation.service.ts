import { Injectable, signal, computed } from '@angular/core';

export type AppLang = 'en' | 'hi' | 'hinglish';

const STORAGE_KEY = 'a11y-demo-lang';
const SUPPORTED: AppLang[] = ['en', 'hi', 'hinglish'];

const LANG_META: Record<AppLang, { label: string; htmlLang: string }> = {
  en: { label: 'English', htmlLang: 'en' },
  hi: { label: 'हिंदी', htmlLang: 'hi' },
  hinglish: { label: 'Hinglish', htmlLang: 'en' },
};

/**
 * TranslationService
 * ─────────────────────────────────────────────
 * Lightweight, dependency-free i18n for the demo app.
 *
 * - Loads /assets/i18n/{lang}.json (fetched once per language, then cached).
 * - Exposes `lang` as a signal so templates/pipes recompute on switch.
 * - `t(key, params?)` resolves a dot-path key (e.g. 'demo.button.title')
 *   and interpolates `{{param}}` placeholders.
 * - Falls back to English, then to the raw key, if a key is missing —
 *   so a partial translation never breaks the UI.
 * - Persists the chosen language in localStorage and updates
 *   <html lang> + <title> + meta description on every switch.
 */
@Injectable({ providedIn: 'root' })
export class TranslationService {
  private cache = new Map<AppLang, Record<string, unknown>>();
  private englishReady: Promise<void> | null = null;

  readonly lang = signal<AppLang>(this.initialLang());
  readonly ready = signal<boolean>(false);
  readonly availableLanguages = computed(() =>
    SUPPORTED.map(code => ({ code, ...LANG_META[code] })),
  );

  constructor() {
    // Always warm the English fallback so missing keys never render blank.
    this.englishReady = this.loadLang('en');
    this.setLang(this.lang(), /* skipPersist */ true);
  }

  private initialLang(): AppLang {
    if (typeof window === 'undefined') return 'en';
    const stored = window.localStorage.getItem(STORAGE_KEY) as AppLang | null;
    return stored && SUPPORTED.includes(stored) ? stored : 'en';
  }

  async setLang(lang: AppLang, skipPersist = false): Promise<void> {
    this.ready.set(false);
    await this.loadLang(lang);
    await this.englishReady; // ensure fallback dictionary is available
    this.lang.set(lang);
    this.ready.set(true);

    if (typeof window !== 'undefined' && !skipPersist) {
      window.localStorage.setItem(STORAGE_KEY, lang);
    }
    this.syncDocument(lang);
  }

  private async loadLang(lang: AppLang): Promise<void> {
    if (this.cache.has(lang)) return;
    try {
      const res = await fetch(`assets/i18n/${lang}.json`);
      const data = await res.json();
      this.cache.set(lang, data);
    } catch {
      // Network/parse failure — leave unset so resolution falls back to English.
      this.cache.set(lang, {});
    }
  }

  private syncDocument(lang: AppLang): void {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = LANG_META[lang].htmlLang;
    const title = this.t('meta.pageTitle');
    const description = this.t('meta.pageDescription');
    if (title) document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && description) metaDesc.setAttribute('content', description);
  }

  /** Resolve a dot-path key against the active language, falling back to English. */
  t(key: string, params?: Record<string, string | number>): string {
    const active = this.cache.get(this.lang());
    const fallback = this.cache.get('en');

    let value = this.resolve(active, key);
    if (value === undefined) value = this.resolve(fallback, key);
    if (value === undefined) return key;

    return params ? this.interpolate(value, params) : value;
  }

  /** Pluralization helper: picks the `_plural` sibling key when count !== 1. */
  tPlural(key: string, count: number, params?: Record<string, string | number>): string {
    const finalKey = count === 1 ? key : `${key}_plural`;
    return this.t(finalKey, { count, ...params });
  }

  private resolve(dict: Record<string, unknown> | undefined, key: string): string | undefined {
    if (!dict) return undefined;
    const parts = key.split('.');
    let node: unknown = dict;
    for (const part of parts) {
      if (node && typeof node === 'object' && part in (node as Record<string, unknown>)) {
        node = (node as Record<string, unknown>)[part];
      } else {
        return undefined;
      }
    }
    return typeof node === 'string' ? node : undefined;
  }

  private interpolate(template: string, params: Record<string, string | number>): string {
    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, name) =>
      params[name] !== undefined ? String(params[name]) : `{{${name}}}`,
    );
  }
}
