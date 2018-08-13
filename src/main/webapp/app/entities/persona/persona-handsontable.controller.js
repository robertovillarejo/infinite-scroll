(function () {
    'use strict';

    angular
        .module('handsontableApp')
        .controller('PersonaHandsontableController', PersonaHandsontableController);

    PersonaHandsontableController.$inject = ['$scope', 'hotRegisterer', 'PersonaHandsontable', 'AlertService', 'paginationConstants'];

    function PersonaHandsontableController($scope, hotRegisterer, PersonaHandsontable, AlertService, paginationConstants) {
        var vm = this;
        var hotInstance;
        var autoRowSizePlugin;
        //Umbral
        var nearLastRowsCount = 3;

        //Table data
        vm.data = [];
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.page = 0;

        //Load next page when 
        function loadPage() {
            console.log(autoRowSizePlugin.getLastVisibleRow() + " last visible row");
            if (autoRowSizePlugin.getLastVisibleRow() >= (hotInstance.countRows() - nearLastRowsCount) && vm.hasNextPage) {
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
            hotInstance = hotRegisterer.getInstance('persona-handsontable');
            autoRowSizePlugin = hotInstance.getPlugin('AutoRowSize');
            loadAll();
        });

        //Overwrite settings from service
        function overwriteSettings() {
            vm.settings.height = 450;
            //Set function to trigger when scrolling table
            vm.settings.afterScrollVertically = loadPage;
            //Avoid empty rows in table
            vm.settings.maxRows = vm.data.length;
        }

        function loadAll() {
            PersonaHandsontable.query({
                page: vm.page,
                size: vm.itemsPerPage
            }, onSuccess, onError);
            function onSuccess(settings, headers) {
                vm.hasNextPage = headers('X-Has-Next-Page') === "true";
                vm.settings = settings;
                overwriteSettings();

                //Append new data
                for (var i = 0; i < settings.data.length; i++) {
                    vm.data.push(settings.data[i]);
                    //console.log(settings.data[i]);
                    console.log("got " + settings.data.length + " elements");
                }
                //Pass vm.data reference to vm.settings
                vm.settings.data = vm.data;
                //Update hot instance settings
                hotInstance.updateSettings(vm.settings);
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }
        }
    }
})();
