import * as Types from "./types";
import * as Matrix from "./matrix";
import { Parser as FormulaParser } from "hot-formula-parser";
import * as PointRange from "./point-range";

export const moveCursorToEnd = (el: HTMLInputElement): void => {
  el.selectionStart = el.selectionEnd = el.value.length;
};

/**
 * Creates an array of numbers (positive and/or negative) progressing from start up to, but not including, end. A step of -1 is used if a negative start is specified without an end or step. If end is not specified, it's set to start with start then set to 0.
 * @param end
 * @param start
 * @param step
 */
export function range(end: number, start = 0, step = 1): number[] {
  const array = [];
  if (Math.sign(end - start) === -1) {
    for (let element = start; element > end; element -= step) {
      array.push(element);
    }
    return array;
  }
  for (let element = start; element < end; element += step) {
    array.push(element);
  }
  return array;
}

export function updateData<Cell>(
  data: Matrix.Matrix<Cell>,
  cellDescriptor: Types.CellDescriptor<Cell>
): Matrix.Matrix<Cell> {
  const row = data[cellDescriptor.row];
  const nextData = [...data];
  const nextRow = row ? [...row] : [];
  nextRow[cellDescriptor.column] = cellDescriptor.data;
  nextData[cellDescriptor.row] = nextRow;

  return nextData;
}

export function isActive(
  active: Types.StoreState["active"],
  { row, column }: Types.Point
): boolean {
  return Boolean(active && column === active.column && row === active.row);
}

export const getOffsetRect = (element: HTMLElement): Types.Dimensions => ({
  width: element.offsetWidth,
  height: element.offsetHeight,
  left: element.offsetLeft,
  top: element.offsetTop,
});

export const writeTextToClipboard = (
  event: ClipboardEvent,
  data: string
): void => {
  if (event.clipboardData) {
    event.clipboardData.setData("text/plain", data);
  }
};

export const readTextFromClipboard = (event: ClipboardEvent): string => {
  // @ts-ignore
  if (window.clipboardData && window.clipboardData.getData) {
    // @ts-ignore
    return window.clipboardData.getData("Text");
  }
  if (event.clipboardData && event.clipboardData.getData) {
    return event.clipboardData.getData("text/plain");
  }
  return "";
};

export function createEmptyMatrix<T>(
  rows: number,
  columns: number
): Matrix.Matrix<T> {
  return range(rows).map(() => Array(columns));
}

export const getCellDimensions = (
  point: Types.Point,
  state: Types.StoreState
): Types.Dimensions | null => {
  const rowDimensions = state.rowDimensions[point.row];
  const columnDimensions = state.columnDimensions[point.column];
  return (
    rowDimensions &&
    columnDimensions && { ...rowDimensions, ...columnDimensions }
  );
};

/** Get the dimensions of a range of cells */
export function getRangeDimensions(
  state: Types.StoreState,
  range: PointRange.PointRange
): Types.Dimensions | null {
  const startDimensions = getCellDimensions(range.start, state);
  const endDimensions = getCellDimensions(range.end, state);
  if (!startDimensions || !endDimensions) {
    return null;
  }
  return {
    width: endDimensions.left + endDimensions.width - startDimensions.left,
    height: endDimensions.top + endDimensions.height - startDimensions.top,
    top: startDimensions.top,
    left: startDimensions.left,
  };
}

export function getComputedValue<Cell extends Types.CellBase<Value>, Value>({
  cell,
  formulaParser,
}: {
  cell: Cell | undefined;
  formulaParser: FormulaParser;
}): Value | string | number | boolean | null {
  if (cell === undefined) {
    return null;
  }
  const rawValue = cell.value;
  if (typeof rawValue === "string" && rawValue.startsWith("=")) {
    const { result, error } = formulaParser.parse(rawValue.slice(1));
    return error || result;
  }
  return rawValue;
}

export function normalizeSelected(
  selected: PointRange.PointRange | null,
  data: Matrix.Matrix<unknown>
): PointRange.PointRange | null {
  const dataSize = Matrix.getSize(data);
  const dataRange = PointRange.create(
    { row: 0, column: 0 },
    { row: dataSize.rows - 1, column: dataSize.columns - 1 }
  );
  return selected && PointRange.mask(selected, dataRange);
}

export function getSelectedCSV(
  selected: PointRange.PointRange | null,
  data: Matrix.Matrix<Types.CellBase>
): string {
  if (!selected) {
    return "";
  }
  const slicedMatrix = Matrix.slice(selected.start, selected.end, data);
  const valueMatrix = Matrix.map((cell) => cell?.value || "", slicedMatrix);
  return Matrix.join(valueMatrix);
}
