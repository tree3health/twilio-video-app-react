import React from 'react';

import MicIcon from '../../../icons/MicIcon';
import MicOffIcon from '../../../icons/MicOffIcon';

import useLocalAudioToggle from '../../../hooks/useLocalAudioToggle/useLocalAudioToggle';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import styled from '@emotion/styled';
import { Switch } from '@material-ui/core';

export default function ToggleAudioButton(props: { disabled?: boolean; className?: string }) {
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();
  const { localTracks } = useVideoContext();
  const hasAudioTrack = localTracks.some(track => track.kind === 'audio');

  return (
    <ToggleAudioButtonContainer>
      {isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
      <StyledSwitch checked={isAudioEnabled} onClick={toggleAudioEnabled} disabled={!hasAudioTrack || props.disabled} />
    </ToggleAudioButtonContainer>
  );
}

const ToggleAudioButtonContainer = styled('div')`
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
