/**
 * A hack to have leaflet as a module since mapbox does not really
 * support require.  Only needed if using the Mapbox.js library.
 */
define(['mapbox'], function(mapbox) {
  return window.L;
});
