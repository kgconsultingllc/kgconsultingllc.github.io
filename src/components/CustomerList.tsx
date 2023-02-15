import _ from "lodash";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useAppDispatch, useAppSelector } from "./../reducers";
// import { selectCustomer } from "./FileSlice";
import { selectCustomer } from "./ChartSlice";
import InvoiceIndicator from "./InvoiceIndicator"


const CustomerList = () => {
  const dispatch = useAppDispatch();
  const customer = useAppSelector(state => state.chart.customer);
  const customers = useAppSelector(state  => state.file.uxCustomers);

  if (!customers.length)
    return <></>

  return (
    <>
      <Autocomplete
        disablePortal
        options={customers}
        getOptionLabel={item => item.name}
        value={customer}
        onChange={(_, value) => value && dispatch(selectCustomer(value))}
        isOptionEqualToValue={(op, val) => op.id === val.id}
        renderInput={(params) => <TextField {...params} label="Customers List" />}
      />
      <InvoiceIndicator />
    </>
  );
}

export default CustomerList;
