import React, {useState, useEffect} from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import './App.css';
import Snackbar from '@material-ui/core/Snackbar';
import AddCustomer from './components/AddCustomer.js';
import EditCustomer from './components/EditCustomer.js';
import Trainings from './components/Trainings';
import MenuIcon from '@material-ui/icons/Menu';
import{BrowserRouter as Router,
  Switch,
  Route,
  Link
} from"react-router-dom";




function App() {

  const [ customers, setCustomers ] = useState([]);
  const [ open, setOpen ] = useState(false);
  const [ gridApi, setGridApi ] =useState(null);
  const [ gridColumnApi, setGridColumnApi ] = useState(null);


  const openSnackbar = () => {
    setOpen(true);
  }

  const closeSnackbar = () => {
    setOpen(false);
  }

  useEffect(() => {
    fetchCustomers();

  }, []);
  
  const fetchCustomers = () => {
    fetch('https://customerrest.herokuapp.com/api/customers')
    .then(response => response.json())
    .then(data => setCustomers(data._embedded.customers))
    .catch(err => console.error(err))
  }

  const addCustomer = (newCustomer) => {
      fetch('https://customerrest.herokuapp.com/api/customers', {
      method: 'POST',
      body: JSON.stringify(newCustomer),
      headers: { 'Content-type' : 'application/json' }
    })
    .then(response => {
      if (response.ok)
      fetchCustomers()
      else
      alert('something went sideways.');
    })
    .catch(err=> console.error(err))
    } 

    
    const editCustomer = (url, updatedCustomer) => {
      fetch(url, {
        method: 'PUT',
        body: JSON.stringify(updatedCustomer),
      headers: { 'Content-type' : 'application/json' }
      })
      .then(response => {
        if (response.ok)
        fetchCustomers();
        else
        alert('Something went bad')
      })
      .catch(err => console.error(err))
    }


    const deleteCustomer = (url) => {
      if (window.confirm('Are you sure?')) {
      fetch(url, { method: 'DELETE'})
      .then(response => {
        if (response.ok) {
          openSnackbar();
          fetchCustomers();
        }
        else
          alert("Something went wrong!");
      })
      .catch(err => console.error(err))
    }
  }


  const columns = [
    {field: 'firstname', sortable: true, filter: true, width: 200},
    {field: 'lastname', sortable: true, filter: true, width: 200},
    {field: 'streetaddress', sortable: true, filter: true, width: 200},
    {field: 'postcode', sortable: true, filter: true, width: 150},
    {field: 'city', sortable: true, filter: true, width: 100},
    {field: 'email', sortable: true, filter: true, width: 200},
    {field: 'phone', sortable: true, filter: true, width: 200},

    {
      headerName: '',
      field: '_links.self.href',
      width: 100,
      cellRendererFramework: params => 
        <EditCustomer link={params.value} customer={params.data} editCustomer={editCustomer} />


    },
    {
      headerName: '',
      field: '_links.self.href',
      width: 100,
      cellRendererFramework: params => 
      <IconButton color='secondary' onClick={() => deleteCustomer(params.value)}>
        <DeleteIcon/>
      </IconButton>
    }

   
  

  ]
    const onFilterTextChange = (e) => {
    gridApi.setQuickFilter(e.target.value)
    }

    const searchDivStyle={backgroundColor:"#00628080", padding:10}
    const searchStyle={width: "75%", padding: "10px 20px", borderRadius:20, outline:0}
    
    function onGridReady(params) {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
}



  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Trainings and things
          </Typography>
        </Toolbar>
      </AppBar>
      <AddCustomer addCustomer={addCustomer} />
      <div style={searchDivStyle}>
      <input type="search" style={searchStyle} onChange={onFilterTextChange} placeholder="Search"/>
      </div>
       <div className="ag-theme-material" style={{ height: 500, width: '95%', margin: 'auto' }}>
            <AgGridReact
                onGridReady={onGridReady}
                columnDefs={columns}
                rowData={customers}
                pagination={true}
                paginationPageSize={8}
                suppressCellSelection={true}
                />
                
            
        </div>
        <Snackbar 
        open={open}
        message ="Customer deleted"
        autoHideDuration={3000}
        onClose={closeSnackbar}
        />

    </div>    
    
  );
  
}

export default App;
