// Using "@types/jsdom" causes a bunch of conflicting type errors.
// May be due to https://github.com/DefinitelyTyped/DefinitelyTyped/issues/21517.
declare module 'jsdom' {
  export class JSDOM {
    public readonly window: Window;
    constructor(html: string, options: object);
  }
}
