import React from "react";
import Popup from "reactjs-popup";
import './css/Pago.css';
import './css/showBill.css';
import axios from 'axios';
import {GraphQLURL} from '../ipgraphql'

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

function getinfobilling(){
  console.log('vamoooooooooooos por el get')
  axios({
    url: GraphQLURL,
    method: 'post',
    data: {
        query: `query {
          userById(id: 4) {
            name
            lastname
          } 
        }`
    }
}).then((result) => {
    console.log(result)
    if(result.data.data!=null){
      /*
      let data = this.state.profile;
      data[0] = result.data.data.userById.name;
      data[1] = result.data.data.userById.lastname;
      data[2] = result.data.data.userById.birthdate.substring(0, 10);;
      data[3] = result.data.data.userById.email;
      data[4] = "assets/img/2.jpg";
      //"assets/img/".concat("2",".jpg");
      this.setState({ profile:data, load:true});
    //this.notify(["success","Registro Exitoso"]);
    //window.location.pathname = '/mh/login'
    */
    }else{
        //this.notify(["danger","Registro Fallido"]);    
    }

}).catch((e) =>{
    console.log(e);
    //this.notify(["danger","Registro Fallido"]);  
    
});
}

export default function Pago(){
  getinfobilling();
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

