import React from "react";
import Popup from "reactjs-popup";
import './css/Pago.css';
import './css/showBill.css';
import axios from 'axios';
import {GraphQLURL} from '../ipgraphql'
import { resolve } from "url";

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
                      
                      Total: {props.total}
                      
                  </div>
              </div>
          )}
          
         
      </Popup>

  );
}
class Bill extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      data : [],
      dataR: [],
      loadR: false,
      load: false
    }
    this.getPaymentById = this.getPaymentById.bind(this);
  }
  getPaymentById(){
    axios({
      url: GraphQLURL,
      method: 'post',
      data: {
          query: `query {
            paymentById (user_id: ${localStorage.UsrID}) {
              reservation_id
              amount
            } 
          }`
      }
  }).then((result) => {
      console.log(result)
      if(result.data.data!=null){
        let data = [];
        data = result.data.data.paymentById;
        console.log(data[0].amount)
        console.log(data[1].amount)
        this.setState ({data: data, load: true})
      }else{
          //this.notify(["danger","Registro Fallido"]);    
      }
  
  }).catch((e) =>{
      console.log(e);
      //this.notify(["danger","Registro Fallido"]);  
      
  });
  }//getInfo
  getReservationById(id){
    axios({
      url: GraphQLURL,
      method: 'post',
      data: {
          query: `query {
            reservationById (id: ${id}) {
              guest_adult_number
              guest_children_number
              start_date
              end_date
            } 
          }`
      }
    }).then((result) => {
      console.log(result)
      if(result.data.data!=null){
        let data = [];
        data = result.data.data.reservationById;
        console.log(data[0].guest_adult_number)
        console.log(data[1].guest_children_number)
        console.log(data[2].start_date)
        console.log(data[3].end_date)
        this.setState ({dataR: data, loadR: true})
      }else{
          //this.notify(["danger","Registro Fallido"]);    
      }
  
    }).catch((e) =>{
      console.log(e);
      //this.notify(["danger","Registro Fallido"]);  
      
    });
  }
  
  
  
  
  render(){
    if(!this.state.load){
      this.getPaymentById()
      this.state.load = true

    }
    if(this.state.load){
      console.log('ya paseeeeeeeeee por el get')
      var items = []
      for (var i=0;i<this.state.data.length;i++){
        this.getReservationById(this.state.data[i].reservation_id)
          items.push(
            <div class='pago'>
              <div id='fechas'><p>
                  Fecha inicio: {this.state.dataR[i].start_date}
                  Fecha final: {this.state.dataR[i].end_date}
                </p></div>
              <div id='huespedes'><p>
                  Adultos: {this.state.dataR[i].guest_adult_number}
                  Niños: {this.state.dataR[i].guest_children_number}
                </p></div>
              <div id='total'><p>Total: {this.state.data[i].amount} </p></div>
              <ShowBill num={i+1} total={this.state.data[i].amount}/>
            </div>
          )
      }

    }
    
    return (
        <div className="content">
          {items}
        </div>
    );

  }
}

export default Bill;

/*
export default function Pago(){
  let bi = new Bill();

  console.log('ya paseeeeeeeeee por el get')
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
*/
