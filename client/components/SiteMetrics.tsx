import React, { FC, useState, useEffect } from 'react';
import { sendAPIRequest } from '../utils/Helpers';
import { EnqueueSnackbar } from '../utils/Types';
import { Theme } from '@mui/material/styles';
import { ResponsiveLine, Serie } from '@nivo/line';
import { withSnackbar } from 'notistack';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Card, CardContent, CardHeader, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, SelectChangeEvent, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      paddingBottom: theme.spacing(5),
    },
    line: {
      height: 400,
      width: "100%",
    },
    form: {
      marginTop: theme.spacing(5)
    }
  }),
);

enum TimeInterval {
  DAILY = "Daily",
  WEEKLY = "Weekly"
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

  useEffect(() => {
    getTrafficData();
  }, [timeInterval])

  const getTrafficData = (): void => {
    sendAPIRequest<TrafficDataRaw>(`/api/traffic?timeInterval=${timeInterval}&intervals=7`)
      .then(data => {
        const keys = Object.keys(data).sort();
        const totalViews: Serie = {
          id: "Total Views",
          data: keys.map(key => ({ x: key, y: data[key].totalViews }))
        };
        const uniqueViews: Serie = {
          id: "Unique Views",
          data: keys.map(key => ({ x: key, y: data[key].uniqueViews }))
        };
        const selfViews: Serie = {
          id: "Your IP's Views",
          data: keys.map(key => ({ x: key, y: data[key].selfViews }))
        };
        setTrafficData([totalViews, uniqueViews, selfViews]);
      })
      .catch(error => enqueueSnackbar(error.toString(), { variant: 'error' }));
  };

  const closeDialog = (): void => setDialogIsOpen(false);

  return (
    <>
      <Dialog open={dialogIsOpen} onClose={closeDialog} disableScrollLock>
        <DialogTitle>Time Interval</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Set the time interval for the traffic data graph.
          </DialogContentText>
          <FormControl fullWidth size="small" className={classes.form}>
            <InputLabel id="time-interval-select-label">Time Interval</InputLabel>
            <Select
              labelId="time-interval-select-label"
              id="time-interval-select"
              value={timeInterval}
              label="Time Interval"
              onChange={(event: SelectChangeEvent) => {
                setTimeInterval(event.target.value as TimeInterval);
                closeDialog();
              }}
            >
              <MenuItem value={TimeInterval.DAILY}>{TimeInterval.DAILY}</MenuItem>
              <MenuItem value={TimeInterval.WEEKLY}>{TimeInterval.WEEKLY}</MenuItem>
            </Select>
          </FormControl>
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
          title={`Traffic (${timeInterval.toLowerCase()})`}
          subheader="Use the settings icon to the top-right of this card to show daily or weekly traffic."
        />
        <CardContent className={classes.line}>
          <ResponsiveLine
            data={trafficData}
            margin={{ top: 50, right: 120, bottom: 100, left: 60 }}
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