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
import { defaulthome } from '../defaulthome'



class CardLodging extends React.Component {
    constructor(props) {
        super(props);
        this.state = { color: null, load: false, charge: false, location: "", lodging: "", id: null, favorite_id:null,images:[],lodid:null };
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
            this.setState({location: l })
            this.getImages();
            

        }).catch((e) => {
            console.log(e);
        });
    };

    getImages(){
        axios({
          url: GraphQLURL,
          method: 'post',
          data: {
              query: `query {
                      lodging_imageByLodgingid(lodging_id:${this.state.lodid}) {
                      url
                      }
               }`
          }
      }).then((result) => {
          if(result.data.data!=null){
            let data = this.state.images;
            let info = result.data.data.lodging_imageByLodgingid;
            if(info.length===0){
                data[0] = defaulthome;
            }else{
                data[0] = info[0].url;
            }
            
            this.setState({load: true, images:data});
          }else{
     
          }    
      }).catch((e) =>{
        console.log(e);
      });
      }

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
            this.setState({ lodging: info });
            this.getlocation(info.location_id);
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
                this.notify(["success", "A??adido a Favoritos"]);
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
                this.setState({ color: null , favorite_id: null })
                if(this.props.favorite!==null){
                    window.location.pathname = 'mh/favorites'
                }
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
        var reservationinfo = this.props.reserva;
        var lodginginfo = this.props.lodging;
        if (this.props.lodging === null) {
            var lodginginfo = this.state.lodging;
        }
        switch (lodginginfo.lodging_provide) {
            case 1:
                lodginginfo.lodging_provide = "Alojamiento Entero";
                break;
            case 2:
                lodginginfo.lodging_provide = "Habitaci??n Privada";
                break;
            case 3:
                lodginginfo.lodging_provide = "Habitaci??n Compartida";
                break;
            default:
                break;
        }
        if (!this.state.load) {
            if (!this.state.charge) {
                this.state.color = this.props.fav;
                this.state.favorite_id = this.props.fav;
                if(this.props.fav!=null){
                    this.state.color = "red";
                }
                if (this.props.reserva === null) {
                    if(this.props.lodging!==null){
                        this.getlocation(lodginginfo.location_id);
                        this.setState({lodid: this.props.lodging.lodging_id});
                    }else{
                        this.getlodging(this.props.favorite.lodging_id);
                        this.setState({lodid: this.props.favorite.lodging_id});
                    }
                    
                } else {
                    this.getlodging(reservationinfo.lodging_id);
                    this.setState({lodid: reservationinfo.lodging_id});
                }
                this.setState({charge: true});
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
                                    image= {'data:image/png;base64' + this.state.images[0]}
                                    title= {lodginginfo.lodging_name}
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
                                                        <p>{reservationinfo.start_date.substring(0, 10)} -> {reservationinfo.end_date.substring(0, 10)}</p>
                                                        <p>Hu??spedes: {reservationinfo.guest_adult_number} Adulto(s), {reservationinfo.guest_children_number} Ni??o(s)</p>
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