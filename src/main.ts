import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

import {
  LucideAngularModule,
  X,
  Car,
  LogOut,
  Menu,
  DollarSign,
  Wrench,
  TrendingUp
} from 'lucide-angular';

import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      LucideAngularModule.pick({
        X,
        Car,
        LogOut,
        Menu,
        DollarSign,
        Wrench,
        TrendingUp
      })
    )
  ]
}).catch(err => console.error(err));