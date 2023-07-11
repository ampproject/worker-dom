export class BytesStream {
  private _buffer: ArrayBuffer;
  private _dataView: DataView;
  private _uint8Array: Uint8Array;
  private _offset: number;

  public get buffer(): ArrayBuffer {
    if (this._buffer.byteLength - this._offset > 3) {
      console.warn('Buffer allocated more memory than used.', this._buffer.byteLength, this._offset);
    }

    return this._buffer;
  }

  public constructor(data: number | ArrayBuffer) {
    if (data instanceof ArrayBuffer) {
      this._buffer = data;
    } else {
      this._buffer = new ArrayBuffer(data || 1e6);
    }

    this._offset = 0;
    this._dataView = new DataView(this._buffer);
    this._uint8Array = new Uint8Array(this._buffer);
  }

  public refresh(): void {
    this._offset = 0;
  }

  private allocate(bytes: number) {
    const targetSize = this._offset + bytes;
    let currentSize = this._buffer.byteLength;

    if (targetSize <= currentSize) {
      return;
    }

    console.warn('Buffer re-allocation happened');

    while (currentSize < targetSize) {
      currentSize += currentSize;
    }

    const currentBuffer = this._buffer;

    // new buffer
    this._buffer = new ArrayBuffer(currentSize);
    this._dataView = new DataView(this._buffer);

    // copy current to the new buffer
    const array = new Uint8Array(this._buffer);
    array.set(new Uint8Array(currentBuffer));
    this._uint8Array = array;
  }

  // ------------------------------------------------------------------------

  // `int8`: [-128, 127] (1 byte)
  public appendInt8(value: number): void {
    if (value >= 127 || value <= -127) {
      console.warn('appendInt8 value out of range', value);
    }
    this.allocate(1);
    this._dataView.setInt8(this._offset++, value);
  }

  // `int16`: [-32768, 32767] (2 bytes)
  public appendInt16(value: number): void {
    if (value >= 32767 || value <= -32768) {
      console.warn('appendInt16 value out of range', value);
    }
    this.allocate(2);
    this._dataView.setInt16(this._offset, value);
    this._offset += 2;
  }

  // `int32`: [-2147483648, 2147483647] (4 bytes)
  public appendInt32(value: number): void {
    if (value >= 2147483647 || value < -2147483648) {
      console.warn('appendInt32 value out of range', value);
    }

    this.allocate(4);
    this._dataView.setInt32(this._offset, value);
    this._offset += 4;
  }

  // `uint8`: [0, 255] (1 byte)
  public appendUint8(value: number): void {
    if (value >= 255 || value < 0) {
      console.warn('appendUint8 value out of range', value);
    }
    this.allocate(1);
    this._dataView.setUint8(this._offset++, value);
  }

  // `uint16`: [0, 65535] (2 bytes)
  public appendUint16(value: number): void {
    if (value >= 65535 || value < 0) {
      console.warn('appendUint16 value out of range', value);
    }
    this.allocate(2);
    this._dataView.setUint16(this._offset, value);
    this._offset += 2;
  }

  // `uint32`: [0, 4294967295] (4 bytes)
  public appendUint32(value: number): void {
    if (value >= 4294967295 || value < 0) {
      console.warn('appendUint32 value out of range', value);
    }
    this.allocate(4);
    this._dataView.setUint32(this._offset, value);
    this._offset += 4;
  }

  // `int64`: [-2^63, 2^63-1] (8 bytes)
  public appendInt64(value: bigint): void {
    this.appendBigInt(value, 8);
  }

  // `uint64`: [0, 2^64-1] (8 bytes)
  public appendUint64(value: bigint): void {
    this.appendBigInt(value, 8, false);
  }

  // `float32`: [1.2×10-38, 3.4×1038] (7 significant digits) (4 bytes)
  public appendFloat32(value: number): void {
    this.allocate(4);
    this._dataView.setFloat32(this._offset, value);
    this._offset += 4;
  }

  // `float64`: [5.0×10-324, 1.8×10308] (16 significant digits) (8 bytes)
  public appendFloat64(value: number): void {
    this.allocate(8);
    this._dataView.setFloat64(this._offset, value);
    this._offset += 8;
  }

  public appendTypedArray(
    array: Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array,
  ): void {
    this.appendUint32(array.length);
    const size = array.BYTES_PER_ELEMENT;
    this._offset += size - (this._offset % size);
    this.allocate(array.byteLength);

    if (array instanceof Uint8Array) {
      this._uint8Array.set(array, this._offset);
    } else {
      this._uint8Array.set(new Uint8Array(array.buffer, array.byteOffset, array.byteLength), this._offset);
    }
    this._offset += array.byteLength;
  }

  public readTypedArray<T extends RelativeIndexable<number>>(
    type:
      | typeof Int8Array
      | typeof Uint8Array
      | typeof Uint8ClampedArray
      | typeof Int16Array
      | typeof Uint16Array
      | typeof Int32Array
      | typeof Uint32Array
      | typeof Float32Array
      | typeof Float64Array,
  ): RelativeIndexable<number> {
    const length = this.readUint32();
    this._offset += type.BYTES_PER_ELEMENT - (this._offset % type.BYTES_PER_ELEMENT);
    const array = new type(this._buffer, this._offset, length);
    this._offset += array.byteLength;
    return array;
  }

  private appendBigInt(data: bigint, bytes: number, signed = true): void {
    this.allocate(8);

    if (bytes === 8) {
      const bigData = typeof data === 'bigint' ? data : BigInt(data);
      if (signed) {
        this._dataView.setBigInt64(this._offset, bigData);
      } else {
        this._dataView.setBigUint64(this._offset, bigData);
      }
    } else {
      throw new Error(`Unsupported bigint with size ${bytes} bytes`);
    }
    this._offset += bytes;
  }

  // ------------------------------------------------------------------------

  public readUint8(): number {
    return this._dataView.getUint8(this._offset++);
  }

  public readUint16(): number {
    const value = this._dataView.getUint16(this._offset);
    this._offset += 2;
    return value;
  }

  public readUint32(): number {
    const value = this._dataView.getUint32(this._offset);
    this._offset += 4;
    return value;
  }

  public readInt8(): number {
    return this._dataView.getInt8(this._offset++);
  }

  public readInt16(): number {
    const value = this._dataView.getInt16(this._offset);
    this._offset += 2;
    return value;
  }

  public readInt32(): number {
    const value = this._dataView.getInt32(this._offset);
    this._offset += 4;
    return value;
  }

  public readUint64(): bigint {
    return this.readBigInt(8, false);
  }

  public readInt64(): bigint {
    return this.readBigInt(8);
  }

  public readFloat32(): number {
    const value = this._dataView.getFloat32(this._offset);
    this._offset += 4;
    return value;
  }

  public readFloat64(): number {
    const value = this._dataView.getFloat64(this._offset);
    this._offset += 8;
    return value;
  }

  private readBigInt(bytes: number, signed = true): bigint {
    let result = BigInt(0);
    if (bytes === 8) {
      if (signed) {
        result = this._dataView.getBigInt64(this._offset);
      } else {
        result = this._dataView.getBigUint64(this._offset);
      }
    } else {
      throw new Error(`Unsupported bigint with size ${bytes} bytes`);
    }
    this._offset += bytes;
    return result;
  }
}
