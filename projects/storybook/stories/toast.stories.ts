import type { Meta, StoryObj } from '@storybook/angular';
import { A11yToastContainerComponent } from '../../accessibility-lib/src/lib/toast/toast.component';

const meta: Meta<A11yToastContainerComponent> = {
  title: 'Accessibility Lib/Toast',
  component: A11yToastContainerComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**WCAG 2.1/2.2 compliance:**
- \`role="status"\` (polite) for success/info/warning (4.1.3)
- \`role="alert"\` (assertive) for errors (4.1.3)
- Error toasts are persistent — duration 0 (2.2.1)
- Close button 44×44px with \`aria-label\` (2.5.5, 1.1.1)
- Type conveyed via icon + label, not colour alone (1.4.1)
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<A11yToastContainerComponent>;

export const AllTypes: Story = {
  render: () => ({
    template: `
      <div style="position:relative;min-height:300px;background:#f8f8f6;padding:1rem">
        <p style="font-family:sans-serif;font-size:.875rem;margin-bottom:1rem">
          Inject <code>A11yToastService</code> and call <code>.success()</code>,
          <code>.error()</code>, <code>.warning()</code>, or <code>.info()</code>.
        </p>
        <a11y-toast-container></a11y-toast-container>
      </div>
    `,
  }),
};
