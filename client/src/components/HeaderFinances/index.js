import React, { useEffect, useState } from 'react'
import './Resultado.module.css';
import Axios from 'axios';
import formatValue from '../../util/formatValue';
import './styles.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputFilter from '../InputFilter';
import { InputLabel, Select, MenuItem, FormControl } from '@material-ui/core';

function calcHead(lancs) {
  const { income, outcome } = lancs.reduce(
    (acc, transaction) => {
      switch (transaction.type) {
        case '+':
          acc.income += Number(transaction.value);
          break;

        case '-':
          acc.outcome += Number(transaction.value);
          break;

        default:
          break;
      }
      return acc;
    },
    {
      income: 0,
      outcome: 0,
      total: 0,
    },
  );
  return { income, outcome}
}

export default function HeaderFinances( { month } ) {
  const [data, setData] = useState('');
  const [formulario, setFormulario] = useState(
    {
      description: '', 
      value: '', 
      category: '', 
      year: '', 
      month: '', 
      day: '', 
      yearMonth: '', 
      yearMonthDay: '', 
      type: ''
    }
  );
  const [open, setOpen] = useState(false);
  const [finances, setFinances] = useState([]);
  const [lancamentos, setLancamentos] = useState([]);
  const [originalLancamentos, setOriginalLancamentos] = useState([]);

  useEffect(() => {
    const { income, outcome } = calcHead(lancamentos);
    setFinances({transactions: lancamentos.length, income, outcome, total: income - outcome});
  }, [lancamentos])

  useEffect(() => {
    setData('');
    Axios.get(`http://localhost:3001/api/transaction?period=${month}`)
        .then(res => {
          const transactions = res.data;
          const ordenedTrasactions = transactions.sort((a,b) => a.day - b.day);
          setLancamentos(ordenedTrasactions);
          setOriginalLancamentos(ordenedTrasactions);
          const { income, outcome } = calcHead(ordenedTrasactions);
          setFinances({transactions: ordenedTrasactions.length, income, outcome, total: income - outcome});
        });
  }, [month, data]);

  const handleUpdate = (id) => {
    lancamentos.forEach((reg) => {
      if (reg._id === id) {
        const stateForm = Object.assign(formulario, reg);
        setFormulario(stateForm);
      }
    });
    console.log(formulario);
    setOpen(true);
  }

  const handleFormulario = (event) => {
    const stateForm = Object.assign({}, formulario);
    const campo = event.target.name;
    
    stateForm[campo] = event.target.value;
    
    setFormulario(stateForm);
    console.log(formulario);
    // JSON.stringify(formulario);
  }

  const handleClickOpen = (event) => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    Axios.post(`http://localhost:3001/api/transaction/save`,
        {data: formulario})
        .then(res => {
          // const save = res.data;
          setOpen(false);
          setData(month);
          setFormulario('');
        });
  };
  const handleSaveUpdate = () => {
    Axios.patch(`http://localhost:3001/api/transaction/update/${formulario._id}`,
        {data: formulario})
        .then(res => {
          // const save = res.data;
          setOpen(false);
          setData(month);
          setFormulario('');
        });
  };

  const handleDelete = (event) => {
    Axios.delete(`http://localhost:3001/api/transaction/remove/${event}`)
      .then(res => {
        // const transactions = res.data;
        const regFiltered = lancamentos.filter((registro) => {
          return registro._id !== event;
        });
      setLancamentos(regFiltered);
    });
  }

  const handleKeyPress = (text) => {
    if (text.length > 0) {
      const valores = lancamentos.filter(item => item.description.toLowerCase().indexOf(text.toLowerCase()) > -1);
      setLancamentos(valores);
    } else {
      setLancamentos(originalLancamentos);
    }
  }

  return (
  <>
    <div className='headFinance'>
      <p>
      <strong className='info'>Lançamentos:</strong>
      <strong className='valores'>{finances.transactions}</strong>
      </p>
      <p>
      <strong className='info'>Receita: </strong>
      <strong className='valores'>{formatValue(finances.income)}</strong>
      </p>
      <p>
      <strong className='info'>Despesa: </strong>
      <strong className='valoresNeg'>{formatValue(finances.outcome)}</strong>
      </p>
      <p>
      <strong className='info'>Saldo: </strong>
      <strong className='valores'>{formatValue(finances.total)}</strong>
      </p>
    </div>
    <div className='addLancamento'>
      <button className="btn waves-effect waves-light" onClick={handleClickOpen}>
          <i className="large material-icons">arrow_forward</i>
      </button>
      <InputFilter label="Filtro" onTypeFilter={handleKeyPress}/>
    </div>
    {
      lancamentos.map((registro) => (
        <div id="divLanc" key={registro._id} className={`lancamentos ${registro.type === '+' ? `plus`:`sub`}`}> 
          <div className="headFinance">
            <strong className="dayLancamento">{registro.day}</strong>
            <div className='desc'>
              <strong>{registro.category}</strong>
              <p>{registro.description}</p>
            </div>
          </div>
          <div>
            <strong className="detalhes">{formatValue (registro.value)}</strong>
            {/*eslint-disable-next-line*/}
            <a className="waves-effect waves-teal btn-flat">
              <i className="detalhes material-icons" onClick={() => handleUpdate(registro._id)}>create</i>
            </a>
            {/*eslint-disable-next-line*/}
            <a className="waves-effect waves-teal btn-flat">
              <i className="detalhes material-icons" onClick={() => handleDelete(registro._id)}>delete</i>
            </a>
          </div>
        </div>
      ))
    }
 <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Inclusão Lançamento</DialogTitle>
        <DialogContent>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
            <Select autoFocus labelId="demo-simple-select-label" value={formulario.type} name="type" onChange={handleFormulario}>
              <MenuItem value='+'>Receita</MenuItem>
              <MenuItem value='-'>Despesa</MenuItem>
            </Select>
            <TextField margin="dense" name="description" label="Descrição" value={formulario.description} type="text" fullWidth onChange={handleFormulario}/>
            <TextField margin="dense" name="category" label="Categoria" value={formulario.category} type="text" fullWidth onChange={handleFormulario}/>
            <TextField margin="dense" name="value" label="Valor" value={formulario.value} type="number" fullWidth onChange={handleFormulario}/>
            <TextField margin="dense" name="yearMonthDay" value={formulario.yearMonthDay} type="date" fullWidth format="dd/mm/yyyy" onChange={handleFormulario}/>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={formulario._id == null ? handleSave : handleSaveUpdate} color="primary">
            {formulario._id == null ? `Save` : `Update`}
          </Button>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  </>
  )
}