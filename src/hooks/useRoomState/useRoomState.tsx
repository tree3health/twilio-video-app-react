import { useEffect, useState } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';

type RoomStateType = 'disconnected' | 'connected' | 'reconnecting';

export default function useRoomState() {
  const { room } = useVideoContext();
  const [state, setState] = useState<RoomStateType>('disconnected');

  useEffect(() => {
    console.log(room);
    if (room) {
      if (room.participants && room.participants.size < 2) {
        const setRoomState = () => setState(room.state as RoomStateType);
        setRoomState();
        room
          .on('disconnected', setRoomState)
          .on('reconnected', setRoomState)
          .on('reconnecting', setRoomState);
        return () => {
          room
            .off('disconnected', setRoomState)
            .off('reconnected', setRoomState)
            .off('reconnecting', setRoomState);
        };
      } else {
        setTimeout(() => {
          setState('disconnected');
          room.disconnect();
        });
      }
    }
  }, [room]);

  return state;
}
