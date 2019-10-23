  
import React from "react";
import {Card,Row,Col} from "reactstrap";
import { makeStyles } from '@material-ui/core/styles';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CardLodging from "components/CardLodging.jsx";


const useStyles = makeStyles({
  media: {
    height: 250
  },
});


export default function Home() {
  console.log(localStorage);
 const classes = useStyles();
    return (
        <div className="content">
          <Row>
            <Col lg="4">
            <CardLodging name="https://pix6.agoda.net/hotelImages/348529/-1/0eb81c6bf886dc45d066e7c1f2b94f11.jpg"/>
            </Col>

            <Col lg="4">
              <Card >
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={require("../assets/img/hospedaje2.jpg")}
                    title="hospedaje"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Medellin
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      Todo incluido, compralo ahora!
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button size="small" color="primary" >
                     favorito
                  </Button>
                </CardActions>
              </Card>
            </Col>

            <Col lg="4">
              <Card >
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={require("../assets/img/hospedaje3.jpg")}
                    title="hospedaje"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Cali - Tarragona
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      4 cuartos, 2 baños, conjunto con piscina
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button size="small" color="primary" >
                     favorito
                  </Button>
                </CardActions>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg="4">
              <Card >
              <h3>próximamente</h3>
              </Card>
            </Col>
            <Col lg="4">
              <Card >
              <h3>próximamente</h3>
              </Card>
            </Col>
            <Col lg="4">
              <Card >
              <h3>próximamente</h3>
              </Card>
            </Col>
          </Row>
          <Row>
          <Col lg="4">
              <Card >
              <h3>próximamente</h3>
              </Card>
            </Col>
            <Col lg="4">
              <Card >
              <h3>próximamente</h3>
              </Card>
            </Col>
            <Col lg="4">
              <Card >
              <h3>próximamente</h3>
              </Card>
            </Col>
          </Row>
        </div>
    );
  

}

