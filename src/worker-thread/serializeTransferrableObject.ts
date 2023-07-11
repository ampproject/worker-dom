import { store } from './strings';
import { TransferrableObjectType } from '../transfer/TransferrableMutation';
import { Serializable, TransferrableObject } from './worker-thread';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { BytesStream } from '../transfer/BytesStream';

/**
 * Serializes arguments into a Uint16 compatible format.
 *
 * The serialization format uses a variable length tuple, with the first item
 * being the encoded representation's type and any number of values afterwards.
 *
 * @param args The arguments to serialize
 */
export function serializeTransferableMessage(args: Array<Serializable>, stream?: BytesStream): BytesStream {
  stream = stream || new BytesStream(estimateSizeInBytes(args));

  stream.appendUint32(args.length);

  for (let i = 0; i < args.length; i++) {
    const arg: any = args[i];

    if (arg === undefined) {
      stream.appendUint8(TransferrableObjectType.Undefined);
      continue;
    }

    if (arg === null) {
      stream.appendUint8(TransferrableObjectType.Null);
      continue;
    }

    const argType = typeof arg;

    if (argType === 'number') {
      appendNumber(arg, stream);
      continue;
    }

    if (argType === 'bigint') {
      if (arg < 0) {
        stream.appendUint8(TransferrableObjectType.Int64);
        stream.appendInt64(arg);
      } else {
        stream.appendUint8(TransferrableObjectType.Uint64);
        stream.appendUint64(arg);
      }
      continue;
    }

    if (argType === 'string') {
      stream.appendUint8(TransferrableObjectType.String);
      stream.appendUint16(store(arg));
      continue;
    }

    if (argType === 'boolean') {
      stream.appendUint8(arg ? TransferrableObjectType.BooleanTrue : TransferrableObjectType.BooleanFalse);
      continue;
    }

    if (Array.isArray(arg)) {
      if (arg.length === 0) {
        stream.appendUint8(TransferrableObjectType.ArrayEmpty);
      } else {
        stream.appendUint8(TransferrableObjectType.Array);
        stream = serializeTransferableMessage(arg, stream);
      }
      continue;
    }

    if (ArrayBuffer.isView(arg)) {
      if (arg instanceof Int8Array) {
        stream.appendUint8(TransferrableObjectType.Int8Array);
        stream.appendTypedArray(arg);
        continue;
      }
      if (arg instanceof Int16Array) {
        stream.appendUint8(TransferrableObjectType.Int16Array);
        stream.appendTypedArray(arg);
        continue;
      }
      if (arg instanceof Int32Array) {
        stream.appendUint8(TransferrableObjectType.Int32Array);
        stream.appendTypedArray(arg);
        continue;
      }
      if (arg instanceof Uint8Array) {
        stream.appendUint8(TransferrableObjectType.Uint8Array);
        stream.appendTypedArray(arg);
        continue;
      }
      if (arg instanceof Uint16Array) {
        stream.appendUint8(TransferrableObjectType.Uint16Array);
        stream.appendTypedArray(arg);
        continue;
      }
      if (arg instanceof Uint32Array) {
        stream.appendUint8(TransferrableObjectType.Uint32Array);
        stream.appendTypedArray(arg);
        continue;
      }
      if (arg instanceof Uint8ClampedArray) {
        stream.appendUint8(TransferrableObjectType.Uint8ClampedArray);
        stream.appendTypedArray(arg);
        continue;
      }
      if (arg instanceof Float32Array) {
        stream.appendUint8(TransferrableObjectType.Float32Array);
        stream.appendTypedArray(arg);
        continue;
      }
      if (arg instanceof Float64Array) {
        stream.appendUint8(TransferrableObjectType.Float64Array);
        stream.appendTypedArray(arg);
        continue;
      }
    }

    if (argType === 'object') {
      const serializedObject = (arg as TransferrableObject)[TransferrableKeys.serializeAsTransferrableObject]();
      stream.appendUint8(serializedObject[0]); // type
      stream.appendUint16(serializedObject[1]); // id
      continue;
    }

    throw new Error('Cannot serialize argument.');
  }

  return stream;
}

export function estimateSizeInBytes(args: any[]) {
  let size = Uint32Array.BYTES_PER_ELEMENT; // args count
  for (let i = 0; i < args.length; i++) {
    const arg: any = args[i];

    size += Uint8Array.BYTES_PER_ELEMENT; // type

    if (arg === undefined) {
      continue;
    }

    if (arg === null) {
      continue;
    }

    const argType = typeof arg;

    if (argType === 'boolean') {
      continue;
    }

    if (argType === 'string') {
      size += Uint16Array.BYTES_PER_ELEMENT;
      continue;
    }

    if (argType === 'number') {
      if (Number.isInteger(arg)) {
        if (arg < 0) {
          // int type
          if (arg >= -128) {
            // int8
            size += Int8Array.BYTES_PER_ELEMENT;
            continue;
          } else if (arg >= -32768) {
            // int16
            size += Int16Array.BYTES_PER_ELEMENT;
            continue;
          } else {
            // int32
            size += Int32Array.BYTES_PER_ELEMENT;
            continue;
          }
        } else {
          // uint type
          if (arg <= 255) {
            // uint8
            size += Uint8Array.BYTES_PER_ELEMENT;
            continue;
          } else if (arg <= 65535) {
            // uint16
            size += Uint16Array.BYTES_PER_ELEMENT;
            continue;
          } else {
            // uint32
            size += Uint32Array.BYTES_PER_ELEMENT;
            continue;
          }
        }
      } else {
        if (arg >= -3.4e38 && arg <= 3.4e38) {
          // float32
          size += Float32Array.BYTES_PER_ELEMENT;
          continue;
        } else {
          size += Float64Array.BYTES_PER_ELEMENT;
          continue;
        }
      }
      continue;
    }

    if (argType === 'bigint') {
      if (arg < 0) {
        size += BigInt64Array.BYTES_PER_ELEMENT;
      } else {
        size += BigUint64Array.BYTES_PER_ELEMENT;
      }
      continue;
    }

    if (Array.isArray(arg)) {
      if (arg.length > 0) {
        size += estimateSizeInBytes(arg);
      }
      continue;
    }

    if (ArrayBuffer.isView(arg)) {
      if (
        arg instanceof Int8Array ||
        arg instanceof Int16Array ||
        arg instanceof Int32Array ||
        arg instanceof Uint8Array ||
        arg instanceof Uint8ClampedArray ||
        arg instanceof Uint16Array ||
        arg instanceof Uint32Array ||
        arg instanceof Float32Array ||
        arg instanceof Float64Array ||
        arg instanceof BigInt64Array ||
        arg instanceof BigUint64Array
      ) {
        size += estimateArraySizeInBytes(arg.length, arg.BYTES_PER_ELEMENT);
        continue;
      }
    }

    if (argType === 'object') {
      size += Uint16Array.BYTES_PER_ELEMENT;
      continue;
    }
  }
  return size;
}

function estimateArraySizeInBytes(length: number, bytesPerElement: number): number {
  return (
    length * bytesPerElement + // bytes size
    bytesPerElement + // offset buffer
    Uint8Array.BYTES_PER_ELEMENT + // type
    Uint32Array.BYTES_PER_ELEMENT // length
  );
}

function appendNumber(value: number, stream: BytesStream): void {
  if (Number.isInteger(value)) {
    if (value < 0) {
      // int type
      if (value >= -128) {
        // int8
        stream.appendUint8(TransferrableObjectType.Int8);
        stream.appendInt8(value);
      } else if (value >= -32768) {
        // int16
        stream.appendUint8(TransferrableObjectType.Int16);
        stream.appendInt16(value);
      } else {
        // int32
        stream.appendUint8(TransferrableObjectType.Int32);
        stream.appendInt32(value);
      }
    } else {
      // uint type
      if (value <= 255) {
        // uint8
        stream.appendUint8(TransferrableObjectType.Uint8);
        stream.appendUint8(value);
      } else if (value <= 65535) {
        // uint16
        stream.appendUint8(TransferrableObjectType.Uint16);
        stream.appendUint16(value);
      } else {
        // uint32
        stream.appendUint8(TransferrableObjectType.Uint32);
        stream.appendUint32(value);
      }
    }
  } else {
    if (value >= -3.4e38 && value <= 3.4e38) {
      // float32
      stream.appendUint8(TransferrableObjectType.Float32);
      stream.appendFloat32(value);
    } else {
      // float64
      stream.appendUint8(TransferrableObjectType.Float64);
      stream.appendFloat64(value);
    }
  }
}
