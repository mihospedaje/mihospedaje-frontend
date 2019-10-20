import React from "react";
import axios from 'axios';
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
        axios({
            url: 'http://3.132.9.148:5000/graphql',
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
                            name
                            }
                        }
                        `
            }
        }).then((result) => {
            console.log(result.data.data.allUsers)
        }).catch((e) =>{
            console.log(e)
        });

    };

    render() {
        return (
            <>
                <div className="content">
                    <Row>
                        <Col md="6">
                            <Card>
                                <CardHeader className="mb-0">
                                    <h5 className="card-category">MiHospedaje</h5>
                                    <CardTitle tag="h3">
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
                                <CardFooter>
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

export default Register;
