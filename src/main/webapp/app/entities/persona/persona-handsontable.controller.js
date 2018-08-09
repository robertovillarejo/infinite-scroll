(function () {
    'use strict';

    angular
        .module('handsontableApp')
        .controller('PersonaHandsontableController', PersonaHandsontableController);

    PersonaHandsontableController.$inject = ['$scope', 'hotRegisterer', 'PersonaHandsontable', 'AlertService', 'paginationConstants'];

    function PersonaHandsontableController($scope, hotRegisterer, PersonaHandsontable, AlertService, paginationConstants) {
        var vm = this;
        var hotInstance;
        var plugin;
        //Umbral
        var nearLastRowsCount = 3

        //Table data
        vm.data = [];
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.page = 0;

        //Load next page when 
        function loadPage() {
            console.log(plugin.getLastVisibleRow() + " last visible row");
            if (plugin.getLastVisibleRow() >= (hotInstance.countRows() - nearLastRowsCount) && vm.hasNextPage) {
                vm.page++;
                loadAll();
            }
        }

        //Useful for initialization
        vm.settings = {
            rowHeaders: true,
            colHeaders: true
        }

        $scope.$on('$viewContentLoaded', function () {
            hotInstance = hotRegisterer.getInstance('my-handsontable');
            plugin = hotInstance.getPlugin('AutoRowSize');
            loadAll();
        });

        function loadAll() {
            PersonaHandsontable.query({
                page: vm.page,
                size: vm.itemsPerPage
            }, onSuccess, onError);
            function onSuccess(settings, headers) {
                vm.hasNextPage = headers('X-Has-Next-Page') === "true";
                vm.settings = settings;
                vm.settings.height = 450;
                //Append new data
                for (var i = 0; i < settings.data.length; i++) {
                    vm.data.push(settings.data[i]);
                    //console.log(settings.data[i]);
                    console.log("got " + settings.data.length + " elements");
                }
                //Pass vm.data reference to vm.settings
                vm.settings.data = vm.data;
                //Set function to trigger when scrolling table
                vm.settings.afterScrollVertically = loadPage;
                //Avoid empty rows in table
                vm.settings.maxRows = vm.data.length;
                //Update hot instance settings
                hotInstance.updateSettings(vm.settings);
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }
        }
    }
})();
