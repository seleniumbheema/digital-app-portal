import { BrandImagePipe } from './brand-image.pipe';

describe('Brand Image Pipe', () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  const pipe = new BrandImagePipe();

  it('should transform path with brand prefix', () => {
    expect(pipe.transform('/images/angular.png')).toBe(`./${ESURE_GLOBALS.BRAND}/images/angular.png`);
  });
});
