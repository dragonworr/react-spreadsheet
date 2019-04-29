import React from "react";
import { createFixture } from "react-cosmos";

import Spreadsheet from "../src/SpreadsheetStateProvider";
import { range } from "../src/util";
import "./index.css";

export const INITIAL_ROWS = 6;

const columnLabels = ["Name", "Age", "Email", "Address"];
const initialData = range(INITIAL_ROWS).map(() => Array(columnLabels.length));

Spreadsheet.displayName = "Spreadsheet";

export default createFixture({
  component: Spreadsheet,
  props: {
    data: initialData,
    columnLabels
  }
});
