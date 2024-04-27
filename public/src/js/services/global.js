'use strict';

//Global service for global variables
angular.module('insight.system')
  .factory('Global',[
    function() {
      return {};
    }
  ])
  .factory('Version',
    function($resource) {
      return $resource(window.apiPrefix + '/version');
  })
  .service('UnitConversionService', function() {
    this.convert = function(value, unitSuffix) {
      const units = ['-', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
      var unitIndex = 0;
  
      while (value >= 1000 && unitIndex < units.length - 1) {
        value /= 1000;
        unitIndex++;
      }
  
      return value.toFixed(5) + ' ' + units[unitIndex] + unitSuffix;
    }

    this.shortenString = function(text, maxLength) {
        if (text.length <= maxLength) return text;

        var halfLength = Math.floor((maxLength - 3) / 2); // Length of the ellipsis in the middle
        return text.substring(0, halfLength) + '...' + text.substring(text.length - halfLength);
    }
  })
  .service('ScrollService', function($window, $timeout) {
    this.scrollToTop = function() {
      var currentY = $window.pageYOffset;
      var step = Math.abs(currentY / 25);
      
      function scrollStep() {
        if ($window.pageYOffset > 0) {
          $window.scrollTo(0, $window.pageYOffset - step);
          requestAnimationFrame(scrollStep);
        }
      }
      requestAnimationFrame(scrollStep);
    };

    this.scrollToBottom = function() {
      $timeout(function() {
        var element = document.getElementById('footer');
        element.scrollIntoView({ behavior: 'smooth', block: 'end' });
      });
    };
  });
