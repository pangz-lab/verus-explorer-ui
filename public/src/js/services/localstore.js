'use strict';

// Todo add caching to avoid reloading of large resource
angular
.module('insight.localstore')
.service('LocalStore',
    function () {
        this.set = function(key, value, ttlInSeconds) {
            var ttl = new Date();
            ttl.setSeconds(ttl.getSeconds() + ttlInSeconds);
            const data = { data: value, createdAt: (new Date()).toString(), ttl: ttl.toString()};
            localStorage.setItem(key, JSON.stringify(data));
        }
        
        this.get = function(key) {
            const cache = JSON.parse(localStorage.getItem(key));
            if(cache != undefined && !this.isExpired(cache)) {
                return cache.data;
            }

            localStorage.removeItem(key);
            return undefined;
        }

        this.isExpired = function(cache) {
            const ttl = cache.ttl;
            return cache != undefined &&
            (new Date()).getTime() > (new Date(ttl)).getTime();
        }
});