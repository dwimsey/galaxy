/* (c) 2012-2016, Ansible by Red Hat
 *
 * This file is part of Ansible Galaxy
 *
 * Ansible Galaxy is free software: you can redistribute it and/or modify
 * it under the terms of the Apache License as published by
 * the Apache Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * Ansible Galaxy is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * Apache License for more details.
 *
 * You should have received a copy of the Apache License
 * along with Galaxy.  If not, see <http://www.apache.org/licenses/>.
 */

 'use strict';

 (function(angular) {

    var mod = angular.module('githubRepoService', ['currentUserService']);

    mod.factory('githubRepoService', ['$resource', 'currentUserService', 'getCSRFToken', _factory]);

    function _factory($resource, currentUserService, getCSRFToken) {

        var token = getCSRFToken();
            
        return {
            get: function(params) {
                params = (params) ? params : {};
                params.owner = currentUserService.id;
                return $resource('/api/v1/repos/list/?page_size=1000').get(params);
            },
            refresh: function(params) {
                return $resource('/api/v1/repos/refresh/', null, {
                    'get': { method: 'GET', isArray: true }
                }).get(params);
            },
            subscribe: function(params) {
                return $resource('/api/v1/repos/subscriptions/', {}, {
                    'save': { 'method': 'POST', headers: { "X-CSRFToken": token }}
                }).save(params);
            },
            unsubscribe: function(params) {
                return $resource('/api/v1/repos/subscriptions/:id/', {'id': '@id'}, {
                    'delete': { 'method': 'DELETE', headers: { "X-CSRFToken": token }}
                }).delete(params);   
            },
            star: function(params) {
                return $resource('/api/v1/repos/stargazers/', {}, {
                    'save': { 'method': 'POST', headers: { "X-CSRFToken": token }}
                }).save(params);
            },
            unstar: function(params) {
                return $resource('/api/v1/repos/stargazers/:id/', {'id': '@id'}, {
                    'delete': { 'method': 'DELETE', headers: { "X-CSRFToken": token }}
                }).delete(params);  
            }
        }
    }

 })(angular);

