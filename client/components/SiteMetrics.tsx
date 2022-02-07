import React, { FC, useState, useEffect } from 'react';
import { sendAPIRequest } from '../utils/Helpers';
import { EnqueueSnackbar } from '../utils/Types';
import { Theme } from '@mui/material/styles';
import { ResponsiveLine, Serie } from '@nivo/line';
import { withSnackbar } from 'notistack';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Card, CardContent, Typography } from '@mui/material';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      paddingBottom: theme.spacing(5),
    },
    line: {
      height: 400,
      width: "100%",
    }
  }),
);

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

  useEffect(() => {
    sendAPIRequest<TrafficDataRaw>('/api/traffic?sinceNDaysAgo=7')
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
          id: "Your Views",
          data: keys.map(key => ({ x: key, y: data[key].selfViews }))
        };
        setTrafficData([totalViews, uniqueViews, selfViews]);
      })
      .catch(error => enqueueSnackbar(error.toString(), { variant: 'error' }));
  }, [])

  return (
    <Card className={classes.card}>
      <CardContent className={classes.line}>
        <Typography gutterBottom variant="h5" component="h2">Traffic</Typography>
        <ResponsiveLine
          data={trafficData}
          margin={{ top: 50, right: 120, bottom: 50, left: 60 }}
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
            tickRotation: 0,
            legend: 'Date',
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
  );
} ;


export default withSnackbar(SiteMetrics);