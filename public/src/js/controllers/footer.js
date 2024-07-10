'use strict';

angular.module('insight.system')
.controller('FooterController',
    function (
        $scope,
        $route,
        $rootScope,
        $location,
        $templateCache,
        gettextCatalog,
        LocalStore,
        amMoment) {

        $scope.defaultLanguage = defaultLanguage;
        const CACHE_THEME_COLOR = 1;
        const CACHE_TTL_THEME_COLOR = 1400;
        
        const _reloadPage = function() {
            $location.url($location.url());
        }
        
        const themeColor = LocalStore.get(CACHE_THEME_COLOR);
        const defaultTheme = 0;
        $rootScope.themeColor = (themeColor == undefined)? defaultTheme : themeColor;

        $scope.toggleTheme = function() {
            $rootScope.themeColor = $rootScope.themeColor == 1? 0 : 1;
            LocalStore.set(CACHE_THEME_COLOR, $rootScope.themeColor, CACHE_TTL_THEME_COLOR)
            _reloadPage();
        }

        var _getVersion = function () {
            return apiVersion;
        };

        $scope.version = _getVersion();

        $scope.availableLanguages = [{
            name: 'English',
            isoCode: 'en',
        }, {
            name: 'Deutsch',
            isoCode: 'de_DE',
        }, {
            name: 'Русский',
            isoCode: 'ru',
        }, {
            name: 'Spanish',
            isoCode: 'es',
        }, {
            name: 'Japanese',
            isoCode: 'ja',
        }];

        $scope.setLanguage = function (isoCode) {
            gettextCatalog.currentLanguage = $scope.defaultLanguage = defaultLanguage = isoCode;
            amMoment.changeLocale(isoCode);
            localStorage.setItem('insight-language', isoCode);
            var currentPageTemplate = $route.current.templateUrl;
            $templateCache.remove(currentPageTemplate);
            $route.reload();
        };

    });
