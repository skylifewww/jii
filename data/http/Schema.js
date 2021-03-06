/**
 * @author <a href="http://www.affka.ru">Vladimir Kozhin</a>
 * @license MIT
 */

'use strict';

var Jii = require('../../BaseJii');
var FilterBuilder = require('../../data/FilterBuilder');
var ModelSchema = require('../../data/ModelSchema');
var _isObject = require('lodash/isObject');
var _keys = require('lodash/keys');
var Object = require('../../base/Object');

/**
 * @class Jii.data.http.Schema
 * @extends Jii.base.Object
 */
var Schema = Jii.defineClass('Jii.data.http.Schema', /** @lends Jii.data.http.Schema.prototype */{

	__extends: Object,

    tables: {},

    _filterBuilder: null,

    /**
     * @return {Jii.data.QueryBuilder} the query builder for this connection.
     */
    getFilterBuilder() {
        if (this._filterBuilder === null) {
            this._filterBuilder = this.createFilterBuilder();
        }

        return this._filterBuilder;
    },

    /**
     *
     * @param {string} name
     * @returns {Jii.data.ModelSchema}
     */
    getTableSchema(name) {
        if (_isObject(this.tables[name]) && !(this.tables[name] instanceof ModelSchema)) {
            this.tables[name] = ModelSchema.createFromObject(this.tables[name]);
        }

        return this.tables[name] || null;
    },

    getTableNames() {
        return _keys(this.tables);
    },

    /**
     * @return {Jii.data.FilterBuilder}
     */
    createFilterBuilder() {
        return new FilterBuilder();
    }

});

module.exports = Schema;