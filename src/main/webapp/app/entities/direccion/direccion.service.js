(function () {
    'use strict';
    angular
        .module('handsontableApp')
        .factory('Direccion', Direccion);

    Direccion.$inject = ['$resource', 'DateUtils'];

    function Direccion($resource, DateUtils) {
        var resourceUrl = 'api/direcciones/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true },
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