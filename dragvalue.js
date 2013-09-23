/*!
 * dragvalue.js 0.0.3 - https://github.com/yckart/DragValue.js
 * Change values by dragging it
 *
 * Copyright (c) 2013 Yannick Albert (http://yckart.com)
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
 * 2013/09/23
 **/

(function ($, undefined) {

    var defaults = {
        step: 1,
        min: -Infinity,
        max: Infinity,
        ratio: 10,
        axis: 'x'
    };



    var on = function (elem, event, fn) {
        return elem.addEventListener ? elem.addEventListener(event, fn, false) : elem.attachEvent('on' + event, fn);
    };



    this.DragValue = function (elem, options) {
        this.elem = elem;
        this.options = defaults;
        if (options) for (var key in options) {
            this.options[key] =  options[key];
        }

        this.init();
    };



    DragValue.prototype.init = function () {
        var elem = this.elem;
        this.value = elem.value !== undefined ? 'value' : 'innerHTML';

        this.axis = elem.getAttribute('data-axis') || this.options.axis;
        this.ratio = elem.getAttribute('data-ratio') || this.options.ratio;
        this.step = elem.getAttribute('step') || elem.getAttribute('data-step') || this.options.step;
        this.min = elem.getAttribute('min') || elem.getAttribute('data-min') || this.options.min;
        this.max = elem.getAttribute('max') || elem.getAttribute('data-max') || this.options.max;
        this.min = (this.min - this.min) + this.min;
        this.max = (this.max - this.max) + this.max;

        this.horizontal = this.axis === 'x';

        elem.className += this.horizontal ? ' w-resize' : ' n-resize';

        this.handleEvents();
    };



    DragValue.prototype.handleEvents = function () {
        var self = this;
        var dragging, last, val;

        var ondown = function (e) {
            dragging = true;
            if ( e.touches ) e = e.touches[0];
            last = self.horizontal ? e.clientX : -e.clientY;
            val = (self.elem[self.value] || self.min || self.max || 0) - 0;
        };

        var onup = function () {
            dragging = false;
        };

        var onmove = function (e) {
            if ( !dragging || (e.touches && e.touches.length > 1) ) return;
            if ( e.touches ) e = e.touches[0];

            var now = self.horizontal ? e.clientX : -e.clientY;
            var tmp = val + Math.floor((now - last) / self.ratio) * self.step;
            tmp = tmp < self.min ? self.min : tmp;
            tmp = tmp > self.max ? self.max : tmp;

            self.elem[self.value] = (tmp - 0).toFixed(self.step.length - 2);
        };


        on(self.elem, 'mousedown', ondown);
        on(document, 'mouseup', onup);
        on(document, 'mousemove', onmove);

        on(self.elem, 'touchstart', ondown);
        on(document, 'touchend', onup);
        on(document, 'touchmove', onmove);
    };



    if ($) $.fn.dragvalue = function (options) {
        return this.each(function () {
            new DragValue(this, options);
        });
    };

}(this.jQuery || this.Zepto));