import React, { PropsWithChildren } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Video from 'twilio-video';
import { version as appVersion } from '../../../package.json';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

interface CommonDialogProps {
  open: boolean;
  onClose(): void;
}

function CommonDialog({ open, onClose }: PropsWithChildren<CommonDialogProps>) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="xs">
      <DialogTitle style={{ fontWeight: 'bold' }}>注意 Notice</DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText style={{ marginBottom: 0 }}>
          在視像診症開始前，請先閱讀以下要點並向醫生清楚陳述以便診症過程中能助醫生更有效理解並診斷您的情況
        </DialogContentText>
        <DialogContentText style={{ marginBottom: 20 }}>
          Before starting the video consultation, please read the following points and state it clearly to the doctor so
          that the doctor can better understand and diagnose your condition during the consultation process
        </DialogContentText>
        <DialogContentText style={{ marginBottom: 0 }}>1. 是否意外引致？起因是什麼？</DialogContentText>
        <DialogContentText>Was it caused by accident? What was the cause?</DialogContentText>
        <DialogContentText style={{ marginBottom: 0 }}>2. 是否需要意外保險索償？</DialogContentText>
        <DialogContentText>Do you need an accident insurance claim?</DialogContentText>
        <DialogContentText style={{ marginBottom: 0 }}>3. 詳細描述：日期和時間？地點？事情經過？</DialogContentText>
        <DialogContentText>Detailed description: Date and time? Place? what happened?</DialogContentText>
        <DialogContentText style={{ marginBottom: 0 }}>4. 受傷情況：留意有否紅腫？有否瘀傷？</DialogContentText>
        <DialogContentText>Injury: Notice any redness? Are there bruises?</DialogContentText>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained" autoFocus>
          OK 明白
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CommonDialog;
