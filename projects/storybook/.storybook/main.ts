import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.ts'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',       // Axe accessibility checks in every story
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  docs: { autodocs: 'tag' },
};

export default config;
