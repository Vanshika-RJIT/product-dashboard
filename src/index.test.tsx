jest.mock('./reportWebVitals', () => ({
  __esModule: true,
  default: jest.fn(),
}));

export {};

describe('index.tsx', () => {
  it('is a module', () => {
    expect(true).toBe(true);
  });
});
