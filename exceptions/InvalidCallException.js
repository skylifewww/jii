/**
 * @author Vladimir Kozhin <affka@affka.ru>
 * @license MIT
 */

'use strict';

var Jii = require('../BaseJii');
var ApplicationException = require('./ApplicationException');

/**
 * @class Jii.exceptions.InvalidCallException
 * @extends Jii.exceptions.ApplicationException
 */
var InvalidCallException = Jii.defineClass('Jii.exceptions.InvalidCallException', /** @lends Jii.exceptions.InvalidCallException.prototype */{

	__extends: ApplicationException

});

module.exports = InvalidCallException;