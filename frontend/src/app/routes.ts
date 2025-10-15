import {Routes} from '@angular/router';
import {Details} from './details/details';
import {Home} from './home/home';


const routeConfig: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home page',
  },
  {
    path: 'details/:id',
    component: Details,
    title: 'Home details',
  },
];
export default routeConfig;
