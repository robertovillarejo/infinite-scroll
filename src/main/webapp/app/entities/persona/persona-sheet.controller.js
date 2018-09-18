(function () {
    'use strict';

    angular
        .module('handsontableApp')
        .controller('PersonaSheetController', PersonaSheetController);

    PersonaSheetController.$inject = ['$timeout', '$q', '$scope', '$state', 'Persona', 'AlertService', 'paginationConstants', 'pagingParams', 'FileSaver', 'User', 'Direccion', 'hotRegisterer'];

    function PersonaSheetController($timeout, $q, $scope, $state, Persona, AlertService, paginationConstants, pagingParams, FileSaver, User, Direccion, hotRegisterer) {

        var vm = this;
        vm.personas = [];
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.page = 1;
        vm.loading = false;
        vm.download = download;
        vm.refresh = refresh;
        vm.users = User.query();
        vm.direcciones = Direccion.query();

        var umbral = 20;
        var hotInstance = $q.defer();
        var autoRowSizePlugin = $q.defer();

        vm.usersHandsontable = {
            colHeaders: ["Id", "Login", "Email", "Idioma", "Perfiles", "Fecha de creación"],
            autoColumnSize: true,
            data: vm.users,
            getValue: function () {
                var selection = this.getSelectedLast();
                var physicalRowNumber = this.toPhysicalRow(selection[0]);
                var userSelected = vm.users[physicalRowNumber];
                console.log(userSelected);
                return userSelected.id;
            }
        }

        vm.direccionHandsontable = {
            colHeaders: [],
            autoColumnSize: true,
            data: vm.direcciones,
            getValue: function () {
                var selection = this.getSelectedLast();
                var physicalRowNumber = this.toPhysicalRow(selection[0]);
                var direccionSelected = vm.direcciones[physicalRowNumber];
                return direccionSelected.id;
            }
        };

        vm.settings = {
            columnSorting: true,
            contextMenu: true,
            search: true,
            beforeColumnSort: function (column) {
                vm.reverse = !vm.reverse;
                vm.predicate = hotInstance.getSettings().columns[column].data;
                transition();
            },
            observeChanges: true,
            manualColumnResize: true,
            sortIndicator: true,
            afterScrollVertically: loadPage,
            stretchH: 'all',
            persistenState: true,
            beforeRemoveRow: function (index) {
                var id = this.getDataAtRowProp(index, 'id');
                confirmDelete(id);
                return false;
            },
            afterChange: function (changes, src) {
                if (!changes) return;
                changes.forEach(function (change) {
                    if (change[2] !== change[3]) {
                        var physicalRowNumber = hotInstance.toPhysicalRow(change[0]);
                        var modifiedPersona = vm.personas[physicalRowNumber];
                        if (change[3] === "") {
                            var property = change[1].substring(0, change[1].indexOf("."));
                            modifiedPersona[property] = undefined;
                        }
                        save(modifiedPersona, physicalRowNumber);
                    }
                });
            }
        };

        $timeout(function () {
            hotInstance = hotRegisterer.getInstance("personasSheet");
        });

        $timeout(function () {
            autoRowSizePlugin = hotInstance.getPlugin('AutoRowSize');
        });

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
            Persona.query({
                page: vm.page - 1,
                size: vm.itemsPerPage,
                sort: sort()
            }, onSuccess, onError);

            function onSuccess(data, headers) {
                vm.hasNextPage = headers('X-Has-Next-Page') === "true";

                for (var i = 0; i < data.length; i++) {
                    vm.personas.push(data[i]);
                }

                //hotInstance.validateCells();
                vm.loading = false;
            }

            function onError(error) {
                AlertService.error(error.data);
                vm.loading = false;
            }
        }

        function loadPage() {
            var page = vm.page + 1;
            if (vm.hasNextPage && !vm.loading) {
                if (autoRowSizePlugin.getLastVisibleRow() >= (hotInstance.countRows() - umbral)) {
                    vm.page = page;
                    loadAll();
                }
            }
        }

        function download() {
            Persona.download({ sort: sort() }, onSuccess, onError);
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

    }
})();
