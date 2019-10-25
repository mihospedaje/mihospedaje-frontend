import React from "react";
import Popup from "reactjs-popup";
import axios from 'axios';
import {GraphQLURL} from '../ipgraphql'
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
                    <div className="header2"> Factura  </div>
                    <div className="content2">
                        <br></br><b>Fechas</b><br></br>
                        
                        Fecha inicio:  {props.start}
                        <br/>
                        Fecha final:  {props.end}
                        
                        <br></br><b>Huespedes</b><br></br>
                        
                        Adultos: {props.adultos}
                        <br/>
                        Niños: {props.ninos}
                        <br></br><b>Precio</b><br></br>
                        
                        Total: {props.total}
                        
                    </div>
                </div>
            )}
            
           
        </Popup>
  
    );
}
export default class Pago extends React.Component{
    
    constructor(props){
        super(props)
        this.state = {
          data : [],
          charge: false,
          load: false
        }
        this.getReservationById = this.getReservationById.bind(this);
      }
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
            let data = result.data.data.reservationById;
          
            this.setState ({data: data,load: true})
            
          }else{
              //this.notify(["danger","Registro Fallido"]);    
          }
      
        }).catch((e) =>{
          console.log(e);
          //this.notify(["danger","Registro Fallido"]);  
          
        });
      }
      render (){
        if (!this.state.load) {
            if (!this.state.charge) {
              this.getReservationById(this.props.info.reservation_id);
              this.setState({ charge: true });
            }
            return(<>
            <div className="content"></div>
            </>)
        }else{
            return (
                <div class='pago'>
                    <div id='fechas'><p>
                        Fecha inicio:  {this.state.data.start_date.substring(0,10)}
                        <br/>
                        Fecha final:  {this.state.data.end_date.substring(0,10)} </p></div>
                    <div id='huespedes'><p>
                        Adultos: {this.state.data.guest_adult_number}
                        <br/>
                        Niños: {this.state.data.guest_children_number}
                     </p></div>
                    <div id='total'><p>Total: {this.props.info.amount}</p></div>
                    <ShowBill 
                        start={this.state.data.start_date.substring(0,10)} 
                        end={this.state.data.end_date.substring(0,10)}
                        adultos = {this.state.data.guest_adult_number}
                        ninos= {this.state.data.guest_children_number}
                        total= {this.props.info.amount}
                    />
                </div>
                
            )
        }
        

      }
    
}