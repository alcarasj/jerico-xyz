import React, { FC, useState, useEffect, ChangeEvent } from 'react';
import { sendAPIRequest } from '../utils/Helpers';
import { EnqueueSnackbar } from '../utils/Types';
import { Theme } from '@mui/material/styles';
import { ResponsiveLine, Serie } from '@nivo/line';
import { withSnackbar } from 'notistack';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { MONTHS } from '../utils/Settings';
import { Card, CardContent, CardHeader, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, Grid, Input,
  DialogActions, Button, SelectChangeEvent, FormControl, InputLabel, Select, MenuItem, Typography, Slider } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

const MIN_INTERVALS = 7;
const MAX_INTERVALS = 24;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      paddingBottom: theme.spacing(5),
    },
    line: {
      height: 400,
      width: "100%",
    },
    timeIntervalForm: {
      marginTop: theme.spacing(5)
    },
    intervalsSlider: {
      marginTop: theme.spacing(5)
    }
  }),
);

enum TimeInterval {
  DAILY = "Daily",
  WEEKLY = "Weekly",
  MONTHLY = "Monthly",
  YEARLY = "Yearly"
}

interface TrafficDatapoint {
    readonly uniqueViews: number;
    readonly totalViews: number;
    readonly selfViews: number;
}

type TrafficDataRaw = Map<string, TrafficDatapoint>;

interface Props {
    readonly enqueueSnackbar: EnqueueSnackbar;
}

const SiteMetrics: FC<Props> = (props: Props): JSX.Element => {
  const classes = useStyles();
  const { enqueueSnackbar } = props;
  const [trafficData, setTrafficData] = useState<Serie[]>([]);
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const [timeInterval, setTimeInterval] = useState<TimeInterval>(TimeInterval.DAILY);
  const [intervals, setIntervals] = useState<number>(MIN_INTERVALS);

  useEffect(() => {
    getTrafficData();
  }, [timeInterval, intervals])

  const formatXAxisKey = (index: number, key: string, amountOfKeys: number): string => {
    if (timeInterval === TimeInterval.DAILY) {
      if (index === amountOfKeys - 1) {
        return 'Today';
      } else if (index === amountOfKeys - 2) {
        return 'Yesterday';
      }
    } else if (timeInterval === TimeInterval.WEEKLY) {
      if (index === amountOfKeys - 1) {
        return 'This week';
      } else if (index === amountOfKeys - 2) {
        return 'Last week';
      } else {
        return `Week of ${key}`;
      }
    } else if (timeInterval === TimeInterval.MONTHLY) {
      if (index === amountOfKeys - 1) {
        return 'This month'
      } else {
        const dateParts = key.split("-");
        const month: string = MONTHS[Number(dateParts[1]) - 1];
        const year: string = dateParts[0];
        return `${month} ${year}`;
      }
    } else if (timeInterval === TimeInterval.YEARLY) {
      if (index === amountOfKeys - 1) {
        return 'This year';
      } else {
        return key.split("-")[0];
      }
    }
    return key;
  };

  const getTrafficData = () => {
    sendAPIRequest<TrafficDataRaw>(`/api/traffic?timeInterval=${timeInterval}&intervals=${intervals}`)
      .then(data => {
        const keys = Object.keys(data).sort();
        const totalViews: Serie = {
          id: "Total Views",
          data: keys.map((key: string, index: number) => 
            ({ x: formatXAxisKey(index, key, keys.length), y: data[key].totalViews })
          )
        };
        const uniqueViews: Serie = {
          id: "Unique Views",
          data: keys.map((key: string, index: number) => 
            ({ x: formatXAxisKey(index, key, keys.length), y: data[key].uniqueViews })
          )
        };
        const selfViews: Serie = {
          id: "Your IP's Views",
          data: keys.map((key: string, index: number) => 
            ({ x: formatXAxisKey(index, key, keys.length), y: data[key].selfViews })
          )
        };
        setTrafficData([totalViews, uniqueViews, selfViews]);
      })
      .catch(error => enqueueSnackbar(error.toString(), { variant: 'error' }));
  };

  const getTimeIntervalPlural = (t: TimeInterval): string => {
    if (t === TimeInterval.DAILY) {
      return 'Days';
    } else if (t === TimeInterval.WEEKLY) {
      return 'Weeks';
    } else if (t === TimeInterval.MONTHLY) {
      return 'Months';
    } else if (t === TimeInterval.YEARLY) {
      return 'Years';
    }
    throw new Error('Wow you are very special!')
  }

  const closeDialog = () => setDialogIsOpen(false);

  return (
    <>
      <Dialog open={dialogIsOpen} onClose={closeDialog} disableScrollLock>
        <DialogTitle>Traffic data settings</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Set the time interval and amount for the traffic data graph.
          </DialogContentText>
          <FormControl fullWidth size="small" className={classes.timeIntervalForm}>
            <InputLabel id="time-interval-select-label">Time Interval</InputLabel>
            <Select
              labelId="time-interval-select-label"
              id="time-interval-select"
              value={timeInterval}
              label="Time Interval"
              onChange={(event: SelectChangeEvent) => {
                setTimeInterval(event.target.value as TimeInterval);
              }}
            >
              { Object.values(TimeInterval).map((t: TimeInterval) => <MenuItem key={t} value={t}>{t}</MenuItem>)  }
            </Select>
          </FormControl>
          <Typography gutterBottom className={classes.intervalsSlider}>
              Last {intervals} {getTimeIntervalPlural(timeInterval).toLowerCase()}
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <Slider
                value={intervals}
                min={MIN_INTERVALS}
                max={MAX_INTERVALS}
                onChange={(event: Event, newValue: number | number[]) => {
                  if (typeof newValue === 'number') {
                    setIntervals(newValue);
                  }
                }}
              />
            </Grid>
            <Grid item>
              <Input
                value={intervals}
                size="small"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setIntervals(event.target.value === '' ? MIN_INTERVALS : Number(event.target.value));
                }}
                onBlur={() => {
                  if (intervals < MIN_INTERVALS) {
                    setIntervals(MIN_INTERVALS);
                  } else if (intervals > MAX_INTERVALS) {
                    setIntervals(MAX_INTERVALS);
                  }
                }}
                inputProps={{
                  step: 1,
                  min: MIN_INTERVALS,
                  max: MAX_INTERVALS,
                  type: 'number',
                  'aria-labelledby': 'input-slider',
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Ok</Button>
        </DialogActions>
      </Dialog>
      <Card className={classes.card}>
        <CardHeader
          action={
            <IconButton aria-label="settings" onClick={() => setDialogIsOpen(true)}>
              <SettingsIcon />
            </IconButton>
          }
          title={`Traffic (last ${intervals} ${getTimeIntervalPlural(timeInterval).toLowerCase()})`}
          subheader="Use the settings icon to the top-right of this card to configure the graph."
        />
        <CardContent className={classes.line}>
          <ResponsiveLine
            data={trafficData}
            margin={{ top: 50, right: 120, bottom: 80, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
              reverse: false
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 30,
              legendOffset: 36,
              legendPosition: 'middle'
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Views',
              legendOffset: -40,
              legendPosition: 'middle'
            }}
            theme={{
              textColor: 'white',
              tooltip: {
                container: {
                  background: 'black'
                }
              }
            }}
            pointSize={10}
            isInteractive
            pointBorderWidth={2}
            pointLabelYOffset={-12}
            enableSlices='x'
            useMesh
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
          />
        </CardContent>
      </Card>
    </>
  );
} ;


export default withSnackbar(SiteMetrics);