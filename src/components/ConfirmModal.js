import React from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';

const ConfirmModal = (props) => {
  const {
    onConfirm,
    onClose,
    confirmMessage,
    open,
    ...other
  } = props;

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      style={{ padding: 16 }}
      {...other}
    >
      <DialogTitle>
        Confirm
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {confirmMessage}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="primary"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmModal;
