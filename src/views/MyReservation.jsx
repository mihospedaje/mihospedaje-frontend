import React from "react";
import axios from 'axios';
import CardLodging from "components/CardLodging.jsx";
import { GraphQLURL } from '../ipgraphql'
import {CardBody, CardText, Row, Col} from "reactstrap";
import CardMedia from '@material-ui/core/CardMedia';



class Home extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      charge: false,
      load: false,
      page: null,
      id : null,
      fav: [],
      idfav:[]
    };
    this.getreservations = this.getreservations.bind(this)
    this.validatetoken = this.validatetoken.bind(this);
    this.getid = this.getid.bind(this);
  }
  generatecol(info,fav) {
    return (
      <Col lg="4">
        <CardLodging lodging={null} favorite={null} fav={fav} reserva= {info}/>
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
                          id
                          lodging_id
                     }
                }`
      }
    }).then((result) => {
      var info = result.data.data.favoriteByUserid;
      var favorites = []
      var idfavorites = []
      for(let i= 0; i<info.length;i++){
         favorites[i] = info[i].lodging_id;
         idfavorites[i] = info[i].id; 

      }
      this.setState({fav:favorites, idfav:idfavorites});
      this.getreservations();
    }).catch((e) => {
      console.log(e);
    });
  };
  getreservations(){
    axios({
        url: GraphQLURL,
        method: 'post',
        data: {
          query: `query {
            reservationByUser(user_id:${this.state.id}) {
                    lodging_id
                    start_date
                    end_date
                    guest_adult_number
                    guest_children_number
                }
            }
                      `
        }
      }).then((result) => {
        
        var info = result.data.data.reservationByUser
        if(info.length!==0){
          let lodgings = []
        let i = 0
        let j = 0
        var misfavorites = this.state.fav;
        while (i < info.length) {
          let recive = null;
          var favorites = [null,null,null]
          if (i + 1 < info.length) {
            if (i + 2 < info.length) {
              for(let h = 0; h<misfavorites.length;h++){
                if(info[i].lodging_id === misfavorites[h]){
                  favorites[0] = this.state.idfav[h] 
                }
                if(info[i+1].lodging_id === misfavorites[h]){
                  favorites[1] = this.state.idfav[h] 
                }
                if(info[i+2].lodging_id === misfavorites[h]){
                  favorites[2] = this.state.idfav[h] 
                }
            }
              recive = this.generaterow([info[i], info[i + 1], info[i + 2]],favorites);
            } else {
              for(let h = 0; h<misfavorites.length;h++){
                if(info[i].lodging_id === misfavorites[h]){
                  favorites[0] = this.state.idfav[h] 
                }
                if(info[i+1].lodging_id === misfavorites[h]){
                  favorites[1] = this.state.idfav[h] 
                }
            }
              recive = this.generaterow([info[i], info[i + 1]],favorites)
            }
          } else {
            for(let h = 0; h<misfavorites.length;h++){
              if(info[i].lodging_id === misfavorites[h]){
                favorites[0] = this.state.idfav[h] 
              }
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
  }
  
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
          return(
        <>
          <div className="content">
        <Row className="justify-content-center">
            <Col md="6">
                  <CardBody className="justify-content-center">
                    <CardMedia
                      className="justify-content-center"
                      image={require("assets/img/favicon.png")}
                      title="hospedaje"
                      style={{ height: 360 , width: 360}}
                    >
                      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                     <CardText className="text-center">
                         <label>Aún no tienes ninguna reserva</label><br/>
                         <label>Escoge tu lugar favorito</label><br/>
                         <label>Para tener una experiencia inolvidable</label></CardText>
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


