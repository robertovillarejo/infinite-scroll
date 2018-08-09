(function () {
    'use strict';
    angular
        .module('handsontableApp')
        .factory('PersonaHandsontable', PersonaHandsontable);

    PersonaHandsontable.$inject = ['$resource'];

    function PersonaHandsontable($resource) {
        var resourceUrl = 'api/personas/handsontable';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET' }
        });
    }
})();

