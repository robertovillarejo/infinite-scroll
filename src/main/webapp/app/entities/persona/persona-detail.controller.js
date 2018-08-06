(function() {
    'use strict';

    angular
        .module('infinitescrollApp')
        .controller('PersonaDetailController', PersonaDetailController);

    PersonaDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'Persona'];

    function PersonaDetailController($scope, $rootScope, $stateParams, previousState, entity, Persona) {
        var vm = this;

        vm.persona = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('infinitescrollApp:personaUpdate', function(event, result) {
            vm.persona = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
