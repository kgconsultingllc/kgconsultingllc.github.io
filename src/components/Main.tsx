import { read } from "xlsx"
import { useState } from "react"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Card, CardContent, CardActions, Button, IconButton, Typography} from "@mui/material"
import ClearIcon from '@mui/icons-material/Clear';
import CustomerList from "./CustomerList"
import SheetSelect from "./SheetSelect"
import ColumnMap from "./ColumnMap"
import { useAppDispatch, useAppSelector } from "./../reducers";
import { uploadWorkbook, generateChart, reset } from "./FileSlice";
import type { ChangeEvent } from "react"

function Main() {
  const [name, setName] = useState<string>();
  const workbook = useAppSelector(state => state.file.wb);
  const valid = useAppSelector(state => state.file.valid);
  const dispatch = useAppDispatch();

  const handleChange = async (ev: ChangeEvent<HTMLInputElement>) => {
    const files = ev.target?.files
    if (!files?.length) //no files are found
      return ;
    const file = files[0]
    setName(file.name);
    const buffer = await file.arrayBuffer();
    const wb = read(buffer, {cellDates: true})
    dispatch(uploadWorkbook(wb))
  }
  console.log(workbook);

  return (
    <Card>
      <CardContent sx={{minHeight: '420px', gap: 1, display: 'flex', flexDirection: 'column'}}>
        {!name ?
          (
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
          ): (
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
              <CustomerList />
          </>
          )
        }
      </CardContent>
      <CardActions>
        { valid &&
          <Button onClick={() => dispatch(generateChart())}>Charts</Button>
        }
      </CardActions>
    </Card>
  );
}

export default Main;
