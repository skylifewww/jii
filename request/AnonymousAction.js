/**
 * @author <a href="http://www.affka.ru">Vladimir Kozhin</a>
 * @license MIT
 */

'use strict';

var Jii = require('../BaseJii');
var Action = require('../base/Action');

/**
 * @class Jii.request.AnonymousAction
 * @extends Jii.base.Action
 */
var AnonymousAction = Jii.defineClass('Jii.request.AnonymousAction', /** @lends Jii.request.AnonymousAction.prototype */{

	__extends: Action,

	/**
	 * @type {string} the controller method that  this inline action is associated with
	 */
	route: null,

    /**
     * @type {function}
     */
    handler: null,

    /**
     * @type {Jii.base.Module}
     */
    module: null,

	constructor(route, module, handler, config) {
		this.route = route;
		this.handler = handler;
		this.module = module;

        var id = route.split('/').pop();
		this.__super(id, null, config);
	},

    /**
     * Returns the unique ID of this action among the whole application.
     * @returns {string} the unique ID of this action among the whole application.
     */
    getUniqueId() {
        return this.route;
    },

	/**
	 * Runs this action with the specified parameters.
	 * This method is mainly invoked by the controller.
	 * @param {Jii.base.Context} context
	 * @returns {*} the result of the action
	 */
	runWithParams(context) {
        return Promise.resolve().then(() => {
            return this.handler.call(this.module, context);
        });
	}
});

module.exports = AnonymousAction;