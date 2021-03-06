
'use strict';

var Jii = require('../../BaseJii');
var InvalidParamException = require('../../exceptions/InvalidParamException');
var Collection = require('../../base/Collection');
var Command = require('./Command');
var Component = require('../../base/Component');
var _each = require('lodash/each');

/**
 *
 * @class Jii.data.http.Connection
 * @extends Jii.base.Component
 */
var Connection = Jii.defineClass('Jii.data.http.Connection', /** @lends Jii.data.http.Connection.prototype */{

	__extends: Component,

    /**
     * @type {Jii.data.http.Schema} the database schema
     */
    schema: {
        className: 'Jii.data.http.Schema'
    },

    /**
     * @type {Jii.data.http.TransportInterface}
     */
    transport: null,

    /**
     * @type {string}
     */
    route: 'api/ar',

    /**
     * @type {object}
     */
    _rootCollections: {},

    /**
     * @type {object}
     */
    _data: {},

    init() {
        this.schema = Jii.createObject(this.schema);
    },

    getTransport() {
        if (this.transport === null) {
            this.transport = Jii.app.get('comet');
        } else if (!(this.transport instanceof Component)) {
            this.transport = Jii.createObject(this.transport);
        }
        return this.transport;
    },

    /**
     *
     * @param {string} modelClassName
     * @returns {Jii.base.Collection|null}
     */
    getRootCollection(modelClassName) {
        var modelClass = Jii.namespace(modelClassName);
        if (!modelClass.tableName) {
            throw new InvalidParamException('Wrong model class for create collection: ' + modelClass.className());
        }

        var tableName = modelClass.tableName();
        if (!tableName) {
            throw new InvalidParamException('Table name is not defined in model: ' + modelClass.className());
        }

        if (!this._rootCollections[tableName]) {
            this._rootCollections[tableName] = new Collection(null, {modelClass: modelClass});
            if (this._data[tableName]) {
                this._rootCollections[tableName].set(this._data[tableName]);
            }
        }
        return this._rootCollections[tableName];
    },

    /**
     * Prepare data for root collections
     * @param {object} data
     */
    setData(data) {
        _each(data, (items, tableName) => {
            if (this._rootCollections[tableName]) {
                this._rootCollections[tableName].set(items);
            } else {
                this._data[tableName] = items;
            }
        });
    },

    /**
     * Creates a command for execution.
     * @returns {Jii.data.http.Command} the DB command
     */
    createCommand() {
        return new Command({
            db: this
        });
    },

    /**
     *
     * @param {string} method
     * @param {string} modelClassName
     * @param {object} [params]
     * @returns {Promise}
     */
    exec(method, modelClassName, params) {
        params = params || {};
        params.method = method;
        params.modelClassName = modelClassName;

        return this.getTransport().request(this.route, params);
    },

    /**
     * Returns the schema information for the database opened by this connection.
     * @returns {Jii.data.http.Schema} the schema information for the database opened by this connection.
     */
    getSchema() {
        return this.schema;
    },

    /**
     * Obtains the schema information for the named table.
     * @param {string} name table name.
     * @returns {*} table schema information. Null if the named table does not exist.
     */
    getTableSchema(name) {
        return this.getSchema().getTableSchema(name);
    }

});

module.exports = Connection;