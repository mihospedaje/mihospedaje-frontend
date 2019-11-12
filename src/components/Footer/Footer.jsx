import React from "react";
import { Container} from "reactstrap";

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <Container fluid>
          <div className="copyright">
            © {new Date().getFullYear()} made with{" "}
            <i className="tim-icons icon-heart-2" /> by{" "}
            <a
              href="https://github.com/mihospedaje"
              rel="noopener noreferrer"
              target="_blank"
            >
              Mi Hospedaje
            </a>{" "}
            for an unforgettable experience
          </div>
        </Container>
      </footer>
    );
  }
}

export default Footer;
