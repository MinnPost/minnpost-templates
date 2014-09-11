/**
 * An attempt to ensure that Require only uses the jQuery
 * we want and not the one that is included on our site.
 */
define(['jquery'], function($) {
  return $.noConflict(true);
});
