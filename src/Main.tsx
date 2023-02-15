import _ from "lodash";
import { useState } from "react"
import {Card, CardContent, Button, Typography} from "@mui/material"
import { utils, read } from "xlsx"
import CustomerList from "./CustomerList"
import type { ChangeEvent } from "react"
import type { WorkBook } from "xlsx"
import type { InvoceRowType } from "./types"

const readWorkbook = (wb: WorkBook): InvoceRowType[] => {
  const sheet = wb.Sheets['Data Input'];
  const rows = utils.sheet_to_json(sheet)
  // const rows = _.filter(sheetJson, (item: any) => item['Customer number'] == CUSTOMER_NUMBER);
  return rows as InvoceRowType[];
}

function Main() {
  const [name, setName] = useState<string>();
  const [customer, setCustomer] = useState<string>("");
  const [workbook, setWorkBook] = useState<WorkBook>();

  const handleChange = async (ev: ChangeEvent<HTMLInputElement>) => {
    const files = ev.target?.files
    if (!files?.length) //no files are found
      return ;
    const file = files[0]
    setName(file.name);
    const buffer = await file.arrayBuffer();
    const wb = read(buffer, {cellDates: true})
    setWorkBook(wb)
  }
  console.log(workbook);
  let customers = []
  if (workbook) {
    // TOOD hanld shits
    const sheet = workbook.Sheets['Data Input'];
    const sheetJson = utils.sheet_to_json(sheet)
    customers = _(sheetJson).map('Customer number').uniq().value()
  }
  console.log('customers', customers);

  return (
    <Card>
      <CardContent>
        <Button variant="outlined" component="label">
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
        <Typography>{name}</Typography>
        <CustomerList
            value={customer}
            customers={customers}
            handleChange={(ev) => setCustomer(ev.target.value)}/>
      </CardContent>
    </Card>
  );
}

export default Main;
