import React from "react";
import axios from 'axios';
import NotificationAlert from "react-notification-alert";
import {GraphQLURL} from '../ipgraphql'
// reactstrap components
import {
    Card, CardHeader, CardBody, CardTitle, Row, Col, FormGroup,
    Form, Input, Button, CardFooter
} from "reactstrap";


class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {register: []};
        this.handleChange = this.handleChange.bind(this);
        this.makepeticion = this.makepeticion.bind(this);
    }
    handleChange(event) {
        let data = this.state.register;
        data[parseInt(event.target.id, 10)] = event.target.value;
        this.setState({ register:data });
      }


    makepeticion(){
        console.log("SSSS");
        let complete = true;
        for(let i = 0; i<5;i++){
            if(this.state.register[i]==undefined){
                complete = false;
            }
        }

        if(complete){
        axios({
            url: GraphQLURL,
            method: 'post',
            data: {
                query: `mutation {
                            createUser(user: {
                            name: "${this.state.register[0]}"
                            lastname: "${this.state.register[1]}"
                            birthdate: "${this.state.register[4]}"
                            email: "${this.state.register[2]}"
                            password: "${this.state.register[3]}"
                            idrole:1
                            }) {
                            id
                            }
                        }
                        `
            }
        }).then((result) => {
            console.log(result)
            if(result.data.data!=null){
                let a = result.data.data.createUser.id
                this.notify(["success","Registro Exitoso con id: ".concat(a)]);
                //window.location.pathname = '/mh/login'
            
            }else{
                this.notify(["danger","Registro Fallido"]);    
            }

        }).catch((e) =>{
            console.log(e)
            this.notify(["danger","Registro Fallido"]);  
            
        });
        }else{
            this.notify(["danger","Datos Incompletos"]);    
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

    render() {
        return (
            <>
                <div className="content">
                <div className="react-notification-alert-container">
            <NotificationAlert ref="notificationAlert" />
          </div>
                    <Row className="justify-content-center">
                        <Col md="6">
                            <Card>
                                <CardHeader className=" text-center mb-0">
                                    <h5 className="card-category">MiHospedaje</h5>
                                    <CardTitle className="text-center" tag="h3">
                                        Regístrese
                                    </CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Form>
                                        <FormGroup> 
                                            <label>Nombre</label>
                                            <Input id="0" placeholder="Nombre" type="text" onChange={this.handleChange} />
                                        </FormGroup>
                                        <FormGroup>
                                            <label>Apellido</label>
                                            <Input id="1" placeholder="Apellido" type="text"  onChange={this.handleChange}/>
                                        </FormGroup>
                                        <FormGroup>
                                            <label> Correo Electronico</label>
                                            <Input id="2" placeholder="email@email.com" type="email" onChange={this.handleChange} />
                                        </FormGroup>
                                        <FormGroup>
                                            <label> Contraseña</label>
                                            <Input id="3" type="password" onChange={this.handleChange}/>
                                        </FormGroup>
                                        <FormGroup>
                                            <label> Fecha de Nacimiento</label>
                                            <Input id="4" type="date" onChange={this.handleChange} />
                                        </FormGroup>
                                    </Form>
                                </CardBody>
                                <CardFooter className="text-center">
                                    <Button className="btn-fill" color="primary" type="submit" onClick={this.makepeticion}>
                                        Registrarse
                  </Button>
                                </CardFooter>
                            </Card>
                        </Col>
                    </Row>
                </div>

            </>
        );
    }
}
/*
{// we don't want the Footer to be rendered on map page	            <Footer fluid />
this.props.location.pathname.indexOf("maps") !== -1 ? null : (	
    <Footer fluid />	
)}
*/

export default Register;
