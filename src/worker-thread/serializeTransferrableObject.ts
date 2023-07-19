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
    serializeObject(args[i], stream);
  }

  return stream;
}

function serializeObject(arg: any, stream: BytesStream) {
  if (arg === undefined) {
    stream.appendUint8(TransferrableObjectType.Undefined);
    return;
  }

  if (arg === null) {
    stream.appendUint8(TransferrableObjectType.Null);
    return;
  }

  const argType = typeof arg;

  if (argType === 'number') {
    appendNumber(arg, stream);
    return;
  }

  if (argType === 'bigint') {
    if (arg < 0) {
      stream.appendUint8(TransferrableObjectType.Int64);
      stream.appendInt64(arg);
    } else {
      stream.appendUint8(TransferrableObjectType.Uint64);
      stream.appendUint64(arg);
    }
    return;
  }

  if (argType === 'string') {
    stream.appendUint8(TransferrableObjectType.String);
    stream.appendUint16(store(arg));
    return;
  }

  if (argType === 'boolean') {
    stream.appendUint8(arg ? TransferrableObjectType.BooleanTrue : TransferrableObjectType.BooleanFalse);
    return;
  }

  if (Array.isArray(arg)) {
    if (arg.length === 0) {
      stream.appendUint8(TransferrableObjectType.ArrayEmpty);
    } else {
      stream.appendUint8(TransferrableObjectType.Array);
      serializeTransferableMessage(arg, stream);
    }
    return;
  }

  if (ArrayBuffer.isView(arg)) {
    if (arg instanceof Int8Array) {
      stream.appendUint8(TransferrableObjectType.Int8Array);
      stream.appendTypedArray(arg);
      return;
    }
    if (arg instanceof Int16Array) {
      stream.appendUint8(TransferrableObjectType.Int16Array);
      stream.appendTypedArray(arg);
      return;
    }
    if (arg instanceof Int32Array) {
      stream.appendUint8(TransferrableObjectType.Int32Array);
      stream.appendTypedArray(arg);
      return;
    }
    if (arg instanceof Uint8Array) {
      stream.appendUint8(TransferrableObjectType.Uint8Array);
      stream.appendTypedArray(arg);
      return;
    }
    if (arg instanceof Uint16Array) {
      stream.appendUint8(TransferrableObjectType.Uint16Array);
      stream.appendTypedArray(arg);
      return;
    }
    if (arg instanceof Uint32Array) {
      stream.appendUint8(TransferrableObjectType.Uint32Array);
      stream.appendTypedArray(arg);
      return;
    }
    if (arg instanceof Uint8ClampedArray) {
      stream.appendUint8(TransferrableObjectType.Uint8ClampedArray);
      stream.appendTypedArray(arg);
      return;
    }
    if (arg instanceof Float32Array) {
      stream.appendUint8(TransferrableObjectType.Float32Array);
      stream.appendTypedArray(arg);
      return;
    }
    if (arg instanceof Float64Array) {
      stream.appendUint8(TransferrableObjectType.Float64Array);
      stream.appendTypedArray(arg);
      return;
    }
  }

  if (arg instanceof ArrayBuffer) {
    stream.appendUint8(TransferrableObjectType.ArrayBuffer);
    stream.appendArrayBuffer(arg);
    return;
  }

  if (argType === 'object') {
    if (typeof arg[TransferrableKeys.serializeAsTransferrableObject] == 'function') {
      // serializable
      const serializedObject = (arg as TransferrableObject)[TransferrableKeys.serializeAsTransferrableObject]();
      stream.appendUint8(serializedObject[0]); // type
      stream.appendUint16(serializedObject[1]); // id
    } else {
      const entries = Object.entries(arg);
      stream.appendUint8(TransferrableObjectType.Object);
      stream.appendUint8(entries.length);

      entries.forEach(([key, value]) => {
        if (typeof value != 'undefined') {
          serializeObject(key, stream); // key
          serializeObject(value, stream); // value
        }
      });
    }

    return;
  }
  throw new Error('Cannot serialize argument.');
}

export function estimateSizeInBytes(args: any[]) {
  let size = Uint32Array.BYTES_PER_ELEMENT; // args count
  for (let i = 0; i < args.length; i++) {
    const arg: any = args[i];
    size += estimateObjectSizeInBytes(arg);
  }
  return size;
}

function estimateObjectSizeInBytes(obj: any) {
  let size = Uint8Array.BYTES_PER_ELEMENT; // type

  if (obj === undefined || obj === null) {
    return size;
  }

  const argType = typeof obj;

  if (argType === 'boolean') {
    return size;
  }

  if (argType === 'string') {
    size += Uint16Array.BYTES_PER_ELEMENT;
    return size;
  }

  if (argType === 'number') {
    if (Number.isInteger(obj)) {
      if (obj < 0) {
        // int type
        if (obj >= -128) {
          // int8
          size += Int8Array.BYTES_PER_ELEMENT;
          return size;
        } else if (obj >= -32768) {
          // int16
          size += Int16Array.BYTES_PER_ELEMENT;
          return size;
        } else {
          // int32
          size += Int32Array.BYTES_PER_ELEMENT;
          return size;
        }
      } else {
        // uint type
        if (obj <= 255) {
          // uint8
          size += Uint8Array.BYTES_PER_ELEMENT;
          return size;
        } else if (obj <= 65535) {
          // uint16
          size += Uint16Array.BYTES_PER_ELEMENT;
          return size;
        } else {
          // uint32
          size += Uint32Array.BYTES_PER_ELEMENT;
          return size;
        }
      }
    } else {
      if (obj >= -3.4e38 && obj <= 3.4e38) {
        // float32
        size += Float32Array.BYTES_PER_ELEMENT;
        return size;
      } else {
        size += Float64Array.BYTES_PER_ELEMENT;
        return size;
      }
    }
  }

  if (argType === 'bigint') {
    if (obj < 0) {
      size += BigInt64Array.BYTES_PER_ELEMENT;
      return size;
    } else {
      size += BigUint64Array.BYTES_PER_ELEMENT;
      return size;
    }
  }

  if (Array.isArray(obj)) {
    if (obj.length > 0) {
      size += estimateSizeInBytes(obj);
      return size;
    }
  }

  if (ArrayBuffer.isView(obj)) {
    if (
      obj instanceof Int8Array ||
      obj instanceof Int16Array ||
      obj instanceof Int32Array ||
      obj instanceof Uint8Array ||
      obj instanceof Uint8ClampedArray ||
      obj instanceof Uint16Array ||
      obj instanceof Uint32Array ||
      obj instanceof Float32Array ||
      obj instanceof Float64Array ||
      obj instanceof BigInt64Array ||
      obj instanceof BigUint64Array
    ) {
      size += estimateArraySizeInBytes(obj.length, obj.BYTES_PER_ELEMENT);
      return size;
    }
  }

  if (obj instanceof ArrayBuffer) {
    size += estimateArraySizeInBytes(obj.byteLength / Uint8Array.BYTES_PER_ELEMENT, Uint8Array.BYTES_PER_ELEMENT);
    return size;
  }

  if (argType === 'object') {
    if (typeof obj[TransferrableKeys.serializeAsTransferrableObject] == 'function') {
      size += Uint16Array.BYTES_PER_ELEMENT;
      return size;
    } else {
      size += Uint8Array.BYTES_PER_ELEMENT; // length

      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value != 'undefined') {
          size += estimateObjectSizeInBytes(key);
          size += estimateObjectSizeInBytes(value);
        }
      });
      return size;
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
