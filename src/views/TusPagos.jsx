import React from "react";
import Popup from "reactjs-popup";
import './css/Pago.css';
import './css/showBill.css';

const contentStyle = {
  maxWidth: "500px",
  width: "90%"
};

function ShowBill (props){
  return (
      <Popup  trigger={ <button className="button">Ver factura</button>}
          modal
          contentStyle={contentStyle}
      >
          {close =>(
              <div className="modal2">
                  <a className="close2" onClick={close}>
                  &times;
                  </a>
                  <div className="header2"> Factura {props.num} </div>
                  <div className="content2">
                      <br></br><b>Descripcion</b><br></br>
                      
                      Tal descripcion de la reserva
                      <br></br><b>Fechas</b><br></br>
                      
                      Tales fechas de la reserva
                      <br></br><b>Huespedes</b><br></br>
                      
                      Tales huespedes que puede tener la reserva
                      <br></br><b>Precio</b><br></br>
                      
                      Total: {1121351}
                      
                  </div>
              </div>
          )}
          
         
      </Popup>

  );
}


export default function Pago(){
  var items = []
  for (var i=0;i<10;i++){
      items.push(
        <div class='pago'>
          <div id='fechas'><p>tales fechas </p></div>
          <div id='huespedes'><p>tales huespedes </p></div>
          <div id='total'><p>total: 13515</p></div>
          <ShowBill num={i}/>
        </div>
      )
  }
  return (
      <div className="content">
        {items}
      </div>
  );
}