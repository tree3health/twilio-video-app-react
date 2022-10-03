import React, { PropsWithChildren } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
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
        <DialogContentText style={{ marginBottom: 10 }}>請預備好向醫生表述：</DialogContentText>
        <DialogContentText style={{ marginBottom: 0 }}>1. 您的受傷是否意外引致及如何發生。</DialogContentText>
        <DialogContentText style={{ marginBottom: 0 }}>2. 是否需要意外保險索償？</DialogContentText>
        <DialogContentText style={{ marginBottom: 0 }}>3. 發生詳情：例如日期、時間、地點及經過</DialogContentText>
        <DialogContentText style={{ marginBottom: 0 }}>4. 受傷情況：例如有無紅腫或瘀傷等</DialogContentText>
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
