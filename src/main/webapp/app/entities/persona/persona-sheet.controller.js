(function () {
    'use strict';

    angular
        .module('handsontableApp')
        .controller('PersonaSheetController', PersonaSheetController);

    PersonaSheetController.$inject = ['$scope', '$state', 'PersonaSheet', 'Persona', 'AlertService', 'paginationConstants', 'pagingParams', 'FileSaver', 'UserSheet', 'Direccion', '$uibModal'];

    function PersonaSheetController($scope, $state, PersonaSheet, Persona, AlertService, paginationConstants, pagingParams, FileSaver, UserSheet, Direccion, $uibModal) {

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

        var umbral = 20;

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

                var usuarioCol = settings.columns.find(function (col) { return col.data === "usuario" });
                usuarioCol.data = 'usuario';
                usuarioCol.allowEmpty = true;
                usuarioCol.handsontable =
                    {
                        colHeaders: vm.users.colHeaders,
                        autoColumnSize: true,
                        data: vm.users.data,
                        getValue: function () {
                            //Get Usuario
                            var selection = this.getSelectedLast();
                            var physicalRowNumber = this.toPhysicalRow(selection[0]);
                            var userSelected = vm.users.data[physicalRowNumber];

                            //Get Persona
                            var personaSelection = personaSheet.getSelectedLast();
                            var personaPhysicalRowNumber = personaSheet.toPhysicalRow(personaSelection[0]);
                            var personaSelected = vm.data[personaPhysicalRowNumber];

                            //Assign usuario to persona
                            personaSelected.usuario = userSelected;
                            return userSelected;
                        }
                    };


                settings.columns.find(function (col) { return col.data === "direccion" }).handsontable =
                    {
                        colHeaders: vm.direcciones.colHeaders,
                        autoColumnSize: true,
                        data: vm.direcciones.data,
                        getValue: function () {
                            //Get Direccion
                            var selection = this.getSelectedLast();
                            var physicalRowNumber = this.toPhysicalRow(selection[0]);
                            var direccionSelected = vm.direcciones.data[physicalRowNumber];

                            //Get Persona
                            var personaSelection = personaSheet.getSelectedLast();
                            var personaPhysicalRowNumber = personaSheet.toPhysicalRow(personaSelection[0]);
                            var personaSelected = vm.data[personaPhysicalRowNumber];

                            //Assign direccion to persona
                            personaSelected.direccion = direccionSelected;
                            return direccionSelected;
                        }

                    };
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
            settings.beforeColumnSort = function (column, order) {
                vm.predicate = settings.colHeaders[column].toLowerCase();
                vm.reverse = (order === "asc" || order === "none") ? true : false;
                transition();
            };
            settings.sortIndicator = true;
            settings.afterScrollVertically = loadPage;
            settings.height = 450;
            settings.stretchH = 'all';
            settings.persistenState = true;
            settings.data = vm.data;
            settings.persistenState = true;
            settings.beforeRemoveRow = function (index) {
                var physicalRow = personaSheet.toPhysicalRow(index);
                var persona = vm.data[physicalRow];
                confirmDelete(persona, physicalRow);
                return false;
            }
            settings.afterChange = function (changes, src) {
                if (!changes || src === "ObserveChanges.change") return;
                changes.forEach(([row, prop, oldValue, newValue]) => {
                    if (oldValue !== newValue) {
                        var physicalRowNumber = personaSheet.toPhysicalRow(row);
                        var modifiedPersona = vm.data[physicalRowNumber];
                        save(modifiedPersona);
                    }
                });
            }
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

        function save(persona) {
            if (persona.id !== null) {
                Persona.update(persona, onSaveSuccess, onSaveError);
            } else {
                Persona.save(persona, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess(result) {
            $scope.$emit('handsontableApp:personaUpdate', result);
            $state.go('personaSheet', null, { reload: 'personaSheet' });
        }

        function onSaveError(error) {
            AlertService.error(error.data.message);
        }

        function confirmDelete(persona, index) {
            $uibModal.open({
                templateUrl: 'app/entities/persona/persona-delete-dialog.html',
                controller: 'PersonaDeleteController',
                controllerAs: 'vm',
                size: 'md',
                resolve: {
                    entity: persona
                }
            }).result.then(function () {
                vm.data.splice(index, 1);
            });
        }

        function transition() {
            $state.transitionTo($state.$current, {
                page: 1,
                sort: vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc')
            });
        }

    }
})();
