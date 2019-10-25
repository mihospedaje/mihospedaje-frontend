import Home from "views/Home.jsx";
import Icons from "views/Icons.jsx";
import Notifications from "views/Notifications.jsx";
import Typography from "views/Typography.jsx";
import TusPagos from "views/TusPagos.jsx";
import UserProfile from "views/UserProfile.jsx";
import Register from "views/Registro.jsx";
import Login from "views/Login.jsx";
import Lodging from "views/Lodging.jsx";
import LodgingCreate from "views/LodgingCreate.jsx";

var routes = [
  {
    path: "/home",
    name: "Home",
    icon: "tim-icons icon-world",
    component: Home,
    layout: "/mh"
  },
  {
    path: "/favorites",
    name: "Favoritos",
    icon: "tim-icons icon-heart-2",
    component: Home, //TableList
    layout: "/mh"
  },
  {
    path: "/reservations",
    name: "Mis Reservas",
    icon: "tim-icons icon-calendar-60",
    component: Typography,
    layout: "/mh"
  },
  {
    path: "/anocement",
    name: "Mis Anuncios",
    icon: "tim-icons icon-single-copy-04",
    component: Home, //Typography
    layout: "/mh"
  },
  
  {
    path: "/payment",
    name: "Mis Pagos",
    icon: "tim-icons icon-money-coins",
    component: TusPagos,
    layout: "/mh"
  },
  {
    path: "/profile",
    name: "Perfil",
    icon: "tim-icons icon-single-02",
    component: UserProfile,
    layout: "/mh"
  },
  /*
  {
    path: "/notifications",
    name: "Notifications",
    icon: "tim-icons icon-bell-55",
    component: Notifications,
    layout: "/mh"
  },
  
  {
    path: "/icons",
    name: "Icons",
    icon: "tim-icons icon-atom",
    component: Icons,
    layout: "/mh"
  },
  */
  {
    path: "/register",
    name: "Registro",
    icon: "tim-icons icon-check-2",
    component: Register,
    layout: "/mh"
  },
  {
    path: "/login",
    name: "Iniciar Sesión",
    icon: "tim-icons icon-badge",
    component: Login,
    layout: "/mh"
  },
  {
    path: "/lodging",
    name: "Hospedaje",
    icon: "tim-icons icon-badge",
    component: Lodging,
    layout: "/mh"
  },
  {
    path: "/createlodging",
    name: "CrearHospedjae",
    icon: "tim-icons icon-badge",
    component: LodgingCreate,
    layout: "/mh"
  },
];
export default routes;
