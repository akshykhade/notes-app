import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from 'app/app.module';
import * as Sentry from '@sentry/angular';
import { BrowserTracing } from '@sentry/tracing';
import { environment } from 'environments/environment';
import { enableProdMode } from '@angular/core';
Sentry.init({
    dsn: environment.sentry.dsn,
    integrations: [
        new BrowserTracing({
            tracePropagationTargets: ["localhost", /^\//],
            routingInstrumentation: Sentry.routingInstrumentation,

        }),
    ],

    tracesSampleRate: environment.sentry.samplerate,
});

if (environment.production) {
    enableProdMode();
}
platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
