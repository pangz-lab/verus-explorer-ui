'use strict';

// Todo add caching to avoid reloading of large resource
angular
.module('insight.localstore')
.service('LocalStore',
    function () {
        this.set = function(key, value, ttlInSeconds) {
            var ttl = new Date();
            ttl.setSeconds(ttl.getSeconds() + ttlInSeconds);
            localStorage.setItem(key, JSON.stringify({ data: value, createdAt: new Date(), ttl: ttl}));
        }
        
        this.get = function(key) {
            const cache = JSON.parse(localStorage.getItem(key));
            if(cache != undefined && !this.isExpired(cache)) {
                return cache.data;
            }

            return undefined;
        }

        this.isExpired = function(cache) {
            const ttl = cache.ttl;

            return cache != undefined &&
            Math.floor((new Date() - new Date(cache.createdAt)) / 1000) < ttl;
        }
});