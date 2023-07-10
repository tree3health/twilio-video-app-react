import React, { useEffect, useState } from 'react';
import { makeStyles, Typography, Grid, Button, Theme, Hidden, Backdrop, styled } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import LocalVideoPreview from './LocalVideoPreview/LocalVideoPreview';
import SettingsMenu from './SettingsMenu/SettingsMenu';
import { Steps } from '../PreJoinScreens';
import ToggleAudioButton from '../../Buttons/ToggleAudioButton/ToggleAudioButton';
import ToggleVideoButton from '../../Buttons/ToggleVideoButton/ToggleVideoButton';
import { useAppState } from '../../../state';
import useChatContext from '../../../hooks/useChatContext/useChatContext';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import CommonDialog from '../../CommonDialog/CommonDialog';
import theme from '../../../theme';

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

const errorMessage = {
  notInHk:
    'Sorry, Tele-Medical Examination is only available in Hong Kong, please retry after arriving in Hong Kong, thank you.' +
    '抱歉，視像體檢只限於香港境內進行，請於抵達香港範圍後進行，謝謝。',
  vpn:
    'Sorry, Tele-Medical Examination is only available within Hong Kong, please disable your VPN to verify your location.' +
    '抱歉，視像體檢只限於香港境內進行，請關閉您的虛擬私人網路(VPN)以驗證您的地理位置。',
  extensions:
    'Sorry, Tele-Medical Examination is only available within Hong Kong, please disable your third party extensions to verify your location.' +
    '抱歉，視像體檢只限於香港境內進行，請關閉您的第三方擴充功能以驗證您的地理位置。',
  permission:
    'Sorry, Tele-Medical Examination is only available in Hong Kong, Please enable your location information.' +
    '抱歉，視像體檢只限於香港境內進行，請開啟你的位置資訊，謝謝。',
  failed: 'Failed to fetch',
};

interface DeviceSelectionScreenProps {
  name: string;
  roomName: string;
  setStep: (step: Steps) => void;
}

const CustomHiddenSmDown = styled('div')({
  '@media (max-width: 600px)': {
    display: 'none',
  },
});

const CustomHiddenMdUp = styled('div')({
  '@media (min-width: 960px)': {
    display: 'none',
  },
});

export default function DeviceSelectionScreen({ name, roomName, setStep }: DeviceSelectionScreenProps) {
  const classes = useStyles();
  const { getToken, isFetching, setError } = useAppState();
  const { connect: chatConnect } = useChatContext();
  const { connect: videoConnect, isAcquiringLocalTracks, isConnecting } = useVideoContext();
  const disableButtons = isFetching || isAcquiringLocalTracks || isConnecting;
  const [disableButton, setDisableButton] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isHK, setHK] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryParams = new URLSearchParams(window.location.search);

  useEffect(() => {
    const service = queryParams.get('service');
    if (service === 'prudential') {
      setDisableButton(!isHK || isFetching || isAcquiringLocalTracks || isConnecting);
    } else {
      setDisableButton(isFetching || isAcquiringLocalTracks);
    }
  }, [isHK, isFetching, isAcquiringLocalTracks, isConnecting]);

  useEffect(() => {
    const service = queryParams.get('service');
    if (service === 'prudential') {
      checkLocation();
    } else {
      setLoading(false);
    }
    console.log('v3');
  }, []);

  useEffect(() => {
    const type = queryParams.get('type');
    if (type === 'p') {
      setDialogOpen(true);
    }
  }, []);

  const handleJoin = () => {
    getToken(name, roomName).then(({ token }) => {
      videoConnect(token);
      process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS !== 'true' && chatConnect(token);
    });
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
            console.log('jsonResponse', jsonResponse);
            if (!res.ok || jsonResponse !== 'HK') {
              const recordingError = new Error(jsonResponse.error?.message || errorMessage.notInHk);
              recordingError.code = jsonResponse.error?.code;
              setHK(false);
              setLoading(false);
              return Promise.reject(recordingError);
            } else {
              const res = await fetch('https://api.ipify.org/?format=json');
              const data = await res.json();
              console.log('ip address', data.ip);
              const checkVpnByIp = await fetch(
                `https://t3h-geolocation-uccixrya5a-de.a.run.app/isVPN?ip_address=${data.ip}`,
                {
                  method: 'POST',
                  headers: {
                    'content-type': 'application/json',
                  },
                }
              );
              const isVpn = await checkVpnByIp.json();
              console.log('isVpn', isVpn);
              if (!isVpn) {
                setLoading(false);
                setHK(true);
              } else {
                const recordingError = new Error(jsonResponse.error?.message || errorMessage.vpn);
                recordingError.code = jsonResponse.error?.code;
                setLoading(false);
                setHK(false);
                return Promise.reject(recordingError);
              }
            }
          })
          .catch(err => {
            if (err) {
              setError(new Error(err.message === errorMessage.failed ? errorMessage.extensions : err.message));
              setLoading(false);
              setHK(false);
            }
          });
      },
      function(e) {
        setError(new Error(errorMessage.permission));
        console.error(e.message);
        setLoading(false);
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
            <div>Joining Meeting</div>
            <div>加入會議</div>
          </Typography>
        </div>
      </Grid>
    );
  }

  return (
    <>
      <Backdrop style={{ zIndex: 99999, color: '#fff' }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Typography variant="h5" className={classes.gutterBottom}>
        Join 加入 <div>{roomName}</div>
      </Typography>

      <Grid container justifyContent="center">
        <Grid item md={7} sm={12} xs={12}>
          <div className={classes.localPreviewContainer}>
            <LocalVideoPreview identity={name} />
          </div>
          <div className={classes.mobileButtonBar}>
            <CustomHiddenMdUp>
              <ToggleAudioButton className={classes.mobileButton} disabled={disableButtons} />
              <ToggleVideoButton className={classes.mobileButton} disabled={disableButtons} />
            </CustomHiddenMdUp>
            {/* <SettingsMenu mobileButtonClass={classes.mobileButton} /> */}
          </div>
        </Grid>
        <Grid item md={5} sm={12} xs={12}>
          <Grid container direction="column" justifyContent="space-between" style={{ height: '100%' }}>
            <div>
              <CustomHiddenSmDown>
                <ToggleAudioButton className={classes.deviceButton} disabled={disableButtons} />
                <ToggleVideoButton className={classes.deviceButton} disabled={disableButtons} />
              </CustomHiddenSmDown>
            </div>
            <div className={classes.joinButtons}>
              <Button
                style={{ marginRight: '10px' }}
                variant="outlined"
                color="primary"
                onClick={() => setStep(Steps.roomNameStep)}
              >
                Cancel 取消
              </Button>
              <Button
                variant="contained"
                color="primary"
                data-cy-join-now
                onClick={handleJoin}
                disabled={disableButton}
              >
                Join Now 加入
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
      <CommonDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
      />
    </>
  );
}
