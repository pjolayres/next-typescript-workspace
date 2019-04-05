/**
 * @jest-environment node
 */

import axios from 'axios';

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

beforeAll(async () => {
  jest.setTimeout(30 * 1000); // 30-second timeout
});

describe('/api/v1/tools', () => {
  test('GET:/api/v1/tools/test', async () => {
    const response = await axios.get(`${baseUrl}/api/v1/tools/test`);

    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(response.data.status).toBe('Success');
    expect(response.data.data.length).toBeGreaterThan(0);
  });

  test('GET:/api/v1/tools/error', async () => {
    let error = null;
    try {
      await axios.get(`${baseUrl}/api/v1/tools/error`);
    } catch (ex) {
      error = ex;
    }

    const response = error.response;

    expect(response).not.toBeNull();
    expect(response.status).toBe(500);
    expect(response.data.success).toBe(false);
    expect(response.data.status).toBe('Server Error');
    expect(response.data.errorCode).toBe(10000);
    expect(response.data.message.length).toBeGreaterThan(0);
  });
});
