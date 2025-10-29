import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: (fn: (...args: unknown[]) => unknown) => {
    function throttled(...args: unknown[]) {
      return fn(...args);
    }
    throttled.cancel = () => {};
    throttled.flush = () => {};
    return throttled;
  },
}));

describe('throttledGetDataFromApi', () => {
  let mockGet: jest.Mock;
  let mockCreate: jest.Mock;

  beforeEach(() => {
    mockGet = jest.fn();
    mockCreate = jest.fn().mockReturnValue({ get: mockGet });
    (axios.create as jest.Mock) = mockCreate;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    mockGet.mockResolvedValue({ data: {} });
    await throttledGetDataFromApi('/posts');
    expect(mockCreate).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    mockGet.mockResolvedValue({ data: {} });
    const path = '/users/1';
    await throttledGetDataFromApi(path);
    expect(mockGet).toHaveBeenCalledWith(path);
  });

  test('should return response data', async () => {
    const data = { id: 5, name: 'test' };
    mockGet.mockResolvedValue({ data });
    const result = await throttledGetDataFromApi('/somepath');
    expect(result).toEqual(data);
  });
});
