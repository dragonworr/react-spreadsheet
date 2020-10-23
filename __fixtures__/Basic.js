import { createFixture } from "react-cosmos";
import Spreadsheet, {
  createEmptyMatrix,
} from "../src/SpreadsheetStateProvider";
import "./index.css";

export const INITIAL_ROWS = 6;
export const INITIAL_COLUMNS = 4;

Spreadsheet.displayName = "Spreadsheet";

export default createFixture({
  component: Spreadsheet,
  name: "Basic",
  props: {
    data: createEmptyMatrix(INITIAL_ROWS, INITIAL_COLUMNS),
  },
});
