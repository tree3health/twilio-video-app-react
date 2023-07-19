import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import LocalVideoPreview from './LocalVideoPreview/LocalVideoPreview';
import { Steps } from '../PreJoinScreens';
import ToggleAudioButton from '../../Buttons/ToggleAudioButton/ToggleAudioButton';
import ToggleVideoButton from '../../Buttons/ToggleVideoButton/ToggleVideoButton';
import { useAppState } from '../../../state';
import useChatContext from '../../../hooks/useChatContext/useChatContext';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import CommonDialog from '../../CommonDialog/CommonDialog';
import styled from '@emotion/styled';
import { media } from '../../../mq';

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

export default function DeviceSelectionScreen({ name, roomName, setStep }: DeviceSelectionScreenProps) {
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
      <LoadingContainer>
        <LoadingContent>
          <CircularProgress variant="indeterminate" />
          <div>Joining Meeting</div>
          <div>加入會議</div>
        </LoadingContent>
      </LoadingContainer>
    );
  }

  return (
    <>
      <LocalPreviewContainer>
        <LocalVideoPreview identity={name} />
      </LocalPreviewContainer>
      <ButtonContainer>
        <ToggleButtonContainer>
          <StyledAudioButton disabled={disableButtons} />
          <StyledVideoButton disabled={disableButtons} />
        </ToggleButtonContainer>
        <JoinButtons color="primary" data-cy-join-now onClick={handleJoin} disabled={disableButton}>
          Join Now 加入
        </JoinButtons>
      </ButtonContainer>
      <CommonDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
      />
    </>
  );
}

const LoadingContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  height: 100%;
  padding: 5rem;
  border-radius: 6px;
`;

const LoadingContent = styled('div')`
  text-align: center;
`;

const ButtonContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: rgba(255, 255, 255);
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;

  ${media.tablet`
    padding: 0.3rem 1rem;
    border-radius: 0;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  `}

  ${media.mobile`
    padding: 0.3rem 1rem;
    border-radius: 0;
  `}
`;

const ToggleButtonContainer = styled('div')`
  display: flex;
`;

const StyledAudioButton = styled(ToggleAudioButton)`
  padding: 0;
`;

const StyledVideoButton = styled(ToggleVideoButton)`
  padding: 0;
`;

const LocalPreviewContainer = styled('div')`
  position: relative;
  height: 0;
  overflow: hidden;
  padding-top: calc((9 / 16) * 100%);
  background-color: black;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
`;

const JoinButtons = styled(Button)`
  display: flex;
  background-color: #3b338c;
  border: none;
  border-radius: 4px;
  padding: 6px 14px;
  cursor: pointer;
  color: white;

  &:hover {
    background-color: #271c66;
  }

  ${media.mobile`
    flex-direction: column-reverse;
    width: fit-content;
  `}
`;
