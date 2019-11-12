import React from "react";
import axios from 'axios';
import { GraphQLURL } from '../ipgraphql';
import NotificationAlert from "react-notification-alert";
// reactstrap components
import {
    Card, CardHeader, CardBody, CardTitle, Row, Col, FormGroup,
    Form, Input, Button, CardFooter
} from "reactstrap";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {datalogin: []};
    
        this.handleChange = this.handleChange.bind(this);
        this.login = this.login.bind(this);
    }
    handleChange(event) {
        let data = this.state.datalogin;
        data[parseInt(event.target.id, 10)] = event.target.value;
        this.setState({ datalogin:data});
      }
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


    login(){
        axios({
            url: GraphQLURL,
            method: 'post',
            data: {
              query: `mutation{
                loginUser(credentials:{
                  email: "${this.state.datalogin[0]}"
                  password: "${this.state.datalogin[1]}"
                }){
                  success
                  token
                }
              }
                        `
            }
          }).then((result) => {
            var info = result.data.data.loginUser
            if(info.success === true){
                localStorage.setItem('jwt', info.token);
                localStorage.setItem('IsLogged', true);
                window.location.pathname = 'mh/profile'

            }else{
                this.notify(["danger", "Usuario o Contraseña Incorrectos"]);
            }
            
          }).catch((e) => {
            console.log(e)
            this.notify(["danger", "Usuario o Contraseña Incorrectos"]);
    
          });
       
    };

    render() {
        return (
            <>
                <div className="content">
                <div className="react-notification-alert-container">
            <NotificationAlert ref="notificationAlert" />
          </div>
                    <Row className="justify-content-center">
                        <Col md="5">
                            <Card >
                                <CardHeader className="text-center mb-0">
                                    <h5 className="card-category">MiHospedaje</h5>
                                    <CardTitle tag="h3">
                                        Iniciar Sesión
                                    </CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Form>
                                        <FormGroup>
                                            <label> Email</label>
                                            <Input id="0" placeholder="email@email.com" type="email" onChange={this.handleChange} />
                                        </FormGroup>
                                        <FormGroup>
                                            <label> Contraseña</label>
                                            <Input id="1" type="password" onChange={this.handleChange}/>
                                        </FormGroup>
                                    </Form>
                                </CardBody>
                                <CardFooter className="text-center">
                                    <Button className="btn-fill" color="primary" type="submit" onClick={this.login}>
                                        Iniciar Sesión
                  </Button>
                  
                                </CardFooter>
                                <CardFooter className="text-center">
                                <label>¿No tienes una cuenta? <a href="/mh/register"> Regístrate</a></label>
                                </CardFooter>
                            </Card>
                        </Col>
                    </Row>
                </div>

            </>
        );
    }
}

export default Register;
