/**
 * Immutable Set like interface of points
 *
 * @flow
 */

import * as Matrix from "./matrix";
import { flatMap } from "./util";
import type { Point } from "./types";
import * as PointMap from "./point-map";

export type PointSet = PointMap.PointMap<boolean>;

export type Descriptor<T> = {|
  ...Point,
  data: T
|};

/** Appends a new point to the Set object */
export const add = (set: PointSet, point: Point): PointSet =>
  PointMap.set(point, true, set);

/** Removes the point from the Set object */
export const remove = (set: PointSet, point: Point): PointSet =>
  PointMap.unset(point, set);

/** Returns a boolean asserting whether an point is present with the given value in the Set object or not */
export const has = (set: PointSet, point: Point): boolean =>
  PointMap.has(point, set);

/** Returns the number of points in a PointSet object */
export const size = (set: PointSet) => PointMap.size(set);

/** Applies a function against an accumulator and each point in the set (from left to right) to reduce it to a single value */
export function reduce<T>(
  func: (T, Point) => T,
  set: PointSet,
  initialValue: T
): T {
  return PointMap.reduce(
    (acc, _, point) => func(acc, point),
    set,
    initialValue
  );
}

/** Creates a new set with the results of calling a provided function on every point in the calling set */
export function map(func: Point => Point, set: PointSet): PointSet {
  return reduce((acc, point) => add(acc, func(point)), set, from([]));
}

export function filter(func: Point => boolean, set: PointSet): PointSet {
  return reduce(
    (acc, point) => {
      if (func(point)) {
        return add(acc, point);
      }
      return acc;
    },
    set,
    from([])
  );
}

const minKey = (object: { [key: number]: any }) =>
  Math.min(...Object.keys(object));

export function min(set: PointSet): Point {
  const row = minKey(set);
  return { row, column: minKey(set[row]) };
}

export function from(points: Point[]): PointSet {
  return points.reduce(add, {});
}

export function isEmpty(set: PointSet): boolean {
  return Object.keys(set).length === 0;
}

export function toArray(set: PointSet): Point[] {
  return flatMap(
    Object.entries(set),
    ([row, columns]: [string, { [key: string]: boolean }]) =>
      Object.keys(columns).map(column => ({
        row: Number(row),
        column: Number(column)
      }))
  );
}

/** @todo refactor to return Matrix.Matrix<T> */
export function toMatrix<T>(
  set: PointSet,
  data: Matrix.Matrix<T>
): Matrix.Matrix<Descriptor<T>> {
  return reduce(
    (acc, { row, column }) =>
      Matrix.set(
        row,
        column,
        { row, column, data: Matrix.get(row, column, data) },
        acc
      ),
    set,
    []
  );
}

type OnEdge = {|
  left: boolean,
  right: boolean,
  top: boolean,
  bottom: boolean
|};

const NO_EDGE: OnEdge = {
  left: false,
  right: false,
  top: false,
  bottom: false
};

export function onEdge(set: PointSet, point: Point): OnEdge {
  if (!has(set, point)) {
    return NO_EDGE;
  }

  let hasNot = (rowDelta, columnDelta) =>
    !has(set, {
      row: point.row + rowDelta,
      column: point.column + columnDelta
    });

  return {
    left: hasNot(0, -1),
    right: hasNot(0, 1),
    top: hasNot(-1, 0),
    bottom: hasNot(1, 0)
  };
}

export function getEdgeValue(
  set: PointSet,
  field: $Keys<Point>,
  delta: number
): number {
  const compare = Math.sign(delta) === -1 ? Math.min : Math.max;
  return reduce(
    (acc, point) => {
      if (acc === null) {
        return point[field];
      }
      return compare(acc, point[field]);
    },
    set,
    null
  );
}

export function extendEdge(
  set: PointSet,
  field: $Keys<Point>,
  delta: number
): PointSet {
  const oppositeField = field === "row" ? "column" : "row";
  const edgeValue = getEdgeValue(set, field, delta);
  return reduce(
    (acc, point) => {
      if (point[field] === edgeValue) {
        return add(acc, {
          [field]: edgeValue + delta,
          [oppositeField]: point[oppositeField]
        });
      }
      return acc;
    },
    set,
    set
  );
}

export function shrinkEdge(
  set: PointSet,
  field: $Keys<Point>,
  delta: number
): PointSet {
  const edgeValue = getEdgeValue(set, field, delta);
  return reduce(
    (acc, point) => {
      if (point[field] === edgeValue) {
        return remove(acc, point);
      }
      return acc;
    },
    set,
    set
  );
}
