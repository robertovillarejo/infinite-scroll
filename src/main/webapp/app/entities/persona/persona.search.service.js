(function() {
    'use strict';

    angular
        .module('handsontableApp')
        .factory('PersonaSearch', PersonaSearch);

    PersonaSearch.$inject = ['$resource'];

    function PersonaSearch($resource) {
        var resourceUrl =  'api/_search/personas/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();
