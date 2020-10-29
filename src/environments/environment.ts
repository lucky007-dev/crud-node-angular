// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl:'http://localhost:3000/api/',
  SOCKET_ENDPOINT: 'http://localhost:3000',
  STRIPE_PUBLIC_KEY:'pk_test_51HcbyRJRL6IOCxYjASPel6u8hWnr6YcrPiKGVfeJebJpHVEYae998ytOcX9ECCSKXVwQtsV1WklqKJLBhLqNWJu000rBbChF4h'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
