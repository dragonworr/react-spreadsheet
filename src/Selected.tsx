import React from "react";
import { connect } from "unistore/react";
import * as Types from "./types";
import * as PointSet from "./point-set";
import FloatingRect, { Props, mapStateToProps } from "./FloatingRect";

const Selected = (props: Props) => (
  <FloatingRect {...props} variant="selected" />
);

export default connect(
  (state: Types.StoreState<any>): Partial<Props> => {
    const cells = state.selected;
    const nextState = mapStateToProps(cells)(state);
    return {
      ...nextState,
      hidden: nextState.hidden || PointSet.size(cells) === 1,
      dragging: state.dragging,
    };
  }
)(Selected);
