import _ from "lodash";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { selectSheetName } from './FileSlice';
import { useAppDispatch, useAppSelector } from "./../reducers";

const SheetSelect = () => {
  const dispatch = useAppDispatch();
  const value = useAppSelector(state => state.file.worksheet)
  const sheetNames = useAppSelector(state => _.keys(state.file.wb))
  return (
    <ToggleButtonGroup exclusive value={value} onChange={(_, value: string) => dispatch(selectSheetName(value))}>
      {
        sheetNames.map((name: string) =>
          <ToggleButton value={name} key={name}>
            {name}
          </ToggleButton>
        )
      }
    </ToggleButtonGroup>
  )
}

export default SheetSelect;
