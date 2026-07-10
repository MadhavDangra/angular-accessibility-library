import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yDropdownComponent, DropdownItem } from 'accessibility-lib';
import { AppLang, TranslationService } from '../i18n/translation.service';

/**
 * LanguageSwitcherComponent
 * Drop this once in the demo hero. Uses the library's own a11y-dropdown
 * component (dogfooding) so language switching is itself keyboard/screen
 * reader accessible.
 */
@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, A11yDropdownComponent],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss',
})
export class LanguageSwitcherComponent {
  private i18n = inject(TranslationService);

  langItems: DropdownItem[] = [
    { id: 'en', label: 'English' },
    { id: 'hi', label: 'हिंदी' },
    { id: 'hinglish', label: 'Hinglish' },
  ];

  triggerLabel(): string {
    const current = this.langItems.find(i => i.id === this.i18n.lang());
    return current?.label ?? 'English';
  }

  onSelect(item: DropdownItem): void {
    this.i18n.setLang(item.id as AppLang);
  }
}
