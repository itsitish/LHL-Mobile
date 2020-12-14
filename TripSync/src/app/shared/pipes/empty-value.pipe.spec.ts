import { EmptyValuePipe } from './empty-value.pipe';

describe('EmptyValuePipe', () => {
  it('create an instance', () => {
    const pipe = new EmptyValuePipe();
    expect(pipe).toBeTruthy();
  });
});
