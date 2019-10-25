import React from "react";
import './css/Pago.css';
import './css/showBill.css';
import axios from 'axios';
import {GraphQLURL} from '../ipgraphql'
import Pago from './pago';





class Bill extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      data : [],
      charge: false,
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
        //console.log(data[0].amount)
        //console.log(data[1].amount)
        //var reser = []
      
        
        this.setState ({data: data,load: true})
        
      }else{
          //this.notify(["danger","Registro Fallido"]);    
      }
  
  }).catch((e) =>{
      console.log(e);
      //this.notify(["danger","Registro Fallido"]);  
      
  });
  }//getInfo
    
  
  render(){
    if (!this.state.load) {
      if (!this.state.charge) {
        this.getPaymentById();
        this.setState({ charge: true });
      }
      return(<>
      <div className="content"></div>
      </>)
    }else{
      return (
        <div className="content">
          {this.state.data.map((prop,key)=> {
            return (
              <Pago key={key} info={prop}/>
            )

          } )}


        </div>

      )
      

    }

  }
}

export default Bill;

