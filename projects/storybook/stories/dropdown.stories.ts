import type { Meta, StoryObj } from '@storybook/angular';
import { A11yDropdownComponent, DropdownItem } from '../../accessibility-lib/src/lib/dropdown/dropdown.component';

const ACTIONS: DropdownItem[] = [
  { id: 'd1', label: 'Edit',      icon: 'edit' },
  { id: 'd2', label: 'Duplicate', icon: 'content_copy' },
  { id: 'd3', label: 'Archive',   icon: 'archive', dividerBefore: true },
  { id: 'd4', label: 'Delete',    icon: 'delete',  dividerBefore: true },
  { id: 'd5', label: 'Restricted (disabled)', icon: 'lock', disabled: true },
];

const meta: Meta<A11yDropdownComponent> = {
  title: 'Accessibility Lib/Dropdown',
  component: A11yDropdownComponent,
  tags: ['autodocs'],
  argTypes: {
    triggerLabel: { control: 'text' },
    triggerIcon:  { control: 'text' },
  },
  parameters: {
    a11y: { disable: false },
    docs: {
      description: {
        component: `
**WCAG 2.1/2.2 compliance (WAI-ARIA Menu Button pattern):**
- Trigger has \`aria-haspopup="menu"\` and \`aria-expanded\` (4.1.2)
- Menu uses \`role="menu"\`, items use \`role="menuitem"\` (1.3.1)
- Enter/Space open; Arrow keys navigate; Escape closes + restores focus (2.1.1)
- Tab also closes and returns focus to trigger (2.4.3)
- Disabled items have \`aria-disabled\` and are skipped in keyboard nav (2.1.1)
- Click-outside closes via HostListener (2.1.1)
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<A11yDropdownComponent>;

export const Default: Story = {
  args: { triggerLabel: 'Actions', triggerIcon: 'more_vert', items: ACTIONS as any },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding:2rem">
        <a11y-dropdown [triggerLabel]="triggerLabel" [triggerIcon]="triggerIcon" [items]="items"></a11y-dropdown>
      </div>
    `,
  }),
};

export const ExportMenu: Story = {
  args: {
    triggerLabel: 'Export',
    triggerIcon:  'download',
    items: [
      { id: 'e1', label: 'Export as CSV',  icon: 'table_chart' },
      { id: 'e2', label: 'Export as JSON', icon: 'data_object' },
      { id: 'e3', label: 'Export as PDF',  icon: 'picture_as_pdf' },
    ] as any,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding:2rem">
        <a11y-dropdown [triggerLabel]="triggerLabel" [triggerIcon]="triggerIcon" [items]="items"></a11y-dropdown>
      </div>
    `,
  }),
};

export const NoIcons: Story = {
  args: {
    triggerLabel: 'Options',
    items: [
      { id: 'n1', label: 'View details' },
      { id: 'n2', label: 'Copy link' },
      { id: 'n3', label: 'Share',  dividerBefore: true },
      { id: 'n4', label: 'Report', dividerBefore: true },
    ] as any,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding:2rem">
        <a11y-dropdown [triggerLabel]="triggerLabel" [items]="items"></a11y-dropdown>
      </div>
    `,
  }),
};
