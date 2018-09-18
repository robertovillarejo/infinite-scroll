(function() {
    'use strict';
    angular
        .module('handsontableApp')
        .factory('Persona', Persona);

    Persona.$inject = ['$resource', 'DateUtils'];

    function Persona ($resource, DateUtils) {
        var resourceUrl = 'api/personas/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
						data.fechaNacimiento = DateUtils.convertLocalDateFromServer(data.fechaNacimiento);
                    }
                    return data;
                }
            },
            'update': {
                method: 'PUT',
                transformRequest: function (data) {
                    var copy = angular.copy(data);
				    copy.fechaNacimiento = DateUtils.convertLocalDateToServer(copy.fechaNacimiento);
        		return angular.toJson(copy);
                }
            },
            'save': {
                method: 'POST',
                transformRequest: function (data) {
                    var copy = angular.copy(data);
				    copy.fechaNacimiento = DateUtils.convertLocalDateToServer(copy.fechaNacimiento);
                    return angular.toJson(copy);
                }
            },
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