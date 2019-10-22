  
import React from "react";
import {Card,Row,Col} from "reactstrap";
import { makeStyles } from '@material-ui/core/styles';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ShowBill from './TusPagos';

const useStyles = makeStyles({
  media: {
    height: 250
  },
  precio:{
      color: 'red'
  }
});


export default function Home() {
  console.log(localStorage);
 const classes = useStyles();
    return (
        <div className="content">
          <Row>
            <Col lg="4">
              <Card >
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={require("../assets/img/hospedaje.jpeg")}
                    title="hospedaje"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Bogotá
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      Camas super comodas, no se diga mas, animate
                    </Typography>
                    <Typography variant="body3" color="textSecondary" component="p">
                      2 camas dobles, 2 baños.
                    </Typography>
                    <Typography variant="body3" color="textSecondary" component="p">
                      4 adultos, 0 niños.
                    </Typography>
                    <Typography   variant="body3" color="primary" >
                      Total: $650000
                    </Typography>
                
                  </CardContent>
                </CardActionArea>
                
              </Card>
            </Col>
          </Row>
        </div>
    );
  

}

