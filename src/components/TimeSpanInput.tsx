import { MouseEvent } from "react";
import { selectTimestamp } from "./ChartSlice";
import { SpanOptions } from "./../types";
import { useAppDispatch, useAppSelector } from "./../reducers";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function ColorToggleButton() {
  const dispatch = useAppDispatch();
  const timespan = useAppSelector(state => state.chart.timespan);

  const handleChange = (
    _: MouseEvent<HTMLElement>,
    newAlignment: SpanOptions,
  ) => {
    dispatch(selectTimestamp(newAlignment));
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={timespan}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
    >
      <ToggleButton value="day">Day</ToggleButton>
      <ToggleButton value="week">Week</ToggleButton>
      <ToggleButton value="month">Month</ToggleButton>
      <ToggleButton value="quarter">Quarter</ToggleButton>
    </ToggleButtonGroup>
  );
}
