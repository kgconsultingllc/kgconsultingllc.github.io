import { useCallback } from "react";
import _ from "lodash";
import moment from "moment";
import { read, utils } from "xlsx"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {useDropzone} from 'react-dropzone'
// import { Box, Button } from "@mui/material"
import { Box } from "@mui/material"
import { useAppDispatch } from "./../reducers";
import { uploadWorkbook, setFileName } from "./FileSlice";

function Main() {
  const dispatch = useAppDispatch();

  const _formatFiles = useCallback((buffer: ArrayBuffer) => {
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
  }, [dispatch])

  const onDrop = useCallback((acceptedFiles: any) => {
    acceptedFiles.forEach((file: any) => {

      dispatch(setFileName(file.name))
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result
        // @ts-ignore
        _formatFiles(binaryStr)
      }
      reader.readAsArrayBuffer(file)
    })
  }, [_formatFiles, dispatch])

  const {getRootProps, getInputProps } = useDropzone({
    onDrop: onDrop,
    multiple: false,
    autoFocus: true,
    accept: { 'application/vnd.ms-excel': ['.xlsx', '.xls', '.xlsb'] }
  })

  /*
  const handleChange = async (ev: ChangeEvent<HTMLInputElement>) => {
    const files = ev.target?.files
    if (!files?.length) //no files are found
      return ;
    const file = files[0]
    dispatch(setFileName(file.name))

    const buffer = await file.arrayBuffer();
    _formatFiles(buffer);
  }
  */

  return (
    <>
      <Box {...getRootProps()} textAlign="center">
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{height: '126px', width:'126px'}} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </Box>
    {/*
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
      */}
    </>
  );
}

export default Main;
