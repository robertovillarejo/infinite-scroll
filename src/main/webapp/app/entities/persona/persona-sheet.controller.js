(function () {
    'use strict';

    angular
        .module('handsontableApp')
        .controller('PersonaSheetController', PersonaSheetController);

    PersonaSheetController.$inject = ['$state', 'PersonaSheet', 'Persona', 'AlertService', 'paginationConstants', 'pagingParams', 'FileSaver', 'UserSheet', 'Direccion'];

    function PersonaSheetController($state, PersonaSheet, Persona, AlertService, paginationConstants, pagingParams, FileSaver, UserSheet, Direccion) {

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
        vm.direcciones = Direccion.sheet();

        var umbral = 10;
        var editMap = new Map();


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
                settings.columns.find(function (col) { return col.data === "direccion" }).handsontable =
                    {
                        colHeaders: vm.direcciones.colHeaders,
                        autoColumnSize: true,
                        data: vm.direcciones.data,
                        getValue: function () {
                            var selection = this.getSelectedLast();
                            return this.getSourceDataAtRow(selection[0]).id;
                        }

                    };
                overwriteSettings(settings);
                personaSheet.updateSettings(settings);
                personaSheet.updateSettings({
                    beforeRemoveRow: function (index) {
                        var id = parseInt(personaSheet.getDataAtRowProp(index, 'id'));
                        confirmDelete(id);
                    },
                    afterChange: function (changes, src) {
                        if (changes) {
                            var row = changes[0][0];
                            var metaData = personaSheet.getCellMetaAtRow(row)
                            var obj = {};
                            for (var i = 0; i < metaData.length; i++) {
                                //hotInstance.setCellMeta(row, metaData[i].col, 'className', 'modified');
                                obj[metaData[i].prop] = personaSheet.getDataAtRowProp(row, metaData[i].prop)
                            }
                            editMap.set(obj.id, obj);
                            save(obj, row);
                            personaSheet.render();
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
            settings.afterScrollVertically = loadPage;
            settings.height = 450;
            settings.stretchH = 'all';
            settings.persistenState = true;
            settings.data = vm.data;
            settings.maxRows = undefined;

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

        function save(persona, row) {
            var createdId = null;
            if (persona.id !== null) {
                Persona.update(persona, onSaveSuccess, onSaveError);
            } else {
                Persona.save(persona, function (response) {
                    personaSheet.setDataAtRowProp(row, "id", response.id);
                }, onSaveError);
            }
        }

        function onSaveSuccess(result) {
            console.log(result.id)
        }

        function onSaveError(error) {
            AlertService.error(error.data);
        }

        function confirmDelete(idPersona) {
            $state.go('personaSheet.delete', { id: idPersona });
        }

    }
})();
