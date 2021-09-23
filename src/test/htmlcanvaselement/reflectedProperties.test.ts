import anyTest, { TestInterface } from 'ava';
import { testReflectedProperty } from '../reflectPropertiesHelper';
import { HTMLCanvasElement } from '../../worker-thread/dom/HTMLCanvasElement';
import { CanvasRenderingContext2DShim } from '../../worker-thread/canvas/CanvasRenderingContext2D';
import { CanvasRenderingContext2D } from '../../worker-thread/canvas/CanvasTypes';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  element: HTMLCanvasElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument({
    OffscreenCanvas: FakeOffscreenCanvas,
  });

  t.context = {
    element: document.createElement('canvas') as HTMLCanvasElement,
  };
});

class FakeOffscreenCanvas {
  getContext(c: string): CanvasRenderingContext2D {
    return {} as unknown as CanvasRenderingContext2D;
  }
}

testReflectedProperty({ width: [0] });
testReflectedProperty({ height: [0] });

test('getContext throws for unsupported types of context', (t) => {
  const { element } = t.context;
  t.throws(() => {
    element.getContext('webgl');
  });
});

test('getContext retrieves 2D context', (t) => {
  const { element } = t.context;
  const ctx = element.getContext('2d');
  t.true(ctx instanceof CanvasRenderingContext2DShim);
});

test('getContext will retrieve same instance always', (t) => {
  const { element } = t.context;
  const firstRetrieval = element.getContext('2d');
  const secondRetrieval = element.getContext('2d');
  t.true(firstRetrieval === secondRetrieval);
});
