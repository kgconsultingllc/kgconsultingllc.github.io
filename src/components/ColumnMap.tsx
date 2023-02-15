import _ from "lodash"
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import { useAppDispatch, useAppSelector } from "./../reducers";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { updateColumnMap } from './FileSlice';

const LABELS: {[key: string]: string} = {
  "invoiceNumber": 'Invocoice number',
  'customerNumber': "Customer number",
  'customerName': "Customer name",
  'invoiceDate': "Date on which the invoice was issued",
  'invoiceAmount': "Invoiced amount",
  'customerPaymentTerms': "Payment terms (days)",
  'customerMaxCreditLine': "Customers Max Credit line",
  'invoicePaymentDate': "The day on which the invoice was paid",
}

export default function ColumnMap() {
  const dispatch = useAppDispatch()
  const map = useAppSelector(state => state.file.columnMap);
  const sheetColumns = useAppSelector(state => {
    const json = _.first(state.file.worksheetJSON) || {};
    return _.keys(json);
  });

  const handleChange = (event: SelectChangeEvent) => {
    const key = event.target.name
    const value = event.target.value
    dispatch(updateColumnMap({key, value}))
  };

  return (
    <Box gap={2} display="flex" flexDirection={'column'} p={2} >
    {_.map(map, ((value: string, key: string) => {
      return (
        <Box display={'flex'} key={key} justifyContent="space-between">
          <Box>
            <Typography
              id={`column-map-${key}`}
              sx={{minWidth: "120px"}}
            >
              {key}
            </Typography>
            <Typography
              variant="caption"
              color="grey"
            >
              {LABELS[key] || ""}
            </Typography>
          </Box>
          <Select
            required
            sx={{minWidth: "320px"}}
            labelId={`column-map-${key}`}
            id={`column-map-id-${key}`}
            name={key}
            value={sheetColumns.includes(value) ? value : ''}
            onChange={handleChange}
          >
            {sheetColumns.map((value: string) =>
              <MenuItem key={value} value={value}>{value}</MenuItem>)
            }
          </Select>
        </Box>
    )}))
    }
    </Box>
  );
}
