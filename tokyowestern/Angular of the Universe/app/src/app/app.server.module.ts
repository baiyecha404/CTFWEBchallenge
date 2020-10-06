import { NgModule } from '@angular/core';
import { ServerModule, INITIAL_CONFIG } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: INITIAL_CONFIG, useValue: { useAbsoluteUrl: true } }
  ]
})
export class AppServerModule {}
