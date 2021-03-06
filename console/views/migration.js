'use strict';

var Jii = require('jii');
var Migration = require('jii/data/Migration');

/**
 * @class <%= className %>
 * @extends Jii.data.Migration
 */
module.exports = Jii.defineClass('<%= className %>', /** @lends <%= className %>.prototype */{

    __extends: Migration,

    up() {

    },

    down() {
        console.log('<%= className %> cannot be reverted.');
        return false;
    }

});
