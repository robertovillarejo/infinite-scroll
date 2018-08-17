(function () {
    'use strict';

    angular
        .module('handsontableApp')
        .controller('PersonaHandsontableController', PersonaHandsontableController);

    PersonaHandsontableController.$inject = ['$scope', 'hotRegisterer', 'PersonaHandsontable', 'AlertService', 'paginationConstants', 'pagingParams'];

    function PersonaHandsontableController($scope, hotRegisterer, PersonaHandsontable, AlertService, paginationConstants, pagingParams) {
        var vm = this;
        var hotInstance;
        var autoRowSizePlugin;
        var nearLastRowsCount = 3;

        vm.data = [];
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.page = 0;
        vm.loading = false;

        vm.settings = {
            rowHeaders: true,
            colHeaders: true
        }

        function loadPage() {
            if (vm.hasNextPage && !vm.loading) {
                if (autoRowSizePlugin.getLastVisibleRow() >= (hotInstance.countRows() - nearLastRowsCount)) {
                    vm.page++;
                    loadAll();
                }
            }
        }

        $scope.$on('$viewContentLoaded', function () {
            hotInstance = hotRegisterer.getInstance('persona-handsontable');
            autoRowSizePlugin = hotInstance.getPlugin('AutoRowSize');
            loadAll();
        });

        function overwriteSettings() {
            vm.settings.height = 450;
            vm.settings.stretchH = 'all';
            vm.settings.afterScrollVertically = loadPage;
            vm.settings.maxRows = vm.data.length;
        }

        function loadAll() {
            vm.loading = true;
            PersonaHandsontable.query({
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
            function onSuccess(settings, headers) {
                vm.hasNextPage = headers('X-Has-Next-Page') === "true";
                vm.settings = settings;
                overwriteSettings();

                for (var i = 0; i < settings.data.length; i++) {
                    vm.data.push(settings.data[i]);
                }
                vm.settings.data = vm.data;
                hotInstance.updateSettings(vm.settings);
                vm.loading = false;
            }
            function onError(error) {
                AlertService.error(error.data);
                vm.loading = false;
            }
        }
    }
})();
