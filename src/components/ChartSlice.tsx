import _ from "lodash";
// import { utils } from "xlsx"
import moment, { Moment } from "moment"
import numeral from "numeral"
import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import type { CustomerId, Operation, SpanOptions, SpanData, InvoceRowType } from "./../types"
import type { PayloadAction } from '@reduxjs/toolkit'

const SPAN_GENERATORS: {[key in SpanOptions]: (arg1: Moment) => string} = {
  'day': (last: Moment) => last.add(1, 'day').endOf('day').utc().format(),
  'week': (last: Moment) => last.add(1, 'week').endOf('isoWeek').utc().format(),
  'month': (last: Moment) => last.add(1, 'month').endOf('month').utc().format(),
  'quarter': (last: Moment) => last.add(1, 'quarter').endOf('quarter').utc().format(),
};

export interface ChartState {
  timespan: SpanOptions,
  invoices: InvoceRowType[],
  operations: Operation[],
  customer?: CustomerId
  spans: SpanData[],
  maxCreditLine: number
}

const initialState: ChartState = {
  timespan: "month",
  invoices: [],
  operations: [],
  spans: [],
  customer: undefined,
  maxCreditLine: 50000
}

export const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    selectCustomer: (state, action: PayloadAction<CustomerId>) => {
      state.customer = action.payload;
    },
    generateChart: (state, action: PayloadAction<InvoceRowType[]>) => {
      state.invoices = action.payload
      state.operations = _.chain(action.payload)
        .reduce((curr: Operation[], invoice: InvoceRowType) => {
          const {customerName, customerNumber, invoiceNumber, invoiceAmount: amount, invoiceDate, invoicePaymentDate} = invoice;
          curr.push({
            customerName,
            customerNumber,
            invoiceNumber,
            amount,
            date: moment(invoiceDate).utc().format()
          });
          if (invoicePaymentDate)
            curr.push({
              customerName,
              customerNumber,
              invoiceNumber,
              amount: String(numeral(0).subtract(amount).value()),
              date: moment(invoicePaymentDate).utc().format(),
            });
          return curr;
        }, [] as Operation[])
        .value();
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(generateChart, selectCustomer), (state) => {
      const rows = _.filter(state.operations, invoice => invoice.customerNumber === state.customer?.id);
      const end = _.maxBy(rows, 'date')
      const start = _.minBy(rows, 'date')
      const momentStart = moment(start?.date);
      const momentEnd = moment(end?.date)
      const span = state.timespan
      const _spanGenerator = SPAN_GENERATORS[span];
      if (!_spanGenerator)
        return ;

      const nextDate = (output: string[]): string[] => {
        const last = moment(_.last(output));
        if (last.isAfter(momentEnd))
          return output
        output.push(_spanGenerator(last))
        return nextDate(output);
      }
      const timespans = nextDate([momentStart.utc().endOf(span).format()]);

      const data = _.map(timespans, (spanDate) => {
        const span = moment(spanDate);
        // beause of the isAfter part it applies operators to each month
        return _.filter(rows, (op) => span.isAfter(moment(op.date)))
          .reduce((data, op) => {
            data.credit = String(numeral(data.credit).add(op.amount).value());
            return data
          }, {
            timedate: span.format(),
            credit: "0",
            creditLine: state.maxCreditLine
          } as SpanData)
      });

      state.spans = data
    })
  }
})

// Action creators are generated for each case reducer function
export const {
  generateChart,
  selectCustomer
} = chartSlice.actions

export default chartSlice.reducer
