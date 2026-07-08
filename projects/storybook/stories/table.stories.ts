import type { Meta, StoryObj } from '@storybook/angular';
import { A11yTableComponent, TableColumn } from '../../accessibility-lib/src/lib/table/table.component';

const COLUMNS: TableColumn[] = [
  { key: 'name',   label: 'Name',   sortable: true },
  { key: 'role',   label: 'Role',   sortable: true },
  { key: 'status', label: 'Status', type: 'badge' },
  { key: 'joined', label: 'Joined', type: 'date', sortable: true },
];

const DATA = [
  { id: 1, name: 'Priya Sharma',  role: 'Lead Engineer',   status: 'Active',   joined: '2021-03-15' },
  { id: 2, name: 'Carlos Mendez', role: 'UX Designer',     status: 'Active',   joined: '2022-07-01' },
  { id: 3, name: 'Wei Zhang',     role: 'Backend Engineer', status: 'Pending', joined: '2023-01-10' },
  { id: 4, name: 'Luca Rossi',    role: 'DevRel Engineer', status: 'Inactive', joined: '2021-09-28' },
];

const meta: Meta<A11yTableComponent> = {
  title: 'Accessibility Lib/Table',
  component: A11yTableComponent,
  tags: ['autodocs'],
  argTypes: {
    loading:    { control: 'boolean' },
    selectable: { control: 'boolean' },
  },
  parameters: {
    a11y: { disable: false },
    docs: {
      description: {
        component: `
**WCAG 2.1/2.2 compliance:**
- \`role="grid"\` with \`aria-label\`, \`aria-rowcount\`, \`aria-colcount\` (1.3.1)
- \`aria-sort="ascending|descending|none"\` on sortable headers (1.3.1)
- \`aria-selected\` + \`aria-multiselectable\` for row selection (1.3.1)
- Scrollable wrapper keyboard-reachable with \`tabindex="0"\` (2.1.1)
- Loading state uses \`aria-busy\` + sr-only announcement (4.1.3)
- Empty state uses \`role="status"\` live region (4.1.3)
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<A11yTableComponent>;

export const Default: Story = {
  args: { columns: COLUMNS as any, data: DATA, tableLabel: 'Team members', selectable: false },
  render: (args) => ({
    props: args,
    template: `<a11y-table [columns]="columns" [data]="data" [tableLabel]="tableLabel" [selectable]="selectable"></a11y-table>`,
  }),
};

export const WithSelection: Story = {
  args: { columns: COLUMNS as any, data: DATA, tableLabel: 'Team members', selectable: true },
  render: (args) => ({
    props: args,
    template: `<a11y-table [columns]="columns" [data]="data" [tableLabel]="tableLabel" [selectable]="selectable"></a11y-table>`,
  }),
};

export const LoadingState: Story = {
  args: { columns: COLUMNS as any, data: [], tableLabel: 'Team members', loading: true },
  render: (args) => ({
    props: args,
    template: `<a11y-table [columns]="columns" [data]="data" [tableLabel]="tableLabel" [loading]="loading"></a11y-table>`,
  }),
};

export const EmptyState: Story = {
  args: { columns: COLUMNS as any, data: [], tableLabel: 'Team members', emptyMessage: 'No team members found.' as any },
  render: (args) => ({
    props: args,
    template: `<a11y-table [columns]="columns" [data]="data" [tableLabel]="tableLabel" [emptyMessage]="emptyMessage"></a11y-table>`,
  }),
};
