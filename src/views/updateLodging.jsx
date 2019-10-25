import React from 'react';
import axios from 'axios';
import { GraphQLURL } from '../ipgraphql'
import CardMedia from '@material-ui/core/CardMedia';
import { Row, Col, Card, CardBody, CardHeader, CardTitle, Button, Input, FormGroup, Form, CardFooter } from "reactstrap";
import NotificationAlert from "react-notification-alert";

export default class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lodging: [],
      load: false,
      charge: false,
      location: [],
      locationid: [],
      hourframe:[]
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.makepeticion = this.makepeticion.bind(this);
  }
  handleChange(event) {
    let data = this.state.lodging;
    data[parseInt(event.target.id, 10)] = event.target.value;
    this.setState({ lodging: data });
    console.log(this.state.lodging);
  }
  handleCheck(event) {
    let data = this.state.lodging;
    if (data[parseInt(event.target.id, 10)] == 1) {
      data[parseInt(event.target.id, 10)] = 0
    } else {
      data[parseInt(event.target.id, 10)] = 1
    }
    if (data[parseInt(event.target.id, 10)] == null) {
      data[parseInt(event.target.id, 10)] = 1
    }
    this.setState({ lodging: data });
    console.log(this.state.lodging)
  }

  // INFORMACION

  getlocation() {
    axios({
      url: GraphQLURL,
      method: 'post',
      data: {
        query: `query {
                     allLocations{
                        location_id
                        country
                        city
                   }
           }
                    `
      }
    }).then((result) => {
      var info = result.data.data.allLocations
      let data = this.state.location
      let datid = this.state.locationid
      for (let i = 0; i < info.length; i++) {
        data[i] = (info[i].city).concat(", ", info[i].country)
        datid[i] = info[i].location_id
      }

      this.setState({ load: true, location: data, locationid: datid });

    }).catch((e) => {
      console.log(e)
    });
  };

  makepeticion() {
    console.log("SSSS");
    let complete = true;
    for (let i = 0; i < 7; i++) {
      if (this.state.lodging[i] == undefined) {
        complete = false;
      }
    }
    for (let i = 8; i < 14; i++) {
      if (this.state.lodging[i] == undefined) {
        complete = false;
      }
    }
    if (this.state.lodging[20] == undefined) {
      complete = false;
    }
    if (this.state.lodging[21] == undefined) {
      complete = false;
    }
    if (this.state.lodging[7] == undefined) {
      this.state.lodging[7] = ""
    }
    if (this.state.lodging[4] != undefined) {
      this.state.lodging[4] = this.state.locationid[parseInt(this.state.lodging[4], 10)]
    }
    if (this.state.lodging[2] != undefined) {
      this.state.lodging[2] = parseInt(this.state.lodging[2], 10)
    }
    if (this.state.lodging[3] != undefined) {
      this.state.lodging[3] = parseInt(this.state.lodging[3], 10)
    }
    if (this.state.lodging[5] != undefined) {
      this.state.lodging[5] = parseInt(this.state.lodging[5], 10)
    }
    if (this.state.lodging[12] != undefined) {
      this.state.lodging[12] = parseInt(this.state.lodging[12], 10)
    }
    if (this.state.lodging[13] != undefined) {
      this.state.lodging[13] = parseInt(this.state.lodging[13], 10)
    }
    for (let i = 14; i < 20; i++) {
      if (this.state.lodging[i] == undefined) {
        this.state.lodging[i] = 0
      }
    }

    if (complete) {
      axios({
        url: GraphQLURL,
        method: 'post',
        data: {
          query: `mutation{
  createLodging(lodging:{
    host_id: ${localStorage.UsrID}
    lodging_name: "${this.state.lodging[0]}"
    phone_number: ${this.state.lodging[1]}
    lodging_type: ${this.state.lodging[2]}
    lodging_provide: ${this.state.lodging[3]}
    location_id: ${this.state.lodging[4]}
    is_exclusive: ${this.state.lodging[5]}
    address: "${this.state.lodging[6]}",
    extra_address: "${this.state.lodging[7]}",
    guest_number: ${this.state.lodging[8]}
    rooms_number: ${this.state.lodging[9]}
    beds_number: ${this.state.lodging[10]}
    bathrooms_number: ${this.state.lodging[11]}
    time_arrive_start: ${this.state.lodging[12]}
    time_arrive_end: ${this.state.lodging[13]}
    with_wifi: ${this.state.lodging[14]}
    with_cable_tv: ${this.state.lodging[15]}
    with_air_conditioning: ${this.state.lodging[16]}
    with_phone: ${this.state.lodging[17]}
    with_kitchen: ${this.state.lodging[18]}
    with_cleaning_items: ${this.state.lodging[19]}
    price_per_person_and_nigth: ${this.state.lodging[20]}
    lodging_description: "${this.state.lodging[21]}"
    lodging_class: 0,
    is_company: 0,
    time_before_guest: 0,
  }){
    lodging_id
  }
}
                    `
        }
      }).then((result) => {
        console.log(result)
        if (result.data.data != null) {
          let a = result.data.data.createLodging.lodging_id
          this.notify(["success", "Registro Exitoso con id: ".concat(a)]);
          localStorage.setItem('LodID', parseInt(a));
          window.location.pathname = '/mh/lodging'

        } else {
          this.notify(["danger", "Registro Fallido"]);
        }

      }).catch((e) => {
        console.log(e)
        this.notify(["danger", "Registro Fallido"]);

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


  render() {
    console.log(localStorage)
    if (!this.state.load) {
      if (!this.state.charge) {
        let horas = this.state.hourframe;
        for(let i = 0; i<16;i++){
          horas[i+7] = i+7;
        }
        this.getlocation();
        this.setState({ charge: true , hourframe: horas });
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
              <NotificationAlert ref="notificationAlert" />
            </div>
            <Row>

              <Col lg="5">
                <Card className="card-user">
                  <CardBody>
                    <CardMedia
                      image="https://pix6.agoda.net/hotelImages/348529/-1/0eb81c6bf886dc45d066e7c1f2b94f11.jpg"
                      title="hospedaje"
                      style={{ height: 400 }}
                    />
                  </CardBody>
                </Card>
              </Col>
              <Col lg="7">
                <Card>
                  <CardHeader className=" text-center mb-0">
                    <h5 className="card-category">MiHospedaje</h5>
                    <CardTitle className="text-center" tag="h3">
                      Regístre su Alojamiento
                                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Form>
                      <Row>
                        <Col>
                          <FormGroup>
                            <label>Nombre del Alojamiento</label>
                            <Input id="0" placeholder="Nombre" type="text" onChange={this.handleChange} />
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <label>Teléfono</label>
                            <Input id="1" placeholder="Teléfono" type="number" onChange={this.handleChange} />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup>
                            <label>Tipo de Alojamiento</label>
                            <Input id="2" placeholder="Nombre" type="select" onChange={this.handleChange}>
                              <option defaultValue>Seleccione una Opcion</option>
                              <option value="1">Departamento</option>
                              <option value="2">Casa</option>
                              <option value="3">Vivienda Anexa</option>
                              <option value="4">Alojamiento Único</option>
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <label>¿De qué dispondrán los huéspedes?</label>
                            <Input id="3" placeholder="Teléfono" type="select" onChange={this.handleChange}>
                              <option defaultValue>Seleccione una Opcion</option>
                              <option value="1">Alojamiento Entero</option>
                              <option value="2">Habitación Privada</option>
                              <option value="3">Habitación Compartida</option>
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup>
                            <label>Ubicación</label>
                            <Input id="4" placeholder="Nombre" type="select" onChange={this.handleChange}>
                              <option defaultValue>Seleccione una Opcion</option>
                              {this.state.location.map((prop, key) => {
                                return (<option key={key} value={key} >{prop}</option>)
                              })
                              }

                            </Input>
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <label>¿El espacio es único para alojamiento</label>
                            <Input id="5" placeholder="Nombre" type="select" onChange={this.handleChange}>
                              <option defaultValue>Seleccione una Opcion</option>
                              <option value="1">Sí, está pensado para los huéspedes</option>
                              <option value="0">No, aquí tengo mis pertenencias</option>
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup>
                            <label>Dirección</label>
                            <Input id="6" placeholder="Dirección" type="text" onChange={this.handleChange} />
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <label>Extra Dirección</label>
                            <Input id="7" placeholder="Extra Dirección" type="text" onChange={this.handleChange} />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col>
                          <FormGroup>
                            <label>¿A cuantos huéspedes puedes alojar?</label>
                            <Input id="8" type="number" onChange={this.handleChange} />
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <label>¿Cuántas habitaciones hay disponibles?</label>
                            <Input id="9" type="number" onChange={this.handleChange} />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup>
                            <label>¿Cuántas camas hay disponibles?</label>
                            <Input id="10" type="number" onChange={this.handleChange} />
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <label>¿Cuántos baños hay disponibles?</label>
                            <Input id="11" type="number" onChange={this.handleChange} />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                        <label>¿Cuándo pueden llegar los huéspedes?</label>
                        </Col>
                        </Row>
                      <Row>
                        <Col>
                         
                          <FormGroup>
                            <label>Desde</label>
                            <Input id="12" type="select" onChange={this.handleChange}>
                            <option defaultValue>Seleccione una Opcion</option>
                            <option value = "0" >Flexible</option>
                              {this.state.hourframe.map((prop, key) => {
                                return (<option key={key} value={key+1} >{prop}:00</option>)
                              })
                              }
                              </Input>
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <label>Hasta</label>
                            <Input id="13" type="select" onChange={this.handleChange}>
                            <option defaultValue>Seleccione una Opcion</option>
                            <option value = "0" >Flexible</option>
                              {this.state.hourframe.map((prop, key) => {
                                return (<option key={key} value={key+1} >{prop+1}:00</option>)
                              })
                              }
                            </Input>
                          </FormGroup>
                        </Col>
                        </Row>
                        <Row>
                        <Col>
                        <label>¿Con qué servicios cuenta el alojamiento?</label>
                        </Col>
                        </Row>
                      <Row>
                        <Col>
                          <FormGroup>
                            <Col>
                              <label>
                                <Input id="14" type="checkbox" onChange={this.handleCheck} />
                                Wifi</label>
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Col>
                              <label>
                                <Input id="15" type="checkbox" onChange={this.handleCheck} />
                                TV Cable</label>
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup>
                            <Col>
                              <label>
                                <Input id="16" type="checkbox" onChange={this.handleCheck} />
                                Aire Acondicionado</label>
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Col>
                              <label>
                                <Input id="17" type="checkbox" onChange={this.handleCheck} />
                                Teléfono</label>
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup>
                            <Col>
                              <label>
                                <Input id="18" type="checkbox" onChange={this.handleCheck} />
                                Cocina</label>
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Col>
                              <label>
                                <Input id="19" type="checkbox" onChange={this.handleCheck} />
                                Artículos de Limpieza</label>
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup>
                            <label>¿Cual será el precio por noche por persona?</label>
                            <Input id="20" type="number" onChange={this.handleChange} />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup>
                            <label>Describe tu Alojamiento</label>
                            <Input id="21" type="text" onChange={this.handleChange} />
                          </FormGroup>
                        </Col>
                      </Row>




                    </Form>
                  </CardBody>
                  <CardFooter className="text-center">
                    <Button className="btn-fill" color="primary" type="submit" onClick={this.makepeticion}>
                      Registrar Alojamiento
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

} 