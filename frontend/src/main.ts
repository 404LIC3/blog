import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import {provideRouter} from '@angular/router';
import routeConfig from './app/routes';
bootstrapApplication(App, {
  providers: [
    importProvidersFrom(FormsModule),
    provideHttpClient(),
    provideRouter(routeConfig)
  ]
}).catch(err => console.error(err));
