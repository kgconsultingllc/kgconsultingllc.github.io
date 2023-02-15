import _ from "lodash"
import Typography from '@mui/material/Typography';
import {  useAppSelector } from "./../reducers";

export default function InvoiceIndicator() {
  const customer = useAppSelector(state => state.chart.customer);
  const invoiceColumnMap = useAppSelector(state => state.file.columnMap['invoiceNumber']);
  const customerNumberMap = useAppSelector(state => state.file.columnMap['customerNumber']);
  const json = useAppSelector(state => state.file.worksheetJSON);

  if (!customer)
    return <></>

  const invoices = _(json)
    .filter(item => item[customerNumberMap] === customer.id)
    .uniqBy(invoiceColumnMap)
    .value()

  return (
    <Typography>
      {`${invoices.length} invoices found`}
    </Typography>
  );
}
