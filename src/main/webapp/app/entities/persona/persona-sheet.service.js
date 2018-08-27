(function () {
    'use strict';
    angular
        .module('handsontableApp')
        .factory('PersonaSheet', PersonaSheet);

    PersonaSheet.$inject = ['$resource'];

    function PersonaSheet($resource) {
        var resourceUrl = 'api/personas/sheet';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET' },
            'download': {
                method: 'GET',
                url: 'api/personas/workbook',
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

