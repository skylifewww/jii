/**
 * @author <a href="http://www.affka.ru">Vladimir Kozhin</a>
 * @license MIT
 */

'use strict';

var Jii = require('../../BaseJii');
var Request = require('./Request');
var Response = require('./Response');
var InvalidRouteException = require('../../exceptions/InvalidRouteException');
var _isString = require('lodash/isString');
var _each = require('lodash/each');
var _extend = require('lodash/extend');
var Component = require('../../base/Component');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');

/**
 * @class Jii.request.http.HttpServer
 * @extends Jii.base.Component
 */
var HttpServer = Jii.defineClass('Jii.request.http.HttpServer', /** @lends Jii.request.http.HttpServer.prototype */{
	
	__extends: Component,

    host: '0.0.0.0',
    port: 3000,

    /**
     * @type {Jii.request.UrlManager|string}
     */
    urlManager: 'urlManager',

    /**
     * @type {string|string[]|object}
     */
    staticDirs: null,

    _express: null,
    _server: null,
    _isExpressSubscribed: false,

    init() {
        this._express = new express();
        this._express.use(bodyParser.json()); // for parsing application/json
        this._express.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
        this._express.use(multer()); // for parsing multipart/form-data

        // Static files
        if (_isString(this.staticDirs)) {
            this.staticDirs = [this.staticDirs];
        }
        _each(this.staticDirs || [], dir => {
            this._express.use(express.static(dir));
        });

        if (_isString(this.urlManager)) {
            this.urlManager = Jii.app.getComponent(this.urlManager);
        }
    },

    /**
     * Start listen http queries
     */
    start() {
        // Subscribe on all requests
        if (!this._isExpressSubscribed) {
            this._isExpressSubscribed = true;
            this._express.all('*', this._onRoute.bind(this));
        }

        Jii.info('Start http server, listening `' + this.host + ':' + this.port + '`.');
        this._server = http.createServer(this._express).listen(this.port, this.host);
    },

    /**
     * Stop listen http port
     */
    stop(c) {
        this._server.close(c);
        Jii.info('Http server is stopped.');
    },

    /**
     * @param {object} expressRequest
     * @param {object} expressResponse
     * @private
     */
    _onRoute(expressRequest, expressResponse) {
        var request = new Request(expressRequest);
        var result = this.urlManager.parseRequest(request);
        if (result !== false) {
            var route = result[0];
            var params = result[1];

            // Append parsed params to request
            var queryParams = request.getQueryParams();
            request.setQueryParams(_extend(queryParams, params));

			// Create response component
			var response = new Response(expressResponse);

			// Create context
			var context = Jii.createContext({route: route});
			context.setComponent('request', request);
			context.setComponent('response', response);

            Jii.app.runAction(route, context);
            return;
        }

        //throw new InvalidRouteException(Jii.t('jii', 'Page not found.'));
        Jii.info('Page not found.');
    }
});

module.exports = HttpServer;