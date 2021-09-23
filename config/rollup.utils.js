const { DEBUG_BUNDLE = false, MINIFY_BUNDLE = false, COMPRESS_BUNDLE = false } = process.env;

export let DEBUG_BUNDLE_VALUE = DEBUG_BUNDLE === 'true';
export let MINIFY_BUNDLE_VALUE = MINIFY_BUNDLE === 'true';
export let COMPRESS_BUNDLE_VALUE = COMPRESS_BUNDLE === 'true';
