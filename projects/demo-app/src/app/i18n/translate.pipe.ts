import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from './translation.service';

/**
 * TranslatePipe
 * Usage: {{ 'demo.button.title' | translate }}
 *        {{ 'demo.input.errors.required' | translate:{ field: fieldLabel } }}
 *
 * Marked `pure: false` so it re-evaluates whenever TranslationService's
 * `lang` signal changes (Angular's default change detection won't otherwise
 * know to re-run a pure pipe just because a signal elsewhere flipped).
 */
@Pipe({
  name: 'translate',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private i18n = inject(TranslationService);

  transform(key: string, params?: Record<string, string | number>): string {
    // Reading the signal here is what makes this pipe reactive to language switches.
    this.i18n.lang();
    return this.i18n.t(key, params);
  }
}
