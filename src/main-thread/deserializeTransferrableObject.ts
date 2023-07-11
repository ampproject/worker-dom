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
    const type = buffer.readUint8() as TransferrableObjectType;
    switch (type) {
      case TransferrableObjectType.Undefined:
        args[i] = undefined;
        break;
      case TransferrableObjectType.Null:
        args[i] = null;
        break;
      case TransferrableObjectType.Int8:
        args[i] = buffer.readInt8();
        break;
      case TransferrableObjectType.Int16:
        args[i] = buffer.readInt16();
        break;
      case TransferrableObjectType.Int32:
        args[i] = buffer.readInt32();
        break;
      case TransferrableObjectType.Int64:
        args[i] = buffer.readInt64();
        break;
      case TransferrableObjectType.Uint8:
        args[i] = buffer.readUint8();
        break;
      case TransferrableObjectType.Uint16:
        args[i] = buffer.readUint16();
        break;
      case TransferrableObjectType.Uint32:
        args[i] = buffer.readUint32();
        break;
      case TransferrableObjectType.Uint64:
        args[i] = buffer.readUint64();
        break;
      case TransferrableObjectType.Float32:
        args[i] = buffer.readFloat32();
        break;
      case TransferrableObjectType.Float64:
        args[i] = buffer.readFloat64();
        break;
      case TransferrableObjectType.String:
        args[i] = stringContext.get(buffer.readUint16());
        break;
      case TransferrableObjectType.BooleanTrue:
        args[i] = true;
        break;
      case TransferrableObjectType.BooleanFalse:
        args[i] = false;
        break;
      case TransferrableObjectType.ArrayEmpty:
        args[i] = [];
        break;
      case TransferrableObjectType.Array:
        args[i] = deserializeTransferableMessage(buffer, stringContext, nodeContext, objectContext);
        break;
      case TransferrableObjectType.TransferObject:
        args[i] = objectContext.get(buffer.readUint16());
        break;
      case TransferrableObjectType.CanvasRenderingContext2D:
        const canvas = nodeContext.getNode(buffer.readUint16()) as HTMLCanvasElement;
        args[i] = canvas.getContext('2d');
        break;
      case TransferrableObjectType.HTMLElement:
        args[i] = nodeContext.getNode(buffer.readUint16());
        break;
      case TransferrableObjectType.Window:
        args[i] = window;
        buffer.readUint16(); // TODO: fix
        break;
      case TransferrableObjectType.Int8Array:
        args[i] = buffer.readTypedArray(Int8Array);
        break;
      case TransferrableObjectType.Int16Array:
        args[i] = buffer.readTypedArray(Int16Array);
        break;
      case TransferrableObjectType.Int32Array:
        args[i] = buffer.readTypedArray(Int32Array);
        break;
      case TransferrableObjectType.Uint8ClampedArray:
        args[i] = buffer.readTypedArray(Uint8ClampedArray);
        break;
      case TransferrableObjectType.Uint8Array:
        args[i] = buffer.readTypedArray(Uint8Array);
        break;
      case TransferrableObjectType.Uint16Array:
        args[i] = buffer.readTypedArray(Uint16Array);
        break;
      case TransferrableObjectType.Uint32Array:
        args[i] = buffer.readTypedArray(Uint32Array);
        break;
      case TransferrableObjectType.Float32Array:
        args[i] = buffer.readTypedArray(Float32Array);
        break;
      case TransferrableObjectType.Float64Array:
        args[i] = buffer.readTypedArray(Float64Array);
        break;

      default:
        throw new Error('Cannot deserialize argument.');
    }
  }
  return args;
}
