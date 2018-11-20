import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import "../node_modules/primeicons/primeicons.css";
// import "../node_modules/primeng/resources/themes/nova-light/theme.css";
import "../node_modules/primeng/resources/primeng.min.css";
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
