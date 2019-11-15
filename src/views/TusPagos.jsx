import React from "react";
import './css/Pago.css';
import './css/showBill.css';
import axios from 'axios';
import {GraphQLURL} from '../ipgraphql'
import Pago from './pago';
import {Row, Col} from "reactstrap";

class Bill extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      data : [],
      charge: false,
      load: false,
      id : null,
      page: null
      
    }
    this.getPaymentById = this.getPaymentById.bind(this);
    this.validatetoken = this.validatetoken.bind(this);
    this.getid = this.getid.bind(this);
  }
  getPaymentById(){
    axios({
      url: GraphQLURL,
      method: 'post',
      data: {
          query: `query {
            paymentById (user_id: ${this.state.id}) {
              reservation_id
              amount
            } 
          }`
      }
  }).then((result) => {
    
      if(result.data.data!=null){
      
        var info = result.data.data.paymentById;
        let pagos = []
        let i = 0
        let j = 0
        while (i < info.length) {
          let recive = null;
          if (i + 1 < info.length) {
            if (i + 2 < info.length) {

              recive = this.generaterow([info[i], info[i + 1], info[i + 2]]);

            }else { 
              recive = this.generaterow([info[i], info[i + 1]]);
            }
          }else {
        
            recive = this.generaterow([info[i]]);
          }
          pagos[j] = recive
          j += 1
          i += 3
        }
        this.setState({ load: true, page: pagos });

      }else{
          //this.notify(["danger","Registro Fallido"]);    
      }
  
  }).catch((e) =>{
      console.log(e);
      //this.notify(["danger","Registro Fallido"]);  
      
  });
  }//getInfo
  
  getid(email) {
    axios({
      url: GraphQLURL,
      method: 'post',
      data: {
        query: `query{
          userByEmail(email:${email}){
            id
          }
        }`
      }
    }).then((result) => {
      if(result.data.data != null){
        this.setState({id:result.data.data.userByEmail.id});
        this.getPaymentById();
      }
    }).catch((e) => {
      console.log(e);
    });
  }
  validatetoken() {
    axios({
      url: GraphQLURL,
      method: 'post',
      data: {
        query: `mutation{
          validate(credentials:{
            token:"${localStorage.jwt}" 
          }){
            message
          }
        }`
      }
    }).then((result) => {
      if (result.data.data.validate.message === "Token Valido") {
        var jwt = require("jsonwebtoken");
        var decoded = jwt.decode(localStorage.jwt);
        var email = (decoded.body.split(",")[0]).split(":")[1];
        this.getid(email);
      } else {
        localStorage.setItem('View_User', "");
        localStorage.setItem('View_Lodging', "");
        localStorage.setItem('jwt', "");
        localStorage.setItem('IsLogged', false);
        window.location.pathname = 'mh/login'
      }
    }).catch((e) => {
      console.log(e);
      localStorage.setItem('View_User', "");
      localStorage.setItem('View_Lodging', "");
      localStorage.setItem('jwt', "");
      localStorage.setItem('IsLogged', false);
      window.location.pathname = 'mh/login'
    });
  }
  generatecol(prop) {
    return (
      <Col lg="4">
        <Pago info={prop} />
      </Col>
    );
  }
  generaterow(info) {
    var colums = []
    for (let i = 0; i < info.length; i++) {
      colums[i] = this.generatecol(info[i]);
    }
    return (
      <Row>
        {colums[0] == null ? null : (colums[0])}
        {colums[1] == null ? null : (colums[1])}
        {colums[2] == null ? null : (colums[2])}
      </Row>
    )
  }
  render(){
    if (!this.state.load) {
      if (!this.state.charge) {
        this.validatetoken();
        this.setState({ charge: true });
      }
      return(<>
      <div className="content"></div>
      </>)
    }else{
      
      return (
        <div className="content">
          {
            this.state.page
          }


        </div>

      )
      

    }

  }
}

export default Bill;

