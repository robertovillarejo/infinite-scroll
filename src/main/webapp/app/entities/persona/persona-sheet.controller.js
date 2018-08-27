(function () {
    'use strict';

    angular
        .module('handsontableApp')
        .controller('PersonaSheetController', PersonaSheetController);

    PersonaSheetController.$inject = ['PersonaSheet', 'AlertService', 'paginationConstants', 'pagingParams', 'FileSaver', 'UserSheet'];

    function PersonaSheetController(PersonaSheet, AlertService, paginationConstants, pagingParams, FileSaver, UserSheet) {

        var vm = this;

        var div = angular.element("#persona-handsontable")[0];
        var personaSheet = new Handsontable(div, {});
        var autoRowSizePlugin = personaSheet.getPlugin('AutoRowSize');

        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.page = 1;
        vm.loading = false;
        vm.download = download;
        vm.data = [];
        vm.users = UserSheet.query();

        var umbral = 10;

        loadAll();

        function loadAll() {
            vm.loading = true;
            PersonaSheet.query({
                page: vm.page - 1,
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

                for (var i = 0; i < settings.data.length; i++) {
                    vm.data.push(settings.data[i]);
                }

                settings.columns.find(function (col) { return col.data === "usuario" }).handsontable =
                    {
                        colHeaders: vm.users.colHeaders,
                        autoColumnSize: true,
                        data: vm.users.data,
                        getValue: function () {
                            var selection = this.getSelectedLast();
                            return this.getSourceDataAtRow(selection[0]).id;
                        }
                    };
                overwriteSettings(settings);
                personaSheet.updateSettings(settings);
                vm.loading = false;
            }

            function onError(error) {
                AlertService.error(error.data);
                vm.loading = false;
            }
        }

        function overwriteSettings(settings) {
            settings.afterScrollVertically = loadPage;
            settings.height = 450;
            settings.stretchH = 'all';
            settings.maxRows = vm.data.length;
            settings.persistenState = true;
            settings.data = vm.data;
        }

        function loadPage() {
            var page = vm.page + 1;
            if (vm.hasNextPage && !vm.loading) {
                if (autoRowSizePlugin.getLastVisibleRow() >= (personaSheet.countRows() - umbral)) {
                    vm.page = page;
                    loadAll();
                }
            }
        }

        function download() {
            PersonaSheet.download({}, onSuccess, onError);
            function onSuccess(response) {
                FileSaver.saveAs(response.blob, 'personas.xlsx');
            }
            function onError(error) {
                AlertService.error(error);
            }
        }
    }
})();
