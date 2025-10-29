import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path', () => ({
  join: jest.fn(() => '/mocked/path/to/file'),
}));

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);

    expect(callback).not.toBeCalled();
    jest.advanceTimersByTime(1000);
    expect(callback).toBeCalledTimes(1);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 2000);

    jest.advanceTimersByTime(1000);
    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(1000);
    expect(callback).toBeCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and interval', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 1000);

    jest.advanceTimersByTime(1000);
    expect(callback).toBeCalledTimes(1);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 500);

    jest.advanceTimersByTime(2000);
    expect(callback).toBeCalledTimes(4);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    (existsSync as jest.Mock).mockReturnValue(false);
    await readFileAsynchronously('test.txt');
    expect(join).toBeCalledWith(__dirname, 'test.txt');
  });

  test('should return null if file does not exist', async () => {
    (existsSync as jest.Mock).mockReturnValue(false);
    const result = await readFileAsynchronously('missing.txt');
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    (existsSync as jest.Mock).mockReturnValue(true);
    (readFile as jest.Mock).mockResolvedValue(Buffer.from('Hello, world!'));

    const result = await readFileAsynchronously('hello.txt');
    expect(result).toBe('Hello, world!');
  });
});
