
import React from "react";
import axios from 'axios';
import {Row, Col} from "reactstrap";
import CardLodging from "components/CardLodging.jsx";
import { GraphQLURL } from '../ipgraphql'



class Home extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      charge: false,
      load: false,
      page: null,
      fav: [],
      idfav: [],
      search_name: null
    };
    this.getlodging = this.getlodging.bind(this);
    this.getfav = this.getfav.bind(this);
  }
  generatecol(info,fav) {
    return (
      <Col lg="4">
        <CardLodging lodging={info} favorite={null} fav={fav} reserva= {null}/>
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
      var id_favorites = []
      for(let i= 0; i<info.length;i++){
         favorites[i] = info[i].lodging_id;
         id_favorites[i] = info[i].id
      }
      this.setState({fav:favorites , idfav:id_favorites});
      if(localStorage.Search_Name==="" || localStorage.Search_Name===undefined){
        this.getlodging();
      }else{
        this.getlodgingbyname();
      }
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
                        allLodgings {
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
      var info = result.data.data.allLodgings
      let lodgings = []
      let i = 0
      let j = 0
      var misfavorites = this.state.fav;
      while (i < info.length) {
        let recive = null;
        if (i + 1 < info.length) {
          if (i + 2 < info.length) {
            var favorites = [null,null,null]
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
            var favorites = [null,null]
            for(let h = 0; h<misfavorites.length;h++){
              if(info[i].lodging_id === misfavorites[h]){
                favorites[0] = this.state.idfav[h] 
              }
              if(info[i+1].lodging_id === misfavorites[h]){
                favorites[1] = this.state.idfav[h] 
              }
          }
              recive = this.generaterow([info[i], info[i + 1]],favorites);
          }
        } else {
          var favorites = [null]
          for(let h = 0; h<misfavorites.length;h++){
            if(info[i].lodging_id === misfavorites[h]){
              favorites[0] = this.state.idfav[h] 
            }
        }
          recive = this.generaterow([info[i]],favorites);
        }
        lodgings[j] = recive
        j += 1
        i += 3
      }
      this.setState({ load: true, page: lodgings });
     
    }).catch((e) => {
      console.log(e);
    });
  };

  getlodgingbyname(){
    axios({
      url: GraphQLURL,
      method: 'post',
      data: {
        query: `query {
                    lodgingByName(name:"${localStorage.Search_Name}") {
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
      
      localStorage.setItem('Search_Name',"");
      var info = result.data.data.lodgingByName
      let lodgings = []
      let i = 0
      let j = 0
      var misfavorites = this.state.fav;
      while (i < info.length) {
        let recive = null;
        if (i + 1 < info.length) {
          if (i + 2 < info.length) {
            var favorites = [null,null,null]
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
            var favorites = [null,null]
            for(let h = 0; h<misfavorites.length;h++){
              if(info[i].lodging_id === misfavorites[h]){
                favorites[0] = this.state.idfav[h] 
              }
              if(info[i+1].lodging_id === misfavorites[h]){
                favorites[1] = this.state.idfav[h] 
              }
          }
              recive = this.generaterow([info[i], info[i + 1]],favorites);
          }
        } else {
          var favorites = [null]
          for(let h = 0; h<misfavorites.length;h++){
            if(info[i].lodging_id === misfavorites[h]){
              favorites[0] = this.state.idfav[h] 
            }
        }
          recive = this.generaterow([info[i]],favorites);
        }
        lodgings[j] = recive
        j += 1
        i += 3
      }
      this.setState({ load: true, page: lodgings });
     
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
    console.log(localStorage)
    if (!this.state.load) {
      if (!this.state.charge) {
        this.setState({search_name : localStorage.Search_Name})
        console.log(this.state.search_name)
        if(localStorage.Search_Name==="" || localStorage.Search_Name===undefined){
          this.setState({search_name : null})
        }
        if(localStorage.IsLogged!="true"){
          if(localStorage.Search_Name==="" || localStorage.Search_Name===undefined){
            this.getlodging();
          }else{
            this.getlodgingbyname();
          }
        
        }else{
          this.validatetoken();
        }
        this.setState({ charge: true });
      }
      return (<>
        <div className="content"></div>
      </>)
    } else {
      return (
        <>
          <div className="content">
          {
              this.state.search_name == null ? null : (
              <label style={{fontSize:"120%"}}>Hospedajes Relacionados con: {this.state.search_name}</label>
              )
         }
             {this.state.page} 
          </div>
        </>
      );
    }
  }
}

export default Home;