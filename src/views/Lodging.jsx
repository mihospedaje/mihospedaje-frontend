import React from 'react';
import axios from 'axios';
import { GraphQLURL } from '../ipgraphql'
import ItemsCarousel from 'react-items-carousel';
import range from 'lodash/range';
import CardMedia from '@material-ui/core/CardMedia';
import Popup from "reactjs-popup";
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Button, Input, Form, FormGroup } from "reactstrap";
import HomeIcon from '@material-ui/icons/Home';
import WifiIcon from '@material-ui/icons/Wifi';
import TvIcon from '@material-ui/icons/Tv';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import PhoneIcon from '@material-ui/icons/Phone';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import LocalLaundryServiceIcon from '@material-ui/icons/LocalLaundryService';
import NotificationAlert from "react-notification-alert";
import Helmet from 'react-helmet';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { CodeStarNotifications } from 'aws-sdk';

export default class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lodging: [],
      reservation: [],
      load: false,
      charge: false,
      id: null,
      host_id: null,
      color:null,
      tofav:null,
      from:null,
      to:null,
      price: 0
    };
    this.getlodginginfo = this.getlodginginfo.bind(this);
    this.updatebill = this.updatebill.bind(this);
    this.Reserva = this.Reserva.bind(this);
    this.makepeticion = this.makepeticion.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validatetoken = this.validatetoken.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.calculateprice = this.calculateprice.bind(this);
  }
  handleChange(event) {
    let data = this.state.reservation;
    data[parseInt(event.target.id, 10)] = event.target.value;
    this.setState({ reservation: data });
  }
  // FOTOS
  componentWillMount() {
    this.setState({
      children: [],
      activeItemIndex: 0,
    });

    setTimeout(() => {
      this.setState({
        children: range(3).map(i => <CardMedia key={i}
          image="https://pix6.agoda.net/hotelImages/348529/-1/0eb81c6bf886dc45d066e7c1f2b94f11.jpg"
          title="hospedaje"
          style={{ height: 400 }}
        />)
      })
    }, 100);
  }
  addtofav(lodging_id) {
    if (localStorage.IsLogged === "true") {
      if (this.state.color === null) {
        this.createfav(lodging_id);
      } else {
        this.deletefav()
      }
    } else {
        window.location.pathname = 'mh/login';
    }
}
createfav(lodging_id) {
  axios({
      url: GraphQLURL,
      method: 'post',
      data: {
          query: `mutation{
          createFavorite(favorite:{
            user_id: ${this.state.id}
            lodging_id: ${lodging_id}
          }){
            id
          }
        }
                    `
      }
  }).then((result) => {
      if (result.data.data != null) {
          this.notify(["success", "Añadido a Favoritos"]);
          this.setState({ color: "red", favorite_id: result.data.data.createFavorite.id})
      }
  }).catch((e) => {
      console.log(e);
  });

}
deletefav() {
  axios({
      url: GraphQLURL,
      method: 'post',
      data: {
          query: `mutation{
          deleteFavorite(id:${this.state.favorite_id})
          }            
                    `
      }
  }).then((result) => {
      if (result.data.data != null) {
          this.notify(["success", "Eliminado de Favoritos"]);
          this.setState({ color: null })
      }
  }).catch((e) => {
      console.log(e);
  });
  
  //
}

  changeActiveItem = (activeItemIndex) => this.setState({ activeItemIndex });
  // INFORMACION
  getUser(information){
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
      if(result.data.data!=null){
        let a = information.host_id
        information.host_id = result.data.data.userById.name
        this.setState({ lodging: information, load: true, host_id: a });
      
      }else{
 
      }

  }).catch((e) =>{
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
        }`
      }
    }).then((result) => {
      var info = result.data.data.locationById
      country = info.country
      city = info.city
      information.location_id = city.concat(", ",country)
      this.getUser(information)
      
      
    }).catch((e) => {
      console.log(e);
    });
  };
  makepeticion() {
    if(localStorage.IsLogged=="true"){
      axios({
        url: GraphQLURL,
        method: 'post',
        data: {
          query: `mutation {
            createReservation(reservation: {
                        user_id: ${this.state.id}
                        start_date: "${this.state.reservation[0]}"
                        end_date: "${this.state.reservation[1]}"
                        guest_adult_number: ${this.state.reservation[2]}
                        guest_children_number: ${this.state.reservation[3]}
                        is_cancel: false
                        lodging_id: ${this.state.lodging.lodging_id}                        
                        
                        }) {
                          reservation_id
                        }
                    }
                    `
        }
      }).then((result) => {
        if (result.data.data!=null) {
          let a = result.data.data.createReservation.reservation_id
          //this.notify(["success", "Actualización Exitosa con id: ".concat(a)]);
          //window.location.pathname = '/mh/home'
          this.updatebill(a)
        } else {
          this.notify(["danger", "No se ha realizado la reserva"]);
          //this.notify(["danger", "Actualización Fallida"]);
        }

      }).catch((e) => {
        console.log(e);
        this.notify(["danger", "No se ha realizado la reserva"]);
      });
    }else{
      window.location.pathname = '/mh/login';
    }
    
    
  };
  updatebill(a) {
      axios({
        url: GraphQLURL,
        method: 'post',
        data: {
          query: `mutation {
            createPayment(payment: {
                        user_id: ${this.state.id}
                        amount: ${this.state.price}
                        reservation_id: ${a}
                        method: "master card"                                 
                        }) {
                          user_id
                        }
                    }
                    `
        }
      }).then((result) => {
        if (result.data.data!=null) {
          let b = result.data.data.createPayment.user_id;
          this.notify(["success", "Se ha realizado la reserva"]);
        } else {
          this.notify(["danger", "No se ha realizado la reserva"]);
        }

      }).catch((e) => {
        console.log(e);
        this.notify(["danger", "No se ha realizado la reserva"]);
      });
    
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

 handleDayClick(day) {
    const range = DateUtils.addDayToRange(day, this.state);
    this.setState(range);
  }
  calculateprice(start_date,end_date){
    if(start_date!==null && end_date!==null && (this.state.reservation[2]!==undefined && this.state.reservation[2]!=="" ) && (this.state.reservation[3]!==undefined && this.state.reservation[3]!=="" ) ){
      let a = this.state.lodging.price_per_person_and_nigth * (parseInt(this.state.reservation[2])+ parseInt(this.state.reservation[3])) * ((end_date - start_date) / (1000 * 3600 * 24))
      let data = this.state.reservation;
      start_date = start_date.toLocaleDateString()
      start_date = start_date.split("/")
      data[0] = start_date[2]+"-"+start_date[0]+"-"+start_date[1];
      end_date = end_date.toLocaleDateString()
      end_date = end_date.split("/")
      data[1] =  end_date[2]+"-"+end_date[0]+"-"+end_date[1];
      if(this.state.price!==a){
        this.setState({ price: a});
      }
      if(this.state.reservation[0]!==data[0]){
        this.setState({reservation:data})
      }
    }    
  }
  Reserva() {
    const from = this.state.from
    const to = this.state.to ;
    const modifiers = { start: from, end: to };
    return (
      <Popup trigger={<Button className="btn-fill" color="primary" type="submit">Reservar</Button>}
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
            <div className="header2"> Reservar alojamiento </div>
            <div>
            <br/>
            <Form>
            <FormGroup >
            <label>Seleccione las fechas de la reserva</label>
            <div className="text-center">
            <div className="RangeExample">
        <DayPicker
          className="Selectable"
          numberOfMonths={1}
          selectedDays={[from, { from, to }]}
          modifiers={modifiers}
          onDayClick={this.handleDayClick}
          disabledDays={[
            {
              before: new Date(),
            },
          ]}
        />
        <Helmet>
          <style>{`
  .Selectable .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
    background-color: #f0f8ff !important;
    color: #4a90e2;
  }
  .Selectable .DayPicker-Day {
    border-radius: 0 !important;
  }
  .Selectable .DayPicker-Day--start {
    border-top-left-radius: 50% !important;
    border-bottom-left-radius: 50% !important;
  }
  .Selectable .DayPicker-Day--end {
    border-top-right-radius: 50% !important;
    border-bottom-right-radius: 50% !important;
  }
  .DayPicker {
    font-size: 12px;
  }
`}</style>
        </Helmet>
      </div>
      <label onChange={this.calculateprice(from,to)}>
          {!from && !to && 'Seleccione la Fecha de Arrivo'}
          {from && !to && 'Seleccione la Fecha de Salida'}
          {from &&
            to &&
            `Seleccionado de ${from.toLocaleDateString()} a
                ${to.toLocaleDateString()}`
                }{' '}
            
        </label>
        </div>
            </FormGroup>
            <FormGroup>
              <label>Número de huéspedes adultos</label>
              <Input id="2" placeholder="1-16" type="number"  onChange={this.handleChange}/>
            </FormGroup>
            <FormGroup>
              <label>Número de huéspedes niños</label>
              <Input id="3" placeholder="1-16" type="number"  onChange={this.handleChange}/>
            </FormGroup>
            <FormGroup>
              <label>Precio: </label>
              <label>${this.state.price} COP</label>
            </FormGroup>
            <div className="text-center">
              <Button className="btn-fill" color="primary" onClick={()=>this.makepeticion()}>Hacer reserva</Button>
              </div>
            </Form>
            </div>
          </div>
        )}


      </Popup>

    );
  };

  getlodginginfo() {
    axios({
      url: GraphQLURL,
      method: 'post',
      data: {
        query: `query{
            lodgingById(id:${localStorage.View_Lodging}){
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
        
        if(info.with_wifi === 0){
          info.with_wifi = "red"
        }else{
          info.with_wifi = "green"
        }
        if(info.with_cable_tv === 0){
          info.with_cable_tv = "red"
        }else{
          info.with_cable_tv = "green"
        }
        
        if(info.with_air_conditioning === 0){
          info.with_air_conditioning = "red"
        }else{
          info.with_air_conditioning = "green"
        }
        if(info.with_phone === 0){
          info.with_phone = "red"
        }else{
          info.with_phone = "green"
        }
        if(info.with_kitchen === 0){
          info.with_kitchen = "red"
        }else{
          info.with_kitchen = "green"
        }
        if(info.with_cleaning_items === 0){
          info.with_cleaning_items = "red"
        }else{
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
  update(id){
      window.location.pathname = '/mh/updatelodging'
      localStorage.setItem('Update_Lodging', parseInt(id));
  
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
        this.getlodginginfo();
    
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
  viewprofile(){
    localStorage.setItem('View_User', this.state.host_id);
    window.location.pathname = 'mh/profile'
    
  }


  render() {
    const {
      activeItemIndex,
      children,
    } = this.state;
    if (!this.state.load) {
      if (!this.state.charge) {
        if(localStorage.My_fav!="null"){
          this.state.favorite_id = parseInt(localStorage.My_fav);
          this.state.color = "red";
        }else{
          this.state.color = null;
        
        }
        if(localStorage.IsLogged  == "true" ){
          this.validatetoken();
        }else{
          this.getlodginginfo();
        }
        this.setState({ charge: true });
      }
      return (<>
        <div className="content"></div>
      </>)
    } else {
      let lodginginfo = this.state.lodging;
      return (
        <>
          <div className="content">
          <div className="react-notification-alert-container">
            <NotificationAlert ref="notificationAlert" />
          </div>
            <Row>

              <Col lg="5">
                <Card className="card-user">
                  <div className="author">
                    <div className="block block-one" />
                  </div>
                  <CardBody>
                    <ItemsCarousel
                      // Carousel configurations
                      numberOfCards={1}
                      gutter={0}
                      showSlither={true}
                      firstAndLastGutter={true}
                      freeScrolling={false}
                      // Active item configurations
                      requestToChangeActive={this.changeActiveItem}
                      activeItemIndex={activeItemIndex}
                      activePosition={'center'}
                      chevronWidth={150}
                      chevronHeigth={150}
                      rightChevron={' '}
                      leftChevron={' '}
                      outsideChevron={false}
                    >
                      {children}
                    </ItemsCarousel>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="7">
                <Row>
                  <Card>
                    <CardHeader >
                      <CardTitle className="text-center"><h1 className="title">{lodginginfo.lodging_name}</h1></CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Row>
                      <Col>
                      <Row><Col><p>{lodginginfo.location_id}</p></Col></Row>
                      <Row><Col><p>Teléfono: {lodginginfo.phone_number}</p></Col></Row>
                      </Col>
                      <Col>
                          <Row>
                          <CardMedia 
                            onClick = {()=>this.viewprofile()}
                            className="avatar"
                            image="https://concepto.de/wp-content/uploads/2018/08/persona-e1533759204552.jpg"
                            title= {lodginginfo.host_id}
                            style={{ height: 50, width: 50 }}
                            />
                            &nbsp;
                            <label><label style={{ fontSize: "150%"}}>{lodginginfo.host_id}</label>
                            <IconButton style={{color: this.state.color}} onClick={() => this.addtofav(lodginginfo.lodging_id)} aria-label="add to favorites"><FavoriteIcon style={{ width:35 , height:35 }} /></IconButton>
                         </label>
                         
                          </Row>
                         </Col>
                        </Row>
                      
                      <Row style={{borderBottom: "1px solid rgb(212, 212, 212)"}}>
                        <Col>
                          <CardHeader className="text-center" >
                            <p className="title" style={{ fontSize: "150%"}}>Descripción</p>
                          </CardHeader>
                          <Row><Col>{lodginginfo.lodging_description}</Col></Row>
                          <br/>
                        </Col>
                       
                      </Row>
                      <br/>
                      <Row>
                        <Col>
                      <IconButton style={{color:"black"}}><HomeIcon/></IconButton>
                          {lodginginfo.lodging_type} - {lodginginfo.lodging_provide}
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                        <Col><p className="title">
                        {lodginginfo.guest_number} Huéspedes &nbsp; &nbsp;
                        {lodginginfo.rooms_number} Habitaciones &nbsp; &nbsp;
                        {lodginginfo.beds_number} Camas &nbsp; &nbsp;
                        {lodginginfo.bathrooms_number} Baños &nbsp; &nbsp;</p>
                          </Col>
                        </Col>
                      </Row>
                      <Row>
                      <Col>
                      <IconButton style={{color:lodginginfo.with_wifi}}><WifiIcon/></IconButton>
                      Wifi
                      </Col>
                      <Col>
                      <IconButton style={{color:lodginginfo.with_cable_tv}}><TvIcon/></IconButton>
                      TV Cable
                      </Col>
                      </Row>
                      <Row>
                      <Col>
                      <IconButton style={{color:lodginginfo.with_air_conditioning}}><AcUnitIcon/></IconButton>
                      Aire Acondicionado
                      </Col>
                      <Col>
                      <IconButton style={{color:lodginginfo.with_phone}}><PhoneIcon/></IconButton>
                      Teléfono
                      </Col>
                      </Row>
                      <Row>
                      <Col>
                      <IconButton style={{color:lodginginfo.with_kitchen}}><RestaurantIcon/></IconButton>
                      Cocina
                      </Col>
                      <Col>
                      <IconButton style={{color:lodginginfo.with_cleaning_items}}><LocalLaundryServiceIcon/></IconButton>
                      Elementos de Aseo
                      </Col>
                      </Row>
                      <br/>
                      <Row>
                        <Col>
                      <Row>
                        <Col><Col><p>Arriendalo por solo: </p></Col></Col>
                      </Row>
                      <Row>
                        <Col><Col><p className="title" style={{ fontSize: "150%"}}>${lodginginfo.price_per_person_and_nigth} COP &nbsp;</p>
                        <p>Noche por Persona</p></Col></Col>
                      </Row>
                      </Col>
                      <Col>
                      <br/>
                      {
                          this.state.host_id  == this.state.id ? null : (
                            <this.Reserva/>
                          )
                       }
                      {
                          this.state.host_id  != this.state.id ? null : (
                            <Button className="btn-fill" color="primary" type="submit" onClick={()=>this.update(lodginginfo.lodging_id)}>
                           Editar
                          </Button>
                          )
                       }
                      
                      </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Row>

              </Col>


            </Row>

          </div>
        </>
      );

    }
  }
} 
