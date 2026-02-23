import type { Preview } from '@storybook/react';
// Import the compiled DS CSS artifact (includes variables + .mts-* utilities)
import '../dist/styles.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
