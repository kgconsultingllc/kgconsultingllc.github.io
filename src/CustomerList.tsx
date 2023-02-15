import type { FC } from "react"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const CustomerList: FC<{value: string, customers: string[], handleChange: (ev: SelectChangeEvent<any>) => void}> = ({value, customers, handleChange}) => {
  return (
      <FormControl fullWidth>
        <InputLabel id="customer-select">Customer List</InputLabel>
          <Select
            labelId="customer-select"
            value={value}
            label="Customers"
            onChange={handleChange}
          >
          {customers.map((customer: string) =>
            <MenuItem id={customer} key={customer} value={customer}>{customer}</MenuItem>
          )}
        </Select>
      </FormControl>
  );
}
export default CustomerList;
