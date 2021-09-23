export const enum BoundClientRectMutationIndex {
  Target = 1,
  End = 2,
}

// [top, right, bottom, left, width, height]
export type TransferrableBoundingClientRect = [number, number, number, number, number, number];
