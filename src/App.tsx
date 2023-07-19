import React, { useEffect } from 'react';
import { Theme } from '@material-ui/core/styles';

import MenuBar from './components/MenuBar/MenuBar';
import MobileTopMenuBar from './components/MobileTopMenuBar/MobileTopMenuBar';
import PreJoinScreens from './components/PreJoinScreens/PreJoinScreens';
import ReconnectingNotification from './components/ReconnectingNotification/ReconnectingNotification';
import RecordingNotifications from './components/RecordingNotifications/RecordingNotifications';
import Room from './components/Room/Room';

import useRoomState from './hooks/useRoomState/useRoomState';
import styled from '@emotion/styled';
import { useTheme } from '@material-ui/core';

const Container = styled('div')`
  height: 100%;
`;

const Main = styled('main')<{ theme: Theme }>`
  overflow: hidden;
  padding-bottom: ${({ theme }) => theme.footerHeight}px; // Leave some space for the footer
  background: black;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding-bottom: ${({ theme }) =>
      theme.mobileFooterHeight + theme.mobileTopBarHeight}px; // Leave some space for the mobile header and footer
  }
`;

export default function App() {
  const roomState = useRoomState();
  const theme = useTheme();
  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.

  useEffect(() => {
    console.log(roomState);
    if (roomState === 'connected') {
      console.log(window);
    }
  }, [roomState]);

  return (
    <Container>
      {roomState === 'disconnected' ? (
        <PreJoinScreens />
      ) : (
        <Main theme={theme}>
          <ReconnectingNotification />
          <RecordingNotifications />
          <MobileTopMenuBar />
          <Room />
          <MenuBar />
        </Main>
      )}
    </Container>
  );
}
