import React, { FC, useState, useEffect } from 'react';
import { sendAPIRequest } from '../utils/Helpers';
import { EnqueueSnackbar } from '../utils/Types';
import { Theme } from '@mui/material/styles';
import { ResponsiveLine, Datum } from '@nivo/line';
import { withSnackbar } from 'notistack';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Paper } from '@mui/material';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    line: {
      height: 400,
      width: "100%",
      marginTop: theme.spacing(10)
    }
  }),
);

type TrafficDataRaw = Map<string, number>;

interface Props {
    readonly enqueueSnackbar: EnqueueSnackbar;
}

const SiteMetrics: FC<Props> = (props: Props): JSX.Element => {
  const classes = useStyles();
  const { enqueueSnackbar } = props;
  const [trafficData, setTrafficData] = useState<Datum[]>([]);

  useEffect(() => {
    sendAPIRequest<TrafficDataRaw>('/api/views')
      .then(data => {
        const dataPoints = Object.keys(data).sort().map(key => ({ x: key, y: data[key] }));
        setTrafficData(dataPoints);
      })
      .catch(error => enqueueSnackbar(error.toString(), { variant: 'error' }));
  }, [])

  return (
    <Paper className={classes.line}>
      <ResponsiveLine
        data={[{ id: "Visitors", data: trafficData }]}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 'auto',
          max: 'auto',
          stacked: true,
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
          legend: 'Visitors',
          legendOffset: -40,
          legendPosition: 'middle'
        }}
        theme={{
          "textColor": "white",
        }}
        pointSize={10}
        pointBorderWidth={2}
        pointLabelYOffset={-12}
        isInteractive={false}
        useMesh={true}
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
    </Paper>
  );
} ;


export default withSnackbar(SiteMetrics);