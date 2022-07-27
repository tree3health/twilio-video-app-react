import React, { useEffect, useState } from 'react';
import { makeStyles, Typography, Grid, Button, Theme, Hidden } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import LocalVideoPreview from './LocalVideoPreview/LocalVideoPreview';
import SettingsMenu from './SettingsMenu/SettingsMenu';
import { Steps } from '../PreJoinScreens';
import ToggleAudioButton from '../../Buttons/ToggleAudioButton/ToggleAudioButton';
import ToggleVideoButton from '../../Buttons/ToggleVideoButton/ToggleVideoButton';
import { useAppState } from '../../../state';
import useChatContext from '../../../hooks/useChatContext/useChatContext';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) => ({
  gutterBottom: {
    marginBottom: '1em',
  },
  marginTop: {
    marginTop: '1em',
  },
  deviceButton: {
    width: '100%',
    border: '2px solid #aaa',
    margin: '1em 0',
  },
  localPreviewContainer: {
    paddingRight: '2em',
    [theme.breakpoints.down('sm')]: {
      padding: '0 2.5em',
    },
  },
  joinButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',
      width: '100%',
      '& button': {
        margin: '0.5em 0',
      },
    },
  },
  mobileButtonBar: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: '1.5em 0 1em',
    },
  },
  mobileButton: {
    padding: '0.8em 0',
    margin: 0,
  },
}));

interface DeviceSelectionScreenProps {
  name: string;
  roomName: string;
  setStep: (step: Steps) => void;
}

export default function DeviceSelectionScreen({ name, roomName, setStep }: DeviceSelectionScreenProps) {
  const classes = useStyles();
  const { getToken, isFetching, setError } = useAppState();
  const { connect: chatConnect } = useChatContext();
  const { connect: videoConnect, isAcquiringLocalTracks, isConnecting } = useVideoContext();
  const disableButtons = isFetching || isAcquiringLocalTracks || isConnecting;
  const [isHK, setHK] = useState(false);

  const handleJoin = () => {
    checkLocation();
    if (isHK) {
      getToken(name, roomName).then(({ token }) => {
        videoConnect(token);
        process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS !== 'true' && chatConnect(token);
      });
    }
  };

  const checkLocation = () => {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const { latitude, longitude } = position.coords;
        return fetch('https://t3h-geolocation-uccixrya5a-de.a.run.app/getCountry', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({ lat: latitude, lng: longitude }),
        })
          .then(async res => {
            const jsonResponse = await res.json();
            if (!res.ok || jsonResponse !== 'HK') {
              const recordingError = new Error(
                jsonResponse.error?.message ||
                  'Sorry, the services is only available in Hong Kong, please retry after arriving in Hong Kong, thank you.'
              );
              recordingError.code = jsonResponse.error?.code;
              setHK(false);
              return Promise.reject(recordingError);
            } else {
              setHK(true);
            }
          })
          .catch(err => {
            setError(err);
            setHK(false);
          });
      },
      function(e) {
        setError(new Error(e.message));
        console.error(e.message);
        setHK(false);
      }
    );
  };

  if (isFetching || isConnecting) {
    return (
      <Grid container justifyContent="center" alignItems="center" direction="column" style={{ height: '100%' }}>
        <div>
          <CircularProgress variant="indeterminate" />
        </div>
        <div>
          <Typography variant="body2" style={{ fontWeight: 'bold', fontSize: '16px' }}>
            Joining Meeting
          </Typography>
        </div>
      </Grid>
    );
  }

  return (
    <>
      <Typography variant="h5" className={classes.gutterBottom}>
        Join {roomName}
      </Typography>

      <Grid container justifyContent="center">
        <Grid item md={7} sm={12} xs={12}>
          <div className={classes.localPreviewContainer}>
            <LocalVideoPreview identity={name} />
          </div>
          <div className={classes.mobileButtonBar}>
            <Hidden mdUp>
              <ToggleAudioButton className={classes.mobileButton} disabled={disableButtons} />
              <ToggleVideoButton className={classes.mobileButton} disabled={disableButtons} />
            </Hidden>
            <SettingsMenu mobileButtonClass={classes.mobileButton} />
          </div>
        </Grid>
        <Grid item md={5} sm={12} xs={12}>
          <Grid container direction="column" justifyContent="space-between" style={{ height: '100%' }}>
            <div>
              <Hidden smDown>
                <ToggleAudioButton className={classes.deviceButton} disabled={disableButtons} />
                <ToggleVideoButton className={classes.deviceButton} disabled={disableButtons} />
              </Hidden>
            </div>
            <div className={classes.joinButtons}>
              <Button variant="outlined" color="primary" onClick={() => setStep(Steps.roomNameStep)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                data-cy-join-now
                onClick={handleJoin}
                disabled={disableButtons}
              >
                Join Now
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
