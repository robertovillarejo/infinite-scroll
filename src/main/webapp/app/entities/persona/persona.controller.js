(function() {
    'use strict';

    angular
        .module('infinitescrollApp')
        .controller('PersonaController', PersonaController);

    PersonaController.$inject = ['Persona', 'AlertService', 'paginationConstants'];

    function PersonaController(Persona, AlertService, paginationConstants) {

        var vm = this;

        vm.personas = [];
        vm.loadPage = loadPage;
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.page = 0;
        vm.links = {
            last: 0
        };
        vm.predicate = 'id';
        vm.reset = reset;
        vm.reverse = true;
        vm.hasNextPage = false;

        loadAll();

        function loadAll () {
            Persona.query({
                page: vm.page,
                size: vm.itemsPerPage,
                sort: sort()
            }, onSuccess, onError);
            function sort() {
                var result = [vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc')];
                if (vm.predicate !== 'id') {
                    result.push('id');
                }
                return result;
            }

            function onSuccess(data, headers) {
                vm.hasNextPage = headers('X-Has-Next-Page') === "true";
                console.log(data);
                for (var i = 0; i < data.length; i++) {
                    vm.personas.push(data[i]);
                }

            }

            function onError(error) {
                AlertService.error(error.data.message);
            }
        }

        function reset () {
            vm.page = 0;
            vm.personas = [];
            loadAll();
        }

        function loadPage(page) {
            vm.page = page;
            loadAll();
        }
    }
})();
