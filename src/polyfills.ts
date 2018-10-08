import 'core-js/client/shim';
import 'reflect-metadata';
import 'eligrey-classlist-js-polyfill/classList.min';
import * as svg4everybody from 'svg4everybody/dist/svg4everybody.min';
import 'zone.js/dist/zone';

if (process.env.NODE_ENV === 'production') {
  // Production

} else {
  // Development

  Error['stackTraceLimit'] = Infinity;

  require('zone.js/dist/long-stack-trace-zone');
}
svg4everybody();