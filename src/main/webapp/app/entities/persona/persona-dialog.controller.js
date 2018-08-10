(function() {
    'use strict';

    angular
        .module('handsontableApp')
        .controller('PersonaDialogController', PersonaDialogController);

    PersonaDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', '$q', 'entity', 'Persona'];

    function PersonaDialogController ($timeout, $scope, $stateParams, $uibModalInstance, $q, entity, Persona) {
        var vm = this;

        vm.persona = entity;
        vm.clear = clear;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.save = save;
        vm.datePickerOpenStatus.fechaNacimiento = false;
        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.persona.id !== null) {
                Persona.update(vm.persona, onSaveSuccess, onSaveError);
            } else {
                Persona.save(vm.persona, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('handsontableApp:personaUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


        function openCalendar (date) {
            vm.datePickerOpenStatus[date] = true;
        }
    }
})();
