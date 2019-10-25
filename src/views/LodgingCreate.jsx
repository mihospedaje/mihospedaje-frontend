import React from 'react';
import axios from 'axios';
import { GraphQLURL } from '../ipgraphql'
import ItemsCarousel from 'react-items-carousel';
import range from 'lodash/range';
import CardMedia from '@material-ui/core/CardMedia';
import { Row, Col, Card, CardBody, CardHeader, CardTitle, Button, Input, FormGroup, Form, CardFooter } from "reactstrap";
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import HomeIcon from '@material-ui/icons/Home';
import WifiIcon from '@material-ui/icons/Wifi';
import TvIcon from '@material-ui/icons/Tv';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import PhoneIcon from '@material-ui/icons/Phone';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import LocalLaundryServiceIcon from '@material-ui/icons/LocalLaundryService';

export default class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lodging: [],
      load: false,
      charge: false
    };
    this.getlodginginfo = this.getlodginginfo.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    let data = this.state.lodging;
    data[parseInt(event.target.id, 10)] = event.target.value;
    this.setState({ lodging: data });
  }
  
  // INFORMACION
  getUser(information) {
    axios({
      url: GraphQLURL,
      method: 'post',
      data: {
        query: `query {
                      userById(id: ${information.host_id}) {
                  id
                  name
                  }
           }`
      }
    }).then((result) => {
      if (result.data.data != null) {
        information.host_id = result.data.data.userById.name
        this.setState({ lodging: information, load: true });

      } else {

      }

    }).catch((e) => {
      console.log(e);

    });
  }
  getlocation(information) {
    let city
    let country
    axios({
      url: GraphQLURL,
      method: 'post',
      data: {
        query: `query {
          locationById(id:${information.location_id}){
            country
            city
          }
        }
                    `
      }
    }).then((result) => {
      var info = result.data.data.locationById
      console.log(info)
      country = info.country
      city = info.city
      information.location_id = city.concat(", ", country)
      this.getUser(information)


    }).catch((e) => {
      console.log(e)
      //return "city.concat(",",country)"
    });
  };

  getlodginginfo() {
    axios({
      url: GraphQLURL,
      method: 'post',
      data: {
        query: `query{
            lodgingById(id:${localStorage.LodID}){
              lodging_id
              lodging_name
              lodging_type
              lodging_provide
              lodging_description
              phone_number
              guest_number
              rooms_number
              beds_number
              bathrooms_number
              location_id
              with_wifi
              with_cable_tv
              with_air_conditioning
              with_phone
              with_kitchen
              with_cleaning_items
              price_per_person_and_nigth
              host_id
            }
          }`
      }
    }).then((result) => {
      localStorage.setItem('LodID', null);
      console.log(result)
      if (result.data.data != null) {
        let info = result.data.data.lodgingById;
        switch (info.lodging_provide) {
          case 1:
            info.lodging_provide = "Alojamiento Entero"
            break;
          case 2:
            info.lodging_provide = "Habitación Privada"
            break;
          case 3:
            info.lodging_provide = "Habitación Compartida"
            break;
        }
        switch (info.lodging_type) {
          case 1:
            info.lodging_type = "Departamento"
            break;
          case 2:
            info.lodging_type = "Casa"
            break;
          case 3:
            info.lodging_type = "Vivienda Anexa"
            break;
          case 4:
            info.lodging_type = "Alojamiento Único"
            break;
          case 5:
            info.lodging_type = "Bed and Breakfast"
            break;
        }

        if (info.with_wifi === 0) {
          info.with_wifi = "red"
        } else {
          info.with_wifi = "green"
        }
        if (info.with_cable_tv === 0) {
          info.with_cable_tv = "red"
        } else {
          info.with_cable_tv = "green"
        }

        if (info.with_air_conditioning === 0) {
          info.with_air_conditioning = "red"
        } else {
          info.with_air_conditioning = "green"
        }
        if (info.with_phone === 0) {
          info.with_phone = "red"
        } else {
          info.with_phone = "green"
        }
        if (info.with_kitchen === 0) {
          info.with_kitchen = "red"
        } else {
          info.with_kitchen = "green"
        }
        if (info.with_cleaning_items === 0) {
          info.with_cleaning_items = "red"
        } else {
          info.with_cleaning_items = "green"
        }
        this.getlocation(info);

      } else {
        //this.notify(["danger","Registro Fallido"]);    
      }

    }).catch((e) => {
      console.log(e);
      //this.notify(["danger","Registro Fallido"]);  

    });
  }


  render() {
    return (
      <>
        <div className="content">
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
                                            <Input id="1" placeholder="Teléfono" type="number"  onChange={this.handleChange}/>
                                        </FormGroup>
                                        </Col>
                                        </Row>
                                        <Row>
                                        <Col>
                                        <FormGroup> 
                                            <label>Tipo de Alojamiento</label>
                                            <Input id="0" placeholder="Nombre" type="select" onChange={this.handleChange}>
                                              <option>Departamento</option>
                                              <option>Casa</option>
                                              <option>Vivienda Anexa</option>
                                              <option>Alojamiento Único</option>
                                              <option></option>
                                              </Input>
                                        </FormGroup>
                                        </Col>
                                        <Col>
                                        <FormGroup>
                                            <label>¿De qué dispondrán los huéspedes?</label>
                                            <Input id="1" placeholder="Teléfono" type="select"  onChange={this.handleChange}>
                                            <option>Alojamiento Entero</option>
                                            <option>Habitación Privada</option>
                                            <option>Habitación Compartida</option>
                                            </Input>
                                        </FormGroup>
                                        </Col>
                                        </Row>
                                        <Row>
                                        <Col>
                                        <FormGroup> 
                                        <label>¿A cuantos huéspedes puedes alojar?</label>
                                            <Input id="1" type="number"  onChange={this.handleChange}/>   
                                        </FormGroup>
                                        </Col>
                                        <Col>
                                        <FormGroup>
                                            <label>¿Cuántas habitaciones hay disponibles?</label>
                                            <Input id="1" type="number"  onChange={this.handleChange}/>                                            
                                        </FormGroup>
                                        </Col>
                                        </Row>
                                        <Row>
                                        <Col>
                                        <FormGroup> 
                                        <label>¿Cuántas camas hay disponibles?</label>
                                            <Input id="1" type="number"  onChange={this.handleChange}/>   
                                        </FormGroup>
                                        </Col>
                                        <Col>
                                        <FormGroup>
                                            <label>¿Cuántos baños hay disponibles?</label>
                                            <Input id="1" type="number"  onChange={this.handleChange}/>                                            
                                        </FormGroup>
                                        </Col>
                                        </Row>

                                        
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