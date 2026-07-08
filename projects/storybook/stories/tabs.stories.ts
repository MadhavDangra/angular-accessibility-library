import type { Meta, StoryObj } from '@storybook/angular';
import { A11yTabsComponent, A11yTabDirective } from '../../accessibility-lib/src/lib/tabs/tabs.component';

const meta: Meta<A11yTabsComponent> = {
  title: 'Accessibility Lib/Tabs',
  component: A11yTabsComponent,
  tags: ['autodocs'],
  argTypes: {
    ariaLabel:   { control: 'text' },
    activeIndex: { control: 'number' },
  },
  parameters: {
    a11y: { disable: false },
    docs: {
      description: {
        component: `
**WCAG 2.1/2.2 compliance (WAI-ARIA Tabs pattern):**
- \`role="tablist"\`, \`role="tab"\`, \`role="tabpanel"\` (1.3.1)
- \`aria-selected\`, \`aria-controls\`, \`aria-labelledby\` (4.1.2)
- Arrow keys navigate; Tab moves into panel (2.1.1)
- Home/End jump to first/last tab (2.1.1)
- Only active tab has \`tabindex="0"\` (2.4.3)
- Disabled tabs skipped in keyboard navigation (2.1.1)
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<A11yTabsComponent>;

export const Default: Story = {
  render: () => ({
    imports: [A11yTabsComponent, A11yTabDirective],
    template: `
      <a11y-tabs ariaLabel="Product details">
        <a11y-tab label="Overview" icon="home">
          <p style="font-size:.9rem;line-height:1.7">
            <strong>Overview panel.</strong> Use arrow keys to move between tabs.
            Press Tab to move into the panel content.
          </p>
        </a11y-tab>
        <a11y-tab label="Features" icon="star">
          <ul style="font-size:.9rem;line-height:2">
            <li>WCAG 2.1 / 2.2 Level AA compliant</li>
            <li>Full keyboard navigation</li>
            <li>Screen reader tested with VoiceOver and NVDA</li>
          </ul>
        </a11y-tab>
        <a11y-tab label="Reviews" icon="rate_review">
          <p style="font-size:.9rem;line-height:1.7">
            ⭐⭐⭐⭐⭐ — "Best accessible component library we've used."
          </p>
        </a11y-tab>
        <a11y-tab label="Archived" icon="archive" [disabled]="true">
          <p>This tab is disabled — skipped when pressing arrow keys.</p>
        </a11y-tab>
      </a11y-tabs>
    `,
  }),
};

export const WithoutIcons: Story = {
  render: () => ({
    imports: [A11yTabsComponent, A11yTabDirective],
    template: `
      <a11y-tabs ariaLabel="Settings sections">
        <a11y-tab label="Account">
          <p style="font-size:.9rem">Account settings panel content.</p>
        </a11y-tab>
        <a11y-tab label="Security">
          <p style="font-size:.9rem">Security settings panel content.</p>
        </a11y-tab>
        <a11y-tab label="Notifications">
          <p style="font-size:.9rem">Notifications settings panel content.</p>
        </a11y-tab>
      </a11y-tabs>
    `,
  }),
};
