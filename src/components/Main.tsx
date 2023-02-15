import _ from "lodash";
import moment from "moment";
import { read, utils } from "xlsx"
import { useState } from "react"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Card, CardContent, CardActions, Button, IconButton, Typography} from "@mui/material"
import ClearIcon from '@mui/icons-material/Clear';
import CustomerList from "./CustomerList"
import SheetSelect from "./SheetSelect"
import ColumnMap from "./ColumnMap"
import Chart from "./Chart"
import { useAppDispatch, useAppSelector } from "./../reducers";
import { uploadWorkbook, reset } from "./FileSlice";
import { generateChart } from "./ChartSlice";
import type { ChangeEvent } from "react"

function Main() {
  const dispatch = useAppDispatch();
  const workbook = useAppSelector(state => state.file.wb);
  const valid = useAppSelector(state => state.file.valid);
  const invoices = useAppSelector(state => state.file.invoices);
  const show = useAppSelector(state => state.chart.spans.length > 0);

  const [name, setName] = useState<string>();
  const handleChange = async (ev: ChangeEvent<HTMLInputElement>) => {
    const files = ev.target?.files
    if (!files?.length) //no files are found
      return ;
    const file = files[0]
    setName(file.name);

    const buffer = await file.arrayBuffer();
    const wb = read(buffer, { cellDates: true })

    const kurec = _.mapValues(wb.Sheets, sheet => {
      const data = utils.sheet_to_json(sheet, { header: 1, blankrows: false })
      const headers = _.first(data) as string[];
      const rows = _.drop(data, 1)

      return rows.map((row: any) => {
        row = row.map((value: string) => {
          if(_.isDate(value))
            return moment(value).format()
          return value
        });
        return _.zipObject(headers, row);
      })
    });

    dispatch(uploadWorkbook(kurec))
  }
  console.log(show, workbook);

  return (
    <Card>
      <CardContent sx={{minHeight: '420px', gap: 1, display: 'flex', flexDirection: 'column'}}>
        {
          show ? (
            <>
              <CustomerList />
              <Chart />
            </>
          ) : name ?
          (
            <>
              <Box display="flex" flexDirection={'row'} justifyContent="space-between" alignItems={'center'}>
                <Typography variant="h5">{name}</Typography>
                <IconButton title="Clear File" onClick={() => {
                  dispatch(reset())
                  setName("")
                }}>
                  <ClearIcon />
                </IconButton>
              </Box>
              <SheetSelect />
              <ColumnMap />
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
              >
                Upload file
                <input
                  hidden
                  type="file"
                  onChange={handleChange}
                  defaultValue=""
                  autoFocus={true}
                  multiple={false}
                  accept={".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"}
                />
              </Button>
            </>
          )
        }
      </CardContent>
      <CardActions>
        { valid &&
          <Button onClick={() => dispatch(generateChart(invoices))}>Charts</Button>
        }
      </CardActions>
    </Card>
  );
}

export default Main;
