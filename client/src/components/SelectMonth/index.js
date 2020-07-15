import React, { useState } from 'react';
import { format, subMonths, addMonths, parseISO } from 'date-fns';
import HeaderFinances from '../HeaderFinances';

export default function SelectMonths(props) {

  const [month, setMonth] = useState(() => {
    const mesInicial = format(new Date(), 'yyyy-MM');
    return mesInicial;
  });

  const handleChangeMonthDown = (event) => {
    const now = `${month}-01`;
    const lastMonth = format(subMonths(parseISO(now),1), 'yyyy-MM');
    setMonth(lastMonth);
  }
  const handleChangeMonthUp = (event) => {
    const now = `${month}-01`;
    const lastMonth = format(addMonths(parseISO(now),1), 'yyyy-MM');
    setMonth(lastMonth);
  }

  const hangleInputChange = (event) => {
    const salary = event.target.value;
    console.log(salary)
  }

  const { label } = props;
  return (
    <>
      <div className='selector'>
        <button className="btn waves-effect waves-light" onClick={handleChangeMonthDown}>
        <i className="large material-icons">arrow_back</i>
        </button>
        <div className="input-field col s3">
          <input type="text" value={month} onChange={hangleInputChange} className="validate"/>
          <label className="active">Mes</label>
          {/*<label>Browser Select</label>
           <select class="browser-default">
            <option value="" disabled selected>Choose your option</option>
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
            <option value="3">Option 3</option>
          </select> */}
        </div>
        <button className="btn waves-effect waves-light" onClick={handleChangeMonthUp}>
          <i className="large material-icons">arrow_forward</i>
        </button>
      </div>
      <div>
        <HeaderFinances month={month}/>
      </div>
    </>
  )
}
