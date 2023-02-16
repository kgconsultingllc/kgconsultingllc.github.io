import _ from "lodash";
import moment from "moment";
import numeral from "numeral"
import { Chart }  from "react-chartjs-2";
import { Card } from "@mui/material"
import { useAppSelector } from "./../reducers";

const ChartPage = () => {
  const spans = useAppSelector(state => state.chart.spans)
  const labels =_(spans)
    .sortBy('timedate')
    .map(item => moment(item.timedate).format('MMM YYYY'))
    .value()

  const datasets = [{
    type: 'line' as const,
    label: 'Exposed Credit line',
    borderColor: '#ff6361',
    backgroundColor: '#ff6361',
    // @ts-ignore
    data: _.map(spans, row => Math.max(Number(numeral(row.credit).subtract(row.creditLine).value()), 0))
  }, {
    type: 'line' as const,
    borderColor: '#ffa600',
    backgroundColor: "#ffa600",
    label: 'Credit line',
    data: _.map(spans, row => Number(row.creditLine))
  },{
    type: 'bar' as const,
    label: 'Turnover',
    backgroundColor: '#003f5c',
    data: _.map(spans, row => Number(row.credit))
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
