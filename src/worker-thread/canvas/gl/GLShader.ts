import { TransferrableGLObject, vGLActiveInfo } from './TransferrableGLObjectTypes';
import { parseGLSL } from './glsl';

export class GLShader extends TransferrableGLObject implements WebGLShader {
  public readonly type: number;
  public source: string | null;
  public compiled: boolean = false;

  public attributes: vGLActiveInfo[];
  public uniforms: vGLActiveInfo[];

  public constructor(id: number, type: number) {
    super(id);

    this.type = type;
    this.source = null;
  }

  compile(context: WebGL2RenderingContext, source: string) {
    if (source == null) {
      return null;
    }

    this.source = source;
    const glsl = parseGLSL(this.source);
    this.attributes = this._processParams(glsl.attributes, context);
    this.uniforms = this._processParams(glsl.uniforms, context);

    return this.source;
  }

  _processParams(params: { [key: string]: any }, context: WebGL2RenderingContext): vGLActiveInfo[] {
    const result: vGLActiveInfo[] = [];

    for (const key in params) {
      result.push(new vGLActiveInfo(key, 1, this._getTypeId(params[key].type, context), params[key].index));
    }
    return result;
  }

  _getTypeId(text: string, context: WebGL2RenderingContext) {
    // https://registry.khronos.org/OpenGL/specs/gl/glspec31.pdf
    switch (text) {
      case 'bool':
        return context.BOOL;
      case 'int':
        return context.INT;
      case 'uint':
        return context.UNSIGNED_INT;
      case 'float':
        return context.FLOAT;
      case 'vec2':
        return context.FLOAT_VEC2;
      case 'vec3':
        return context.FLOAT_VEC3;
      case 'vec4':
        return context.FLOAT_VEC4;
      case 'ivec2':
        return context.INT_VEC2;
      case 'ivec3':
        return context.INT_VEC3;
      case 'ivec4':
        return context.INT_VEC4;
      case 'bvec2':
        return context.BOOL_VEC2;
      case 'bvec3':
        return context.BOOL_VEC3;
      case 'bvec4':
        return context.BOOL_VEC4;
      case 'mat2':
        return context.FLOAT_MAT2;
      case 'mat3':
        return context.FLOAT_MAT3;
      case 'mat4':
        return context.FLOAT_MAT4;
      case 'sampler2D':
        return context.SAMPLER_2D;
      case 'sampler2DShadow':
        return context.SAMPLER_2D_SHADOW;
      case 'sampler2DArray':
        return context.SAMPLER_2D_ARRAY;
      case 'sampler2DArrayShadow':
        return context.SAMPLER_2D_ARRAY_SHADOW;
      case 'samplerCubeShadow':
        return context.SAMPLER_CUBE_SHADOW;
      case 'isampler2D':
        return context.INT_SAMPLER_2D;
      case 'isampler3D':
        return context.INT_SAMPLER_3D;
      case 'isamplerCube':
        return context.INT_SAMPLER_CUBE;
      case 'isampler2DArray':
        return context.INT_SAMPLER_2D_ARRAY;
      case 'usampler2D':
        return context.UNSIGNED_INT_SAMPLER_2D;
      case 'usampler3D':
        return context.UNSIGNED_INT_SAMPLER_3D;
      case 'usamplerCube':
        return context.UNSIGNED_INT_SAMPLER_CUBE;
      case 'usampler2DArray':
        return context.UNSIGNED_INT_SAMPLER_2D_ARRAY;
      case 'sampler3D':
        return context.SAMPLER_3D;
      case 'samplerCube':
        return context.SAMPLER_CUBE;
      case 'uvec2':
        return context.UNSIGNED_INT_VEC2;
      case 'uvec3':
        return context.UNSIGNED_INT_VEC3;
      case 'uvec4':
        return context.UNSIGNED_INT_VEC4;
      case 'mat2x3':
        return context.FLOAT_MAT2x3;
      case 'mat2x4':
        return context.FLOAT_MAT2x4;
      case 'mat3x2':
        return context.FLOAT_MAT3x2;
      case 'mat3x4':
        return context.FLOAT_MAT3x4;
      case 'mat4x2':
        return context.FLOAT_MAT4x2;
      case 'mat4x3':
        return context.FLOAT_MAT4x3;
      default:
        throw new Error('not yet recognized type text: ' + text);
    }
  }
}
