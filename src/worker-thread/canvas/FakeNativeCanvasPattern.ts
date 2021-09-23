import { HTMLElement } from '../dom/HTMLElement';
import { CanvasImageSource } from './CanvasTypes';
import { retrieveImageBitmap } from './canvas-utils';
import { HTMLCanvasElement } from '../dom/HTMLCanvasElement';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';

/**
 * Wraps CanvasPattern for usage in a native OffscreenCanvas case.
 */
export class FakeNativeCanvasPattern<ElementType extends HTMLElement> {
  public [TransferrableKeys.patternImplementation] = {} as CanvasPattern;
  public [TransferrableKeys.patternUpgraded] = false;
  public [TransferrableKeys.patternUpgradePromise]: Promise<void>;

  /**
   * Retrieves ImageBitmap object from main-thread, which replicates the input image. Upon
   * retrieval, uses it to create a real CanvasPattern and upgrade the implementation property.
   * @param canvas Canvas element used to create the pattern.
   * @param image Image to be used as the pattern's image
   * @param repetition DOMStrings indicating how to repeat the pattern's image.
   */
  [TransferrableKeys.retrieveCanvasPattern](canvas: ElementType, image: CanvasImageSource, repetition: string): Promise<void> {
    this[TransferrableKeys.patternUpgradePromise] = retrieveImageBitmap(image as any, canvas as unknown as HTMLCanvasElement)
      // Create new pattern with retrieved ImageBitmap
      .then((instance: ImageBitmap) => {
        const pattern = canvas.getContext('2d').createPattern(instance, repetition);

        if (!pattern) {
          throw new Error('Pattern is null!');
        }

        this[TransferrableKeys.patternImplementation] = pattern;
        this[TransferrableKeys.patternUpgraded] = true;
      });

    return this[TransferrableKeys.patternUpgradePromise];
  }

  // This method is experimental.
  // Takes an SVGMatrix as an argument, which is a deprecated API.
  setTransform() {}
}
