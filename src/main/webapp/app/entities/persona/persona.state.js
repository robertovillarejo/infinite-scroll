(function () {
    'use strict';

    angular
        .module('handsontableApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('persona', {
                parent: 'entity',
                url: '/personas?page&sort&search',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'handsontableApp.persona.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/persona/personas.html',
                        controller: 'PersonaController',
                        controllerAs: 'vm'
                    }
                },
                params: {
                    page: {
                        value: '1',
                        squash: true
                    },
                    sort: {
                        value: 'id,asc',
                        squash: true
                    },
                    search: null
                },
                resolve: {
                    pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                        return {
                            page: PaginationUtil.parsePage($stateParams.page),
                            sort: $stateParams.sort,
                            predicate: PaginationUtil.parsePredicate($stateParams.sort),
                            ascending: PaginationUtil.parseAscending($stateParams.sort),
                            search: $stateParams.search
                        };
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('persona');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('personaSheet', {
                parent: 'entity',
                url: '/personas/sheet?page&sort&search',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'handsontableApp.persona.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/persona/personas-sheet.html',
                        controller: 'PersonaSheetController',
                        controllerAs: 'vm'
                    }
                },
                params: {
                    /*
                    page: {
                        value: '1',
                        squash: true
                    },*/
                    sort: {
                        value: 'id,asc',
                        squash: true
                    }/*,
                    search: null*/
                },
                resolve: {
                    pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                        return {
                            //page: PaginationUtil.parsePage($stateParams.page),
                            sort: $stateParams.sort,
                            predicate: PaginationUtil.parsePredicate($stateParams.sort),
                            ascending: PaginationUtil.parseAscending($stateParams.sort),
                            //search: $stateParams.search
                        };
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('persona');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('personaHandsontable.new', {
                parent: 'personaHandsontable',
                url: '/new',
                data: {
                    authorities: ['ROLE_USER']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/persona/persona-dialog.html',
                        controller: 'PersonaDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    id: null,
                                    nombre: null
                                };
                            }
                        }
                    }).result.then(function () {
                        $state.go('personaHandsontable', null, { reload: 'personaHandsontable' });
                    }, function () {
                        $state.go('personaHandsontable');
                    });
                }]
            })
            .state('persona-detail', {
                parent: 'persona',
                url: '/personas/{id}',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'handsontableApp.persona.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/persona/persona-detail.html',
                        controller: 'PersonaDetailController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('persona');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'Persona', function ($stateParams, Persona) {
                        return Persona.get({ id: $stateParams.id }).$promise;
                    }],
                    previousState: ["$state", function ($state) {
                        var currentStateData = {
                            name: $state.current.name || 'persona',
                            params: $state.params,
                            url: $state.href($state.current.name, $state.params)
                        };
                        return currentStateData;
                    }]
                }
            })
            .state('persona-detail.edit', {
                parent: 'persona-detail',
                url: '/detail/edit',
                data: {
                    authorities: ['ROLE_USER']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/persona/persona-dialog.html',
                        controller: 'PersonaDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['Persona', function (Persona) {
                                return Persona.get({ id: $stateParams.id }).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('^', {}, { reload: false });
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('persona.new', {
                parent: 'persona',
                url: '/new',
                data: {
                    authorities: ['ROLE_USER']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/persona/persona-dialog.html',
                        controller: 'PersonaDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    id: null,
                                    nombre: null
                                };
                            }
                        }
                    }).result.then(function () {
                        $state.go('persona', null, { reload: 'persona' });
                    }, function () {
                        $state.go('persona');
                    });
                }]
            })
            .state('persona.edit', {
                parent: 'persona',
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_USER']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/persona/persona-dialog.html',
                        controller: 'PersonaDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['Persona', function (Persona) {
                                return Persona.get({ id: $stateParams.id }).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('persona', null, { reload: 'persona' });
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('persona.delete', {
                parent: 'persona',
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_USER']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/persona/persona-delete-dialog.html',
                        controller: 'PersonaDeleteController',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            entity: ['Persona', function (Persona) {
                                return Persona.get({ id: $stateParams.id }).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('persona', null, { reload: 'persona' });
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('personaSheet.delete', {
                parent: 'personaSheet',
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_USER']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/persona/persona-delete-dialog.html',
                        controller: 'PersonaDeleteController',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            entity: ['Persona', function (Persona) {
                                return Persona.get({ id: $stateParams.id }).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('personaSheet', null, { reload: 'personaSheet' });
                    }, function () {
                        $state.go('personaSheet');
                    });
                }]
            });

    }

})();
