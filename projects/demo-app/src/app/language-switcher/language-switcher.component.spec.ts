import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { DropdownItem } from 'accessibility-lib';

import { LanguageSwitcherComponent } from './language-switcher.component';
import { AppLang, TranslationService } from '../i18n/translation.service';

describe('LanguageSwitcherComponent', () => {
  let component: LanguageSwitcherComponent;
  let fixture: ComponentFixture<LanguageSwitcherComponent>;
  let mockTranslationService: {
    lang: ReturnType<typeof signal<AppLang>>;
    setLang: jest.Mock;
  };

  beforeEach(async () => {
    mockTranslationService = {
      lang: signal<AppLang>('en'),
      setLang: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LanguageSwitcherComponent],
      providers: [
        { provide: TranslationService, useValue: mockTranslationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose English, Hindi, and Hinglish as language options', () => {
    expect(component.langItems).toEqual<DropdownItem[]>([
      { id: 'en', label: 'English' },
      { id: 'hi', label: 'हिंदी' },
      { id: 'hinglish', label: 'Hinglish' },
    ]);
  });

  describe('triggerLabel()', () => {
    it('should return the label matching the current TranslationService language', () => {
      mockTranslationService.lang.set('hi');
      expect(component.triggerLabel()).toBe('हिंदी');
    });

    it('should fall back to "English" when the current language has no matching item', () => {
      // Cast to bypass the AppLang type for this edge-case test
      mockTranslationService.lang.set('fr' as AppLang);
      expect(component.triggerLabel()).toBe('English');
    });
  });

  describe('onSelect()', () => {
    it('should call TranslationService.setLang with the selected item id', () => {
      const item: DropdownItem = { id: 'hinglish', label: 'Hinglish' };
      component.onSelect(item);
      expect(mockTranslationService.setLang).toHaveBeenCalledWith('hinglish');
      expect(mockTranslationService.setLang).toHaveBeenCalledTimes(1);
    });

    it('should pass through the raw id even for unexpected values', () => {
      const item: DropdownItem = { id: 'unknown-lang', label: 'Unknown' };
      component.onSelect(item);
      expect(mockTranslationService.setLang).toHaveBeenCalledWith('unknown-lang');
    });
  });

  it('should render an a11y-dropdown with the translate trigger icon', () => {
    const dropdownEl: HTMLElement = fixture.nativeElement.querySelector('a11y-dropdown');
    expect(dropdownEl).toBeTruthy();
  });
});
