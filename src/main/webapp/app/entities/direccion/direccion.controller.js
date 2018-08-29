(function () {
    'use strict';

    angular
        .module('handsontableApp')
        .controller('DireccionController', DireccionController);

    DireccionController.$inject = ['$state', 'Direccion', 'AlertService', 'paginationConstants', 'pagingParams', 'FileSaver'];

    function DireccionController($state, Direccion, AlertService, paginationConstants, pagingParams, FileSaver) {

        var vm = this;

        var div = angular.element("#direccion-sheet")[0];
        var direccionSheet = new Handsontable(div, {});
        var autoRowSizePlugin = direccionSheet.getPlugin('AutoRowSize');

        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.page = 1;
        vm.loading = false;
        vm.download = download;
        vm.data = [];

        var umbral = 10;
        var editMap = new Map();


        loadAll();

        function loadAll() {
            vm.loading = true;
            Direccion.sheet({
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

                overwriteSettings(settings);
                direccionSheet.updateSettings(settings);
                direccionSheet.updateSettings({
                    beforeRemoveRow: function (index) {
                        var id = parseInt(direccionSheet.getDataAtRowProp(index, 'id'));
                        confirmDelete(id);
                    },
                    afterChange: function (changes, src) {
                        if (changes) {
                            var row = changes[0][0];
                            var metaData = direccionSheet.getCellMetaAtRow(row)
                            var obj = {};
                            for (var i = 0; i < metaData.length; i++) {
                                //hotInstance.setCellMeta(row, metaData[i].col, 'className', 'modified');
                                obj[metaData[i].prop] = direccionSheet.getDataAtRowProp(row, metaData[i].prop)
                            }
                            editMap.set(obj.id, obj);
                            save(obj, row);
                            direccionSheet.render();
                        }
                    }
                });
                vm.loading = false;
            }

            function onError(error) {
                AlertService.error(error.data);
                vm.loading = false;
            }
        }

        function overwriteSettings(settings) {
            settings.maxRows = Infinity;
            settings.afterScrollVertically = loadPage;
            settings.height = 450;
            settings.stretchH = 'all';
            settings.persistenState = true;
            settings.data = vm.data;
        }

        function loadPage() {
            var page = vm.page + 1;
            if (vm.hasNextPage && !vm.loading) {
                if (autoRowSizePlugin.getLastVisibleRow() >= (direccionSheet.countRows() - umbral)) {
                    vm.page = page;
                    loadAll();
                }
            }
        }

        function download() {
            Direccion.download({}, onSuccess, onError);
            function onSuccess(response) {
                FileSaver.saveAs(response.blob, 'direcciones.xlsx');
            }
            function onError(error) {
                AlertService.error(error);
            }
        }

        function save(direccion, row) {
            var createdId = null;
            if (direccion.id !== null) {
                Direccion.update(direccion, onSaveSuccess, onSaveError);
            } else {
                Direccion.save(direccion, function (response) {
                    direccionSheet.setDataAtRowProp(row, "id", response.id);
                }, onSaveError);
            }
        }

        function onSaveSuccess(result) {
            console.log(result.id)
        }

        function onSaveError(error) {
            AlertService.error(error.data);
        }

        function confirmDelete(idDireccion) {
            $state.go('direccionSheet.delete', { id: idDireccion });
        }

    }
})();
