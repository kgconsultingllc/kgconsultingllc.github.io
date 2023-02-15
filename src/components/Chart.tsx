import _ from "lodash";
import moment from "moment";
import numeral from "numeral"
import { Chart }  from "react-chartjs-2";
import { Card} from "@mui/material"
import { useAppSelector } from "./../reducers";

const ChartPage = () => {
  const spans = useAppSelector(state => state.chart.spans)
  const labels =_(spans)
    .sortBy('timedate')
    .map(item => moment(item.timedate).format('MMM YYYY'))
    .value()

  const datasets = [{
    type: 'bar' as const,
    label: 'Turnover',
    data: _.map(spans, row => Number(row.credit))
  }, {
    type: 'line' as const,
    label: 'Exposed Credit line',
    // @ts-ignore
    data: _.map(spans, row => Math.max(Number(numeral(row.credit).subtract(row.creditLine).value()), 0))
  }, {
    type: 'line' as const,
    label: 'Credit line',
    data: _.map(spans, row => Number(row.creditLine))
  }]

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Chart Exposure',
      }
    }
  }
  const data = {
    labels,
    datasets
  }
  return (
    <Card sx={{backgroundColor: "#FFF"}}>
      <Chart type='bar' data={data} options={options} />
    </Card>
  )
}

export default ChartPage;
