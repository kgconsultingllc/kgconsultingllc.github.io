import _ from "lodash";
import { utils } from "xlsx"
import type { WorkBook } from "xlsx"
import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const DEFAULT_COLUMN_MAP = {
  "invoiceNumber": 'Invocoice number',
  'customerNumber': "Customer number",
  'customerName': "Customer name",
  'invoiceDate': "Date of invoice",
  'invoiceAmount': "Invoiced amount (EUR)",
  'customerPaymentTerms': "Payment terms (days)",
  'customerMaxCreditLine': "Max Credit line",
  'invoicePaymentDate': "Date of Payment",
}
type CustomerId = {
  name: string;
  id: string;
}

export interface FileState {
  filename: string;
  wb?: WorkBook;
  worksheet: string;
  worksheetJSON: {[key: string]: any}[];
  columnMap: {[key: string]: string}
  customer?: CustomerId
  uxCustomers: CustomerId[]
  valid: boolean
}

const initialState: FileState = {
  filename: "",
  wb: undefined,
  worksheet: "",
  worksheetJSON: [],
  columnMap: DEFAULT_COLUMN_MAP,
  customer: undefined,
  uxCustomers: [],
  valid: false
}

export const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    uploadWorkbook: (state, action: PayloadAction<WorkBook>) => {
      state.wb = action.payload
      state.worksheet = action.payload.SheetNames[0]
    },
    selectCustomer: (state, action: PayloadAction<CustomerId>) => {
      state.customer = action.payload
    },
    selectSheetName: (state, action: PayloadAction<string>) => {
      state.worksheet = action.payload
      state.columnMap = initialState.columnMap
      state.customer = initialState.customer
    },
    updateColumnMap: (state, action: PayloadAction<{key: string, value:string}>) => {
      const {key, value} = action.payload;
      state.columnMap[key] = value;

    },
    reset: () => {
      return initialState
    },
    generateChart: () => {
      console.log('generate chart');
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(selectSheetName, uploadWorkbook), (state) => {
      const wb = state.wb;
      if (wb)
        state.worksheetJSON = utils.sheet_to_json(wb.Sheets[state.worksheet])
      // TODO: abstract this into a seprate fle
      if (!state.worksheetJSON.length)
        return ;
      const nameColumn= state.columnMap['customerName'];
      const idColumn= state.columnMap['customerNumber'];
      const customers = _(state.worksheetJSON).map(item => ({
        name: item[nameColumn],
        id: item[idColumn]
      })).filter(item => !!item.id).uniqBy('id').value()
      state.uxCustomers = customers;
      state.customer = customers[0]
    })
  }
})

// Action creators are generated for each case reducer function
export const {
  reset,
  uploadWorkbook,
  selectSheetName,
  updateColumnMap,
  selectCustomer,
  generateChart
} = fileSlice.actions

export default fileSlice.reducer
