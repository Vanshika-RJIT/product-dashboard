import reportWebVitals from './reportWebVitals';

describe('reportWebVitals', () => {
  it('is a function', () => {
    expect(typeof reportWebVitals).toBe('function');
  });

  it('can be called without errors', () => {
    const mockCallback = jest.fn();
    expect(() => reportWebVitals(mockCallback)).not.toThrow();
  });
});
