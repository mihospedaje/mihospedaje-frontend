import React from "react";
import axios from 'axios';
import Popup from "reactjs-popup";
import NotificationAlert from "react-notification-alert";
import CardMedia from '@material-ui/core/CardMedia';
import { GraphQLURL } from '../ipgraphql'
import { defaultprofile } from '../defaultprofile'
import { Card, CardHeader, CardBody, CardFooter, CardText, Row, Col, Button, Input } from "reactstrap";
import ReactFileReader from 'react-file-reader';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: [],
      load: false,
      charge: false,
      register: [],
      view: null
    };
    this.getinfoprofile = this.getinfoprofile.bind(this);
    this.ProfileEdit = this.ProfileEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validatetoken = this.validatetoken.bind(this);
    this.getid= this.getid.bind(this);

  }
  handleChange(event) {
    let data = this.state.register;
    data[parseInt(event.target.id, 10)] = event.target.value;
    this.setState({ register: data });
  }

  actualizarldap(){
    axios({
      url: GraphQLURL,
      method: 'post',
      data: {
        query: `mutation {
                      updatePassword( user: {
                      email: "${this.state.profile[3]}"
                      password: "${this.state.register[4]}"                        
                      }) {
                      data
                      }
                  }
                  `
      }
    }).then((result) => {
      if (result.data.data != null) {
        this.notify(["success", "Actualización Exitosa"]);
        window.location.pathname = '/mh/profile'
      } else {
        this.notify(["danger", "Actualización Fallida"]);
      }

    }).catch((e) => {
      console.log(e)
      this.notify(["danger", "Actualización Fallida"]);
    });
  }


  makepeticion() {
    let complete = true;
    for (let i = 0; i < 5; i++) {
      if (this.state.register[i] === undefined) {
        complete = false;
      }
    }

    if (complete) {
      axios({
        url: GraphQLURL,
        method: 'post',
        data: {
          query: `mutation {
                        updateUser(id: ${this.state.id}, user: {
                        name: "${this.state.register[0]}"
                        lastname: "${this.state.register[1]}"
                        birthdate: "${this.state.register[2]}"
                        email: "${this.state.profile[3]}"
                        password: "${this.state.register[4]}"                        
                        idrole:1
                        image: "${this.state.imagenp}"
                        }) {
                        id
                        }
                    }
                    `
        }
      }).then((result) => {
        if (result.data.data != null) {
          this.actualizarldap();
        } else {
          this.notify(["danger", "Actualización Fallida"]);
        }

      }).catch((e) => {
        console.log(e);
        this.notify(["danger", "Actualización Fallida"]);
      });
    } else {
      this.notify(["danger", "Datos Incompletos"]);
    }
  };
  notify = place => {
    var type = place[0];
    var options = {};
    options = {
      place: "tc",
      message: (
        <div>
          <div>
            {place[1]}
          </div>
        </div>
      ),
      type: type,
      icon: "tim-icons icon-bell-55",
      autoDismiss: 7
    };
    this.refs.notificationAlert.notificationAlert(options);
  };
  ProfileEdit() {
    return (
      <Popup trigger={<Button className="btn-fill" color="primary" type="submit">Editar perfil</Button>}
        modal
        contentStyle={{
          maxWidth: "500px",
          width: "90%"
        }}
      >
        {close => (
          <div className="modal2">
            <a className="close2" onClick={close}>&times;</a>
            <div className="header2"> Editar perfil </div>
            <div className="content2">
              <br></br><b>Nombre</b><br></br>

              <Input id="0" defaultValue={this.state.profile[0]} type="text" onChange={this.handleChange} />
              <br></br><b>Apellido</b><br></br>

              <Input id="1" defaultValue={this.state.profile[1]} type="text" onChange={this.handleChange} />

              <br></br><b>Contraseña</b><br></br>
              <Input id="4" placeholder="Contraseña" type="password" onChange={this.handleChange} />

              <Button className="btn-fill" color="primary" type="submit" onClick={() => this.makepeticion()}>Actualizar</Button>

            </div>
          </div>
        )}


      </Popup>

    );
  }
  getinfoprofile(view_id) {
    axios({
      url: GraphQLURL,
      method: 'post',
      data: {
        query: `query {
                  userById(id: ${view_id}) {
                    id
                    name
                    lastname
                    birthdate
                    email
                    password
                    image
                  }
           }`
      }
    }).then((result) => {
      if (result.data.data != null) {
        let data = this.state.profile;
        data[0] = result.data.data.userById.name;
        data[1] = result.data.data.userById.lastname;
        data[2] = result.data.data.userById.birthdate.substring(0, 10);
        data[3] = result.data.data.userById.email;
        data[4] = result.data.data.userById.password;
        data[5] = result.data.data.userById.image;
        let adicional = [data[0], data[1], data[2], data[3], data[4], data[5]]
        if(data[5]==="" || data[5]===null){
          data[5] = defaultprofile;
        }
          data[5] = defaultprofile;
        
        this.setState({ profile: data, load: true, register: adicional});
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
        this.getinfoprofile(result.data.data.userByEmail.id);
        this.setState({id:result.data.data.userByEmail.id});
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
  handleFiles = (files) => {
    let imgp = files.base64
    console.log(files)
    let base64 = 'data:image/png;base64' + imgp;
    console.log(base64)
    this.setState({imagenp:imgp});
    let data = this.state.profile;
    data[5] = base64;
    this.setState({ profile: data});
    //this.makepeticion()
  }

  render() {
    console.log(localStorage)
    if (!this.state.load) {
      if (!this.state.charge) {
        if (localStorage.View_User !== "") {
          this.setState({view:true})
          this.getinfoprofile(localStorage.View_User);
          localStorage.setItem('View_User', "");
        } else {
          this.validatetoken();
        }
        this.setState({ charge: true });
      }
      return (<>
        <div className="content">
        </div>
      </>)
    } else {
      return (
        <>
          <div className="content">
            <div className="react-notification-alert-container">
              <NotificationAlert ref="notificationAlert" /></div>
            <Row>
              <Col md="4">
                <Card className="card-user">
                  <CardBody>
                    <CardText />
                    <div className="author">
                      <div className="block block-one" />
                    </div>
                    <CardMedia
                      //image="https://www.emprenderalia.com/wp-content/uploads/tipo-de-persona-emprendedor-1152x768.jpg"
                      image = {'data:image/png;base64' + this.state.profile[5]}
                      title= {this.state.profile[0]}
                      style={{ height: 360}}
                    />
                    <ReactFileReader fileTypes = {[".jpeg", ".png", ".jpg"]} base64={true} multipleFiles={true} handleFiles={this.handleFiles}>
                        <Button className="btn-fill" color="primary">Upload</Button>
                    </ReactFileReader>
                  </CardBody>

                </Card>
              </Col>
              <Col md="8">
                <Card>
                  <CardHeader className="text-center">
                    <h1 className="title">Hola, mi nombre es {this.state.profile[0]}</h1>
                  </CardHeader>
                  <CardBody>
                    <div><label>Email: {this.state.profile[3]}</label></div>
                    <div><label>Fecha de Nacimiento: {this.state.profile[2]}</label></div>
                  </CardBody>
                  <CardFooter>
                  {
                    this.state.view != null ? null : (
                    <this.ProfileEdit/>
                    )
                  }
                    
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </div>
        </>
      );
    }
  }
}

export default UserProfile;
