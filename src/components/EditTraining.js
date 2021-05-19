import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

function EditTraining(props) {
  const [open, setOpen] = React.useState(false);
  const [training, setTraining] = React.useState({
    date: '',
    duration: '',
    activity: '',
    customer: ''
  })

  const handleClickOpen = () => {
    setTraining({
        date: props.training.date,
        duration: props.training.duration,
        activity: props.training.activity,
        customer: props.training.customer
       

    })
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    props.editTraining(props.link, training);
    setOpen(false);
  }

  const inputChanged = (event) => {
    setTraining({...training, [event.target.name] : event.target.value});
  }

  return (
    <div>
      <IconButton color="primary" onClick={handleClickOpen}>
        <EditIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edit training</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Date"
            name="date"
            value={training.date}
            onChange={inputChanged}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Duration"
            name="duration"
            value={training.duration}
            onChange={inputChanged}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Activity"
            name="activity"
            value={training.activity}
            onChange={inputChanged}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Customer"
            name="customer"
            value={training.customer}
            onChange={inputChanged}
            fullWidth
         
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EditTraining;