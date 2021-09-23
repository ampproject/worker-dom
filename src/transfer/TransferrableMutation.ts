export const enum TransferrableMutationType {
  ATTRIBUTES = 0,
  CHARACTER_DATA = 1,
  CHILD_LIST = 2,
  PROPERTIES = 3,
  EVENT_SUBSCRIPTION = 4,
  GET_BOUNDING_CLIENT_RECT = 5,
  LONG_TASK_START = 6,
  LONG_TASK_END = 7,
  OFFSCREEN_CANVAS_INSTANCE = 8,
  OBJECT_MUTATION = 9,
  OBJECT_CREATION = 10,
  IMAGE_BITMAP_INSTANCE = 11,
  STORAGE = 12,
  FUNCTION_CALL = 13,
  SCROLL_INTO_VIEW = 14,
}

/**
 * Returns true if the mutation type can cause a user-visible change to the DOM.
 * @param type
 */
export const isUserVisibleMutation = (type: TransferrableMutationType): boolean => {
  switch (type) {
    case TransferrableMutationType.EVENT_SUBSCRIPTION:
    case TransferrableMutationType.GET_BOUNDING_CLIENT_RECT:
    case TransferrableMutationType.LONG_TASK_START:
    case TransferrableMutationType.LONG_TASK_END:
    case TransferrableMutationType.STORAGE:
    case TransferrableMutationType.OFFSCREEN_CANVAS_INSTANCE:
    case TransferrableMutationType.FUNCTION_CALL:
      return false;
    default:
      return true;
  }
};

export const DefaultAllowedMutations = [
  TransferrableMutationType.ATTRIBUTES,
  TransferrableMutationType.CHARACTER_DATA,
  TransferrableMutationType.CHILD_LIST,
  TransferrableMutationType.PROPERTIES,
  TransferrableMutationType.EVENT_SUBSCRIPTION,
  TransferrableMutationType.GET_BOUNDING_CLIENT_RECT,
  TransferrableMutationType.LONG_TASK_START,
  TransferrableMutationType.LONG_TASK_END,
  TransferrableMutationType.OFFSCREEN_CANVAS_INSTANCE,
  TransferrableMutationType.OBJECT_MUTATION,
  TransferrableMutationType.OBJECT_CREATION,
  TransferrableMutationType.IMAGE_BITMAP_INSTANCE,
  TransferrableMutationType.STORAGE,
  TransferrableMutationType.FUNCTION_CALL,
  TransferrableMutationType.SCROLL_INTO_VIEW,
];

export const ReadableMutationType: { [key: number]: string } = {
  0: 'ATTRIBUTES',
  1: 'CHARACTER_DATA',
  2: 'CHILD_LIST',
  3: 'PROPERTIES',
  4: 'EVENT_SUBSCRIPTION',
  5: 'GET_BOUNDING_CLIENT_RECT',
  6: 'LONG_TASK_START',
  7: 'LONG_TASK_END',
  8: 'OFFSCREEN_CANVAS_INSTANCE',
  9: 'OBJECT_MUTATION',
  10: 'OBJECT_CREATION',
  11: 'IMAGE_BITMAP_INSTANCE',
  12: 'STORAGE',
  13: 'FUNCTION_INVOCATION',
  14: 'SCROLL_INTO_VIEW',
};

/**
 * Child List Mutations
 * [
 *   TransferrableMutationType.CHILD_LIST,
 *   Target.index,
 *   NextSibling.index,
 *   PreviousSibling.index,
 *   AppendedNodeCount,
 *   RemovedNodeCount,
 *   ... AppendedNode.index,
 *   ... RemovedNode.index,
 * ]
 */
export const enum ChildListMutationIndex {
  Target = 1,
  NextSibling = 2,
  PreviousSibling = 3,
  AppendedNodeCount = 4,
  RemovedNodeCount = 5,
  Nodes = 6,
  End = 6,
}

/**
 * Attribute Mutations
 * [
 *   TransferrableMutationType.ATTRIBUTES,
 *   Target.index,
 *   Attr.name,
 *   Attr.namespace,   // 0 is the default value.
 *   Attr.value,       // 0 is the default value.
 * ]
 */
export const enum AttributeMutationIndex {
  Target = 1,
  Name = 2,
  Namespace = 3,
  Value = 4,
  End = 5,
}

/**
 * Character Data Mutations
 * [
 *   TransferrableMutationType.CHARACTER_DATA,
 *   Target.index,
 *   CharacterData.value,
 * ]
 */
export const enum CharacterDataMutationIndex {
  Target = 1,
  Value = 2,
  End = 3,
}

/**
 * Properties Mutations
 * [
 *   TransferrableMutationType.PROPERTIES,
 *   Target.index,
 *   Property.name,
 *   typeof Property.value === boolean,
 *   Property.value,
 * ]
 */
export const enum PropertyMutationIndex {
  Target = 1,
  Name = 2,
  IsBoolean = 3,
  Value = 4,
  End = 5,
}

/**
 * Long Task Mutations
 * [
 *   TransferrableMutationType.LONG_TASK_START || TransferrableMutation.LONG_TASK_END
 *   Target.index,
 * ]
 */
export const enum LongTaskMutationIndex {
  Target = 1,
  End = 2,
}

/**
 * OffscreenCanvas Mutations
 * [
 *   TransferrableMutationType.OFFSCREEN_CANVAS_INSTANCE,
 *   Target.index,
 * ]
 */
export const enum OffscreenCanvasMutationIndex {
  Target = 1,
  End = 2,
}

/**
 * ImageBitmap Mutations
 * [
 *   TransferrableMutationType.IMAGE_BITMAP_INSTANCE,
 *   Target.index,
 * ]
 */
export const enum ImageBitmapMutationIndex {
  Target = 1,
  CallIndex = 2,
  End = 3,
}

/**
 * ObjectMutation Mutations
 * [
 *   TransferrableMutationType.IMAGE_BITMAP_INSTANCE,
 *   Target.index,
 * ]
 * // TODO(choumx): Fix naming inconsistency.
 */
export const enum ObjectMutationIndex {
  FunctionName = 1,
  ArgumentCount = 2,
  SerializedTarget = 3,
  // "End" index is variable.
}

/**
 * ObjectCreation Mutations
 * [
 *   TransferrableMutationType.IMAGE_BITMAP_INSTANCE,
 *   Target.index,
 * ]
 * // TODO(choumx): Fix naming inconsistency.
 */
export const enum ObjectCreationIndex {
  FunctionName = 1,
  ObjectId = 2,
  ArgumentCount = 3,
  SerializedTarget = 4,
  // "End" index is variable.
}

/**
 * Used in OBJECT_MUTATION and OBJECT_CREATION mutations for typing non-primitives
 * passed in function parameters, e.g. <image> in CanvasRenderingContext2D.drawImage(<image>).
 */
export const enum TransferrableObjectType {
  SmallInt = 1,
  Float = 2,
  String = 3,
  Array = 4,
  TransferObject = 5,
  CanvasRenderingContext2D = 6,
  HTMLElement = 7,
}

/**
 * Storage Mutations
 * [
 *   TransferrableMutationType.STORAGE,
 *   GetOrSet,
 *   StorageLocation,
 *   string(key),
 *   string(value),
 * ]
 */
export const enum StorageMutationIndex {
  Operation = 1,
  Location = 2,
  Key = 3,
  Value = 4,
  End = 5,
}

/**
 * [
 *   TransferrableMutationType.FunctionInvocation,
 *   ResolveOrReject,
 *   index,
 *   string(value)
 * ]
 */
export const enum FunctionMutationIndex {
  Status = 1,
  Index = 2,
  Value = 3,
  End = 4,
}

/**
 * Scroll Into View Mutation
 * [
 *   ScrollIntoViewMutationIndex.START || TransferrableMutation.END
 *   Target.index,
 * ]
 */
export const enum ScrollIntoViewMutationIndex {
  Target = 1,
  End = 2,
}
