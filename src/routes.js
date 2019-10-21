import Home from "views/Home.jsx";
import Icons from "views/Icons.jsx";
import Notifications from "views/Notifications.jsx";
import TableList from "views/TableList.jsx";
import Typography from "views/Typography.jsx";
import TusPagos from "views/TusPagos.jsx";
import UserProfile from "views/UserProfile.jsx";
import Register from "views/Registro.jsx";
import Login from "views/Login.jsx";

var routes = [
  {
    path: "/home",
    name: "Home",
    icon: "tim-icons icon-planet",
    component: Home,
    layout: "/mh"
  },
  {
    path: "/favorites",
    name: "Favoritos",
    icon: "tim-icons icon-heart-2",
    component: TableList,
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
    component: Typography,
    layout: "/mh"
  },
  
  {
    path: "/mensage",
    name: "Mensajes",
    icon: "tim-icons icon-email-85",
    component: Typography,
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
  {
    path: "/register",
    name: "Register",
    component: Register,
    layout: "/mh"
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    layout: "/mh"
  },
];
export default routes;
