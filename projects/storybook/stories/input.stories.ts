import type { Meta, StoryObj } from '@storybook/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { A11yInputComponent } from '../../accessibility-lib/src/lib/input/input.component';

const meta: Meta<A11yInputComponent> = {
  title: 'Accessibility Lib/Input',
  component: A11yInputComponent,
  tags: ['autodocs'],
  argTypes: {
    label:        { control: 'text' },
    type:         { control: 'select', options: ['text','email','password','number','textarea','select','search'] },
    placeholder:  { control: 'text' },
    required:     { control: 'boolean' },
    disabled:     { control: 'boolean' },
    hint:         { control: 'text' },
    errorMessage: { control: 'text' },
    prefixIcon:   { control: 'text' },
  },
  parameters: {
    a11y: { disable: false },
    docs: {
      description: {
        component: `
**WCAG 2.1/2.2 compliance:**
- Explicit \`<label for="...">\` — never placeholder-as-label (3.3.2)
- \`aria-required\` on required fields (3.3.2)
- \`aria-invalid\` + \`role="alert"\` error messages (3.3.1, 4.1.3)
- Hint text via \`aria-describedby\` (3.3.2)
- Password toggle with \`aria-pressed\` + dynamic \`aria-label\` (4.1.2)
- Implements \`ControlValueAccessor\` — works with reactive and template forms
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<A11yInputComponent>;

export const TextInput: Story = {
  args: {
    label: 'Full Name',
    type: 'text',
    placeholder: 'Enter your name',
    required: true,
    hint: 'First and last name',
    prefixIcon: 'person',
  },
  render: (args) => ({
    props: args,
    template: `
      <a11y-input
        [label]="label" [type]="type" [placeholder]="placeholder"
        [required]="required" [hint]="hint" [prefixIcon]="prefixIcon">
      </a11y-input>
    `,
  }),
};

export const EmailWithError: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    placeholder: 'you@company.com',
    required: true,
    hint: "We'll never share your email",
    prefixIcon: 'email',
    errorMessage: 'Please enter a valid email address.',
  },
  render: (args) => ({
    props: args,
    template: `
      <a11y-input
        [label]="label" [type]="type" [placeholder]="placeholder"
        [required]="required" [hint]="hint" [prefixIcon]="prefixIcon"
        [errorMessage]="errorMessage">
      </a11y-input>
    `,
  }),
};

export const PasswordField: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Min 8 characters',
    required: true,
    hint: 'Include a number and special character',
  },
  render: (args) => ({
    props: args,
    template: `
      <a11y-input [label]="label" [type]="type"
        [placeholder]="placeholder" [required]="required" [hint]="hint">
      </a11y-input>
    `,
  }),
};

export const SelectField: Story = {
  args: {
    label: 'Role',
    type: 'select',
    required: true,
    options: [
      { value: 'engineer', label: 'Software Engineer' },
      { value: 'designer', label: 'UX Designer' },
      { value: 'pm',       label: 'Product Manager' },
      { value: 'qa',       label: 'QA Engineer', disabled: true },
    ] as any,
  },
  render: (args) => ({
    props: args,
    template: `
      <a11y-input [label]="label" [type]="type"
        [required]="required" [options]="options">
      </a11y-input>
    `,
  }),
};

export const TextareaField: Story = {
  args: {
    label: 'Bio',
    type: 'textarea',
    placeholder: 'Tell us about yourself…',
    hint: 'Optional — max 300 characters',
  },
  render: (args) => ({
    props: args,
    template: `
      <a11y-input [label]="label" [type]="type"
        [placeholder]="placeholder" [hint]="hint">
      </a11y-input>
    `,
  }),
};

export const DisabledInput: Story = {
  args: {
    label: 'Username',
    type: 'text',
    placeholder: 'Cannot be changed',
    disabled: true,
    hint: 'Contact admin to update',
  },
  render: (args) => ({
    props: args,
    template: `
      <a11y-input [label]="label" [type]="type"
        [placeholder]="placeholder" [disabled]="disabled" [hint]="hint">
      </a11y-input>
    `,
  }),
};
