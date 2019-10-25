import React from "react";
import axios from 'axios';
import Popup from "reactjs-popup";
import NotificationAlert from "react-notification-alert";
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { GraphQLURL } from '../ipgraphql'

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  Row,
  Col,
  Button,
  Input
} from "reactstrap";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: [],
      load: false,
      charge: false,
      register:[]
    };
    this.getinfoprofile = this.getinfoprofile.bind(this);
    this.ProfileEdit = this.ProfileEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    let data = this.state.register;
    data[parseInt(event.target.id, 10)] = event.target.value;
    this.setState({ register: data });
  }


  makepeticion() {
    console.log("SSSS");
    let complete = true;
    for (let i = 0; i < 5; i++) {
      if (this.state.register[i] == undefined) {
        complete = false;
      }
    }

    if (complete) {
      console.log(this.state.register)
      console.log(this.state.profile)
      axios({
        url: GraphQLURL,
        method: 'post',
        data: {
          query: `mutation {
                        updateUser(id: ${localStorage.UsrID}, user: {
                        name: "${this.state.register[0]}"
                        lastname: "${this.state.register[1]}"
                        birthdate: "${this.state.register[2]}"
                        email: "${this.state.profile[3]}"
                        password: "${this.state.register[3]}"                        
                        idrole:1
                        }) {
                        id
                        }
                    }
                    `
        }
      }).then((result) => {
        console.log("salida")
        console.log(result)
        if (result.data.data!=null) {
          console.log("verdadero pa")
          let a = result.data.data.updateUser.id
          this.notify(["success", "Actualización Exitosa con id: ".concat(a)]);
          window.location.pathname = '/mh/profile'
        } else {
          this.notify(["danger", "Actualización Fallida"]);
        }

      }).catch((e) => {
        console.log(e)
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
  ProfileEdit(props) {
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
            <a className="close2" onClick={close}>
              &times;
                  </a>
            <div className="header2"> Editar perfil </div>
            <div className="content2">
              <br></br><b>Nombre</b><br></br>

              <Input id="0" defaultValue={this.state.profile[0]} type="text" onChange={this.handleChange} />
              <br></br><b>Apellido</b><br></br>

              <Input id="1" defaultValue={this.state.profile[1]} type="text" onChange={this.handleChange}/>
              
              <br></br><b>Contraseña</b><br></br>
              <Input id="3" placeholder="Contraseña" type="password" onChange={this.handleChange} />

              <Button className="btn-fill" color="primary" type="submit" onClick={()=>this.makepeticion()}>Actualizar</Button>

            </div>
          </div>
        )}


      </Popup>

    );
  }
  getinfoprofile() {
    axios({
      url: GraphQLURL,
      method: 'post',
      data: {
        query: `query {
                      userById(id: ${localStorage.UsrID}) {
                  id
                  name
                  lastname
                  birthdate
                  email
                  password
                  }
           }`
      }
    }).then((result) => {
      console.log(result)
      if (result.data.data != null) {
        let data = this.state.profile;
        data[0] = result.data.data.userById.name;
        data[1] = result.data.data.userById.lastname;
        data[2] = result.data.data.userById.birthdate.substring(0, 10);;
        data[3] = result.data.data.userById.email;
        data[4] = result.data.data.userById.password;
        data[5] = "assets/img/2.jpg";
        let adicional = [data[0],data[1],data[2],data[3],data[4],data[5]]
        //"assets/img/".concat("2",".jpg");
        this.setState({ profile: data, load: true , register:adicional });
        //this.notify(["success","Registro Exitoso"]);
        //window.location.pathname = '/mh/login'

      } else {
        //this.notify(["danger","Registro Fallido"]);    
      }

    }).catch((e) => {
      console.log(e);
      this.notify(["danger","Registro Fallido"]);  

    });
  }
  render() {
    console.log(localStorage)
    if (!this.state.load) {
      if (!this.state.charge) {
        this.getinfoprofile();
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
                      image="https://www.emprenderalia.com/wp-content/uploads/tipo-de-persona-emprendedor-1152x768.jpg"
                      title="hospedaje"
                      style={{ height: 360 }}
                      
                    />
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
                    <div><label>FN: {this.state.profile[2]}</label></div>
                  </CardBody>

                  <CardFooter>

                    
                    <this.ProfileEdit num={localStorage.UsrID} />
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
