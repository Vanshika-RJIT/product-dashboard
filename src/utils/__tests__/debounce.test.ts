import { debounce } from '../debounce';

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('calls function after delay', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    expect(func).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('cancels previous calls when called multiple times', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('passes arguments correctly', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc('arg1', 'arg2');

    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('resets timer on each call', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    jest.advanceTimersByTime(50);
    debouncedFunc();
    jest.advanceTimersByTime(50);
    expect(func).not.toHaveBeenCalled();
    jest.advanceTimersByTime(50);
    expect(func).toHaveBeenCalledTimes(1);
  });
});
