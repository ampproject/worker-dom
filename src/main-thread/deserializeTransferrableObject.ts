import { StringContext } from './strings';
import { TransferrableObjectType } from '../transfer/TransferrableMutation';
import { NodeContext } from './nodes';
import { ObjectContext } from './object-context';
import { BytesStream } from '../transfer/BytesStream';

export function deserializeTransferableMessage(
  buffer: BytesStream,
  stringContext: StringContext,
  nodeContext: NodeContext,
  objectContext: ObjectContext,
): any[] {
  const count = buffer.readUint32();
  const args: any[] = new Array(count);

  for (let i = 0; i < count; i++) {
    args[i] = deserializeNext(buffer, stringContext, nodeContext, objectContext);
  }
  return args;
}

function deserializeNext(buffer: BytesStream, stringContext: StringContext, nodeContext: NodeContext, objectContext: ObjectContext): any {
  const type = buffer.readUint8() as TransferrableObjectType;
  switch (type) {
    case TransferrableObjectType.Undefined:
      return undefined;
    case TransferrableObjectType.Null:
      return null;
    case TransferrableObjectType.Int8:
      return buffer.readInt8();
    case TransferrableObjectType.Int16:
      return buffer.readInt16();
    case TransferrableObjectType.Int32:
      return buffer.readInt32();
    case TransferrableObjectType.Int64:
      return buffer.readInt64();
    case TransferrableObjectType.Uint8:
      return buffer.readUint8();
    case TransferrableObjectType.Uint16:
      return buffer.readUint16();
    case TransferrableObjectType.Uint32:
      return buffer.readUint32();
    case TransferrableObjectType.Uint64:
      return buffer.readUint64();
    case TransferrableObjectType.Float32:
      return buffer.readFloat32();
    case TransferrableObjectType.Float64:
      return buffer.readFloat64();
    case TransferrableObjectType.String:
      return stringContext.get(buffer.readUint16());
    case TransferrableObjectType.BooleanTrue:
      return true;
    case TransferrableObjectType.BooleanFalse:
      return false;
    case TransferrableObjectType.ArrayEmpty:
      return [];
    case TransferrableObjectType.Array:
      return deserializeTransferableMessage(buffer, stringContext, nodeContext, objectContext);
    case TransferrableObjectType.TransferObject:
      return objectContext.get(buffer.readUint16());
    case TransferrableObjectType.CanvasRenderingContext2D:
      const canvas = nodeContext.getNode(buffer.readUint16()) as HTMLCanvasElement;
      return canvas.getContext('2d');
    case TransferrableObjectType.HTMLElement:
      return nodeContext.getNode(buffer.readUint16());
    case TransferrableObjectType.Window:
      buffer.readUint16(); // TODO: fix
      return window;
    case TransferrableObjectType.Int8Array:
      return buffer.readTypedArray(Int8Array);
    case TransferrableObjectType.Int16Array:
      return buffer.readTypedArray(Int16Array);
    case TransferrableObjectType.Int32Array:
      return buffer.readTypedArray(Int32Array);
    case TransferrableObjectType.Uint8ClampedArray:
      return buffer.readTypedArray(Uint8ClampedArray);
    case TransferrableObjectType.Uint8Array:
      return buffer.readTypedArray(Uint8Array);
    case TransferrableObjectType.Uint16Array:
      return buffer.readTypedArray(Uint16Array);
    case TransferrableObjectType.Uint32Array:
      return buffer.readTypedArray(Uint32Array);
    case TransferrableObjectType.Float32Array:
      return buffer.readTypedArray(Float32Array);
    case TransferrableObjectType.Float64Array:
      return buffer.readTypedArray(Float64Array);
    case TransferrableObjectType.ArrayBuffer:
      return buffer.readArrayBuffer();
    case TransferrableObjectType.Object:
      const object: any = {};
      const keysCount = buffer.readUint8();

      for (let i = 0; i < keysCount; i++) {
        const key = deserializeNext(buffer, stringContext, nodeContext, objectContext); // expect string
        const value = deserializeNext(buffer, stringContext, nodeContext, objectContext); // any
        object[key] = value;
      }

      return object;
    default:
      throw new Error('Cannot deserialize argument.');
  }
}
