import { mockOne, mockTwo, mockThree } from './index';

jest.mock('./index', () => {
  const originalModule =
    jest.requireActual<typeof import('./index')>('./index');

  return {
    ...originalModule,
    mockOne: jest.fn(),
    mockTwo: jest.fn(),
    mockThree: jest.fn(),
  };
});

describe('partial mocking', () => {
  afterAll(() => {
    jest.unmock('./index');
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    mockOne();
    mockTwo();
    mockThree();

    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test('unmockedFunction should log into console', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const { unmockedFunction } =
      jest.requireActual<typeof import('./index')>('./index');

    unmockedFunction();

    expect(consoleSpy).toHaveBeenCalledWith('I am not mocked');
    consoleSpy.mockRestore();
  });
});
