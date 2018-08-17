(function () {
    'use strict';

    angular
        .module('handsontableApp')
        .controller('PersonaHandsontableController', PersonaHandsontableController);

    PersonaHandsontableController.$inject = ['PersonaHandsontable', 'AlertService', 'paginationConstants', 'pagingParams'];

    function PersonaHandsontableController(PersonaHandsontable, AlertService, paginationConstants, pagingParams) {

        var vm = this;

        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.page = 0;
        vm.loading = false;

        var div = angular.element("#persona-handsontable")[0];

        vm.data = [];

        var hotInstance = new Handsontable(div, {});
        var autoRowSizePlugin = hotInstance.getPlugin('AutoRowSize');
        var nearLastRowsCount = 3;

        loadAll();

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
                overwriteSettings(settings);

                for (var i = 0; i < settings.data.length; i++) {
                    vm.data.push(settings.data[i]);
                }
                //hotInstance.updateSettings(settings);
                
                hotInstance.updateSettings({
                    allowEmpty: settings.allowEmpty,
                    data: vm.data,
                    colHeaders: settings.colHeaders,
                    columns: settings.columns,
                    columnSorting: true,
                    contextMenu: true,
                    readOnly: false,
                    rowHeaders: true,
                    afterScrollVertically: loadPage,
                    height : 450,
                    stretchH : 'all',
                    maxRows : vm.data.length,
                });
                vm.loading = false;
            }
            function onError(error) {
                AlertService.error(error.data);
                vm.loading = false;
            }
        }

        function loadPage() {
            if (vm.hasNextPage && !vm.loading) {
                if (autoRowSizePlugin.getLastVisibleRow() >= (hotInstance.countRows() - nearLastRowsCount)) {
                    vm.page++;
                    loadAll();
                }
            }
        }

        function overwriteSettings(settings) {
            settings.height = 450;
            settings.stretchH = 'all';
            settings.afterScrollVertically = loadPage;
            settings.maxRows = vm.data.length;
        }
    }
})();
