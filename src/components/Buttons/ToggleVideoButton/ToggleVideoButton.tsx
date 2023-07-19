import React, { useCallback, useRef } from 'react';

import VideoOffIcon from '../../../icons/VideoOffIcon';
import VideoOnIcon from '../../../icons/VideoOnIcon';

import useDevices from '../../../hooks/useDevices/useDevices';
import useLocalVideoToggle from '../../../hooks/useLocalVideoToggle/useLocalVideoToggle';
import { Switch } from '@material-ui/core';
import styled from '@emotion/styled';

export default function ToggleVideoButton(props: { disabled?: boolean; className?: string }) {
  const [isVideoEnabled, toggleVideoEnabled] = useLocalVideoToggle();
  const lastClickTimeRef = useRef(0);
  const { hasVideoInputDevices } = useDevices();

  const toggleVideo = useCallback(() => {
    if (Date.now() - lastClickTimeRef.current > 1) {
      lastClickTimeRef.current = Date.now();
      toggleVideoEnabled();
    }
  }, [toggleVideoEnabled]);

  return (
    <ToggleVideoButtonContainer>
      {isVideoEnabled ? <VideoOnIcon /> : <VideoOffIcon />}
      <StyledSwitch checked={isVideoEnabled} onClick={toggleVideo} disabled={!hasVideoInputDevices || props.disabled} />
    </ToggleVideoButtonContainer>
  );
}

const ToggleVideoButtonContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledSwitch = styled(Switch)`
  .MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track {
    background-color: #3b338c;
  }

  .MuiSwitch-colorSecondary.Mui-checked {
    color: #3b338c;
  }
`;
