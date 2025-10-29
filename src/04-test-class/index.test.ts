import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const account = getBankAccount(100);
    expect(account.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError when withdrawing more than balance', () => {
    const account = getBankAccount(50);
    expect(() => account.withdraw(100)).toThrow(InsufficientFundsError);
    expect(() => account.withdraw(100)).toThrow(
      'Insufficient funds: cannot withdraw more than 50',
    );
  });

  test('should throw error when transferring more than balance', () => {
    const acc1 = getBankAccount(30);
    const acc2 = getBankAccount(0);
    expect(() => acc1.transfer(50, acc2)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const acc = getBankAccount(100);
    expect(() => acc.transfer(10, acc)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const acc = getBankAccount(100);
    acc.deposit(50);
    expect(acc.getBalance()).toBe(150);
  });

  test('should withdraw money', () => {
    const acc = getBankAccount(100);
    acc.withdraw(40);
    expect(acc.getBalance()).toBe(60);
  });

  test('should transfer money', () => {
    const acc1 = getBankAccount(100);
    const acc2 = getBankAccount(50);
    acc1.transfer(30, acc2);
    expect(acc1.getBalance()).toBe(70);
    expect(acc2.getBalance()).toBe(80);
  });

  test('fetchBalance should return number if request did not fail', async () => {
    const acc = getBankAccount(100);
    const result = await acc.fetchBalance();
    expect(typeof result === 'number' || result === null).toBe(true);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const acc = getBankAccount(100);
    jest.spyOn(acc, 'fetchBalance').mockResolvedValue(77);
    await acc.synchronizeBalance();
    expect(acc.getBalance()).toBe(77);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const acc = getBankAccount(100);
    jest.spyOn(acc, 'fetchBalance').mockResolvedValue(null);
    await expect(acc.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
