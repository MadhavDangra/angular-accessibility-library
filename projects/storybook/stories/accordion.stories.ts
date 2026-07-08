import type { Meta, StoryObj } from '@storybook/angular';
import { A11yAccordionComponent, AccordionItem } from '../../accessibility-lib/src/lib/accordion/accordion.component';

const ITEMS: AccordionItem[] = [
  {
    id: 'a1', icon: 'verified', title: 'What is WCAG?',
    content: 'The Web Content Accessibility Guidelines (WCAG) are developed by the W3C and define how to make web content more accessible to people with disabilities. WCAG 2.1 and 2.2 cover the four POUR principles.',
  },
  {
    id: 'a2', icon: 'keyboard', title: 'Keyboard accessibility',
    content: 'All interactive elements must be operable via keyboard alone. Users should never be trapped in a component without a keyboard exit path.',
  },
  {
    id: 'a3', icon: 'record_voice_over', title: 'Screen reader support',
    content: 'Screen readers rely on semantic HTML and ARIA attributes. Every component in this library is tested with VoiceOver (macOS/iOS) and NVDA (Windows).',
  },
  {
    id: 'a4', icon: 'block', title: 'Disabled panel (cannot open)',
    content: 'This content is unreachable because the panel is disabled.',
    disabled: true,
  },
];

const meta: Meta<A11yAccordionComponent> = {
  title: 'Accessibility Lib/Accordion',
  component: A11yAccordionComponent,
  tags: ['autodocs'],
  argTypes: {
    allowMultiple: { control: 'boolean' },
  },
  parameters: {
    a11y: { disable: false },
    docs: {
      description: {
        component: `
**WCAG 2.1/2.2 compliance (WAI-ARIA Accordion pattern):**
- \`<button>\` inside \`<h3>\` — correct heading + button pattern (1.3.1)
- \`aria-expanded\` and \`aria-controls\` on every trigger (4.1.2)
- Panels use \`role="region"\` with \`aria-labelledby\` (1.3.1)
- Arrow keys navigate between triggers; Home/End jump to ends (2.1.1)
- Disabled panels are keyboard-skipped (2.1.1)
- Smooth animation respects \`prefers-reduced-motion\` (2.3.3)
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<A11yAccordionComponent>;

export const SingleOpen: Story = {
  args: { items: ITEMS as any, allowMultiple: false, openIds: ['a1'] as any },
  render: (args) => ({
    props: args,
    template: `<a11y-accordion [items]="items" [allowMultiple]="allowMultiple" [openIds]="openIds"></a11y-accordion>`,
  }),
};

export const MultipleOpen: Story = {
  args: { items: ITEMS as any, allowMultiple: true, openIds: ['a1', 'a2'] as any },
  render: (args) => ({
    props: args,
    template: `<a11y-accordion [items]="items" [allowMultiple]="allowMultiple" [openIds]="openIds"></a11y-accordion>`,
  }),
};

export const AllClosed: Story = {
  args: { items: ITEMS as any, allowMultiple: false, openIds: [] as any },
  render: (args) => ({
    props: args,
    template: `<a11y-accordion [items]="items" [allowMultiple]="allowMultiple" [openIds]="openIds"></a11y-accordion>`,
  }),
};
