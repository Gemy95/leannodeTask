/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  //  '*': true,


  'user/*': 'isUserLoggedIn',
  'user/login-action': true,
  'user/register-action': true,


  'admin/*': 'isAdminLoggedIn',
  'admin/login-action': true,
  'admin/register-action': true,
};
