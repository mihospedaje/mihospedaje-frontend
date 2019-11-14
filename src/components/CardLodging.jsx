import React from "react";
import axios from 'axios';
import { GraphQLURL } from '../ipgraphql'
// reactstrap components
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Card, Row, Col, CardBody } from "reactstrap";
import NotificationAlert from "react-notification-alert";




class CardLodging extends React.Component {
    constructor(props) {
        super(props);
        this.state = { color: null, load: false, charge: false, location: "", lodging: "", id: null, favorite_id:null };
        this.addtofav = this.addtofav.bind(this);
        this.getlocation = this.getlocation.bind(this);
        this.createfav = this.createfav.bind(this);
        this.validatetoken = this.validatetoken.bind(this);
        this.getid = this.getid.bind(this);
    }
    getlocation(idlocation) {
        let city
        let country
        axios({
            url: GraphQLURL,
            method: 'post',
            data: {
                query: `query {
              locationById(id:${idlocation}){
                country
                city
              }
            }
                        `
            }
        }).then((result) => {
            var info = result.data.data.locationById
            country = info.country
            city = info.city
            let l = city.concat(", ", country)
            this.setState({ load: true, location: l })

        }).catch((e) => {
            console.log(e);
        });
    };

    getlodging(id) {
        axios({
            url: GraphQLURL,
            method: 'post',
            data: {
                query: `query {
                lodgingById(id:${id}) {
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
            var info = result.data.data.lodgingById
            this.setState({ load: true, lodging: info });
        }).catch((e) => {
            console.log(e);
        });
    };

    gotolodging(id) {
        localStorage.setItem('View_Lodging', parseInt(id));
        localStorage.setItem('My_fav',this.state.favorite_id)
        window.location.pathname = '/mh/lodging'
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
    addtofav(lodging_id) {
        if (localStorage.IsLogged === "true") {
            this.validatetoken(lodging_id);
        } else {
            window.location.pathname = 'mh/login';
        }
    }
    getid(email, lodging_id) {
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
            if (result.data.data != null) {
                this.setState({ id: result.data.data.userByEmail.id });
                if (this.state.color === null) {
                    this.createfav(lodging_id);
                } else {
                    this.deletefav()
                }
            }
        }).catch((e) => {
            console.log(e);
        });
    }
    validatetoken(lodging_id) {
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
                this.getid(email, lodging_id);
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
        if (this.props.reserva === null) {
            var lodginginfo = this.props.lodinfo;
            switch (lodginginfo.lodging_provide) {
                case 1:
                    lodginginfo.lodging_provide = "Alojamiento Entero"
                    break;
                case 2:
                    lodginginfo.lodging_provide = "Habitación Privada"
                    break;
                case 3:
                    lodginginfo.lodging_provide = "Habitación Compartida"
                    break;
                default:
                    break;
            }
        } else {
            var reservationinfo = this.props.reserva;
            var lodginginfo = this.state.lodging;
            switch (lodginginfo.lodging_provide) {
                case 1:
                    lodginginfo.lodging_provide = "Alojamiento Entero"
                    break;
                case 2:
                    lodginginfo.lodging_provide = "Habitación Privada"
                    break;
                case 3:
                    lodginginfo.lodging_provide = "Habitación Compartida"
                    break;
                default:
                    break;
            }
        }
        if (!this.state.load) {
            if (!this.state.charge) {
                this.state.color = this.props.fav;
                this.state.favorite_id = this.props.fav;
                
                if(this.props.fav!=null){
                    this.state.color = "red";
                }
                if (this.props.reserva === null) {
                    this.getlocation(lodginginfo.location_id);
                } else {
                    this.getlodging(reservationinfo.lodging_id);
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
                        <div className="react-notification-alert-container">
                            <NotificationAlert ref="notificationAlert" />
                        </div>
                        <Card >
                            <CardActionArea >
                                <CardMedia
                                    image="https://pix6.agoda.net/hotelImages/348529/-1/0eb81c6bf886dc45d066e7c1f2b94f11.jpg"
                                    title="hospedaje"
                                    style={{ height: 250 }}
                                    onClick={() => this.gotolodging(lodginginfo.lodging_id)}
                                />
                                <CardBody >
                                    <Row >
                                        <Col onClick={() => this.gotolodging(lodginginfo.lodging_id)}>
                                            <p>{this.state.location}</p>
                                            <p style={{ fontSize: "180%" }} className="title">{lodginginfo.lodging_name}</p>
                                            <p>{lodginginfo.lodging_provide}</p>
                                            {
                                                this.props.reserva != null ? null : (
                                                    <p>${lodginginfo.price_per_person_and_nigth} COP por noche</p>
                                                )
                                            }
                                            {
                                                this.props.reserva == null ? null : (
                                                    <div>
                                                        <p>{reservationinfo.start_date.substring(0, 10)} -> {reservationinfo.start_date.substring(0, 10)}</p>
                                                        <p>Huéspedes:{reservationinfo.guest_adult_number} Adulto(s), {reservationinfo.guest_children_number} Niño(s)</p>
                                                        <p>Total: $15000 COP</p>
                                                    </div>
                                                )
                                            }
                                        </Col>
                                        <div className="justify-content-center"><IconButton style={{ color: this.state.color }} onClick={() => this.addtofav(lodginginfo.lodging_id)} aria-label="add to favorites"><FavoriteIcon /></IconButton></div>
                                    </Row>
                                </CardBody>
                            </CardActionArea>
                        </Card>
                    </div>
                </>
            );
        }
    }
}


export default CardLodging;