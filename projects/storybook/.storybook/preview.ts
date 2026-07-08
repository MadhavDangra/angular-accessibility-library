import { Preview, applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const preview: Preview = {
  decorators: [
    applicationConfig({ providers: [provideAnimationsAsync()] }),
  ],
  parameters: {
    a11y: {
      // Run axe on every story automatically
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'label', enabled: true },
          { id: 'button-name', enabled: true },
        ],
      },
    },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
  },
};

export default preview;
