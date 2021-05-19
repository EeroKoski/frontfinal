import React, {useState, useEffect} from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Snackbar from '@material-ui/core/Snackbar';
import AddTraining from './AddTraining';
import EditTraining from './EditTraining';


function Trainings() {
  const [ trainings, setTrainings ] = useState([]);
  const [ open, setOpen ] = useState(false);

  const openSnackbar = () => {
    setOpen(true);
  }

  const closeSnackbar = () => {
    setOpen(false);
  }

  useEffect(() => {
    fetchTrainings();

  }, []);

  
  
  const fetchTrainings = () => {
    fetch ('https://customerrest.herokuapp.com/api/trainings')
    .then(response => response.json())
    .then(data => setTrainings(data._embedded.trainings))
    .catch(err => console.error(err))
  }

  const addTraining = (newTraining) => {
      fetch('https://customerrest.herokuapp.com/api/trainings', {
      method: 'POST',
      body: JSON.stringify(newTraining),
      headers: { 'Content-type' : 'application/json' }
    })
    .then(response => {
      if (response.ok)
      fetchTrainings()
      else
      alert('something went sideways.');
    })
    .catch(err=> console.error(err))
    } 

    
    const editTraining = (url, updatedTraining) => {
      fetch(url, {
        method: 'PUT',
        body: JSON.stringify(updatedTraining),
      headers: { 'Content-type' : 'application/json' }
      })
      .then(response => {
        if (response.ok)
        fetchTrainings();
        else
        alert('Something went bad')
      })
      .catch(err => console.error(err))
    }

    const deleteTraining = (url) => {
      if (window.confirm('Are you sure?')) {
      fetch(url, { method: 'DELETE'})
      .then(response => {
        if (response.ok) {
          openSnackbar();
          fetchTrainings();
        }
        else
          alert("Something went wrong!");
      })
      .catch(err => console.error(err))
    }
  }


  const columns = [
    {field: 'date', sortable: true, filter: true},
    {field: 'duration', sortable: true, filter: true},
    {field: 'activity', sortable: true, filter: true},
    {field: 'customer', sortable: true, filter: true},
    

    {
      headerName: '',
      field: '_links.self.href',
      width: 100,
      cellRendererFramework: params => 
        <EditTraining link={params.value} training={params.data} editTraining={editTraining} />


    },
    {
      headerName: '',
      field: '_links.self.href',
      width: 100,
      cellRendererFramework: params => 
      <IconButton color='secondary' onClick={() => deleteTraining(params.value)}>
        <DeleteIcon/>
      </IconButton>
    }
    

  ]

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Trainings and things
          </Typography>
        </Toolbar>
      </AppBar>
      <AddTraining addTraining={addTraining} />
       <div className="ag-theme-material" style={{ height: 600, width: '90%', margin: 'auto' }}>
            <AgGridReact
                columnDefs={columns}
                rowData={trainings}
                pagination={true}
                paginationPageSize={8}
                suppressCellSelection={true}
                />
                
            
        </div>
        <Snackbar 
        open={open}
        message ="Training deleted"
        autoHideDuration={3000}
        onClose={closeSnackbar}
        />
    </div>
  );
}

export default Trainings;
