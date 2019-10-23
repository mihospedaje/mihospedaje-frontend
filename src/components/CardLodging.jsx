import React from "react";
import axios from 'axios';
// reactstrap components
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import {Card,Row,Col,CardBody,CardHeader} from "reactstrap";
import { func } from "prop-types";

const useStyles = makeStyles({
    media: {
      height: 250
},
});
var sectionStyle = {
    fontSize : "100%",
    

  };
var lodginginfo ={

}
function getlodging(){
    return {name:"Finca El Tesoro",location:"Villeta, Cundinamarca",type:"Habitacion Privada",precio:198000,id:1};
};
function getreservation(){
    return {fechast:"2019/09/09",fechaend:"2019/09/19",adults:1,children:1,total:198000};
};

export default function LodgingCard(props) {
    const classes = useStyles();
    var lodginginfo = getlodging();
    if(props.reserva=="true"){
        var reserinfo = getreservation()
    }
        return (
            <>
             <Card>
              <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image="https://pix6.agoda.net/hotelImages/348529/-1/0eb81c6bf886dc45d066e7c1f2b94f11.jpg"
                    title="hospedaje"                    
                  />
               
                          
                <CardBody>
                    <Row>
                        <Col>
                        <p>{lodginginfo.location}</p> 
                        <p style={{fontSize : "180%"}} className="title">{lodginginfo.name}</p>
                        <p>{lodginginfo.type}</p>
                        {
                            props.reserva== "true" ? null :(
                                <p>${lodginginfo.precio} COP por noche</p>
                            )
                        }
                        {
                            props.reserva== "false" ? null :(
                                <div>
                                <p>{reserinfo.fechast} -> {reserinfo.fechaend}</p>
                                <p>Huéspedes:{reserinfo.adults} Adulto(s), {reserinfo.children} Niño(s)</p>
                                <p>Total: ${reserinfo.total} COP</p>
                                </div>
                            )
                        }
                        </Col>
                        <div className="justify-content-center"><IconButton aria-label="add to favorites"><FavoriteIcon/></IconButton></div>
                    </Row>
                </CardBody>
                </CardActionArea>
                </Card>
            </>
        );
    }

