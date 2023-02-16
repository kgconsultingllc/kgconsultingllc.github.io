import { Box, Card, CardContent, CardActions, Button, IconButton, Typography} from "@mui/material"
import ClearIcon from '@mui/icons-material/Clear';
import CustomerList from "./CustomerList"
import SheetSelect from "./SheetSelect"
import ColumnMap from "./ColumnMap"
import Chart from "./Chart"
import UploadField from "./UploadField"
import TimeSpanInput from "./TimeSpanInput"
import { useAppDispatch, useAppSelector } from "./../reducers";
import { reset } from "./FileSlice";
import { generateChart } from "./ChartSlice";

function Main() {
  const dispatch = useAppDispatch();
  const name = useAppSelector(state => state.file.filename);
  const valid = useAppSelector(state => state.file.valid);
  const invoices = useAppSelector(state => state.file.invoices);
  const show = useAppSelector(state => state.chart.spans.length > 0);

  return (
    <Card>
      <CardContent sx={{gap: 1, display: 'flex', flexDirection: 'column'}}>
        {
          show ? (
            <>
              <CustomerList />
              <TimeSpanInput />
              <Chart />
            </>
          ) : name ?
          (
            <>
              <Box display="flex" flexDirection={'row'} justifyContent="space-between" alignItems={'center'}>
                <Typography variant="h5">{name}</Typography>
                <IconButton title="Clear File" onClick={() => dispatch(reset())}>
                  <ClearIcon />
                </IconButton>
              </Box>
              <SheetSelect />
              <ColumnMap />
              <CardActions>
                { valid &&
                  <Button onClick={() => dispatch(generateChart(invoices))}>Charts</Button>
                }
              </CardActions>
            </>
          ) : (
            <UploadField />
          )
        }
      </CardContent>
    </Card>
  );
}

export default Main;
