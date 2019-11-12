
import React from "react";
import axios from 'axios';
import CardLodging from "components/CardLodging.jsx";
import { GraphQLURL } from '../ipgraphql'
import { Card, CardHeader, CardBody, CardFooter, CardText, Row, Col, Button, Input } from "reactstrap";
import CardMedia from '@material-ui/core/CardMedia';



class Home extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      charge: false,
      load: false,
      page: null,
      id : null,
      fav:[]
    };
    this.getlodging = this.getlodging.bind(this);
    this.validatetoken = this.validatetoken.bind(this);
    this.getid = this.getid.bind(this);
  }
  generatecol(info,fav) {
    return (
      <Col lg="4">
        <CardLodging lodinfo={info} fav={fav} reserva= {null}/>
      </Col>
    );
  }
  generaterow(info,fav) {
    var colums = []
    for (let i = 0; i < info.length; i++) {
      colums[i] = this.generatecol(info[i],fav[i]);
    }
    return (
      <Row>
        {colums[0] == null ? null : (colums[0])}
        {colums[1] == null ? null : (colums[1])}
        {colums[2] == null ? null : (colums[2])}
      </Row>
    )
  }
  getfav(){
    axios({
      url: GraphQLURL,
      method: 'post',
      data: {
        query: `query {
                    favoriteByUserid (user_id:${this.state.id}){
                          lodging_id
                     }
                }`
      }
    }).then((result) => {
      var info = result.data.data.favoriteByUserid;
      var favorites = []
      for(let i= 0; i<info.length;i++){
         favorites[i] = info[i].lodging_id;
      }
      this.setState({fav:favorites});
      this.getlodging();
    }).catch((e) => {
      console.log(e);
    });
  };
  getlodging() {
    axios({
      url: GraphQLURL,
      method: 'post',
      data: {
        query: `query {
            lodgingByUser(user_id:${this.state.id}) {
                          lodging_id
                          lodging_name
                          location_id
                          price_per_person_and_nigth
                          lodging_provide
                      }
                    }
                    `
      }
    }).then((result) => {
      var info = result.data.data.lodgingByUser
      
      if(info.length!=0){
        let lodgings = []
      let i = 0
      let j = 0
      var misfavorites = this.state.fav;
      while (i < info.length) {
        let recive = null;
        if (i + 1 < info.length) {
          if (i + 2 < info.length) {
            var favorites = [null,null,null]
              
              if(misfavorites.includes(info[i].lodging_id)){
                favorites[0] = "red"
              }
              if(misfavorites.includes(info[i+1].lodging_id)){
                favorites[1] = "red"
              }
              if(misfavorites.includes(info[i+2].lodging_id)){
                favorites[2] = "red"
              }
            recive = this.generaterow([info[i], info[i + 1], info[i + 2]],favorites);
          } else {
            var favorites = [null,null]
              if(misfavorites.includes(info[i].lodging_id)){
                favorites[0] = "red"
              }
              if(misfavorites.includes(info[i+1].lodging_id)){
                favorites[1] = "red"
              }
            recive = this.generaterow([info[i], info[i + 1]],favorites)
          }
        } else {
          var favorites = [null]
          if(misfavorites.includes(info[i].lodging_id)){
            favorites[0] = "red"
          }
          recive = this.generaterow([info[i]],favorites)
        }
        lodgings[j] = recive
        j += 1
        i += 3
      }
      this.setState({ load: true, page: lodgings });
    }else{
        this.setState({ load: true, page: null });
    }
     
    }).catch((e) => {
      console.log(e);
    });
  };

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
        this.getfav();
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

  render() {
    if (!this.state.load) {
      if (!this.state.charge) {
        this.validatetoken()
        this.setState({ charge: true });
      }
      return (<>
        <div className="content"></div>
      </>)
    } else {
        if(this.state.page!=null){
      return (
        <>
          <div className="content">
             {this.state.page} 
          </div>
        </>
      );}else{
          console.log("SSS")
          return(
        <>
          <div className="content">
        <Row className="justify-content-center">
            <Col md="6">
                  <CardBody className="justify-content-center ">
                    <CardMedia
                      image={require("assets/img/favicon.png")}
                      title="hospedaje"
                      style={{ height: 360 , width: 360}}>
                      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                      <CardText  className="text-center ">
                         <label>Aún no tienes ningún hospedaje registrado</label><br/>
                         <label>Empieza a ganar dinero con nosotros</label><br/>
                         <label>registra un hospedaje<a href="/mh/createlodging"> aquí</a></label></CardText>
                    </CardMedia>
                  </CardBody>
               
            </Col>
          </Row>
          </div>
        </>
          );
      }
    }
  }
}

export default Home;


