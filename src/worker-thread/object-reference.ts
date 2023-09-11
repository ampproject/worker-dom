import { transfer } from './MutationTransfer';
import { Document } from './dom/Document';
import { TransferrableMutationType } from '../transfer/TransferrableMutation';
import { DocumentStub } from './dom/DocumentStub';
import { TransferrableObject } from './worker-thread';

let objectId = 0;
const mapping: Map<number, any> = new Map();

export function getObjectReference(id: number) {
  return mapping.get(id);
}

export function setObjectReference(id: number, object: any) {
  if (mapping.has(id)) {
    const current = mapping.get(id);
    if (current !== object) {
      throw new Error(
        `ID: ${id} already associated with another object, current object ${JSON.stringify(current)}, provided: ${JSON.stringify(object)}`,
      );
    }
  } else {
    mapping.set(id, object);
  }
  return;
}

/**
 * Creates object in the main thread, and associates it with the returned id.
 *
 * @param document Target document.
 * @param target Target object to use for object creation.
 * @param creationMethod Method to use for object creation.
 * @param creationArgs Arguments to pass into the creation method.
 * @param instanceCreationFn method instantiate object with provided id.
 * @return objectId Object reference ID.
 */
export function createObjectReference<T>(
  document: Document | DocumentStub,
  target: TransferrableObject | Document | typeof globalThis,
  creationMethod: string,
  creationArgs: any[] | IArguments,
  instanceCreationFn: (id: number) => T,
): T {
  const id = nextObjectId();
  transfer(document, [TransferrableMutationType.OBJECT_CREATION, creationMethod, false, id, target, creationArgs]);

  const instance = instanceCreationFn(id);
  mapping.set(id, instance);

  return instance;
}

export function createObjectReferenceConstructor<T>(
  document: Document | DocumentStub,
  target: TransferrableObject | Document | typeof globalThis,
  creationMethod: string,
  creationArgs: any[],
  instanceCreationFn: (id: number) => T,
): T {
  const id = nextObjectId();
  transfer(document, [TransferrableMutationType.OBJECT_CREATION, creationMethod, true, id, target, creationArgs]);

  const instance = instanceCreationFn(id);
  mapping.set(id, instance);

  return instance;
}

export function createWindowObjectReferenceConstructor<T>(document: Document | DocumentStub, className: string, args: any[] | IArguments): number {
  const id = nextObjectId();
  transfer(document, [TransferrableMutationType.OBJECT_CREATION, className, true, id, self, args]);

  return id;
}

export function deleteObjectReference(document: Document | DocumentStub, id: number): void {
  transfer(document, [TransferrableMutationType.OBJECT_DELETION, id]);
  mapping.delete(id);
}

export function nextObjectId(): number {
  // Wraparound to 0 in case someone attempts to register over 9 quadrillion objects.
  if (objectId >= Number.MAX_VALUE) {
    objectId = 0;
  }

  return ++objectId;
}
