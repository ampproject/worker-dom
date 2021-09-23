declare type TransferObject = CanvasGradient | CanvasPattern;

/**
 * Stores objects that have their behavior handled from the main-thread. Each object is associated to a unique ID.
 */
export class ObjectContext {
  private objects: Map<number, TransferObject>;

  constructor() {
    this.objects = new Map();
  }

  store(id: number, obj: TransferObject): void {
    this.objects.set(id, obj);
  }

  get(id: number): TransferObject {
    const obj = this.objects.get(id);

    if (obj) {
      return obj;
    } else {
      throw new Error('Object with id (' + id + ') does not exist.');
    }
  }
}
