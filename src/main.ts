import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { LucideAngularModule, X, Car, LogOut, Menu, DollarSign, Wrench, TrendingUp } from 'lucide-angular';



bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
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
