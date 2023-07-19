import { TransferrableGLObject, vGLQuery } from './TransferrableGLObjectTypes';
import { WebGLRenderingContextPolyfill } from '../WebGLRenderingContextPolyfill';
import { TransferrableKeys } from '../../../transfer/TransferrableKeys';
import { transfer } from '../../MutationTransfer';
import { Document } from '../../dom/Document';
import { TransferrableMutationType } from '../../../transfer/TransferrableMutation';
import { GLConstants } from './GLConstants';
import { GLShader } from './GLShader';
import { createObjectReference, deleteObjectReference } from '../../object-reference';

export abstract class TransferrableGLExtension extends TransferrableGLObject {
  protected readonly context: WebGLRenderingContextPolyfill;

  public constructor(id: number, context: WebGLRenderingContextPolyfill) {
    super(id);
    this.context = context;
  }

  protected [TransferrableKeys.mutated](fnName: string, args: any[]) {
    transfer(this.context.canvas.ownerDocument as Document, [TransferrableMutationType.OBJECT_MUTATION, fnName, this, args]);
  }

  protected createObjectReference(creationMethod: string, creationArgs: any[]): number {
    return createObjectReference(this.context.canvas.ownerDocument as Document, this, creationMethod, creationArgs);
  }

  protected deleteObjectReference(objectId: number) {
    deleteObjectReference(this.context.canvas.ownerDocument as Document, objectId);
  }
}

export class GenericExtension
  extends GLConstants
  implements
    EXT_blend_minmax,
    EXT_sRGB,
    EXT_texture_filter_anisotropic,
    KHR_parallel_shader_compile,
    OES_standard_derivatives,
    OES_texture_half_float,
    EXT_color_buffer_half_float,
    EXT_texture_compression_rgtc,
    WEBGL_color_buffer_float,
    WEBGL_compressed_texture_etc,
    WEBGL_compressed_texture_etc1,
    WEBGL_compressed_texture_pvrtc,
    WEBGL_compressed_texture_s3tc,
    WEBGL_compressed_texture_s3tc_srgb,
    WEBGL_debug_renderer_info,
    WEBGL_depth_texture /*, EXT_texture_norm16, EXT_texture_compression_bptc */ {}

export class GLVertexArrayObjectOES extends TransferrableGLObject implements WebGLVertexArrayObjectOES {}

export class WEBGLDebugShaders implements WEBGL_debug_shaders {
  getTranslatedShaderSource(shader: GLShader): string {
    return shader.compiled && shader.source != null ? shader.source : '';
  }
}

export class WEBGLCompressedTextureAstc extends GLConstants implements WEBGL_compressed_texture_astc {
  getSupportedProfiles(): string[] {
    return ['ldr']; // HDR?
  }
}

export class WEBGLDrawBuffers extends TransferrableGLExtension implements WEBGL_draw_buffers {
  readonly COLOR_ATTACHMENT0_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT10_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT11_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT12_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT13_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT14_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT15_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT1_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT2_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT3_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT4_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT5_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT6_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT7_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT8_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT9_WEBGL: GLenum;
  readonly DRAW_BUFFER0_WEBGL: GLenum;
  readonly DRAW_BUFFER10_WEBGL: GLenum;
  readonly DRAW_BUFFER11_WEBGL: GLenum;
  readonly DRAW_BUFFER12_WEBGL: GLenum;
  readonly DRAW_BUFFER13_WEBGL: GLenum;
  readonly DRAW_BUFFER14_WEBGL: GLenum;
  readonly DRAW_BUFFER15_WEBGL: GLenum;
  readonly DRAW_BUFFER1_WEBGL: GLenum;
  readonly DRAW_BUFFER2_WEBGL: GLenum;
  readonly DRAW_BUFFER3_WEBGL: GLenum;
  readonly DRAW_BUFFER4_WEBGL: GLenum;
  readonly DRAW_BUFFER5_WEBGL: GLenum;
  readonly DRAW_BUFFER6_WEBGL: GLenum;
  readonly DRAW_BUFFER7_WEBGL: GLenum;
  readonly DRAW_BUFFER8_WEBGL: GLenum;
  readonly DRAW_BUFFER9_WEBGL: GLenum;
  readonly MAX_COLOR_ATTACHMENTS_WEBGL: GLenum;
  readonly MAX_DRAW_BUFFERS_WEBGL: GLenum;

  public constructor(id: number, context: WebGLRenderingContextPolyfill) {
    super(id, context);
    this.COLOR_ATTACHMENT0_WEBGL = context.COLOR_ATTACHMENT0_WEBGL;
    this.COLOR_ATTACHMENT1_WEBGL = context.COLOR_ATTACHMENT1_WEBGL;
    this.COLOR_ATTACHMENT2_WEBGL = context.COLOR_ATTACHMENT2_WEBGL;
    this.COLOR_ATTACHMENT3_WEBGL = context.COLOR_ATTACHMENT3_WEBGL;
    this.COLOR_ATTACHMENT4_WEBGL = context.COLOR_ATTACHMENT4_WEBGL;
    this.COLOR_ATTACHMENT5_WEBGL = context.COLOR_ATTACHMENT5_WEBGL;
    this.COLOR_ATTACHMENT6_WEBGL = context.COLOR_ATTACHMENT6_WEBGL;
    this.COLOR_ATTACHMENT7_WEBGL = context.COLOR_ATTACHMENT7_WEBGL;
    this.COLOR_ATTACHMENT8_WEBGL = context.COLOR_ATTACHMENT8_WEBGL;
    this.COLOR_ATTACHMENT9_WEBGL = context.COLOR_ATTACHMENT9_WEBGL;
    this.COLOR_ATTACHMENT10_WEBGL = context.COLOR_ATTACHMENT10_WEBGL;
    this.COLOR_ATTACHMENT11_WEBGL = context.COLOR_ATTACHMENT11_WEBGL;
    this.COLOR_ATTACHMENT12_WEBGL = context.COLOR_ATTACHMENT12_WEBGL;
    this.COLOR_ATTACHMENT13_WEBGL = context.COLOR_ATTACHMENT13_WEBGL;
    this.COLOR_ATTACHMENT14_WEBGL = context.COLOR_ATTACHMENT14_WEBGL;
    this.COLOR_ATTACHMENT15_WEBGL = context.COLOR_ATTACHMENT15_WEBGL;

    this.DRAW_BUFFER0_WEBGL = context.DRAW_BUFFER0_WEBGL;
    this.DRAW_BUFFER1_WEBGL = context.DRAW_BUFFER1_WEBGL;
    this.DRAW_BUFFER2_WEBGL = context.DRAW_BUFFER2_WEBGL;
    this.DRAW_BUFFER3_WEBGL = context.DRAW_BUFFER3_WEBGL;
    this.DRAW_BUFFER4_WEBGL = context.DRAW_BUFFER4_WEBGL;
    this.DRAW_BUFFER5_WEBGL = context.DRAW_BUFFER5_WEBGL;
    this.DRAW_BUFFER6_WEBGL = context.DRAW_BUFFER6_WEBGL;
    this.DRAW_BUFFER7_WEBGL = context.DRAW_BUFFER7_WEBGL;
    this.DRAW_BUFFER8_WEBGL = context.DRAW_BUFFER8_WEBGL;
    this.DRAW_BUFFER9_WEBGL = context.DRAW_BUFFER9_WEBGL;
    this.DRAW_BUFFER10_WEBGL = context.DRAW_BUFFER10_WEBGL;
    this.DRAW_BUFFER11_WEBGL = context.DRAW_BUFFER11_WEBGL;
    this.DRAW_BUFFER12_WEBGL = context.DRAW_BUFFER12_WEBGL;
    this.DRAW_BUFFER13_WEBGL = context.DRAW_BUFFER13_WEBGL;
    this.DRAW_BUFFER14_WEBGL = context.DRAW_BUFFER14_WEBGL;
    this.DRAW_BUFFER15_WEBGL = context.DRAW_BUFFER15_WEBGL;

    this.MAX_COLOR_ATTACHMENTS_WEBGL = context.MAX_COLOR_ATTACHMENTS_WEBGL;
    this.MAX_DRAW_BUFFERS_WEBGL = context.MAX_DRAW_BUFFERS_WEBGL;
  }

  drawBuffersWEBGL(buffers: GLenum[]): void {
    this[TransferrableKeys.mutated]('drawBuffersWEBGL', [...arguments]);
  }
}

export class ANGLEInstancedArrays extends TransferrableGLExtension implements ANGLE_instanced_arrays {
  public readonly VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE: GLenum;

  public constructor(id: number, context: WebGLRenderingContextPolyfill) {
    super(id, context);
    this.VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE = context.VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE;
  }

  drawArraysInstancedANGLE(mode: GLenum, first: GLint, count: GLsizei, primcount: GLsizei): void {
    this[TransferrableKeys.mutated]('drawArraysInstancedANGLE', [...arguments]);
  }

  drawElementsInstancedANGLE(mode: GLenum, count: GLsizei, type: GLenum, offset: GLintptr, primcount: GLsizei): void {
    this[TransferrableKeys.mutated]('drawElementsInstancedANGLE', [...arguments]);
  }

  vertexAttribDivisorANGLE(index: GLuint, divisor: GLuint): void {
    this[TransferrableKeys.mutated]('vertexAttribDivisorANGLE', [...arguments]);
  }
}

export class OVRMultiview2 extends TransferrableGLExtension implements OVR_multiview2 {
  readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_NUM_VIEWS_OVR: GLenum;
  readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_BASE_VIEW_INDEX_OVR: GLenum;
  readonly MAX_VIEWS_OVR: GLenum;
  readonly FRAMEBUFFER_INCOMPLETE_VIEW_TARGETS_OVR: GLenum;

  public constructor(id: number, context: WebGLRenderingContextPolyfill) {
    super(id, context);
    this.FRAMEBUFFER_ATTACHMENT_TEXTURE_NUM_VIEWS_OVR = context.FRAMEBUFFER_ATTACHMENT_TEXTURE_NUM_VIEWS_OVR;
    this.FRAMEBUFFER_ATTACHMENT_TEXTURE_BASE_VIEW_INDEX_OVR = context.FRAMEBUFFER_ATTACHMENT_TEXTURE_BASE_VIEW_INDEX_OVR;
    this.MAX_VIEWS_OVR = context.MAX_VIEWS_OVR;
    this.FRAMEBUFFER_INCOMPLETE_VIEW_TARGETS_OVR = context.FRAMEBUFFER_INCOMPLETE_VIEW_TARGETS_OVR;
  }

  framebufferTextureMultiviewOVR(
    target: GLenum,
    attachment: GLenum,
    texture: WebGLTexture | null,
    level: GLint,
    baseViewIndex: GLint,
    numViews: GLsizei,
  ): void {
    this[TransferrableKeys.mutated]('framebufferTextureMultiviewOVR', [...arguments]);
  }
}

export class OESVertexArrayObject extends TransferrableGLExtension implements OES_vertex_array_object {
  readonly VERTEX_ARRAY_BINDING_OES: GLenum;

  public constructor(id: number, context: WebGLRenderingContextPolyfill) {
    super(id, context);
    this.VERTEX_ARRAY_BINDING_OES = context.VERTEX_ARRAY_BINDING_OES;
  }

  bindVertexArrayOES(arrayObject: GLVertexArrayObjectOES | null): void {
    this[TransferrableKeys.mutated]('bindVertexArrayOES', [...arguments]);
  }

  createVertexArrayOES(): GLVertexArrayObjectOES | null {
    const id = this.createObjectReference('createVertexArrayOES', []);
    return new GLVertexArrayObjectOES(id);
  }

  deleteVertexArrayOES(arrayObject: GLVertexArrayObjectOES | null): void {
    if (!arrayObject || arrayObject.isDeleted()) return;
    this[TransferrableKeys.mutated]('deleteVertexArrayOES', [...arguments]);
    this.deleteObjectReference(arrayObject.id);

    arrayObject.delete();
  }

  isVertexArrayOES(arrayObject: GLVertexArrayObjectOES | null): GLboolean {
    return arrayObject != null && arrayObject instanceof GLVertexArrayObjectOES && !arrayObject.isDeleted();
  }
}

export class WEBGLLoseContext extends TransferrableGLExtension implements WEBGL_lose_context {
  loseContext(): void {
    this[TransferrableKeys.mutated]('loseContext', []);
  }

  restoreContext(): void {
    this[TransferrableKeys.mutated]('restoreContext', []);
  }
}

export class EXTDisjointTimerQuery extends TransferrableGLExtension /* implements EXT_disjoint_timer_query */ {
  readonly GPU_DISJOINT_EXT: GLenum;
  readonly QUERY_COUNTER_BITS_EXT: GLenum;
  readonly QUERY_RESULT_AVAILABLE_EXT: GLenum;
  readonly QUERY_RESULT_EXT: GLenum;
  readonly TIMESTAMP_EXT: GLenum;
  readonly TIME_ELAPSED_EXT: GLenum;

  public constructor(id: number, context: WebGLRenderingContextPolyfill) {
    super(id, context);
    this.GPU_DISJOINT_EXT = context.GPU_DISJOINT_EXT;
    this.QUERY_COUNTER_BITS_EXT = context.QUERY_COUNTER_BITS_EXT;
    this.QUERY_RESULT_AVAILABLE_EXT = context.QUERY_RESULT_AVAILABLE_EXT;
    this.QUERY_RESULT_EXT = context.QUERY_RESULT_EXT;
    this.TIMESTAMP_EXT = context.TIMESTAMP_EXT;
    this.TIME_ELAPSED_EXT = context.TIME_ELAPSED_EXT;
  }

  beginQueryEXT(target: number, query: vGLQuery): void {
    this[TransferrableKeys.mutated]('beginQueryEXT', [...arguments]);
  }

  createQueryEXT(): vGLQuery {
    const queryId = this.createObjectReference('createQueryEXT', []);
    return new vGLQuery(queryId);
  }

  deleteQueryEXT(query: vGLQuery): void {
    if (!query || query.isDeleted()) return;

    this[TransferrableKeys.mutated]('deleteQueryEXT', [...arguments]);
    this.deleteObjectReference(query.id);

    query.delete();
  }

  endQueryEXT(target: number): void {
    this[TransferrableKeys.mutated]('endQueryEXT', [...arguments]);
  }

  getQueryEXT(target: number, pname: number): any {
    throw new Error('NOT IMPLEMENTED');
  }

  getQueryObjectEXT(query: vGLQuery, target: number): any {
    throw new Error('NOT IMPLEMENTED');
  }

  queryCounterEXT(query: vGLQuery, target: number): void {
    this[TransferrableKeys.mutated]('queryCounterEXT', [...arguments]);
  }

  isQueryEXT(query: vGLQuery): boolean {
    return query != null && query instanceof vGLQuery && !query.isDeleted();
  }
}

export class WEBGLMultiDraw extends TransferrableGLExtension implements WEBGL_multi_draw {
  multiDrawArraysInstancedWEBGL(
    mode: GLenum,
    firstsList: Int32Array | GLint[],
    firstsOffset: GLuint,
    countsList: Int32Array | GLsizei[],
    countsOffset: GLuint,
    instanceCountsList: Int32Array | GLsizei[],
    instanceCountsOffset: GLuint,
    drawcount: GLsizei,
  ): void {
    this[TransferrableKeys.mutated]('multiDrawArraysInstancedWEBGL', [...arguments]);
  }

  multiDrawArraysWEBGL(
    mode: GLenum,
    firstsList: Int32Array | GLint[],
    firstsOffset: GLuint,
    countsList: Int32Array | GLsizei[],
    countsOffset: GLuint,
    drawcount: GLsizei,
  ): void {
    this[TransferrableKeys.mutated]('multiDrawArraysWEBGL', [...arguments]);
  }

  multiDrawElementsInstancedWEBGL(
    mode: GLenum,
    countsList: Int32Array | GLint[],
    countsOffset: GLuint,
    type: GLenum,
    offsetsList: Int32Array | GLsizei[],
    offsetsOffset: GLuint,
    instanceCountsList: Int32Array | GLsizei[],
    instanceCountsOffset: GLuint,
    drawcount: GLsizei,
  ): void {
    this[TransferrableKeys.mutated]('multiDrawElementsInstancedWEBGL', [...arguments]);
  }

  multiDrawElementsWEBGL(
    mode: GLenum,
    countsList: Int32Array | GLint[],
    countsOffset: GLuint,
    type: GLenum,
    offsetsList: Int32Array | GLsizei[],
    offsetsOffset: GLuint,
    drawcount: GLsizei,
  ): void {
    this[TransferrableKeys.mutated]('multiDrawElementsWEBGL', [...arguments]);
  }
}

export class OESDrawBuffersIndexed extends TransferrableGLExtension /* implements OES_draw_buffers_indexed */ {
  blendEquationSeparateiOES(buf: GLuint, modeRGB: GLenum, modeAlpha: GLenum): void {
    this[TransferrableKeys.mutated]('multiDrawElementsInstancedWEBGL', [...arguments]);
  }

  blendEquationiOES(buf: GLuint, mode: GLenum): void {
    this[TransferrableKeys.mutated]('blendEquationiOES', [...arguments]);
  }

  blendFuncSeparateiOES(buf: GLuint, srcRGB: GLenum, dstRGB: GLenum, srcAlpha: GLenum, dstAlpha: GLenum): void {
    this[TransferrableKeys.mutated]('blendFuncSeparateiOES', [...arguments]);
  }

  blendFunciOES(buf: GLuint, src: GLenum, dst: GLenum): void {
    this[TransferrableKeys.mutated]('blendFunciOES', [...arguments]);
  }

  colorMaskiOES(buf: GLuint, r: GLboolean, g: GLboolean, b: GLboolean, a: GLboolean): void {
    this[TransferrableKeys.mutated]('colorMaskiOES', [...arguments]);
  }

  disableiOES(target: GLenum, index: GLuint): void {
    this[TransferrableKeys.mutated]('disableiOES', [...arguments]);
  }

  enableiOES(target: GLenum, index: GLuint): void {
    this[TransferrableKeys.mutated]('enableiOES', [...arguments]);
  }
}
