import { GLShader } from './GLShader';
import { TransferrableGLObject, vGLActiveInfo } from './TransferrableGLObjectTypes';
import { WebGLRenderingContextPolyfill } from '../WebGLRenderingContextPolyfill';

export class GLProgram extends TransferrableGLObject implements WebGLProgram {
  public shaders: GLShader[];

  public activeAttributes: number;
  public activeUniforms: number;

  public attributesByName: Record<string, vGLActiveInfo>;
  public uniformsByName: Record<string, vGLActiveInfo>;

  public attributesByLocation: Record<number, vGLActiveInfo>;
  public uniformsByLocation: Record<number, vGLActiveInfo>;

  constructor(id: number) {
    super(id);

    this.activeAttributes = 0;
    this.activeUniforms = 0;
    this.shaders = [];

    this.attributesByName = {};
    this.uniformsByName = {};

    this.attributesByLocation = {};
    this.uniformsByLocation = {};
  }

  detachShader(shader: GLShader, context: WebGLRenderingContextPolyfill) {
    const index = this.shaders.indexOf(shader);
    if (index > -1) {
      this.shaders.splice(index, 1);
    }

    this.link(context);
  }

  attachShader(shader: GLShader) {
    this.shaders.push(shader);
  }

  link(context: WebGLRenderingContextPolyfill) {
    this.uniformsByName = {};
    this.uniformsByLocation = {};
    this.activeUniforms = 0;

    this.attributesByName = {};
    this.attributesByLocation = {};
    this.activeAttributes = 0;

    for (const shader of this.shaders) {
      this.activeUniforms += shader.uniforms.length;
      for (const uniform of shader.uniforms) {
        this.uniformsByName[uniform.name] = uniform;
        uniform.location = Object.keys(this.uniformsByLocation).length;
        this.uniformsByLocation[uniform.location] = uniform;
      }

      this.activeAttributes += shader.attributes.length;
      for (const attribute of shader.attributes) {
        this.attributesByName[attribute.name] = attribute;
        attribute.location = Object.keys(this.attributesByLocation).length;
        this.attributesByLocation[attribute.location] = attribute;
      }
    }
  }

  getActiveAttrib(index: GLuint): vGLActiveInfo | null {
    return this.attributesByLocation[index] || null;
  }

  getActiveUniform(index: GLuint): vGLActiveInfo | null {
    return this.uniformsByLocation[index] || null;
  }

  getUniform(key: string) {
    // key = key.trim();
    return this.uniformsByName[key] || this.uniformsByName[key + '[0]'] || null;
  }

  getAttribute(key: string) {
    key = key.trim();
    return this.attributesByName[key] || this.attributesByName[key + '[0]'] || null;
  }
}
