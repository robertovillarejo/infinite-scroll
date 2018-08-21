(function () {
    'use strict';
    angular
        .module('handsontableApp')
        .factory('PersonaHandsontable', PersonaHandsontable);

    PersonaHandsontable.$inject = ['$resource'];

    function PersonaHandsontable($resource) {
        var resourceUrl = 'api/personas/handsontable';

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

