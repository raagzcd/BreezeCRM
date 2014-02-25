﻿'use strict';

angular.module('crmApp.controllers', [])
    .controller('CustomerListController', ['$scope', '$location', 'custDataService', function ($scope, $location, custDataService) {

    
        $scope.search = function () {
            debugger;
            custDataService.getAllCustomers($scope.criteria, $scope.sortOption, $scope.currentPage)
                .then(function (data) {
                    debugger;
                    $scope.customers = data.results;
                    $scope.totalItems = data.inlineCount;
                    $scope.totalPages = data.inlineCount / 5;
                })
            .catch(function (error) {
                console.log('Error calling api: ' + error.message);
            });
        };

        $scope.search(null, 'companyName', 1);

        //$scope.$watchCollection('customers', function (newValue) {
        //    setPagination(newValue);
        //});

        //function setPagination(newValue) {
        //    if (!newValue) {
        //        return;
        //    }

        //    $scope.totalItems = newValue.length;
        //    $scope.currentPage = 1;
        //    $scope.maxSize = 5;

        //}

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
            $scope.search();
        };

        $scope.markForDelete = function (customer) {
            custDataService.deleteCustomer(customer, false);
        };

        $scope.edit = function (id) {
            location.href = '#/customer/' + id + '/edit/';
        };

        $scope.saveChanges = function () {
            custDataService.saveChanges();
        };

    }]).controller('EditCustomerController', ['$scope', '$location', '$routeParams', 'custDataService', function ($scope, $location, $routeParams, custDataService) {

        custDataService.getCustomerById($routeParams.customerId)
            .then(function (data) {
                $scope.customer = data.entity;
            }).catch(function (error) {
                console.log('Error calling api: ' + error.message);
            });

        $scope.cancel = function () {
            $scope.customer.entityAspect.rejectChanges(); //undo pending changes and reset entityState to 'Unchanged'
            $location.path('/');
        };

        $scope.delete = function () {
            custDataService.deleteCustomer($scope.customer, true);
            $location.path('/');
        };

        $scope.canDelete = true;
        $scope.save = function () {
            custDataService.saveChanges();
            $location.path('/');
        };

    }]).controller('CreateCustomerController', ['$scope', '$location', 'custDataService', function ($scope, $location, custDataService) {

        $scope.cancel = function () {
            $location.path('/');
        };

        var customer = custDataService.newCustomer({ customerID: 'TEMP' }); //TEMP is a HACK - Can't create entity w/o ID and 'AutoGeneratedKeyType' is none
        customer.customerID = '';
        $scope.customer = customer;

        $scope.save = function () {
            custDataService.saveChanges();
            $location.path('/');
        };
    }]);