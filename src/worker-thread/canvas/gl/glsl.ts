const QUALITY = ['mediump', 'highp', 'lowp'];

const TYPES = [
  'bool',
  'int',
  'uint',
  'ivec2',
  'ivec3',
  'ivec4',
  'bvec2',
  'bvec3',
  'bvec4',
  'vec2',
  'vec3',
  'vec4',
  'mat2',
  'mat3',
  'mat4',
  'float',
  'sampler2D',
  'samplerCube',
  'uvec2',
  'uvec3',
  'uvec4',
  'mat2x3',
  'mat2x4',
  'mat3x2',
  'mat3x4',
  'mat4x2',
  'mat4x3',
  'sampler2DShadow',
  'sampler2DArray',
  'sampler2DArrayShadow',
  'samplerCubeShadow',
  'isampler2D',
  'isampler3D',
  'isamplerCube',
  'isampler2DArray',
  'usampler2D',
  'usampler3D',
  'usamplerCube',
  'usampler2DArray',
  'sampler3D',
];

const OPERATOR_AND = '&&';
const OPERATOR_OR = '||';
const OPERATORS = [OPERATOR_AND, OPERATOR_OR];

const KEYWORD_DEFINE = '#define';
const KEYWORD_IF = '#if';
const KEYWORD_IFDEF = '#ifdef';
const KEYWORD_ELIF = '#elif';
const KEYWORD_ELSE = '#else';
const KEYWORD_ENDIF = '#endif';
const KEYWORD_ATTRIBUTE = 'attribute';
const KEYWORD_UNIFORM = 'uniform';

class StreamReader {
  public words: string[];
  public position: number;

  constructor(source: string) {
    this.words = source.split(/\s/);
    this.position = 0;
  }

  hasNext() {
    return this.position < this.words.length;
  }

  next() {
    return this.words[this.position++];
  }
}

export type DefinesType = {
  [key: string]: boolean;
};

function readConditionResult(reader: StreamReader, defines: DefinesType) {
  let result = true;
  let operator = OPERATOR_AND;
  while (reader.hasNext()) {
    const keyword = reader.next();
    let defineResult = false;
    if (keyword === 'defined') {
      const define = reader.next();
      defineResult = !!defines[define];
    } else if (keyword === '!defined') {
      const define = reader.next();
      defineResult = !defines[define];
    } else {
      break;
    }

    if (operator === OPERATOR_AND) {
      result = result && defineResult;
    } else if (operator === OPERATOR_OR) {
      result = result || defineResult;
    } else {
      throw new Error(`Unexpected operator: ${operator}`);
    }

    operator = reader.next();
    if (OPERATORS.indexOf(operator) === -1) {
      break;
    }
  }
  return result;
}

export type UniformsType = {
  [key: string]: any;
};

export type AttributesType = {
  [key: string]: any;
};

export function parseGLSL(source: string) {
  const reader = new StreamReader(source);

  const defines: DefinesType = {};
  const uniforms: UniformsType = {};
  const attributes: AttributesType = {};

  const stack = [true];
  let enabled = true;

  while (reader.hasNext()) {
    const word = reader.next();
    switch (word) {
      case KEYWORD_DEFINE: {
        const define = reader.next();
        defines[define] = true;
        break;
      }

      case KEYWORD_IF: {
        const conditionResult = readConditionResult(reader, defines);
        stack.push(conditionResult);
        break;
      }

      case KEYWORD_IFDEF: {
        const define = reader.next();
        stack.push(!!defines[define]);
        break;
      }

      case KEYWORD_ELIF: {
        const define = reader.next();
        stack.push(!!defines[define] && !stack.pop());
        break;
      }

      case KEYWORD_ELSE: {
        stack.push(!stack.pop());
        break;
      }

      case KEYWORD_ENDIF: {
        stack.pop();
        break;
      }

      case KEYWORD_ATTRIBUTE: {
        if (enabled) {
          let quality = reader.next();
          let type = '';
          if (QUALITY.indexOf(quality) === -1) {
            if (TYPES.indexOf(quality) >= 0) {
              type = quality;
              quality = 'lowp';
            } else throw new Error(`Unexpected quality: ${quality}`);
          }

          if (type.length == 0) {
            type = reader.next();
            if (TYPES.indexOf(type) === -1) {
              throw new Error(`Unexpected type: ${type}`);
            }
          }

          const name = reader.next().replace(';', '');
          if (!name) {
            throw new Error(`Unexpected name: ${name}`);
          }
          if (attributes[name]) {
            throw new Error(`Attribute already exists: ${name}`);
          }
          const index = Object.keys(attributes).length;
          attributes[name] = { quality, type, index };
        }
        break;
      }

      case KEYWORD_UNIFORM: {
        if (enabled) {
          let quality = reader.next();
          let type = '';
          if (QUALITY.indexOf(quality) === -1) {
            if (TYPES.indexOf(quality) >= 0) {
              type = quality;
              quality = 'lowp';
            } else throw new Error(`Unexpected quality: ${quality}`);
          }

          if (type.length == 0) {
            type = reader.next();
            if (TYPES.indexOf(type) === -1) {
              throw new Error(`Unexpected type: ${type}`);
            }
          }

          const name = reader.next().replace(';', '');
          if (!name) {
            throw new Error(`Unexpected name: ${name}`);
          }
          if (uniforms[name]) {
            throw new Error(`Uniform already exists: ${name}`);
          }
          const index = Object.keys(uniforms).length;
          uniforms[name] = { quality, type, index };
        }
        break;
      }
    }

    if (!stack.length) {
      throw new Error('Incorrect condition parsing');
    }

    enabled = stack.filter((value) => value).length === stack.length;
  }
  return { defines, uniforms, attributes };
}
