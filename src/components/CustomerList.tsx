import _ from "lodash";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useAppDispatch, useAppSelector } from "./../reducers";
import { selectCustomer } from "./FileSlice";
import InvoiceIndicator from "./InvoiceIndicator"


const CustomerList = () => {
  const dispatch = useAppDispatch();
  // const worksheetJSON = useAppSelector(state => state.file.worksheetJSON)
  const customer = useAppSelector(state => state.file.customer);
  const customers = useAppSelector(state  => state.file.uxCustomers);
  // const { nameColumn, idColumn } = useAppSelector(state  => ({
  //   nameColumn: state.file.columnMap['customerName'],
  //   idColumn: state.file.columnMap['customerNumber']
  // }));

  // const customers = _(worksheetJSON).map(item => ({
  //   name: item[nameColumn],
  //   id: item[idColumn]
  // })).filter(item => !!item.id).uniqBy('id').value()

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
