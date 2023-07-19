import { TransferrableObject } from '../../worker-thread';
import { TransferrableKeys } from '../../../transfer/TransferrableKeys';
import { TransferrableObjectType } from '../../../transfer/TransferrableMutation';

export abstract class TransferrableGLObject implements TransferrableObject {
  public id: number;
  private readonly _serializedAsTransferrableObject: number[];

  constructor(id: number) {
    this.id = id;
    this._serializedAsTransferrableObject = [TransferrableObjectType.TransferObject, this.id];
  }

  public isDeleted() {
    return this.id == -1;
  }

  public delete() {
    this.id = -1;
  }

  public [TransferrableKeys.serializeAsTransferrableObject](): number[] {
    return this._serializedAsTransferrableObject;
  }
}

export class vGLQuery extends TransferrableGLObject implements WebGLQuery {
  public constructor(id: number) {
    super(id);
  }
}

export class vGLSampler extends TransferrableGLObject implements WebGLSampler {
  public constructor(id: number) {
    super(id);
  }
}

export class vGLTransformFeedback extends TransferrableGLObject implements WebGLTransformFeedback {
  public constructor(id: number) {
    super(id);
  }
}

export class vGLSync extends TransferrableGLObject implements WebGLSync {
  public constructor(id: number) {
    super(id);
  }
}

export class vGLLocation extends TransferrableGLObject implements WebGLUniformLocation {
  public name: string;

  public constructor(id: number, name: string) {
    super(id);
    this.name = name;
  }
}

export class vGLActiveInfo implements WebGLActiveInfo {
  public readonly name: string;
  public readonly size: number;
  public readonly type: number;
  public location: number;
  public uniformLocations: vGLLocation;

  public constructor(name: string, size: number, type: number, location: number) {
    this.name = name;
    this.size = size;
    this.type = type;
    this.location = location;
  }
}

export class vGLVertexArrayObject extends TransferrableGLObject implements WebGLVertexArrayObject {
  public constructor(id: number) {
    super(id);
  }
}

export class vGLTexture extends TransferrableGLObject implements WebGLTexture {
  public binding: number = 0;

  public constructor(id: number) {
    super(id);
  }
}

export class vGLBuffer extends TransferrableGLObject implements WebGLBuffer {
  public target: GLenum;
  public size: GLsizeiptr;
  public usage: GLenum;

  public constructor(id: number) {
    super(id);
  }
}

export class vGLFramebuffer extends vGLBuffer implements WebGLFramebuffer {
  public constructor(id: number) {
    super(id);
  }
}

export class vGLRenderbuffer extends vGLBuffer implements WebGLRenderbuffer {
  public constructor(id: number) {
    super(id);
  }
}
