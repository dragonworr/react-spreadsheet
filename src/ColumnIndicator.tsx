import * as React from "react";
import { columnIndexToLabel } from "hot-formula-parser";
import * as Types from "./types";

const ColumnIndicator: Types.ColumnIndicatorComponent = ({ column, label }) => (
  <th className="Spreadsheet__header">
    {label !== undefined ? label : columnIndexToLabel(String(column))}
  </th>
);

export default ColumnIndicator;
