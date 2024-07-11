'use strict';

//Global service for global variables
angular.module('insight.system')
.service('UnitConversionService', function () {
    this.convert = function (value, unitSuffix) {
        const units = ['-', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
        var unitIndex = 0;

        while (value >= 1000 && unitIndex < units.length - 1) {
            value /= 1000;
            unitIndex++;
        }

        return value.toFixed(5) + ' ' + units[unitIndex] + unitSuffix;
    }

    this.shortenString = function (text, maxLength) {
        if (text.length <= maxLength) return text;

        var halfLength = Math.floor((maxLength - 3) / 2); // Length of the ellipsis in the middle
        return text.substring(0, halfLength) + '...' + text.substring(text.length - halfLength);
    }

    this.createDateFromString = function (dateString, hour, minutes, dateDelimiter) {
        const timePart = (hour === undefined && minutes === undefined) ?
            '00:00:00' : hour + ':' + minutes + ':00';
        dateDelimiter = dateDelimiter === undefined ? '-' : dateDelimiter;
        const splitDate = dateString.split(dateDelimiter);
        const year = parseInt(splitDate[0], 10);
        const month = parseInt(splitDate[1], 10);
        const day = parseInt(splitDate[2], 10);
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        const isoStr = day + ' ' + months[month - 1] + ' ' + year + ' ' + timePart;
        return new Date(isoStr);
    }
})
.service('ScrollService', function ($window, $timeout) {
    this.scrollToTop = function () {
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

    this.scrollToBottom = function () {
        $timeout(function () {
            var element = document.getElementById('footer');
            element.scrollIntoView({ behavior: 'smooth', block: 'end' });
        });
    };
});
