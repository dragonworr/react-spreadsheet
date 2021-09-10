/**
 * @jest-environment jsdom
 */

import React from "react";
import { render } from "@testing-library/react";
import { Cell } from "./Cell";
import { Parser as FormulaParser } from "hot-formula-parser";
import * as Types from "./types";
import { getOffsetRect } from "./util";

const MOCK_DATA_VIEWER = jest.fn(() => null);
const MOCK_FORMULA_PARSER = {} as FormulaParser;
const MOCK_SELECT = jest.fn();
const MOCK_ACTIVATE = jest.fn();
const MOCK_SET_CELL_DIMENSIONS = jest.fn();
const EXAMPLE_ROW = 0;
const EXAMPLE_COLUMN = 0;
const EXAMPLE_PROPS: Types.CellComponentProps = {
  row: EXAMPLE_ROW,
  column: EXAMPLE_COLUMN,
  DataViewer: MOCK_DATA_VIEWER,
  formulaParser: MOCK_FORMULA_PARSER,
  selected: false,
  active: false,
  copied: false,
  dragging: false,
  mode: "view",
  data: { value: null },
  select: MOCK_SELECT,
  activate: MOCK_ACTIVATE,
  setCellDimensions: MOCK_SET_CELL_DIMENSIONS,
};
const EXAMPLE_DATA_VIEWER_PROPS: Types.DataViewerProps = {
  row: EXAMPLE_ROW,
  column: EXAMPLE_COLUMN,
  cell: EXAMPLE_PROPS.data,
  formulaParser: MOCK_FORMULA_PARSER,
};
const EXAMPLE_READ_ONLY_DATA: Types.CellBase = { value: null, readOnly: true };
const EXAMPLE_DATA_WITH_CLASS_NAME: Types.CellBase = {
  value: null,
  className: "example",
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("<Cell />", () => {
  test("renders", () => {
    render(<Cell {...EXAMPLE_PROPS} />);
    const element = document.querySelector(".Spreadsheet__cell");
    expect(element).not.toBeNull();
    expect(MOCK_DATA_VIEWER).toBeCalledTimes(1);
    expect(MOCK_DATA_VIEWER).toBeCalledWith(EXAMPLE_DATA_VIEWER_PROPS, {});
  });
  test("renders read only", () => {
    render(<Cell {...EXAMPLE_PROPS} data={EXAMPLE_READ_ONLY_DATA} />);
    const element = document.querySelector(
      ".Spreadsheet__cell.Spreadsheet__cell--readonly"
    );
    expect(element).not.toBeNull();
    expect(MOCK_DATA_VIEWER).toBeCalledTimes(1);
    expect(MOCK_DATA_VIEWER).toBeCalledWith(
      { ...EXAMPLE_DATA_VIEWER_PROPS, cell: EXAMPLE_READ_ONLY_DATA },
      {}
    );
  });
  test("renders with given class name", () => {
    render(<Cell {...EXAMPLE_PROPS} data={EXAMPLE_DATA_WITH_CLASS_NAME} />);
    const element = document.querySelector(
      `.Spreadsheet__cell.${EXAMPLE_DATA_WITH_CLASS_NAME.className}`
    );
    expect(element).not.toBeNull();
    expect(MOCK_DATA_VIEWER).toBeCalledTimes(1);
    expect(MOCK_DATA_VIEWER).toBeCalledWith(
      { ...EXAMPLE_DATA_VIEWER_PROPS, cell: EXAMPLE_DATA_WITH_CLASS_NAME },
      {}
    );
  });
  test("renders selected", () => {
    render(<Cell {...EXAMPLE_PROPS} selected />);
    const element = document.querySelector<HTMLElement>(".Spreadsheet__cell");
    expect(element).not.toBeNull();
    if (!element) {
      throw new Error("element must be defined");
    }
    expect(MOCK_SET_CELL_DIMENSIONS).toBeCalledTimes(1);
    expect(MOCK_SET_CELL_DIMENSIONS).toBeCalledWith(
      { row: EXAMPLE_ROW, column: EXAMPLE_COLUMN },
      getOffsetRect(element)
    );
  });
  test("renders active", () => {
    render(<Cell {...EXAMPLE_PROPS} active />);
    const element = document.querySelector<HTMLElement>(".Spreadsheet__cell");
    expect(element).not.toBeNull();
    if (!element) {
      throw new Error("element must be defined");
    }
    expect(document.activeElement === element);
  });
});
