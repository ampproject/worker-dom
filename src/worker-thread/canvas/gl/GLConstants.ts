export class GLConstants {
  /**
   * The following defined constants and descriptions are directly ported from https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
   *
   * These constants are defined on the WebGLRenderingContext / WebGL2RenderingContext interface
   */

  // Clearing buffers
  // Constants passed to WebGLRenderingContext.clear() to clear buffer masks

  /**
   * Passed to clear to clear the current depth buffer
   * @constant {number}
   */
  public readonly DEPTH_BUFFER_BIT: GLenum = 0x00000100;

  /**
   * Passed to clear to clear the current stencil buffer
   * @constant {number}
   */
  public readonly STENCIL_BUFFER_BIT: GLenum = 0x00000400;

  /**
   * Passed to clear to clear the current color buffer
   * @constant {number}
   */
  public readonly COLOR_BUFFER_BIT: GLenum = 0x00004000;

  // Rendering primitives
  // Constants passed to WebGLRenderingContext.drawElements() or WebGLRenderingContext.drawArrays() to specify what kind of primitive to render

  /**
   * Passed to drawElements or drawArrays to draw single points
   * @constant {number}
   */
  public readonly POINTS: GLenum = 0x0000;

  /**
   * Passed to drawElements or drawArrays to draw lines. Each vertex connects to the one after it
   * @constant {number}
   */
  public readonly LINES: GLenum = 0x0001;

  /**
   * Passed to drawElements or drawArrays to draw lines. Each set of two vertices is treated as a separate line segment
   * @constant {number}
   */
  public readonly LINE_LOOP: GLenum = 0x0002;

  /**
   * Passed to drawElements or drawArrays to draw a connected group of line segments from the first vertex to the last
   * @constant {number}
   */
  public readonly LINE_STRIP: GLenum = 0x0003;

  /**
   * Passed to drawElements or drawArrays to draw triangles. Each set of three vertices creates a separate triangle
   * @constant {number}
   */
  public readonly TRIANGLES: GLenum = 0x0004;

  /**
   * Passed to drawElements or drawArrays to draw a connected group of triangles
   * @constant {number}
   */
  public readonly TRIANGLE_STRIP: GLenum = 0x0005;

  /**
   * Passed to drawElements or drawArrays to draw a connected group of triangles. Each vertex connects to the previous and the first vertex in the fan
   * @constant {number}
   */
  public readonly TRIANGLE_FAN: GLenum = 0x0006;

  // Blending modes
  // Constants passed to WebGLRenderingContext.blendFunc() or WebGLRenderingContext.blendFuncSeparate() to specify the blending mode (for both, RBG and alpha, or separately)

  /**
   * Passed to blendFunc or blendFuncSeparate to turn off a component
   * @constant {number}
   */
  public readonly ZERO: GLenum = 0;

  /**
   * Passed to blendFunc or blendFuncSeparate to turn on a component
   * @constant {number}
   */
  public readonly ONE: GLenum = 1;

  /**
   * Passed to blendFunc or blendFuncSeparate to multiply a component by the source elements color
   * @constant {number}
   */
  public readonly SRC_COLOR: GLenum = 0x0300;

  /**
   * Passed to blendFunc or blendFuncSeparate to multiply a component by one minus the source elements color
   * @constant {number}
   */
  public readonly ONE_MINUS_SRC_COLOR: GLenum = 0x0301;

  /**
   * Passed to blendFunc or blendFuncSeparate to multiply a component by the source's alpha
   * @constant {number}
   */
  public readonly SRC_ALPHA: GLenum = 0x0302;

  /**
   * Passed to blendFunc or blendFuncSeparate to multiply a component by one minus the source's alpha
   * @constant {number}
   */
  public readonly ONE_MINUS_SRC_ALPHA: GLenum = 0x0303;

  /**
   * Passed to blendFunc or blendFuncSeparate to multiply a component by the destination's alpha
   * @constant {number}
   */
  public readonly DST_ALPHA: GLenum = 0x0304;

  /**
   * Passed to blendFunc or blendFuncSeparate to multiply a component by one minus the destination's alpha
   * @constant {number}
   */
  public readonly ONE_MINUS_DST_ALPHA: GLenum = 0x0305;

  /**
   * Passed to blendFunc or blendFuncSeparate to multiply a component by the destination's color
   * @constant {number}
   */
  public readonly DST_COLOR: GLenum = 0x0306;

  /**
   * Passed to blendFunc or blendFuncSeparate to multiply a component by one minus the destination's color
   * @constant {number}
   */
  public readonly ONE_MINUS_DST_COLOR: GLenum = 0x0307;

  /**
   * Passed to blendFunc or blendFuncSeparate to multiply a component by the minimum of source's alpha or one minus the destination's alpha
   * @constant {number}
   */
  public readonly SRC_ALPHA_SATURATE: GLenum = 0x0308;

  /**
   * Passed to blendFunc or blendFuncSeparate to specify a constant color blend function
   * @constant {number}
   */
  public readonly CONSTANT_COLOR: GLenum = 0x8001;

  /**
   * Passed to blendFunc or blendFuncSeparate to specify one minus a constant color blend function
   * @constant {number}
   */
  public readonly ONE_MINUS_CONSTANT_COLOR: GLenum = 0x8002;

  /**
   * Passed to blendFunc or blendFuncSeparate to specify a constant alpha blend function
   * @constant {number}
   */
  public readonly CONSTANT_ALPHA: GLenum = 0x8003;

  /**
   * Passed to blendFunc or blendFuncSeparate to specify one minus a constant alpha blend function
   * @constant {number}
   */
  public readonly ONE_MINUS_CONSTANT_ALPHA: GLenum = 0x8004;

  // Blending equations
  // Constants passed to WebGLRenderingContext.blendEquation() or WebGLRenderingContext.blendEquationSeparate() to control how the blending is calculated (for both, RBG and alpha, or separately)

  /**
   * Passed to blendEquation or blendEquationSeparate to set an addition blend function
   * @constant {number}
   */
  public readonly FUNC_ADD: GLenum = 0x8006;

  /**
   * Passed to blendEquation or blendEquationSeparate to specify a subtraction blend function (source - destination)
   * @constant {number}
   */
  public readonly FUNC_SUBSTRACT: GLenum = 0x800a;
  public readonly FUNC_SUBTRACT: GLenum = 0x800a;

  /**
   * Passed to blendEquation or blendEquationSeparate to specify a reverse subtraction blend function (destination - source)
   * @constant {number}
   */
  public readonly FUNC_REVERSE_SUBTRACT: GLenum = 0x800b;

  // Getting GL parameter information
  // Constants passed to WebGLRenderingContext.getParameter() to specify what information to return

  /**
   * Passed to getParameter to get the current RGB blend function
   * @constant {number}
   */
  public readonly BLEND_EQUATION: GLenum = 0x8009;

  /**
   * Passed to getParameter to get the current RGB blend function. Same as BLEND_EQUATION
   * @constant {number}
   */
  public readonly BLEND_EQUATION_RGB: GLenum = 0x8009;

  /**
   * Passed to getParameter to get the current alpha blend function. Same as BLEND_EQUATION
   * @constant {number}
   */
  public readonly BLEND_EQUATION_ALPHA: GLenum = 0x883d;

  /**
   * Passed to getParameter to get the current destination RGB blend function
   * @constant {number}
   */
  public readonly BLEND_DST_RGB: GLenum = 0x80c8;

  /**
   * Passed to getParameter to get the current source RGB blend function
   * @constant {number}
   */
  public readonly BLEND_SRC_RGB: GLenum = 0x80c9;

  /**
   * Passed to getParameter to get the current destination alpha blend function
   * @constant {number}
   */
  public readonly BLEND_DST_ALPHA: GLenum = 0x80ca;

  /**
   * Passed to getParameter to get the current source alpha blend function
   * @constant {number}
   */
  public readonly BLEND_SRC_ALPHA: GLenum = 0x80cb;

  /**
   * Passed to getParameter to return a the current blend color
   * @constant {number}
   */
  public readonly BLEND_COLOR: GLenum = 0x8005;

  /**
   * Passed to getParameter to get the array buffer binding
   * @constant {number}
   */
  public readonly ARRAY_BUFFER_BINDING: GLenum = 0x8894;

  /**
   * Passed to getParameter to get the current element array buffer
   * @constant {number}
   */
  public readonly ELEMENT_ARRAY_BUFFER_BINDING: GLenum = 0x8895;

  /**
   * Passed to getParameter to get the current lineWidth (set by the lineWidth method)
   * @constant {number}
   */
  public readonly LINE_WIDTH: GLenum = 0x0b21;

  /**
   * Passed to getParameter to get the current size of a point drawn with gl.POINTS
   * @constant {number}
   */
  public readonly ALIASED_POINT_SIZE_RANGE: GLenum = 0x846d;

  /**
   * Passed to getParameter to get the range of available widths for a line. Returns a length-2 array with the lo value at 0, and hight at 1
   * @constant {number}
   */
  public readonly ALIASED_LINE_WIDTH_RANGE: GLenum = 0x846e;

  /**
   * Passed to getParameter to get the current value of cullFace. Should return FRONT, BACK, or FRONT_AND_BACK
   * @constant {number}
   */
  public readonly CULL_FACE_MODE: GLenum = 0x0b45;

  /**
   * Passed to getParameter to determine the current value of frontFace. Should return CW or CCW
   * @constant {number}
   */
  public readonly FRONT_FACE: GLenum = 0x0b46;

  /**
   * Passed to getParameter to return a length-2 array of floats giving the current depth range
   * @constant {number}
   */
  public readonly DEPTH_RANGE: GLenum = 0x0b70;

  /**
   * Passed to getParameter to determine if the depth write mask is enabled
   * @constant {number}
   */
  public readonly DEPTH_WRITEMASK: GLenum = 0x0b72;

  /**
   * Passed to getParameter to determine the current depth clear value
   * @constant {number}
   */
  public readonly DEPTH_CLEAR_VALUE: GLenum = 0x0b73;

  /**
   * Passed to getParameter to get the current depth function. Returns NEVER, ALWAYS, LESS, EQUAL, LEQUAL, GREATER, GEQUAL, or NOTEQUAL
   * @constant {number}
   */
  public readonly DEPTH_FUNC: GLenum = 0x0b74;

  /**
   * Passed to getParameter to get the value the stencil will be cleared to
   * @constant {number}
   */
  public readonly STENCIL_CLEAR_VALUE: GLenum = 0x0b91;

  /**
   * Passed to getParameter to get the current stencil function. Returns NEVER, ALWAYS, LESS, EQUAL, LEQUAL, GREATER, GEQUAL, or NOTEQUAL
   * @constant {number}
   */
  public readonly STENCIL_FUNC: GLenum = 0x0b92;

  /**
   * Passed to getParameter to get the current stencil fail function. Should return KEEP, REPLACE, INCR, DECR, INVERT, INCR_WRAP, or DECR_WRAP
   * @constant {number}
   */
  public readonly STENCIL_FAIL: GLenum = 0x0b94;

  /**
   * Passed to getParameter to get the current stencil fail function should the depth buffer test fail. Should return KEEP, REPLACE, INCR, DECR, INVERT, INCR_WRAP, or DECR_WRAP
   * @constant {number}
   */
  public readonly STENCIL_PASS_DEPTH_FAIL: GLenum = 0x0b95;

  /**
   * Passed to getParameter to get the current stencil fail function should the depth buffer test pass. Should return KEEP, REPLACE, INCR, DECR, INVERT, INCR_WRAP, or DECR_WRAP
   * @constant {number}
   */
  public readonly STENCIL_PASS_DEPTH_PASS: GLenum = 0x0b96;

  /**
   * Passed to getParameter to get the reference value used for stencil tests
   * @constant {number}
   */
  public readonly STENCIL_REF: GLenum = 0x0b97;

  /**
   * @constant {number}
   */
  public readonly STENCIL_VALUE_MASK: GLenum = 0x0b93;

  /**
   * @constant {number}
   */
  public readonly STENCIL_WRITEMASK: GLenum = 0x0b98;

  /**
   * @constant {number}
   */
  public readonly STENCIL_BACK_FUNC: GLenum = 0x8800;

  /**
   * @constant {number}
   */
  public readonly STENCIL_BACK_FAIL: GLenum = 0x8801;

  /**
   * @constant {number}
   */
  public readonly STENCIL_BACK_PASS_DEPTH_FAIL: GLenum = 0x8802;

  /**
   * @constant {number}
   */
  public readonly STENCIL_BACK_PASS_DEPTH_PASS: GLenum = 0x8803;

  /**
   * @constant {number}
   */
  public readonly STENCIL_BACK_REF: GLenum = 0x8ca3;

  /**
   * @constant {number}
   */
  public readonly STENCIL_BACK_VALUE_MASK: GLenum = 0x8ca4;

  /**
   * @constant {number}
   */
  public readonly STENCIL_BACK_WRITEMASK: GLenum = 0x8ca5;

  /**
   * Returns an Int32Array with four elements for the current viewport dimensions
   * @constant {number}
   */
  public readonly VIEWPORT: GLenum = 0x0ba2;

  /**
   * Returns an Int32Array with four elements for the current scissor box dimensions
   * @constant {number}
   */
  public readonly SCISSOR_BOX: GLenum = 0x0c10;

  /**
   * @constant {number}
   */
  public readonly COLOR_CLEAR_VALUE: GLenum = 0x0c22;

  /**
   * @constant {number}
   */
  public readonly COLOR_WRITEMASK: GLenum = 0x0c23;

  /**
   * @constant {number}
   */
  public readonly UNPACK_ALIGNMENT: GLenum = 0x0cf5;

  /**
   * @constant {number}
   */
  public readonly PACK_ALIGNMENT: GLenum = 0x0d05;

  /**
   * @constant {number}
   */
  public readonly MAX_TEXTURE_SIZE: GLenum = 0x0d33;

  /**
   * @constant {number}
   */
  public readonly MAX_VIEWPORT_DIMS: GLenum = 0x0d3a;

  /**
   * @constant {number}
   */
  public readonly SUBPIXEL_BITS: GLenum = 0x0d50;

  /**
   * @constant {number}
   */
  public readonly RED_BITS: GLenum = 0x0d52;

  /**
   * @constant {number}
   */
  public readonly GREEN_BITS: GLenum = 0x0d53;

  /**
   * @constant {number}
   */
  public readonly BLUE_BITS: GLenum = 0x0d54;

  /**
   * @constant {number}
   */
  public readonly ALPHA_BITS: GLenum = 0x0d55;

  /**
   * @constant {number}
   */
  public readonly DEPTH_BITS: GLenum = 0x0d56;

  /**
   * @constant {number}
   */
  public readonly STENCIL_BITS: GLenum = 0x0d57;

  /**
   * @constant {number}
   */
  public readonly POLYGON_OFFSET_UNITS: GLenum = 0x2a00;

  /**
   * @constant {number}
   */
  public readonly POLYGON_OFFSET_FACTOR: GLenum = 0x8038;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_BINDING_2D: GLenum = 0x8069;

  /**
   * @constant {number}
   */
  public readonly SAMPLE_BUFFERS: GLenum = 0x80a8;

  /**
   * @constant {number}
   */
  public readonly SAMPLES: GLenum = 0x80a9;

  /**
   * @constant {number}
   */
  public readonly SAMPLE_COVERAGE_VALUE: GLenum = 0x80aa;

  /**
   * @constant {number}
   */
  public readonly SAMPLE_COVERAGE_INVERT: GLenum = 0x80ab;

  /**
   * @constant {number}
   */
  public readonly COMPRESSED_TEXTURE_FORMATS: GLenum = 0x86a3;

  /**
   * @constant {number}
   */
  public readonly VENDOR: GLenum = 0x1f00;

  /**
   * @constant {number}
   */
  public readonly RENDERER: GLenum = 0x1f01;

  /**
   * @constant {number}
   */
  public readonly VERSION: GLenum = 0x1f02;

  /**
   * @constant {number}
   */
  public readonly IMPLEMENTATION_COLOR_READ_TYPE: GLenum = 0x8b9a;

  /**
   * @constant {number}
   */
  public readonly IMPLEMENTATION_COLOR_READ_FORMAT: GLenum = 0x8b9b;

  /**
   * @constant {number}
   */
  public readonly BROWSER_DEFAULT_WEBGL: GLenum = 0x9244;

  // Buffers
  // Constants passed to WebGLRenderingContext.bufferData(), WebGLRenderingContext.bufferSubData(), WebGLRenderingContext.bindBuffer(), or WebGLRenderingContext.getBufferParameter()

  /**
   * Passed to bufferData as a hint about whether the contents of the buffer are likely to be used often and not change often
   * @constant {number}
   */
  public readonly STATIC_DRAW: GLenum = 0x88e4;

  /**
   * Passed to bufferData as a hint about whether the contents of the buffer are likely to not be used often
   * @constant {number}
   */
  public readonly STREAM_DRAW: GLenum = 0x88e0;

  /**
   * Passed to bufferData as a hint about whether the contents of the buffer are likely to be used often and change often
   * @constant {number}
   */
  public readonly DYNAMIC_DRAW: GLenum = 0x88e8;

  /**
   * Passed to bindBuffer or bufferData to specify the type of buffer being used
   * @constant {number}
   */
  public readonly ARRAY_BUFFER: GLenum = 0x8892;

  /**
   * Passed to bindBuffer or bufferData to specify the type of buffer being used
   * @constant {number}
   */
  public readonly ELEMENT_ARRAY_BUFFER: GLenum = 0x8893;

  /**
   * Passed to getBufferParameter to get a buffer's size
   * @constant {number}
   */
  public readonly BUFFER_SIZE: GLenum = 0x8764;

  /**
   * Passed to getBufferParameter to get the hint for the buffer passed in when it was created
   * @constant {number}
   */
  public readonly BUFFER_USAGE: GLenum = 0x8765;

  // Vertex attributes
  // Constants passed to WebGLRenderingContext.getVertexAttrib()

  /**
   * Passed to getVertexAttrib to read back the current vertex attribute
   * @constant {number}
   */
  public readonly CURRENT_VERTEX_ATTRIB: GLenum = 0x8626;

  /**
   * @constant {number}
   */
  public readonly VERTEX_ATTRIB_ARRAY_ENABLED: GLenum = 0x8622;

  /**
   * @constant {number}
   */
  public readonly VERTEX_ATTRIB_ARRAY_SIZE: GLenum = 0x8623;

  /**
   * @constant {number}
   */
  public readonly VERTEX_ATTRIB_ARRAY_STRIDE: GLenum = 0x8624;

  /**
   * @constant {number}
   */
  public readonly VERTEX_ATTRIB_ARRAY_TYPE: GLenum = 0x8625;

  /**
   * @constant {number}
   */
  public readonly VERTEX_ATTRIB_ARRAY_NORMALIZED: GLenum = 0x886a;

  /**
   * @constant {number}
   */
  public readonly VERTEX_ATTRIB_ARRAY_POINTER: GLenum = 0x8645;

  /**
   * @constant {number}
   */
  public readonly VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: GLenum = 0x889f;

  // Culling
  // Constants passed to WebGLRenderingContext.cullFace()

  /**
   * Passed to enable/disable to turn on/off culling. Can also be used with getParameter to find the current culling method
   * @constant {number}
   */
  public readonly CULL_FACE: GLenum = 0x0b44;

  /**
   * Passed to cullFace to specify that only front faces should be culled
   * @constant {number}
   */
  public readonly FRONT: GLenum = 0x0404;

  /**
   * Passed to cullFace to specify that only back faces should be culled
   * @constant {number}
   */
  public readonly BACK: GLenum = 0x0405;

  /**
   * Passed to cullFace to specify that front and back faces should be culled
   * @constant {number}
   */
  public readonly FRONT_AND_BACK: GLenum = 0x0408;

  // Enabling and disabling
  // Constants passed to WebGLRenderingContext.enable() or WebGLRenderingContext.disable()

  /**
   * Passed to enable/disable to turn on/off blending. Can also be used with getParameter to find the current blending method
   * @constant {number}
   */
  public readonly BLEND: GLenum = 0x0be2;

  /**
   * Passed to enable/disable to turn on/off the depth test. Can also be used with getParameter to query the depth test
   * @constant {number}
   */
  public readonly DEPTH_TEST: GLenum = 0x0b71;

  /**
   * Passed to enable/disable to turn on/off dithering. Can also be used with getParameter to find the current dithering method
   * @constant {number}
   */
  public readonly DITHER: GLenum = 0x0bd0;

  /**
   * Passed to enable/disable to turn on/off the polygon offset. Useful for rendering hidden-line images, decals, and or solids with highlighted edges. Can also be used with getParameter to query the scissor test
   * @constant {number}
   */
  public readonly POLYGON_OFFSET_FILL: GLenum = 0x8037;

  /**
   * Passed to enable/disable to turn on/off the alpha to coverage. Used in multi-sampling alpha channels
   * @constant {number}
   */
  public readonly SAMPLE_ALPHA_TO_COVERAGE: GLenum = 0x809e;

  /**
   * Passed to enable/disable to turn on/off the sample coverage. Used in multi-sampling
   * @constant {number}
   */
  public readonly SAMPLE_COVERAGE: GLenum = 0x80a0;

  /**
   * Passed to enable/disable to turn on/off the scissor test. Can also be used with getParameter to query the scissor test
   * @constant {number}
   */
  public readonly SCISSOR_TEST: GLenum = 0x0c11;

  /**
   * Passed to enable/disable to turn on/off the stencil test. Can also be used with getParameter to query the stencil test
   * @constant {number}
   */
  public readonly STENCIL_TEST: GLenum = 0x0b90;

  // Errors
  // Constants returned from WebGLRenderingContext.getError()

  /**
   * Returned from getError
   * @constant {number}
   */
  public readonly NO_ERROR: GLenum = 0;

  /**
   * Returned from getError
   * @constant {number}
   */
  public readonly INVALID_ENUM: GLenum = 0x0500;

  /**
   * Returned from getError
   * @constant {number}
   */
  public readonly INVALID_VALUE: GLenum = 0x0501;

  /**
   * Returned from getError
   * @constant {number}
   */
  public readonly INVALID_OPERATION: GLenum = 0x0502;

  /**
   * Returned from getError
   * @constant {number}
   */
  public readonly OUT_OF_MEMORY: GLenum = 0x0505;

  /**
   * Returned from getError
   * @constant {number}
   */
  public readonly CONTEXT_LOST_WEBGL: GLenum = 0x9242;

  // Front face directions
  // Constants passed to WebGLRenderingContext.frontFace()

  /**
   * Passed to frontFace to specify the front face of a polygon is drawn in the clockwise direction,
   * @constant {number}
   */
  public readonly CW: GLenum = 0x0900;

  /**
   * Passed to frontFace to specify the front face of a polygon is drawn in the counter clockwise direction
   * @constant {number}
   */
  public readonly CCW: GLenum = 0x0901;

  // Hints
  // Constants passed to WebGLRenderingContext.hint()

  /**
   * There is no preference for this behavior
   * @constant {number}
   */
  public readonly DONT_CARE: GLenum = 0x1100;

  /**
   * The most efficient behavior should be used
   * @constant {number}
   */
  public readonly FASTEST: GLenum = 0x1101;

  /**
   * The most correct or the highest quality option should be used
   * @constant {number}
   */
  public readonly NICEST: GLenum = 0x1102;

  /**
   * Hint for the quality of filtering when generating mipmap images with WebGLRenderingContext.generateMipmap()
   * @constant {number}
   */
  public readonly GENERATE_MIPMAP_HINT: GLenum = 0x8192;

  // Data types

  /**
   * @constant {number}
   */
  public readonly BYTE: GLenum = 0x1400;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_BYTE: GLenum = 0x1401;

  /**
   * @constant {number}
   */
  public readonly SHORT: GLenum = 0x1402;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_SHORT: GLenum = 0x1403;

  /**
   * @constant {number}
   */
  public readonly INT: GLenum = 0x1404;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_INT: GLenum = 0x1405;

  /**
   * @constant {number}
   */
  public readonly FLOAT: GLenum = 0x1406;

  // Pixel formats

  /**
   * @constant {number}
   */
  public readonly DEPTH_COMPONENT: GLenum = 0x1902;

  /**
   * @constant {number}
   */
  public readonly ALPHA: GLenum = 0x1906;

  /**
   * @constant {number}
   */
  public readonly RGB: GLenum = 0x1907;

  /**
   * @constant {number}
   */
  public readonly RGBA: GLenum = 0x1908;

  /**
   * @constant {number}
   */
  public readonly LUMINANCE: GLenum = 0x1909;

  /**
   * @constant {number}
   */
  public readonly LUMINANCE_ALPHA: GLenum = 0x190a;

  // Pixel types

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_SHORT_4_4_4_4: GLenum = 0x8033;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_SHORT_5_5_5_1: GLenum = 0x8034;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_SHORT_5_6_5: GLenum = 0x8363;

  // Shaders
  // Constants passed to WebGLRenderingContext.getShaderParameter()

  /**
   * Passed to createShader to define a fragment shader
   * @constant {number}
   */
  public readonly FRAGMENT_SHADER: GLenum = 0x8b30;

  /**
   * Passed to createShader to define a vertex shader
   * @constant {number}
   */
  public readonly VERTEX_SHADER: GLenum = 0x8b31;

  /**
   * Passed to getShaderParamter to get the status of the compilation. Returns false if the shader was not compiled. You can then query getShaderInfoLog to find the exact error
   * @constant {number}
   */
  public readonly COMPILE_STATUS: GLenum = 0x8b81;

  /**
   * Passed to getShaderParamter to determine if a shader was deleted via deleteShader. Returns true if it was, false otherwise
   * @constant {number}
   */
  public readonly DELETE_STATUS: GLenum = 0x8b80;

  /**
   * Passed to getProgramParameter after calling linkProgram to determine if a program was linked correctly. Returns false if there were errors. Use getProgramInfoLog to find the exact error
   * @constant {number}
   */
  public readonly LINK_STATUS: GLenum = 0x8b82;

  /**
   * Passed to getProgramParameter after calling validateProgram to determine if it is valid. Returns false if errors were found
   * @constant {number}
   */
  public readonly VALIDATE_STATUS: GLenum = 0x8b83;

  /**
   * Passed to getProgramParameter after calling attachShader to determine if the shader was attached correctly. Returns false if errors occurred
   * @constant {number}
   */
  public readonly ATTACHED_SHADERS: GLenum = 0x8b85;

  /**
   * Passed to getProgramParameter to get the number of attributes active in a program
   * @constant {number}
   */
  public readonly ACTIVE_ATTRIBUTES: GLenum = 0x8b89;

  /**
   * Passed to getProgramParamter to get the number of uniforms active in a program
   * @constant {number}
   */
  public readonly ACTIVE_UNIFORMS: GLenum = 0x8b86;

  /**
   * The maximum number of entries possible in the vertex attribute list
   * @constant {number}
   */
  public readonly MAX_VERTEX_ATTRIBS: GLenum = 0x8869;

  /**
   * @constant {number}
   */
  public readonly MAX_VERTEX_UNIFORM_VECTORS: GLenum = 0x8dfb;

  /**
   * @constant {number}
   */
  public readonly MAX_VARYING_VECTORS: GLenum = 0x8dfc;

  /**
   * @constant {number}
   */
  public readonly MAX_COMBINED_TEXTURE_IMAGE_UNITS: GLenum = 0x8b4d;

  /**
   * @constant {number}
   */
  public readonly MAX_VERTEX_TEXTURE_IMAGE_UNITS: GLenum = 0x8b4c;

  /**
   * Implementation dependent number of maximum texture units. At least 8
   * @constant {number}
   */
  public readonly MAX_TEXTURE_IMAGE_UNITS: GLenum = 0x8872;

  /**
   * @constant {number}
   */
  public readonly MAX_FRAGMENT_UNIFORM_VECTORS: GLenum = 0x8dfd;

  /**
   * @constant {number}
   */
  public readonly SHADER_TYPE: GLenum = 0x8b4f;

  /**
   * @constant {number}
   */
  public readonly SHADING_LANGUAGE_VERSION: GLenum = 0x8b8c;

  /**
   * @constant {number}
   */
  public readonly CURRENT_PROGRAM: GLenum = 0x8b8d;

  // Depth or stencil tests
  // Constants passed to WebGLRenderingContext.stencilFunc()

  /**
   * Passed to depthFunction or stencilFunction to specify depth or stencil tests will never pass. i.e. Nothing will be drawn
   * @constant {number}
   */
  public readonly NEVER: GLenum = 0x0200;

  /**
   * Passed to depthFunction or stencilFunction to specify depth or stencil tests will always pass. i.e. Pixels will be drawn in the order they are drawn
   * @constant {number}
   */
  public readonly ALWAYS: GLenum = 0x0207;

  /**
   * Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than the stored value
   * @constant {number}
   */
  public readonly LESS: GLenum = 0x0201;

  /**
   * Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is equals to the stored value
   * @constant {number}
   */
  public readonly EQUAL: GLenum = 0x0202;

  /**
   *  Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than or equal to the stored value
   * @constant {number}
   */
  public readonly LEQUAL: GLenum = 0x0203;

  /**
   * Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than the stored value
   * @constant {number}
   */
  public readonly GREATER: GLenum = 0x0204;

  /**
   * Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than or equal to the stored value
   * @constant {number}
   */
  public readonly GEQUAL: GLenum = 0x0206;

  /**
   * Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is not equal to the stored value
   * @constant {number}
   */
  public readonly NOTEQUAL: GLenum = 0x0205;

  // Stencil actions
  // Constants passed to WebGLRenderingContext.stencilOp()

  /**
   * @constant {number}
   */
  public readonly KEEP: GLenum = 0x1e00;

  /**
   * @constant {number}
   */
  public readonly REPLACE: GLenum = 0x1e01;

  /**
   * @constant {number}
   */
  public readonly INCR: GLenum = 0x1e02;

  /**
   * @constant {number}
   */
  public readonly DECR: GLenum = 0x1e03;

  /**
   * @constant {number}
   */
  public readonly INVERT: GLenum = 0x150a;

  /**
   * @constant {number}
   */
  public readonly INCR_WRAP: GLenum = 0x8507;

  /**
   * @constant {number}
   */
  public readonly DECR_WRAP: GLenum = 0x8508;

  // Textures
  // Constants passed to WebGLRenderingContext.texParameteri(), WebGLRenderingContext.texParameterf(), WebGLRenderingContext.bindTexture(), WebGLRenderingContext.texImage2D(), and others

  /**
   * @constant {number}
   */
  public readonly NEAREST: GLenum = 0x2600;

  /**
   * @constant {number}
   */
  public readonly LINEAR: GLenum = 0x2601;

  /**
   * @constant {number}
   */
  public readonly NEAREST_MIPMAP_NEAREST: GLenum = 0x2700;

  /**
   * @constant {number}
   */
  public readonly LINEAR_MIPMAP_NEAREST: GLenum = 0x2701;

  /**
   * @constant {number}
   */
  public readonly NEAREST_MIPMAP_LINEAR: GLenum = 0x2702;

  /**
   * @constant {number}
   */
  public readonly LINEAR_MIPMAP_LINEAR: GLenum = 0x2703;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_MAG_FILTER: GLenum = 0x2800;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_MIN_FILTER: GLenum = 0x2801;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_WRAP_S: GLenum = 0x2802;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_WRAP_T: GLenum = 0x2803;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_2D: GLenum = 0x0de1;

  /**
   * @constant {number}
   */
  public readonly TEXTURE: GLenum = 0x1702;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_CUBE_MAP: GLenum = 0x8513;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_BINDING_CUBE_MAP: GLenum = 0x8514;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_CUBE_MAP_POSITIVE_X: GLenum = 0x8515;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_CUBE_MAP_NEGATIVE_X: GLenum = 0x8516;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_CUBE_MAP_POSITIVE_Y: GLenum = 0x8517;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_CUBE_MAP_NEGATIVE_Y: GLenum = 0x8518;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_CUBE_MAP_POSITIVE_Z: GLenum = 0x8519;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_CUBE_MAP_NEGATIVE_Z: GLenum = 0x851a;

  /**
   * @constant {number}
   */
  public readonly MAX_CUBE_MAP_TEXTURE_SIZE: GLenum = 0x851c;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE0: GLenum = 0x84c0;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE1: GLenum = 0x84c1;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE2: GLenum = 0x84c2;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE3: GLenum = 0x84c3;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE4: GLenum = 0x84c4;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE5: GLenum = 0x84c5;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE6: GLenum = 0x84c6;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE7: GLenum = 0x84c7;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE8: GLenum = 0x84c8;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE9: GLenum = 0x84c9;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE10: GLenum = 0x84ca;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE11: GLenum = 0x84cb;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE12: GLenum = 0x84cc;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE13: GLenum = 0x84cd;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE14: GLenum = 0x84ce;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE15: GLenum = 0x84cf;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE16: GLenum = 0x84d0;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE17: GLenum = 0x84d1;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE18: GLenum = 0x84d2;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE19: GLenum = 0x84d3;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE20: GLenum = 0x84d4;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE21: GLenum = 0x84d5;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE22: GLenum = 0x84d6;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE23: GLenum = 0x84d7;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE24: GLenum = 0x84d8;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE25: GLenum = 0x84d9;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE26: GLenum = 0x84da;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE27: GLenum = 0x84db;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE28: GLenum = 0x84dc;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE29: GLenum = 0x84dd;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE30: GLenum = 0x84de;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE31: GLenum = 0x84df;

  /**
   * The current active texture unit
   * @constant {number}
   */
  public readonly ACTIVE_TEXTURE: GLenum = 0x84e0;

  /**
   * @constant {number}
   */
  public readonly REPEAT: GLenum = 0x2901;

  /**
   * @constant {number}
   */
  public readonly CLAMP_TO_EDGE: GLenum = 0x812f;

  /**
   * @constant {number}
   */
  public readonly MIRRORED_REPEAT: GLenum = 0x8370;

  // Uniform types

  /**
   * @constant {number}
   */
  public readonly FLOAT_VEC2: GLenum = 0x8b50;

  /**
   * @constant {number}
   */
  public readonly FLOAT_VEC3: GLenum = 0x8b51;

  /**
   * @constant {number}
   */
  public readonly FLOAT_VEC4: GLenum = 0x8b52;

  /**
   * @constant {number}
   */
  public readonly INT_VEC2: GLenum = 0x8b53;

  /**
   * @constant {number}
   */
  public readonly INT_VEC3: GLenum = 0x8b54;

  /**
   * @constant {number}
   */
  public readonly INT_VEC4: GLenum = 0x8b55;

  /**
   * @constant {number}
   */
  public readonly BOOL: GLenum = 0x8b56;

  /**
   * @constant {number}
   */
  public readonly BOOL_VEC2: GLenum = 0x8b57;

  /**
   * @constant {number}
   */
  public readonly BOOL_VEC3: GLenum = 0x8b58;

  /**
   * @constant {number}
   */
  public readonly BOOL_VEC4: GLenum = 0x8b59;

  /**
   * @constant {number}
   */
  public readonly FLOAT_MAT2: GLenum = 0x8b5a;

  /**
   * @constant {number}
   */
  public readonly FLOAT_MAT3: GLenum = 0x8b5b;

  /**
   * @constant {number}
   */
  public readonly FLOAT_MAT4: GLenum = 0x8b5c;

  /**
   * @constant {number}
   */
  public readonly SAMPLER_2D: GLenum = 0x8b5e;

  /**
   * @constant {number}
   */
  public readonly SAMPLER_CUBE: GLenum = 0x8b60;

  // Shader precision-specified types

  /**
   * @constant {number}
   */
  public readonly LOW_FLOAT: GLenum = 0x8df0;

  /**
   * @constant {number}
   */
  public readonly MEDIUM_FLOAT: GLenum = 0x8df1;

  /**
   * @constant {number}
   */
  public readonly HIGH_FLOAT: GLenum = 0x8df2;

  /**
   * @constant {number}
   */
  public readonly LOW_INT: GLenum = 0x8df3;

  /**
   * @constant {number}
   */
  public readonly MEDIUM_INT: GLenum = 0x8df4;

  /**
   * @constant {number}
   */
  public readonly HIGH_INT: GLenum = 0x8df5;

  // Framebuffers and renderbuffers

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER: GLenum = 0x8d40;

  /**
   * @constant {number}
   */
  public readonly RENDERBUFFER: GLenum = 0x8d41;

  /**
   * @constant {number}
   */
  public readonly RGBA4: GLenum = 0x8056;

  /**
   * @constant {number}
   */
  public readonly RGB5_A1: GLenum = 0x8057;

  /**
   * @constant {number}
   */
  public readonly RGB565: GLenum = 0x8d62;

  /**
   * @constant {number}
   */
  public readonly DEPTH_COMPONENT16: GLenum = 0x81a5;

  /**
   * @constant {number}
   */
  public readonly STENCIL_INDEX: GLenum = 0x1901;

  /**
   * @constant {number}
   */
  public readonly STENCIL_INDEX8: GLenum = 0x8d48;

  /**
   * @constant {number}
   */
  public readonly DEPTH_STENCIL: GLenum = 0x84f9;

  /**
   * @constant {number}
   */
  public readonly RENDERBUFFER_WIDTH: GLenum = 0x8d42;

  /**
   * @constant {number}
   */
  public readonly RENDERBUFFER_HEIGHT: GLenum = 0x8d43;

  /**
   * @constant {number}
   */
  public readonly RENDERBUFFER_INTERNAL_FORMAT: GLenum = 0x8d44;

  /**
   * @constant {number}
   */
  public readonly RENDERBUFFER_RED_SIZE: GLenum = 0x8d50;

  /**
   * @constant {number}
   */
  public readonly RENDERBUFFER_GREEN_SIZE: GLenum = 0x8d51;

  /**
   * @constant {number}
   */
  public readonly RENDERBUFFER_BLUE_SIZE: GLenum = 0x8d52;

  /**
   * @constant {number}
   */
  public readonly RENDERBUFFER_ALPHA_SIZE: GLenum = 0x8d53;

  /**
   * @constant {number}
   */
  public readonly RENDERBUFFER_DEPTH_SIZE: GLenum = 0x8d54;

  /**
   * @constant {number}
   */
  public readonly RENDERBUFFER_STENCIL_SIZE: GLenum = 0x8d55;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: GLenum = 0x8cd0;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: GLenum = 0x8cd1;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: GLenum = 0x8cd2;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: GLenum = 0x8cd3;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT0: GLenum = 0x8ce0;

  /**
   * @constant {number}
   */
  public readonly DEPTH_ATTACHMENT: GLenum = 0x8d00;

  /**
   * @constant {number}
   */
  public readonly STENCIL_ATTACHMENT: GLenum = 0x8d20;

  /**
   * @constant {number}
   */
  public readonly DEPTH_STENCIL_ATTACHMENT: GLenum = 0x821a;

  /**
   * @constant {number}
   */
  public readonly NONE: GLenum = 0;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_COMPLETE: GLenum = 0x8cd5;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_INCOMPLETE_ATTACHMENT: GLenum = 0x8cd6;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: GLenum = 0x8cd7;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_INCOMPLETE_DIMENSIONS: GLenum = 0x8cd9;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_UNSUPPORTED: GLenum = 0x8cdd;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_BINDING: GLenum = 0x8ca6;

  /**
   * @constant {number}
   */
  public readonly RENDERBUFFER_BINDING: GLenum = 0x8ca7;

  /**
   * @constant {number}
   */
  public readonly MAX_RENDERBUFFER_SIZE: GLenum = 0x84e8;

  /**
   * @constant {number}
   */
  public readonly INVALID_FRAMEBUFFER_OPERATION: GLenum = 0x0506;

  // Pixel storage modes
  // Constants passed to WebGLRenderingContext.pixelStorei()

  /**
   * @constant {number}
   */
  public readonly UNPACK_FLIP_Y_WEBGL: GLenum = 0x9240;

  /**
   * @constant {number}
   */
  public readonly UNPACK_PREMULTIPLY_ALPHA_WEBGL: GLenum = 0x9241;

  /**
   * @constant {number}
   */
  public readonly UNPACK_COLORSPACE_CONVERSION_WEBGL: GLenum = 0x9243;

  // Additional constants defined WebGL 2
  // These constants are defined on the WebGL2RenderingContext interface. All WebGL 1 constants are also available in a WebGL 2 context

  // Getting GL parameter information
  // Constants passed to WebGLRenderingContext.getParameter() to specify what information to return

  /**
   * @constant {number}
   */
  public readonly READ_BUFFER: GLenum = 0x0c02;

  /**
   * @constant {number}
   */
  public readonly UNPACK_ROW_LENGTH: GLenum = 0x0cf2;

  /**
   * @constant {number}
   */
  public readonly UNPACK_SKIP_ROWS: GLenum = 0x0cf3;

  /**
   * @constant {number}
   */
  public readonly UNPACK_SKIP_PIXELS: GLenum = 0x0cf4;

  /**
   * @constant {number}
   */
  public readonly PACK_ROW_LENGTH: GLenum = 0x0d02;

  /**
   * @constant {number}
   */
  public readonly PACK_SKIP_ROWS: GLenum = 0x0d03;

  /**
   * @constant {number}
   */
  public readonly PACK_SKIP_PIXELS: GLenum = 0x0d04;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_BINDING_3D: GLenum = 0x806a;

  /**
   * @constant {number}
   */
  public readonly UNPACK_SKIP_IMAGES: GLenum = 0x806d;

  /**
   * @constant {number}
   */
  public readonly UNPACK_IMAGE_HEIGHT: GLenum = 0x806e;

  /**
   * @constant {number}
   */
  public readonly MAX_3D_TEXTURE_SIZE: GLenum = 0x8073;

  /**
   * @constant {number}
   */
  public readonly MAX_ELEMENTS_VERTICES: GLenum = 0x80e8;

  /**
   * @constant {number}
   */
  public readonly MAX_ELEMENTS_INDICES: GLenum = 0x80e9;

  /**
   * @constant {number}
   */
  public readonly MAX_TEXTURE_LOD_BIAS: GLenum = 0x84fd;

  /**
   * @constant {number}
   */
  public readonly MAX_FRAGMENT_UNIFORM_COMPONENTS: GLenum = 0x8b49;

  /**
   * @constant {number}
   */
  public readonly MAX_VERTEX_UNIFORM_COMPONENTS: GLenum = 0x8b4a;

  /**
   * @constant {number}
   */
  public readonly MAX_ARRAY_TEXTURE_LAYERS: GLenum = 0x88ff;

  /**
   * @constant {number}
   */
  public readonly MIN_PROGRAM_TEXEL_OFFSET: GLenum = 0x8904;

  /**
   * @constant {number}
   */
  public readonly MAX_PROGRAM_TEXEL_OFFSET: GLenum = 0x8905;

  /**
   * @constant {number}
   */
  public readonly MAX_VARYING_COMPONENTS: GLenum = 0x8b4b;

  /**
   * @constant {number}
   */
  public readonly FRAGMENT_SHADER_DERIVATIVE_HINT: GLenum = 0x8b8b;

  /**
   * @constant {number}
   */
  public readonly RASTERIZER_DISCARD: GLenum = 0x8c89;

  /**
   * @constant {number}
   */
  public readonly VERTEX_ARRAY_BINDING: GLenum = 0x85b5;

  /**
   * @constant {number}
   */
  public readonly MAX_VERTEX_OUTPUT_COMPONENTS: GLenum = 0x9122;

  /**
   * @constant {number}
   */
  public readonly MAX_FRAGMENT_INPUT_COMPONENTS: GLenum = 0x9125;

  /**
   * @constant {number}
   */
  public readonly MAX_SERVER_WAIT_TIMEOUT: GLenum = 0x9111;

  /**
   * @constant {number}
   */
  public readonly MAX_ELEMENT_INDEX: GLenum = 0x8d6b;

  // Textures
  // Constants passed to WebGLRenderingContext.texParameteri(), WebGLRenderingContext.texParameterf(), WebGLRenderingContext.bindTexture(), WebGLRenderingContext.texImage2D(), and others

  /**
   * @constant {number}
   */
  public readonly RED: GLenum = 0x1903;

  /**
   * @constant {number}
   */
  public readonly RGB8: GLenum = 0x8051;

  /**
   * @constant {number}
   */
  public readonly RGBA8: GLenum = 0x8058;

  /**
   * @constant {number}
   */
  public readonly RGB10_A2: GLenum = 0x8059;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_3D: GLenum = 0x806f;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_WRAP_R: GLenum = 0x8072;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_MIN_LOD: GLenum = 0x813a;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_MAX_LOD: GLenum = 0x813b;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_BASE_LEVEL: GLenum = 0x813c;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_MAX_LEVEL: GLenum = 0x813d;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_COMPARE_MODE: GLenum = 0x884c;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_COMPARE_FUNC: GLenum = 0x884d;

  /**
   * @constant {number}
   */
  public readonly SRGB: GLenum = 0x8c40;

  /**
   * @constant {number}
   */
  public readonly SRGB8: GLenum = 0x8c41;

  /**
   * @constant {number}
   */
  public readonly SRGB8_ALPHA8: GLenum = 0x8c43;

  /**
   * @constant {number}
   */
  public readonly COMPARE_REF_TO_TEXTURE: GLenum = 0x884e;

  /**
   * @constant {number}
   */
  public readonly RGBA32F: GLenum = 0x8814;

  /**
   * @constant {number}
   */
  public readonly RGB32F: GLenum = 0x8815;

  /**
   * @constant {number}
   */
  public readonly RGBA16F: GLenum = 0x881a;
  public readonly RGBA16F_EXT: GLenum = this.RGBA16F;

  /**
   * @constant {number}
   */
  public readonly RGB16F: GLenum = 0x881b;
  public readonly RGB16F_EXT: GLenum = this.RGB16F;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_2D_ARRAY: GLenum = 0x8c1a;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_BINDING_2D_ARRAY: GLenum = 0x8c1d;

  /**
   * @constant {number}
   */
  public readonly R11F_G11F_B10F: GLenum = 0x8c3a;

  /**
   * @constant {number}
   */
  public readonly RGB9_E5: GLenum = 0x8c3d;

  /**
   * @constant {number}
   */
  public readonly RGBA32UI: GLenum = 0x8d70;

  /**
   * @constant {number}
   */
  public readonly RGB32UI: GLenum = 0x8d71;

  /**
   * @constant {number}
   */
  public readonly RGBA16UI: GLenum = 0x8d76;

  /**
   * @constant {number}
   */
  public readonly RGB16UI: GLenum = 0x8d77;

  /**
   * @constant {number}
   */
  public readonly RGBA8UI: GLenum = 0x8d7c;

  /**
   * @constant {number}
   */
  public readonly RGB8UI: GLenum = 0x8d7d;

  /**
   * @constant {number}
   */
  public readonly RGBA32I: GLenum = 0x8d82;

  /**
   * @constant {number}
   */
  public readonly RGB32I: GLenum = 0x8d83;

  /**
   * @constant {number}
   */
  public readonly RGBA16I: GLenum = 0x8d88;

  /**
   * @constant {number}
   */
  public readonly RGB16I: GLenum = 0x8d89;

  /**
   * @constant {number}
   */
  public readonly RGBA8I: GLenum = 0x8d8e;

  /**
   * @constant {number}
   */
  public readonly RGB8I: GLenum = 0x8d8f;

  /**
   * @constant {number}
   */
  public readonly RED_INTEGER: GLenum = 0x8d94;

  /**
   * @constant {number}
   */
  public readonly RGB_INTEGER: GLenum = 0x8d98;

  /**
   * @constant {number}
   */
  public readonly RGBA_INTEGER: GLenum = 0x8d99;

  /**
   * @constant {number}
   */
  public readonly R8: GLenum = 0x8229;

  /**
   * @constant {number}
   */
  public readonly RG8: GLenum = 0x822b;

  /**
   * @constant {number}
   */
  public readonly R16F: GLenum = 0x822d;

  /**
   * @constant {number}
   */
  public readonly R32F: GLenum = 0x822e;

  /**
   * @constant {number}
   */
  public readonly RG16F: GLenum = 0x822f;

  /**
   * @constant {number}
   */
  public readonly RG32F: GLenum = 0x8230;

  /**
   * @constant {number}
   */
  public readonly R8I: GLenum = 0x8231;

  /**
   * @constant {number}
   */
  public readonly R8UI: GLenum = 0x8232;

  /**
   * @constant {number}
   */
  public readonly R16I: GLenum = 0x8233;

  /**
   * @constant {number}
   */
  public readonly R16UI: GLenum = 0x8234;

  /**
   * @constant {number}
   */
  public readonly R32I: GLenum = 0x8235;

  /**
   * @constant {number}
   */
  public readonly R32UI: GLenum = 0x8236;

  /**
   * @constant {number}
   */
  public readonly RG8I: GLenum = 0x8237;

  /**
   * @constant {number}
   */
  public readonly RG8UI: GLenum = 0x8238;

  /**
   * @constant {number}
   */
  public readonly RG16I: GLenum = 0x8239;

  /**
   * @constant {number}
   */
  public readonly RG16UI: GLenum = 0x823a;

  /**
   * @constant {number}
   */
  public readonly RG32I: GLenum = 0x823b;

  /**
   * @constant {number}
   */
  public readonly RG32UI: GLenum = 0x823c;

  /**
   * @constant {number}
   */
  public readonly R8_SNORM: GLenum = 0x8f94;

  /**
   * @constant {number}
   */
  public readonly RG8_SNORM: GLenum = 0x8f95;

  /**
   * @constant {number}
   */
  public readonly RGB8_SNORM: GLenum = 0x8f96;

  /**
   * @constant {number}
   */
  public readonly RGBA8_SNORM: GLenum = 0x8f97;

  /**
   * @constant {number}
   */
  public readonly RGB10_A2UI: GLenum = 0x906f;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_IMMUTABLE_FORMAT: GLenum = 0x912f;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_IMMUTABLE_LEVELS: GLenum = 0x82df;

  // Pixel types

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_INT_2_10_10_10_REV: GLenum = 0x8368;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_INT_10F_11F_11F_REV: GLenum = 0x8c3b;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_INT_5_9_9_9_REV: GLenum = 0x8c3e;

  /**
   * @constant {number}
   */
  public readonly FLOAT_32_UNSIGNED_INT_24_8_REV: GLenum = 0x8dad;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_INT_24_8: GLenum = 0x84fa;

  /**
   * @constant {number}
   */
  public readonly HALF_FLOAT: GLenum = 0x140b;

  /**
   * @constant {number}
   */
  public readonly RG: GLenum = 0x8227;

  /**
   * @constant {number}
   */
  public readonly RG_INTEGER: GLenum = 0x8228;

  /**
   * @constant {number}
   */
  public readonly INT_2_10_10_10_REV: GLenum = 0x8d9f;

  // Queries

  /**
   * @constant {number}
   */
  public readonly CURRENT_QUERY: GLenum = 0x8865;

  /**
   * @constant {number}
   */
  public readonly QUERY_RESULT: GLenum = 0x8866;

  /**
   * @constant {number}
   */
  public readonly QUERY_RESULT_AVAILABLE: GLenum = 0x8867;

  /**
   * @constant {number}
   */
  public readonly ANY_SAMPLES_PASSED: GLenum = 0x8c2f;

  /**
   * @constant {number}
   */
  public readonly ANY_SAMPLES_PASSED_CONSERVATIVE: GLenum = 0x8d6a;

  // Draw buffers

  /**
   * @constant {number}
   */
  public readonly MAX_DRAW_BUFFERS: GLenum = 0x8824;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER0: GLenum = 0x8825;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER1: GLenum = 0x8826;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER2: GLenum = 0x8827;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER3: GLenum = 0x8828;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER4: GLenum = 0x8829;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER5: GLenum = 0x882a;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER6: GLenum = 0x882b;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER7: GLenum = 0x882c;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER8: GLenum = 0x882d;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER9: GLenum = 0x882e;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER10: GLenum = 0x882f;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER11: GLenum = 0x8830;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER12: GLenum = 0x8831;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER13: GLenum = 0x8832;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER14: GLenum = 0x8833;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER15: GLenum = 0x8834;

  /**
   * @constant {number}
   */
  public readonly MAX_COLOR_ATTACHMENTS: GLenum = 0x8cdf;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT1: GLenum = 0x8ce1;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT2: GLenum = 0x8ce2;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT3: GLenum = 0x8ce3;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT4: GLenum = 0x8ce4;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT5: GLenum = 0x8ce5;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT6: GLenum = 0x8ce6;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT7: GLenum = 0x8ce7;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT8: GLenum = 0x8ce8;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT9: GLenum = 0x8ce9;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT10: GLenum = 0x8cea;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT11: GLenum = 0x8ceb;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT12: GLenum = 0x8cec;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT13: GLenum = 0x8ced;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT14: GLenum = 0x8cee;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT15: GLenum = 0x8cef;

  // Samplers

  /**
   * @constant {number}
   */
  public readonly SAMPLER_3D: GLenum = 0x8b5f;

  /**
   * @constant {number}
   */
  public readonly SAMPLER_2D_SHADOW: GLenum = 0x8b62;

  /**
   * @constant {number}
   */
  public readonly SAMPLER_2D_ARRAY: GLenum = 0x8dc1;

  /**
   * @constant {number}
   */
  public readonly SAMPLER_2D_ARRAY_SHADOW: GLenum = 0x8dc4;

  /**
   * @constant {number}
   */
  public readonly SAMPLER_CUBE_SHADOW: GLenum = 0x8dc5;

  /**
   * @constant {number}
   */
  public readonly INT_SAMPLER_2D: GLenum = 0x8dca;

  /**
   * @constant {number}
   */
  public readonly INT_SAMPLER_3D: GLenum = 0x8dcb;

  /**
   * @constant {number}
   */
  public readonly INT_SAMPLER_CUBE: GLenum = 0x8dcc;

  /**
   * @constant {number}
   */
  public readonly INT_SAMPLER_2D_ARRAY: GLenum = 0x8dcf;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_INT_SAMPLER_2D: GLenum = 0x8dd2;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_INT_SAMPLER_3D: GLenum = 0x8dd3;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_INT_SAMPLER_CUBE: GLenum = 0x8dd4;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_INT_SAMPLER_2D_ARRAY: GLenum = 0x8dd7;

  /**
   * @constant {number}
   */
  public readonly MAX_SAMPLES: GLenum = 0x8d57;

  /**
   * @constant {number}
   */
  public readonly SAMPLER_BINDING: GLenum = 0x8919;

  // Buffers

  /**
   * @constant {number}
   */
  public readonly PIXEL_PACK_BUFFER: GLenum = 0x88eb;

  /**
   * @constant {number}
   */
  public readonly PIXEL_UNPACK_BUFFER: GLenum = 0x88ec;

  /**
   * @constant {number}
   */
  public readonly PIXEL_PACK_BUFFER_BINDING: GLenum = 0x88ed;

  /**
   * @constant {number}
   */
  public readonly PIXEL_UNPACK_BUFFER_BINDING: GLenum = 0x88ef;

  /**
   * @constant {number}
   */
  public readonly COPY_READ_BUFFER: GLenum = 0x8f36;

  /**
   * @constant {number}
   */
  public readonly COPY_WRITE_BUFFER: GLenum = 0x8f37;

  /**
   * @constant {number}
   */
  public readonly COPY_READ_BUFFER_BINDING: GLenum = 0x8f36;

  /**
   * @constant {number}
   */
  public readonly COPY_WRITE_BUFFER_BINDING: GLenum = 0x8f37;

  // Data types

  /**
   * @constant {number}
   */
  public readonly FLOAT_MAT2X3: GLenum = 0x8b65;
  public readonly FLOAT_MAT2x3: GLenum = 0x8b65;

  /**
   * @constant {number}
   */
  public readonly FLOAT_MAT2X4: GLenum = 0x8b66;
  public readonly FLOAT_MAT2x4: GLenum = 0x8b66;

  /**
   * @constant {number}
   */
  public readonly FLOAT_MAT3X2: GLenum = 0x8b67;
  public readonly FLOAT_MAT3x2: GLenum = 0x8b67;

  /**
   * @constant {number}
   */
  public readonly FLOAT_MAT3X4: GLenum = 0x8b68;
  public readonly FLOAT_MAT3x4: GLenum = 0x8b68;

  /**
   * @constant {number}
   */
  public readonly FLOAT_MAT4X2: GLenum = 0x8b69;
  public readonly FLOAT_MAT4x2: GLenum = 0x8b69;

  /**
   * @constant {number}
   */
  public readonly FLOAT_MAT4X3: GLenum = 0x8b6a;
  public readonly FLOAT_MAT4x3: GLenum = 0x8b6a;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_INT_VEC2: GLenum = 0x8dc6;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_INT_VEC3: GLenum = 0x8dc7;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_INT_VEC4: GLenum = 0x8dc8;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_NORMALIZED: GLenum = 0x8c17;

  /**
   * @constant {number}
   */
  public readonly SIGNED_NORMALIZED: GLenum = 0x8f9c;

  // Vertex attributes

  /**
   * @constant {number}
   */
  public readonly VERTEX_ATTRIB_ARRAY_INTEGER: GLenum = 0x88fd;

  /**
   * @constant {number}
   */
  public readonly VERTEX_ATTRIB_ARRAY_DIVISOR: GLenum = 0x88fe;

  // Transform feedback

  /**
   * @constant {number}
   */
  public readonly TRANSFORM_FEEDBACK_BUFFER_MODE: GLenum = 0x8c7f;

  /**
   * @constant {number}
   */
  public readonly MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS: GLenum = 0x8c80;

  /**
   * @constant {number}
   */
  public readonly TRANSFORM_FEEDBACK_VARYINGS: GLenum = 0x8c83;

  /**
   * @constant {number}
   */
  public readonly TRANSFORM_FEEDBACK_BUFFER_START: GLenum = 0x8c84;

  /**
   * @constant {number}
   */
  public readonly TRANSFORM_FEEDBACK_BUFFER_SIZE: GLenum = 0x8c85;

  /**
   * @constant {number}
   */
  public readonly TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN: GLenum = 0x8c88;

  /**
   * @constant {number}
   */
  public readonly MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS: GLenum = 0x8c8a;

  /**
   * @constant {number}
   */
  public readonly MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS: GLenum = 0x8c8b;

  /**
   * @constant {number}
   */
  public readonly INTERLEAVED_ATTRIBS: GLenum = 0x8c8c;

  /**
   * @constant {number}
   */
  public readonly SEPARATE_ATTRIBS: GLenum = 0x8c8d;

  /**
   * @constant {number}
   */
  public readonly TRANSFORM_FEEDBACK_BUFFER: GLenum = 0x8c8e;

  /**
   * @constant {number}
   */
  public readonly TRANSFORM_FEEDBACK_BUFFER_BINDING: GLenum = 0x8c8f;

  /**
   * @constant {number}
   */
  public readonly TRANSFORM_FEEDBACK: GLenum = 0x8e22;

  /**
   * @constant {number}
   */
  public readonly TRANSFORM_FEEDBACK_PAUSED: GLenum = 0x8e23;

  /**
   * @constant {number}
   */
  public readonly TRANSFORM_FEEDBACK_ACTIVE: GLenum = 0x8e24;

  /**
   * @constant {number}
   */
  public readonly TRANSFORM_FEEDBACK_BINDING: GLenum = 0x8e25;

  // Framebuffers and renderbuffers

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING: GLenum = 0x8210;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE: GLenum = 0x8211;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_RED_SIZE: GLenum = 0x8212;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_GREEN_SIZE: GLenum = 0x8213;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_BLUE_SIZE: GLenum = 0x8214;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE: GLenum = 0x8215;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE: GLenum = 0x8216;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE: GLenum = 0x8217;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_DEFAULT: GLenum = 0x8218;

  /**
   * @constant {number}
   */
  public readonly DEPTH24_STENCIL8: GLenum = 0x88f0;

  /**
   * @constant {number}
   */
  public readonly DRAW_FRAMEBUFFER_BINDING: GLenum = 0x8ca6;

  /**
   * @constant {number}
   */
  public readonly READ_FRAMEBUFFER: GLenum = 0x8ca8;

  /**
   * @constant {number}
   */
  public readonly DRAW_FRAMEBUFFER: GLenum = 0x8ca9;

  /**
   * @constant {number}
   */
  public readonly READ_FRAMEBUFFER_BINDING: GLenum = 0x8caa;

  /**
   * @constant {number}
   */
  public readonly RENDERBUFFER_SAMPLES: GLenum = 0x8cab;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER: GLenum = 0x8cd4;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_INCOMPLETE_MULTISAMPLE: GLenum = 0x8d56;

  // Uniforms

  /**
   * @constant {number}
   */
  public readonly UNIFORM_BUFFER: GLenum = 0x8a11;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_BUFFER_BINDING: GLenum = 0x8a28;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_BUFFER_START: GLenum = 0x8a29;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_BUFFER_SIZE: GLenum = 0x8a2a;

  /**
   * @constant {number}
   */
  public readonly MAX_VERTEX_UNIFORM_BLOCKS: GLenum = 0x8a2b;

  /**
   * @constant {number}
   */
  public readonly MAX_FRAGMENT_UNIFORM_BLOCKS: GLenum = 0x8a2d;

  /**
   * @constant {number}
   */
  public readonly MAX_COMBINED_UNIFORM_BLOCKS: GLenum = 0x8a2e;

  /**
   * @constant {number}
   */
  public readonly MAX_UNIFORM_BUFFER_BINDINGS: GLenum = 0x8a2f;

  /**
   * @constant {number}
   */
  public readonly MAX_UNIFORM_BLOCK_SIZE: GLenum = 0x8a30;

  /**
   * @constant {number}
   */
  public readonly MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS: GLenum = 0x8a31;

  /**
   * @constant {number}
   */
  public readonly MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS: GLenum = 0x8a33;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_BUFFER_OFFSET_ALIGNMENT: GLenum = 0x8a34;

  /**
   * @constant {number}
   */
  public readonly ACTIVE_UNIFORM_BLOCKS: GLenum = 0x8a36;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_TYPE: GLenum = 0x8a37;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_SIZE: GLenum = 0x8a38;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_BLOCK_INDEX: GLenum = 0x8a3a;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_OFFSET: GLenum = 0x8a3b;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_ARRAY_STRIDE: GLenum = 0x8a3c;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_MATRIX_STRIDE: GLenum = 0x8a3d;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_IS_ROW_MAJOR: GLenum = 0x8a3e;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_BLOCK_BINDING: GLenum = 0x8a3f;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_BLOCK_DATA_SIZE: GLenum = 0x8a40;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_BLOCK_ACTIVE_UNIFORMS: GLenum = 0x8a42;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES: GLenum = 0x8a43;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER: GLenum = 0x8a44;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER: GLenum = 0x8a46;

  // Sync objects

  /**
   * @constant {number}
   */
  public readonly OBJECT_TYPE: GLenum = 0x9112;

  /**
   * @constant {number}
   */
  public readonly SYNC_CONDITION: GLenum = 0x9113;

  /**
   * @constant {number}
   */
  public readonly SYNC_STATUS: GLenum = 0x9114;

  /**
   * @constant {number}
   */
  public readonly SYNC_FLAGS: GLenum = 0x9115;

  /**
   * @constant {number}
   */
  public readonly SYNC_FENCE: GLenum = 0x9116;

  /**
   * @constant {number}
   */
  public readonly SYNC_GPU_COMMANDS_COMPLETE: GLenum = 0x9117;

  /**
   * @constant {number}
   */
  public readonly UNSIGNALED: GLenum = 0x9118;

  /**
   * @constant {number}
   */
  public readonly SIGNALED: GLenum = 0x9119;

  /**
   * @constant {number}
   */
  public readonly ALREADY_SIGNALED: GLenum = 0x911a;

  /**
   * @constant {number}
   */
  public readonly TIMEOUT_EXPIRED: GLenum = 0x911b;

  /**
   * @constant {number}
   */
  public readonly CONDITION_SATISFIED: GLenum = 0x911c;

  /**
   * @constant {number}
   */
  public readonly WAIT_FAILED: GLenum = 0x911d;

  /**
   * @constant {number}
   */
  public readonly SYNC_FLUSH_COMMANDS_BIT: GLenum = 0x00000001;

  // Miscellaneous constants

  /**
   * @constant {number}
   */
  public readonly COLOR: GLenum = 0x1800;

  /**
   * @constant {number}
   */
  public readonly DEPTH: GLenum = 0x1801;

  /**
   * @constant {number}
   */
  public readonly STENCIL: GLenum = 0x1802;

  /**
   * @constant {number}
   */
  public readonly MIN: GLenum = 0x8007;

  /**
   * @constant {number}
   */
  public readonly MAX: GLenum = 0x8008;

  /**
   * @constant {number}
   */
  public readonly DEPTH_COMPONENT24: GLenum = 0x81a6;

  /**
   * @constant {number}
   */
  public readonly STREAM_READ: GLenum = 0x88e1;

  /**
   * @constant {number}
   */
  public readonly STREAM_COPY: GLenum = 0x88e2;

  /**
   * @constant {number}
   */
  public readonly STATIC_READ: GLenum = 0x88e5;

  /**
   * @constant {number}
   */
  public readonly STATIC_COPY: GLenum = 0x88e6;

  /**
   * @constant {number}
   */
  public readonly DYNAMIC_READ: GLenum = 0x88e9;

  /**
   * @constant {number}
   */
  public readonly DYNAMIC_COPY: GLenum = 0x88ea;

  /**
   * @constant {number}
   */
  public readonly DEPTH_COMPONENT32F: GLenum = 0x8cac;

  /**
   * @constant {number}
   */
  public readonly DEPTH32F_STENCIL8: GLenum = 0x8cad;

  /**
   * @constant {number}
   */
  public readonly INVALID_INDEX: GLenum = 0xffffffff;

  /**
   * @constant {number}
   */
  public readonly TIMEOUT_IGNORED: GLenum = -1;

  /**
   * @constant {number}
   */
  public readonly MAX_CLIENT_WAIT_TIMEOUT_WEBGL: GLenum = 0x9247;

  // Constants defined in WebGL extensions

  // ANGLE_instanced_arrays
  // The ANGLE_instanced_arrays extension is part of the WebGL API and allows to draw the same object, or groups of similar objects multiple times, if they share the same vertex data, primitive count and type
  /**
   * Describes the frequency divisor used for instanced rendering
   * @constant {number}
   */
  public readonly VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE: GLenum = 0x88fe;

  // WEBGL_debug_renderer_info
  // The WEBGL_debug_renderer_info extension is part of the WebGL API and exposes two constants with information about the graphics driver for debugging purposes
  /**
   * Passed to getParameter to get the vendor string of the graphics driver
   * @constant {number}
   */
  public readonly UNMASKED_VENDOR_WEBGL: GLenum = 0x9245;

  /**
   * Passed to getParameter to get the renderer string of the graphics driver
   * @constant {number}
   */
  public readonly UNMASKED_RENDERER_WEBGL: GLenum = 0x9246;

  // EXT_texture_filter_anisotropic
  // The EXT_texture_filter_anisotropic extension is part of the WebGL API and exposes two constants for anisotropic filtering (AF)
  /**
   * Returns the maximum available anisotropy
   * @constant {number}
   */
  public readonly MAX_TEXTURE_MAX_ANISOTROPY_EXT: GLenum = 0x84ff;

  /**
   * Passed to texParameter to set the desired maximum anisotropy for a texture
   * @constant {number}
   */
  public readonly TEXTURE_MAX_ANISOTROPY_EXT: GLenum = 0x84fe;

  // WEBGL_compressed_texture_s3tc
  // The WEBGL_compressed_texture_s3tc extension is part of the WebGL API and exposes four S3TC compressed texture formats
  /**
   * A DXT1-compressed image in an RGB image format
   * @constant {number}
   */
  public readonly COMPRESSED_RGB_S3TC_DXT1_EXT: GLenum = 0x83f0;

  /**
   * A DXT1-compressed image in an RGB image format with a simple on/off alpha value
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_S3TC_DXT1_EXT: GLenum = 0x83f1;

  /**
   * A DXT3-compressed image in an RGBA image format. Compared to a 32-bit RGBA texture, it offers 4:1 compression
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_S3TC_DXT3_EXT: GLenum = 0x83f2;

  /**
   * A DXT5-compressed image in an RGBA image format. It also provides a 4:1 compression, but differs to the DXT3 compression in how the alpha compression is done
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_S3TC_DXT5_EXT: GLenum = 0x83f3;

  // WEBGL_compressed_texture_s3tc_srgb
  // The WEBGL_compressed_texture_s3tc_srgb extension is part of the WebGL API and exposes four S3TC compressed texture formats for the sRGB colorspace
  /**
   * A DXT1-compressed image in an sRGB image format
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB_S3TC_DXT1_EXT: GLenum = 0x8c4c;

  /**
   * A DXT1-compressed image in an sRGB image format with a simple on/off alpha value
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT: GLenum = 0x8c4d;

  /**
   * A DXT3-compressed image in an sRGBA image format
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT: GLenum = 0x8c4e;

  /**
   * A DXT5-compressed image in an sRGBA image format
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT: GLenum = 0x8c4f;

  // WEBGL_compressed_texture_etc
  // The WEBGL_compressed_texture_etc extension is part of the WebGL API and exposes 10 ETC/EAC compressed texture formats
  /**
   * One-channel (red) unsigned format compression
   * @constant {number}
   */
  public readonly COMPRESSED_R11_EAC: GLenum = 0x9270;

  /**
   * One-channel (red) signed format compression
   * @constant {number}
   */
  public readonly COMPRESSED_SIGNED_R11_EAC: GLenum = 0x9271;

  /**
   * Two-channel (red and green) unsigned format compression
   * @constant {number}
   */
  public readonly COMPRESSED_RG11_EAC: GLenum = 0x9272;

  /**
   * Two-channel (red and green) signed format compression
   * @constant {number}
   */
  public readonly COMPRESSED_SIGNED_RG11_EAC: GLenum = 0x9273;

  /**
   * Compresses RBG8 data with no alpha channel
   * @constant {number}
   */
  public readonly COMPRESSED_RGB8_ETC2: GLenum = 0x9274;

  /**
   * Compresses RGBA8 data. The RGB part is encoded the same as RGB_ETC2, but the alpha part is encoded separately
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA8_ETC2_EAC: GLenum = 0x9275;

  /**
   * Compresses sRBG8 data with no alpha channel
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ETC2: GLenum = 0x9276;

  /**
   * Compresses sRGBA8 data. The sRGB part is encoded the same as SRGB_ETC2, but the alpha part is encoded separately
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ETC2_EAC: GLenum = 0x9277;

  /**
   * Similar to RGB8_ETC, but with ability to punch through the alpha channel, which means to make it completely opaque or transparent
   * @constant {number}
   */
  public readonly COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2: GLenum = 0x9278;

  /**
   * Similar to SRGB8_ETC, but with ability to punch through the alpha channel, which means to make it completely opaque or transparent
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2: GLenum = 0x9279;

  // WEBGL_compressed_texture_pvrtc
  // The WEBGL_compressed_texture_pvrtc extension is part of the WebGL API and exposes four PVRTC compressed texture formats
  /**
   * RGB compression in 4-bit mode. One block for each 4×4 pixels
   * @constant {number}
   */
  public readonly COMPRESSED_RGB_PVRTC_4BPPV1_IMG: GLenum = 0x8c00;

  /**
   * RGBA compression in 4-bit mode. One block for each 4×4 pixels
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: GLenum = 0x8c02;

  /**
   * RGB compression in 2-bit mode. One block for each 8×4 pixels
   * @constant {number}
   */
  public readonly COMPRESSED_RGB_PVRTC_2BPPV1_IMG: GLenum = 0x8c01;

  /**
   * RGBA compression in 2-bit mode. One block for each 8×4 pixels
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: GLenum = 0x8c03;

  // WEBGL_compressed_texture_etc1
  // The WEBGL_compressed_texture_etc1 extension is part of the WebGL API and exposes the ETC1 compressed texture format
  /**
   * Compresses 24-bit RGB data with no alpha channel
   * @constant {number}
   */
  public readonly COMPRESSED_RGB_ETC1_WEBGL: GLenum = 0x8d64;

  // WEBGL_compressed_texture_atc
  // The WEBGL_compressed_texture_atc extension is part of the WebGL API and exposes 3 ATC compressed texture formats. ATC is a proprietary compression algorithm for compressing textures on handheld devices
  /**
   * Compresses RGB textures with no alpha channel
   * @constant {number}
   */
  public readonly COMPRESSED_RGB_ATC_WEBGL: GLenum = 0x8c92;

  /**
   * Compresses RGBA textures using explicit alpha encoding (useful when alpha transitions are sharp)
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL: GLenum = 0x8c92;

  /**
   * Compresses RGBA textures using interpolated alpha encoding (useful when alpha transitions are gradient)
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL: GLenum = 0x87ee;

  // WEBGL_compressed_texture_astc
  // The WEBGL_compressed_texture_astc extension is part of the WebGL API and exposes Adaptive Scalable Texture Compression (ASTC) compressed texture formats to WebGL
  // https://www.khronos.org/registry/webgl/extensions/WEBGL_compressed_texture_astc/
  // https://developer.nvidia.com/astc-texture-compression-for-game-assets
  /**
   * Compresses RGBA textures using ASTC compression in a blocksize of 4x4
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ASTC_4X4_KHR: GLenum = 0x93b0;
  public readonly COMPRESSED_RGBA_ASTC_4x4_KHR: GLenum = 0x93b0;

  /**
   * Compresses RGBA textures using ASTC compression in a blocksize of 5x4
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ASTC_5X4_KHR: GLenum = 0x93b1;
  public readonly COMPRESSED_RGBA_ASTC_5x4_KHR: GLenum = 0x93b1;

  /**
   * Compresses RGBA textures using ASTC compression in a blocksize of 5x5
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ASTC_5X5_KHR: GLenum = 0x93b2;
  public readonly COMPRESSED_RGBA_ASTC_5x5_KHR: GLenum = 0x93b2;

  /**
   * Compresses RGBA textures using ASTC compression in a blocksize of 6x5
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ASTC_6X5_KHR: GLenum = 0x93b3;
  public readonly COMPRESSED_RGBA_ASTC_6x5_KHR: GLenum = 0x93b3;

  /**
   * Compresses RGBA textures using ASTC compression in a blocksize of 6x6
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ASTC_6X6_KHR: GLenum = 0x93b4;
  public readonly COMPRESSED_RGBA_ASTC_6x6_KHR: GLenum = 0x93b4;

  /**
   * Compresses RGBA textures using ASTC compression in a blocksize of 8x5
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ASTC_8X5_KHR: GLenum = 0x93b5;
  public readonly COMPRESSED_RGBA_ASTC_8x5_KHR: GLenum = 0x93b5;

  /**
   * Compresses RGBA textures using ASTC compression in a blocksize of 8x6
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ASTC_8X6_KHR: GLenum = 0x93b6;
  public readonly COMPRESSED_RGBA_ASTC_8x6_KHR: GLenum = 0x93b6;

  /**
   * Compresses RGBA textures using ASTC compression in a blocksize of 8x8
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ASTC_8X8_KHR: GLenum = 0x93b7;
  public readonly COMPRESSED_RGBA_ASTC_8x8_KHR: GLenum = 0x93b7;

  /**
   * Compresses RGBA textures using ASTC compression in a blocksize of 10x5
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ASTC_10X5_KHR: GLenum = 0x93b8;
  public readonly COMPRESSED_RGBA_ASTC_10x5_KHR: GLenum = 0x93b8;

  /**
   * Compresses RGBA textures using ASTC compression in a blocksize of 10x6
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ASTC_10X6_KHR: GLenum = 0x93b9;
  public readonly COMPRESSED_RGBA_ASTC_10x6_KHR: GLenum = 0x93b9;

  /**
   * Compresses RGBA textures using ASTC compression in a blocksize of 10x8
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ASTC_10X8_KHR: GLenum = 0x93ba;
  public readonly COMPRESSED_RGBA_ASTC_10x8_KHR: GLenum = 0x93ba;

  /**
   * Compresses RGBA textures using ASTC compression in a blocksize of 10x10
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ASTC_10X10_KHR: GLenum = 0x93bb;
  public readonly COMPRESSED_RGBA_ASTC_10x10_KHR: GLenum = 0x93bb;

  /**
   * Compresses RGBA textures using ASTC compression in a blocksize of 12x10
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ASTC_12X10_KHR: GLenum = 0x93bc;
  public readonly COMPRESSED_RGBA_ASTC_12x10_KHR: GLenum = 0x93bc;

  /**
   * Compresses RGBA textures using ASTC compression in a blocksize of 12x12
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ASTC_12X12_KHR: GLenum = 0x93bd;
  public readonly COMPRESSED_RGBA_ASTC_12x12_KHR: GLenum = 0x93bd;

  /**
   * Compresses SRGB8 textures using ASTC compression in a blocksize of 4x4
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_4X4_KHR: GLenum = 0x93d0;
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR: GLenum = 0x93d0;

  /**
   * Compresses SRGB8 textures using ASTC compression in a blocksize of 5x4
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_5X4_KHR: GLenum = 0x93d1;
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR: GLenum = 0x93d1;

  /**
   * Compresses SRGB8 textures using ASTC compression in a blocksize of 5x5
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_5X5_KHR: GLenum = 0x93d2;
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR: GLenum = 0x93d2;

  /**
   * Compresses SRGB8 textures using ASTC compression in a blocksize of 6x5
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_6X5_KHR: GLenum = 0x93d3;
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR: GLenum = 0x93d3;

  /**
   * Compresses SRGB8 textures using ASTC compression in a blocksize of 6x6
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_6X6_KHR: GLenum = 0x93d4;
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR: GLenum = 0x93d4;

  /**
   * Compresses SRGB8 textures using ASTC compression in a blocksize of 8x5
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_8X5_KHR: GLenum = 0x93d5;
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR: GLenum = 0x93d5;

  /**
   * Compresses SRGB8 textures using ASTC compression in a blocksize of 8x6
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_8X6_KHR: GLenum = 0x93d6;
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR: GLenum = 0x93d6;

  /**
   * Compresses SRGB8 textures using ASTC compression in a blocksize of 8x8
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_8X8_KHR: GLenum = 0x93d7;
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR: GLenum = 0x93d7;

  /**
   * Compresses SRGB8 textures using ASTC compression in a blocksize of 10x5
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_10X5_KHR: GLenum = 0x93d8;
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR: GLenum = 0x93d8;

  /**
   * Compresses SRGB8 textures using ASTC compression in a blocksize of 10x6
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_10X6_KHR: GLenum = 0x93d9;
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR: GLenum = 0x93d9;

  /**
   * Compresses SRGB8 textures using ASTC compression in a blocksize of 10x8
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_10X8_KHR: GLenum = 0x93da;
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR: GLenum = 0x93da;

  /**
   * Compresses SRGB8 textures using ASTC compression in a blocksize of 10x10
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_10X10_KHR: GLenum = 0x93db;
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR: GLenum = 0x93db;

  /**
   * Compresses SRGB8 textures using ASTC compression in a blocksize of 12x10
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_12X10_KHR: GLenum = 0x93dc;
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR: GLenum = 0x93dc;

  /**
   * Compresses SRGB8 textures using ASTC compression in a blocksize of 12x12
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_12X12_KHR: GLenum = 0x93dd;
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR: GLenum = 0x93dd;

  // WEBGL_depth_texture
  // The WEBGL_depth_texture extension is part of the WebGL API and defines 2D depth and depth-stencil textures
  /**
   * Unsigned integer type for 24-bit depth texture data
   * @constant {number}
   */
  public readonly UNSIGNED_INT_24_8_WEBGL: GLenum = 0x84fa;

  // OES_texture_half_float
  // The OES_texture_half_float extension is part of the WebGL API and adds texture formats with 16- (aka half float) and 32-bit floating-point components
  /**
   * Half floating-point type (16-bit)
   * @constant {number}
   */
  public readonly HALF_FLOAT_OES: GLenum = 0x8d61;

  // WEBGL_color_buffer_float
  // The WEBGL_color_buffer_float extension is part of the WebGL API and adds the ability to render to 32-bit floating-point color buffers
  /**
   * RGBA 32-bit floating-point color-renderable format
   * @constant {number}
   */
  public readonly RGBA32F_EXT: GLenum = 0x8814;

  /**
   * RGB 32-bit floating-point color-renderable format
   * @constant {number}
   */
  public readonly RGB32F_EXT: GLenum = 0x8815;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT: GLenum = 0x8211;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_NORMALIZED_EXT: GLenum = 0x8c17;

  // EXT_blend_minmax
  // The EXT_blend_minmax extension is part of the WebGL API and extends blending capabilities by adding two new blend equations: the minimum or maximum color components of the source and destination colors
  /**
   * Produces the minimum color components of the source and destination colors
   * @constant {number}
   */
  public readonly MIN_EXT: GLenum = 0x8007;

  /**
   * Produces the maximum color components of the source and destination colors
   * @constant {number}
   */
  public readonly MAX_EXT: GLenum = 0x8008;

  // EXT_sRGB
  // The EXT_sRGB extension is part of the WebGL API and adds sRGB support to textures and framebuffer objects
  /**
   * Unsized sRGB format that leaves the precision up to the driver
   * @constant {number}
   */
  public readonly SRGB_EXT: GLenum = 0x8c40;

  /**
   * Unsized sRGB format with unsized alpha component
   * @constant {number}
   */
  public readonly SRGB_ALPHA_EXT: GLenum = 0x8c42;

  /**
   * Sized (8-bit) sRGB and alpha formats
   * @constant {number}
   */
  public readonly SRGB8_ALPHA8_EXT: GLenum = 0x8c43;

  /**
   * Returns the framebuffer color encoding
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT: GLenum = 0x8210;

  // OES_standard_derivatives
  // The OES_standard_derivatives extension is part of the WebGL API and adds the GLSL derivative functions dFdx, dFdy, and fwidth
  /**
   * Indicates the accuracy of the derivative calculation for the GLSL built-in functions: dFdx, dFdy, and fwidth
   * @constant {number}
   */
  public readonly FRAGMENT_SHADER_DERIVATIVE_HINT_OES: GLenum = 0x8b8b;

  // WEBGL_draw_buffers
  // The WEBGL_draw_buffers extension is part of the WebGL API and enables a fragment shader to write to several textures, which is useful for deferred shading, for example
  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT0_WEBGL: GLenum = 0x8ce0;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT1_WEBGL: GLenum = 0x8ce1;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT2_WEBGL: GLenum = 0x8ce2;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT3_WEBGL: GLenum = 0x8ce3;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT4_WEBGL: GLenum = 0x8ce4;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT5_WEBGL: GLenum = 0x8ce5;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT6_WEBGL: GLenum = 0x8ce6;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT7_WEBGL: GLenum = 0x8ce7;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT8_WEBGL: GLenum = 0x8ce8;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT9_WEBGL: GLenum = 0x8ce9;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT10_WEBGL: GLenum = 0x8cea;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT11_WEBGL: GLenum = 0x8ceb;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT12_WEBGL: GLenum = 0x8cec;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT13_WEBGL: GLenum = 0x8ced;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT14_WEBGL: GLenum = 0x8cee;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT15_WEBGL: GLenum = 0x8cef;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER0_WEBGL: GLenum = 0x8825;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER1_WEBGL: GLenum = 0x8826;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER2_WEBGL: GLenum = 0x8827;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER3_WEBGL: GLenum = 0x8828;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER4_WEBGL: GLenum = 0x8829;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER5_WEBGL: GLenum = 0x882a;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER6_WEBGL: GLenum = 0x882b;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER7_WEBGL: GLenum = 0x882c;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER8_WEBGL: GLenum = 0x882d;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER9_WEBGL: GLenum = 0x882e;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER10_WEBGL: GLenum = 0x882f;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER11_WEBGL: GLenum = 0x8830;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER12_WEBGL: GLenum = 0x8831;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER13_WEBGL: GLenum = 0x8832;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER14_WEBGL: GLenum = 0x8833;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER15_WEBGL: GLenum = 0x8834;

  /**
   * Maximum number of framebuffer color attachment points
   * @constant {number}
   */
  public readonly MAX_COLOR_ATTACHMENTS_WEBGL: GLenum = 0x8cdf;

  /**
   * Maximum number of draw buffers
   * @constant {number}
   */
  public readonly MAX_DRAW_BUFFERS_WEBGL: GLenum = 0x8824;

  // OES_vertex_array_object
  // The OES_vertex_array_object extension is part of the WebGL API and provides vertex array objects (VAOs) which encapsulate vertex array states. These objects keep pointers to vertex data and provide names for different sets of vertex data
  /**
   * The bound vertex array object (VAO)
   * @constant {number}
   */
  public readonly VERTEX_ARRAY_BINDING_OES: GLenum = 0x85b5;

  // EXT_disjoint_timer_query
  // The EXT_disjoint_timer_query extension is part of the WebGL API and provides a way to measure the duration of a set of GL commands, without stalling the rendering pipeline
  /**
   * The number of bits used to hold the query result for the given target
   * @constant {number}
   */
  public readonly QUERY_COUNTER_BITS_EXT: GLenum = 0x8864;

  /**
   * The currently active query
   * @constant {number}
   */
  public readonly CURRENT_QUERY_EXT: GLenum = 0x8865;

  /**
   * The query result
   * @constant {number}
   */
  public readonly QUERY_RESULT_EXT: GLenum = 0x8866;

  /**
   * A Boolean indicating whether or not a query result is available
   * @constant {number}
   */
  public readonly QUERY_RESULT_AVAILABLE_EXT: GLenum = 0x8867;

  /**
   * Elapsed time (in nanoseconds)
   * @constant {number}
   */
  public readonly TIME_ELAPSED_EXT: GLenum = 0x88bf;

  /**
   * The current time
   * @constant {number}
   */
  public readonly TIMESTAMP_EXT: GLenum = 0x8e28;

  /**
   * A Boolean indicating whether or not the GPU performed any disjoint operation
   * @constant {number}
   */
  public readonly GPU_DISJOINT_EXT: GLenum = 0x8fbb;

  // Constants defined in WebGL draft extensions

  // KHR_parallel_shader_compile
  // The KHR_parallel_shader_compile extension is part of the WebGL draft API and provides multithreaded asynchronous shader compilation
  /**
   * Query to determine if the compilation process is complete
   * @constant {number}
   */
  public readonly COMPLETION_STATUS_KHR: GLenum = 0x91b1;

  // EXT_texture_norm16
  public readonly R16_EXT: GLenum = 0x822a;
  public readonly RG16_EXT: GLenum = 0x822c;
  public readonly RGBA16_EXT: GLenum = 0x805b;

  public readonly RGB16_EXT: GLenum = 0x8054;

  public readonly R16_SNORM_EXT: GLenum = 0x8f98;
  public readonly RG16_SNORM_EXT: GLenum = 0x8f99;
  public readonly RG16_SNORM__EXT: GLenum = this.RG16_SNORM_EXT;

  public readonly RGB16_SNORM_EXT: GLenum = 0x8f9a;
  public readonly RGB16_SNORM__EXT: GLenum = this.RGB16_SNORM_EXT;

  public readonly RGBA16_SNORM_EXT: GLenum = 0x8f9b;
  public readonly RGBA16_SNORM__EXT: GLenum = this.RGBA16_SNORM_EXT;

  // EXT_texture_compression_rgtc
  public readonly COMPRESSED_RED_RGTC1_EXT: GLenum = 0x8dbb;
  public readonly COMPRESSED_SIGNED_RED_RGTC1_EXT: GLenum = 0x8dbc;
  public readonly COMPRESSED_RED_GREEN_RGTC2_EXT: GLenum = 0x8dbd;
  public readonly COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT: GLenum = 0x8dbe;

  // EXT_texture_compression_bptc
  public readonly COMPRESSED_RGBA_BPTC_UNORM_EXT: GLenum = 0x8e8c;
  public readonly COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT: GLenum = 0x8e8d;
  public readonly COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT: GLenum = 0x8e8e;
  public readonly COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT: GLenum = 0x8e8f;

  // OVR_multiview2
  public readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_NUM_VIEWS_OVR: GLenum = 0x9630;
  public readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_BASE_VIEW_INDEX_OVR: GLenum = 0x9632;
  public readonly MAX_VIEWS_OVR: GLenum = 0x9631;
  public readonly FRAMEBUFFER_INCOMPLETE_VIEW_TARGETS_OVR: GLenum = 0x9633;
}
