(function () {
    'use strict';

    angular
        .module('handsontableApp')
        .controller('PersonaSheetController', PersonaSheetController);

    PersonaSheetController.$inject = ['$scope', '$state', 'PersonaSheet', 'Persona', 'AlertService', 'paginationConstants', 'pagingParams', 'FileSaver', 'UserSheet', 'Direccion'];

    function PersonaSheetController($scope, $state, PersonaSheet, Persona, AlertService, paginationConstants, pagingParams, FileSaver, UserSheet, Direccion) {

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
        vm.refresh = refresh;
        vm.data = [];
        vm.users = UserSheet.query();
        vm.direcciones = Direccion.sheet();

        var umbral = 20;

        loadAll();

        function sort() {
            var result = [vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc')];
            if (vm.predicate !== 'id') {
                result.push('id');
            }
            return result;
        }

        function loadAll() {
            vm.loading = true;
            PersonaSheet.query({
                page: vm.page - 1,
                size: vm.itemsPerPage,
                sort: sort()
            }, onSuccess, onError);

            function onSuccess(settings, headers) {
                vm.hasNextPage = headers('X-Has-Next-Page') === "true";

                for (var i = 0; i < settings.data.length; i++) {
                    vm.data.push(settings.data[i]);
                }

                overwriteSettings(settings);
                personaSheet.updateSettings(settings);
                personaSheet.validateCells();
                vm.loading = false;
            }

            function onError(error) {
                AlertService.error(error.data);
                vm.loading = false;
            }
        }

        function overwriteSettings(settings) {
            settings.beforeColumnSort = function (column) {
                vm.reverse = !vm.reverse;
                vm.predicate = settings.columns[column].data;
                transition();
            };
            settings.observeChanges = true;
            settings.manualColumnResize = true;
            settings.sortIndicator = true;
            settings.afterScrollVertically = loadPage;
            settings.height = 450;
            settings.stretchH = 'all';
            settings.persistenState = true;
            settings.data = vm.data;
            settings.persistenState = true;
            settings.beforeRemoveRow = function (index) {
                var id = personaSheet.getDataAtRowProp(index, 'id');
                confirmDelete(id);
                return false;
            }
            settings.afterChange = function (changes, src) {
                if (!changes) return;
                changes.forEach(function (array) {
	            var row = array[0];
		    var prop = array[1];
	            var oldValue = array[2];
                    var newValue = array[3];
                    if (oldValue !== newValue) {
                        var physicalRowNumber = personaSheet.toPhysicalRow(row);
                        var modifiedPersona = vm.data[physicalRowNumber];
                        if (newValue === "") {
                            var property = prop.substring(0, prop.indexOf("."));
                            modifiedPersona[property] = undefined;
                        }
                        save(modifiedPersona, physicalRowNumber);
                    }
                });
            };
            var usuarioCol = findColumn("usuario.id", settings);
            usuarioCol.handsontable =
                {
                    colHeaders: vm.users.colHeaders,
                    autoColumnSize: true,
                    data: vm.users.data,
                    getValue: function () {
                        var selection = this.getSelectedLast();
                        var physicalRowNumber = this.toPhysicalRow(selection[0]);
                        var userSelected = vm.users.data[physicalRowNumber];
                        return userSelected.id;
                    }
                };


            var direccionCol = findColumn("direccion.id", settings);
            direccionCol.handsontable =
                {
                    colHeaders: vm.direcciones.colHeaders,
                    autoColumnSize: true,
                    data: vm.direcciones.data,
                    getValue: function () {
                        var selection = this.getSelectedLast();
                        var physicalRowNumber = this.toPhysicalRow(selection[0]);
                        var direccionSelected = vm.direcciones.data[physicalRowNumber];
                        return direccionSelected.id;
                    }

                };
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
            PersonaSheet.download({ sort: sort() }, onSuccess, onError);
            function onSuccess(response) {
                FileSaver.saveAs(response.blob, 'personas.xlsx');
            }
            function onError(error) {
                AlertService.error(error);
            }
        }

        function save(persona, row) {
            if (persona.id) {
                Persona.update(persona, onSaveSuccess, onSaveError);
            } else {
                Persona.save(persona, function (result) {
                    personaSheet.setDataAtRowProp(row, "id", result.id);
                }, onSaveError);
            }
        }

        function onSaveSuccess(result) {
            $scope.$emit('handsontableApp:personaUpdate', result);
        }

        function onSaveError(error) {
            AlertService.error(error.data.message);
        }

        function confirmDelete(idPersona) {
            $state.go('personaSheet.delete', { id: idPersona }, { reload: false });
        }

        function transition() {
            $state.transitionTo($state.$current, {
                sort: vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc')
            });
        }

        function refresh() {
            $state.go('personaSheet', null, { reload: 'personaSheet' });
        }

        function findColumn(colName, settings) {
            return settings.columns.find(function (col) { return col.data === colName });
        }

    }
})();
