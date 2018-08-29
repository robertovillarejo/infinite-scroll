(function () {
    'use strict';
    angular
        .module('handsontableApp')
        .factory('DireccionSheet', DireccionSheet);

    DireccionSheet.$inject = ['$resource'];

    function DireccionSheet($resource) {
        var resourceUrl = 'api/direcciones/sheet';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET' },
            'download': {
                method: 'GET',
                url: 'api/direcciones/workbook',
                responseType: 'blob',
                transformResponse: function (data) {
                    return {
                        blob: new Blob([data], {
                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                        })
                    }
                }
            }
        });
    }
})();

