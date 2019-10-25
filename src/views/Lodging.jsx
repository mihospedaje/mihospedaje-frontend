import React from 'react';
import ItemsCarousel from 'react-items-carousel';
import range from 'lodash/range';
import CardMedia from '@material-ui/core/CardMedia';
import {Row, Col, Card, CardBody, CardHeader, CardTitle} from "reactstrap";
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';

export default class Test extends React.Component {
  
  componentWillMount() {
    this.setState({
      children: [],
      activeItemIndex: 0,
    });

    setTimeout(() => {
      this.setState({
        children: range(20).map(i => <CardMedia key={i}
          image="https://pix6.agoda.net/hotelImages/348529/-1/0eb81c6bf886dc45d066e7c1f2b94f11.jpg"
          title="hospedaje"
          style={{ height: 400}}
      />)
      })
    }, 100);
  }

 
  changeActiveItem = (activeItemIndex) => this.setState({ activeItemIndex });

  render() {
    const {
      activeItemIndex,
      children,
    } = this.state;

    return (
      <>
      <div className="content">
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
            <CardTitle className="text-center"><h1 className="title">Hola, mi nombre es</h1></CardTitle>
            <p>Londres, Reino Unido</p>
          </CardHeader>
          <CardBody>
            <Row>
              <Col>
          <CardMedia 
          className = "avatar"
          image="https://pix6.agoda.net/hotelImages/348529/-1/0eb81c6bf886dc45d066e7c1f2b94f11.jpg"
          title="hospedaje"
          style={{ height: 60 , width:60}}
          />
          </Col>
          <Col><Row>Sara Peña</Row><Row>+573124980393</Row></Col>
          <div className="justify-content-center"><IconButton style={{color: this.state.color}} onClick={()=>this.addtofav()} aria-label="add to favorites"><FavoriteIcon/></IconButton></div>
          </Row>
          <Row>
            <Col>
          <CardHeader >
            <CardTitle className="text-center"><h3 className="title">Descripción</h3></CardTitle>
          </CardHeader>
          <Row className="text-center"><Col>Esta en una finca campestre mi pes, muy bonita mi cosita</Col></Row>
          </Col>
          </Row>
          <Row>
            <Col>
          <Row className="text-center"><Col>Esta en una finca campestre mi pes, muy bonita mi cosita</Col></Row>
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