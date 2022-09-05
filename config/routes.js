/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

 // '/': { view: 'pages/homepage' },


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/

  // User Routes
  'POST /user/register': { action: 'user/register-action' },
  'POST /user/login': { action: 'user/login-action' },
  'GET /user/profile': { action: 'user/profile-action' },
  'PATCH /user/update': { action: 'user/update-action' },


  // Admin Routes
  'POST /admin/register': { action: 'admin/register-action' },
  'POST /admin/login': { action: 'admin/login-action' },
  'GET /admin/listAllUsers': { action: 'admin/list-all-users-action' }
  

};
