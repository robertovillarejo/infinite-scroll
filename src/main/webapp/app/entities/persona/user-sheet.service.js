(function () {
    'use strict';
    angular
        .module('handsontableApp')
        .factory('UserSheet', UserSheet);

    UserSheet.$inject = ['$resource'];

    function UserSheet($resource) {
        var resourceUrl = 'api/users/sheet';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET' }
        });
    }
})();

