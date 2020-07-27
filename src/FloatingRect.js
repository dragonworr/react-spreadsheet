// @flow

import React from "react";
import * as PointMap from "./point-map";
import * as PointSet from "./point-set";
import * as Types from "./types";
import classnames from "classnames";
import { getCellDimensions } from "./util";

type Props = {
  ...Types.Dimensions,
  className: string,
  dragging: ?boolean,
  hidden: boolean,
  variant: 'copied' | 'selected'
};

const FloatingRect = ({
  width,
  height,
  top,
  left,
  className,
  dragging,
  hidden,
  variant
}: Props) => (
  <div
    className={classnames("Spreadsheet__floating-rect", {
      [`Spreadsheet__floating-rect--${variant}`]: variant,
      "Spreadsheet__floating-rect--dragging": dragging,
      "Spreadsheet__floating-rect--hidden": hidden,
    })}
    style={{ width, height, top, left }}
  />
);

const getRangeDimensions = (
  points: PointSet.PointSet,
  state: Types.StoreState<*>
): Types.Dimensions => {
  const { width, height, left, top } = PointSet.reduce(
    (acc, point) => {
      const isOnEdge = PointSet.onEdge(points, point);
      const dimensions = getCellDimensions(point, state);
      if (dimensions) {
        acc.width = isOnEdge.top ? acc.width + dimensions.width : acc.width;
        acc.height = isOnEdge.left
          ? acc.height + dimensions.height
          : acc.height;
        acc.left = isOnEdge.left && isOnEdge.top ? dimensions.left : acc.left;
        acc.top = isOnEdge.left && isOnEdge.top ? dimensions.top : acc.top;
      }
      return acc;
    },
    points,
    { left: 0, top: 0, width: 0, height: 0 }
  );
  return { left, top, width, height };
};

export const mapStateToProps = (cells: PointSet.PointSet) => (
  state: Types.StoreState<*>
) => {
  return {
    ...getRangeDimensions(cells, state),
    hidden: PointSet.size(cells) === 0
  };
};

export default FloatingRect;
