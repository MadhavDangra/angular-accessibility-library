import type { Meta, StoryObj } from '@storybook/angular';
import { A11yButtonComponent } from '../../accessibility-lib/src/lib/button/button.component';

const meta: Meta<A11yButtonComponent> = {
  title: 'Accessibility Lib/Button',
  component: A11yButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    variant:  { control: 'select', options: ['primary','secondary','danger','ghost','icon-only'] },
    size:     { control: 'select', options: ['sm','md','lg'] },
    disabled: { control: 'boolean' },
    loading:  { control: 'boolean' },
    leftIcon: { control: 'text' },
    rightIcon:{ control: 'text' },
    ariaLabel:{ control: 'text' },
  },
  parameters: {
    a11y: { disable: false },
    docs: {
      description: {
        component: `
**WCAG 2.1/2.2 compliance:**
- \`aria-disabled\` keeps disabled buttons in focus order (2.1.1)
- \`aria-busy\` announced during loading (4.1.3)
- 44×44px minimum touch target (2.5.5)
- 3px focus ring (2.4.7)
- ≥4.5:1 contrast on all variants (1.4.3)
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<A11yButtonComponent>;

export const Primary: Story = {
  args: { variant: 'primary', size: 'md', disabled: false, loading: false },
  render: (args) => ({
    props: args,
    template: `<a11y-button [variant]="variant" [size]="size" [disabled]="disabled" [loading]="loading">Click me</a11y-button>`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">
        <a11y-button variant="primary">Primary</a11y-button>
        <a11y-button variant="secondary">Secondary</a11y-button>
        <a11y-button variant="danger">Danger</a11y-button>
        <a11y-button variant="ghost">Ghost</a11y-button>
        <a11y-button variant="icon-only" ariaLabel="Settings">
          <span class="material-icons">settings</span>
        </a11y-button>
      </div>
    `,
  }),
};

export const LoadingState: Story = {
  args: { loading: true },
  render: (args) => ({
    props: args,
    template: `<a11y-button [loading]="loading" variant="primary">Saving…</a11y-button>`,
  }),
};

export const DisabledState: Story = {
  args: { disabled: true },
  render: (args) => ({
    props: args,
    template: `<a11y-button [disabled]="disabled" variant="primary">Disabled (still focusable)</a11y-button>`,
  }),
};
