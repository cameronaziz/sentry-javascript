import { expect } from '@playwright/test';

import { sentryTest } from '../../../utils/fixtures';
import { getSentryRequest } from '../../../utils/helpers';

sentryTest(
  'should parse function identifiers that contain protocol names correctly',
  async ({ getLocalTestPath, page, browserName }) => {
    const url = await getLocalTestPath({ testDir: __dirname });

    const eventData = await getSentryRequest(page, url);

    expect(eventData.exception?.values?.[0].stacktrace?.frames).toMatchObject(
      browserName === 'chromium'
        ? [
            { function: '?' },
            { function: '?' },
            { function: 'decodeBlob' },
            { function: 'readFile' },
            { function: 'httpsCall' },
            { function: 'webpackDevServer' },
            { function: 'Function.httpCode' },
          ]
        : browserName === 'firefox'
        ? [
            { function: '?' },
            { function: '?' },
            { function: 'decodeBlob' },
            { function: 'readFile' },
            { function: 'httpsCall' },
            { function: 'webpackDevServer' },
            { function: 'httpCode' },
          ]
        : [
            { function: 'global code' },
            { function: '?' },
            { function: 'decodeBlob' },
            { function: 'readFile' },
            { function: 'httpsCall' },
            { function: 'webpackDevServer' },
            { function: 'httpCode' },
          ],
    );
  },
);

sentryTest('should not add any part of the function identifier inside filename', async ({ getLocalTestPath, page }) => {
  const url = await getLocalTestPath({ testDir: __dirname });

  const eventData = await getSentryRequest(page, url);

  expect(eventData.exception?.values?.[0].stacktrace?.frames).toMatchObject(
    Array(7).fill({ filename: expect.stringMatching(/^file:\/?/) }),
  );
});