
"use strict";


var FormUtils = function(items) {
    this.items = items;

    this.prefix = function (item) {
        item = item || {label: '请选择', value: ''};
        return !this.items.length ? [item] : [item].concat(this.items);
    }

    this.subfix = function (item) {
        item = item || {label: '保密', value: '-1'};
        return !this.items.length ? [item] : this.items.concat([item]);
    }

    this.get = function() {
        return this.items;
    }
}

var FormUtilsApi = {
    combine: (data) => {
        var items = data.map((e) => {
            return {label: e, value: e}
        })
        return new FormUtils(items);
    },

    range: (min, max, step, subfix) => {
        step = step || 1;
        subfix = subfix || '';
        var items = [];
        for (var i = min; i <= max; i += step) {
            items.push({
                label: i + subfix,
                value: i
            });
        }
        return new FormUtils(items);
    }
}
module.exports = FormUtilsApi;
