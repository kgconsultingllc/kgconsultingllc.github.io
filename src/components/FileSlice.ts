import _ from "lodash";
// import moment from "moment";
import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { InvoceRowType } from '../types'

const DEFAULT_COLUMN_MAP = {
  "invoiceNumber": 'Invocoice number',
  'customerNumber': "Customer number",
  'customerName': "Customer name",
  'invoiceDate': "Date of invoice",
  'invoiceAmount': "Invoiced amount (EUR)",
  'customerPaymentTerms': "Payment terms (days)",
  'customerMaxCreditLine': "Max Credit line",
  'invoicePaymentDate': "Days of payment",
}
type CustomerId = {
  name: string;
  id: string;
}

type WorkBookSnapshot = {[key: string]: {[key: string]: any}[]}

export interface FileState {
  filename: string;
  wb: WorkBookSnapshot;
  worksheet: string;
  worksheetJSON: {[key: string]: any}[];
  columnMap: {[key: string]: string}
  customer?: CustomerId
  uxCustomers: CustomerId[]
  invoices: InvoceRowType[]
  valid: boolean
}

const initialState: FileState = {
  filename: "",
  wb: {},
  worksheet: "",
  worksheetJSON: [],
  columnMap: DEFAULT_COLUMN_MAP,
  customer: undefined,
  uxCustomers: [],
  invoices: [],
  valid: false
}

export const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    uploadWorkbook: (state, action: PayloadAction<WorkBookSnapshot>) => {
      state.wb = action.payload
      state.worksheet = _.first(_.keys(action.payload)) || "";
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
    builder
      .addMatcher(isAnyOf(selectSheetName, uploadWorkbook), (state) => {
        const wb = state.wb;
        if (wb) {
          // state.worksheetJSON = utils.sheet_to_json(wb.Sheets[state.worksheet])
          // @ts-ignore
          state.worksheetJSON = wb[state.worksheet] || {}
          const sample = state.worksheetJSON.at(0);
          if (sample) {
            const sheetColumns =_.keys(sample);
            state.columnMap = _.mapValues(
              state.columnMap,
              map => _.includes(sheetColumns, map) ? map : ""
            )
          }
        }

        // compute uxCustomers
        // TODO: abstract this into a seprate place
        if (!state.worksheetJSON.length)
          return ;
        const nameColumn= state.columnMap['customerName'];
        const idColumn= state.columnMap['customerNumber'];
        const customers = _(state.worksheetJSON)
          .map(item => ({
            name: item[nameColumn],
            id: item[idColumn]
          }))
          .filter(item => !!item.id)
          .uniqBy('id')
          .value()
        state.uxCustomers = customers;
        state.customer = customers[0]
      })
      .addMatcher(isAnyOf(selectSheetName, uploadWorkbook, selectCustomer, updateColumnMap), (state) => {
        if (!state.wb) {
          state.valid = false
          return ;
        }
        if (!state.uxCustomers.length) {
          state.valid = false
          return ;
        }
        if (!state.customer) {
          state.valid = false;
          return;
        }
        const hasEmpty = _(state.columnMap).values().filter(val => !Boolean(val)).value();
        if (hasEmpty.length){
          state.valid = false
          return;
        }
        // calculate invoices
        const PARSE_PARSE_MAP = _.invert(state.columnMap)
        const columnsToMap = _.keys(PARSE_PARSE_MAP);

        const invoices = _(state.worksheetJSON)
          .map(invoice => {
            return _(invoice)
            .pick(columnsToMap)
            .mapKeys((_, key) => PARSE_PARSE_MAP[key])
            .value()
          })
          .filter(invoice => invoice.customerNumber === state.customer?.id)
          // .map((invoice) => {
          //   const daysToPayment = moment(invoice.invoicePaymentDate).diff(moment(invoice.invoiceDate), 'days');
          //   invoice._invoiceOverdue = Math.max(0, daysToPayment - invoice.customerPaymentTerms)
          //   return invoice;
          // })
          .orderBy('invoiceDate')
          .value() as InvoceRowType[];

        state.invoices = invoices
        state.valid = true
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
