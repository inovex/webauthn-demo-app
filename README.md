# WebAuthn Demo

This project demonstrates the integration of WebAuthn in an Angular webapp.

It is based on the [example project](https://github.com/cornflourblue/angular-7-registration-login-example) of Jason Watmore, extending it with WebAuthn functionality.

## Run locally

You need to run this app with SSL/TLS support. Therefore, you need a (selfsigned) key `localhost.key` and a certificate `localhost.crt`being placed in the app's root.
See [here](https://medium.com/@richardr39/using-angular-cli-to-serve-over-https-locally-70dab07417c8) for detailed instructions.
 
Then, run `npm start` for a local ssl dev server. Navigate to `https://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Backend service

You need to have a webservice supporting WebAuthn running. 
We recommend to use [Yubico's demo server](https://github.com/Yubico/java-webauthn-server/tree/master/webauthn-server-demo) as a starting point.
You can configure the endpoint urls this app is using in the  `environment.ts`. 

## Further information
See [here](https://www.inovex.de/de/content-pool/vortraege/webauthn-in-practice/) for more informations about this app and its purpose evaluating WebAuthns usability. 
