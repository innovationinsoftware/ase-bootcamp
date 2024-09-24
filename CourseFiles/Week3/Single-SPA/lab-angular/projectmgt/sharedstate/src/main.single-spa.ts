import { NgZone } from '@angular/core';
import { Router, NavigationStart, provideRouter } from '@angular/router';
import {
  singleSpaAngular,
  getSingleSpaExtraProviders,
  enableProdMode,
} from 'single-spa-angular';
import { environment } from './environments/environment';
import { singleSpaPropsSubject } from './single-spa/single-spa-props';
import { APP_BASE_HREF } from '@angular/common';
import { EmptyRouteComponent } from './app/empty-route/empty-route.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { sharedStateResource } from './services/shared-state.service';
import { apiService } from './services/api.service';
import {
  eventBus,
  emitEvent,
  onEvent,
  removeEvent,
} from './services/event-bus';

if (environment.production) {
  enableProdMode();
}

const lifecycles = singleSpaAngular({
  bootstrapFunction: (singleSpaProps) => {
    singleSpaPropsSubject.next(singleSpaProps);
    const options = {
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        getSingleSpaExtraProviders(),
        provideRouter([{ path: '**', component: EmptyRouteComponent }]),
      ],
    };

    return bootstrapApplication(AppComponent, options);
  },
  template: '<app-sharedstate />',
  Router,
  NavigationStart,
  NgZone,
});

export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;

export const sharedStateService = sharedStateResource();
export const apiServiceInstance = apiService();

export const eventBusInstance = eventBus;
export const emitEventInstance = emitEvent;
export const onEventInstance = onEvent;
export const removeEventInstance = removeEvent;
