import type { Meta, StoryObj } from '@storybook/angular';
import { A11yModalComponent } from '../../accessibility-lib/src/lib/modal/modal.component';

const meta: Meta<A11yModalComponent> = {
  title: 'Accessibility Lib/Modal',
  component: A11yModalComponent,
  tags: ['autodocs'],
  argTypes: {
    open:             { control: 'boolean' },
    title:            { control: 'text' },
    size:             { control: 'select', options: ['sm','md','lg','fullscreen'] },
    closeOnBackdrop:  { control: 'boolean' },
    showFooter:       { control: 'boolean' },
    icon:             { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component: `
**WCAG 2.1/2.2 compliance:**
- Focus trap: Tab/Shift+Tab cycle within dialog (2.1.2)
- Escape key closes (2.1.1)
- Focus returns to trigger on close (2.4.3)
- \`role="dialog"\`, \`aria-modal\`, \`aria-labelledby\`, \`aria-describedby\` (1.3.1)
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<A11yModalComponent>;

export const Default: Story = {
  args: { open: true, title: 'Sample Dialog', size: 'md', showFooter: true, icon: 'info' },
  render: (args) => ({
    props: args,
    template: `
      <a11y-modal [open]="open" [title]="title" [size]="size" [showFooter]="showFooter" [icon]="icon">
        <p>This dialog demonstrates focus trapping, Escape key handling, and proper ARIA labelling.</p>
      </a11y-modal>
    `,
  }),
};

export const SmallConfirm: Story = {
  args: { open: true, title: 'Confirm Delete', size: 'sm', icon: 'warning' },
  render: (args) => ({
    props: args,
    template: `
      <a11y-modal [open]="open" [title]="title" [size]="size" [icon]="icon">
        <p>Are you sure? This action cannot be undone.</p>
      </a11y-modal>
    `,
  }),
};
