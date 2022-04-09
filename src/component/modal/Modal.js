import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Switch from '@mui/material/Switch';
import { useForm } from 'react-hook-form';
import moment from 'moment';

export default function AlertDialog(props) {
  const [open, setOpen] = React.useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = data => {
    data.createdAt = props && props.data && props.data.createdAt ? props.data.createdAt : moment().format('YYYY-MM-DD HH:mm')
    data.id = props && props.data && props.data.id ? props.data.id : (props.length + 1)
    data.status = data.status ? 1 : 0
    props.onSubmitForm(data)
    setFormData({
        title: "",
        id: "",
        status: "",
        description: "",
        date: ""
    })
    handleClose()
  }

  const deleteData = (data) => {
      props.onDeleteItem(data)
      handleClose()
  }

  const [formData, setFormData] = React.useState({
      title: "",
      id: "",
      status: "",
      desc: "",
      date: ""
  })

  const handleClickOpen = () => {
    setOpen(true);
    setFormData({
        title: props && props.data && props.data.title ? props.data.title : '',
        id: props && props.data && props.data.id ? props.data.id : '',
        status: props && props.data && props.data.status ? props.data.status : '',
        description: props && props.data && props.data.description ? props.data.description : '',
        date: props && props.data && props.data.createdAt ? props.data.createdAt : ''
    })
  };

  const handleClose = () => {
    setOpen(false);
  };

  const label = { inputProps: { 'aria-label': 'Status' } };

  let button
  if (props.value === "Add New Task") {
      button = <button className='px-2 py-1 bg-green-900 text-white rounded-md' onClick={handleClickOpen}>{props.value}</button>
  } else if (props.value === "Edit Task") {
      button = <button className='px-2 py-1 bg-blue-900 text-white rounded-md' onClick={handleClickOpen}>{props.value}</button>
  }

  let deleteButton
  if ((props && props.data && props.data.status && props.data.status === 1) || props.value === "Add New Task") {
    deleteButton = ''
  } else {
      deleteButton = <button className='px-2 py-1 bg-red-900 text-white font-medium rounded-md' onClick={() => deleteData(props && props.data ? props.data : '')}>Delete</button>
  }

  return (
    <div>

      {button}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">
          {props.value}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
            <div className='grid grid-cols-3 gap-4'>
                <div className='flex items-center'>
                    <p>Title</p>
                </div>
                <div className='col-span-2'>
                    <input type="text" placeholder="Input title of task" {...register("title")} defaultValue={props && props.data ? props.data.title : ''} onChange={(e) => setFormData({...formData, title: e.target.value})} className="text-xs w-full bg-gray-100 rounded-md px-2 h-9 focus:outline-none"/>
                </div>
                <div className='flex items-center'>
                    <p>Description</p>
                </div>
                <div className='col-span-2'>
                    <input type="text" placeholder="Input title of task" {...register("description")} defaultValue={props && props.data ? props.data.description : ''} onChange={(e) => setFormData({...formData, description: e.target.value})} className="text-xs w-full bg-gray-100 rounded-md px-2 h-9 focus:outline-none"/>
                </div>
                <div className='flex items-center'>
                    <p>Status</p>
                </div>
                <div className='col-span-2 flex items-center'>
                    Undone <Switch {...label} {...register("status")} defaultChecked={props && props.data && props.data.status === 1 ? true : false} onChange={(e) => setFormData({...formData, status: e.target.value})}/> Done
                </div>
            </div>
            </DialogContent>
            <DialogActions>
                <div className='flex p-4 space-x-2'>
                    {deleteButton}
                    <button className='px-2 py-1 bg-blue-900 text-white font-medium rounded-md' type="submit">
                        Save
                    </button>
                </div>
            </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}