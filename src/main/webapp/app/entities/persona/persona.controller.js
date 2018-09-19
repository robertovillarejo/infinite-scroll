(function () {
    'use strict';

    angular
        .module('handsontableApp')
        .controller('PersonaController', PersonaController);

    PersonaController.$inject = ['$scope', '$state', 'Persona', 'AlertService', 'paginationConstants', 'pagingParams', 'FileSaver', 'hotRegisterer'];

    function PersonaController($scope, $state, Persona, AlertService, paginationConstants, pagingParams, FileSaver, hotRegisterer) {

        var vm = this;
        var hotInstance;
        var autoRowSizePlugin;

        vm.personas = [];
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.page = 1;
        vm.loading = false;
        vm.download = download;
        vm.refresh = refresh;

        var umbral = paginationConstants.itemsPerPage - 3;

        $scope.$on('$viewContentLoaded', function () {
            hotInstance = hotRegisterer.getInstance('personasSheet');
            autoRowSizePlugin = hotInstance.getPlugin('AutoRowSize');
        });

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
            afterChange: function (changes) {
                if (!changes) return;
                changes.forEach(function (change) {
                    var row = change[0];
                    var prop = change[1];
                    var oldVal = change[2];
                    var newVal = change[3];
                    if (oldVal !== newVal) {
                        var physicalRowNumber = hotInstance.toPhysicalRow(row);
                        var modifiedPersona = vm.personas[physicalRowNumber];
                        //Replace empty string with undefined when clear a cell
                        if (newVal === "") {
                            var property = prop.substring(0, prop.indexOf("."));
                            modifiedPersona[property] = undefined;
                        }
                        save(modifiedPersona, physicalRowNumber);
                    }
                });
            }
        };

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