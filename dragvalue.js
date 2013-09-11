/*!
 * dragvalue.js 0.0.1 - https://github.com/yckart/DragValue.js
 * Change values by dragging it
 *
 * Copyright (c) 2013 Yannick Albert (http://yckart.com)
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
 * 2013/09/11
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
        this.getset = elem.value !== undefined ? 'value' : 'innerHTML';

        this.ratio = elem.getAttribute('data-ratio') || this.options.ratio;
        this.step = elem.getAttribute('step') || elem.getAttribute('data-step') || this.options.step;
        this.min = elem.getAttribute('min') || elem.getAttribute('data-min') || this.options.min;
        this.max = elem.getAttribute('max') || elem.getAttribute('data-max') || this.options.max;
        this.min = (this.min - this.min) + this.min;
        this.max = (this.max - this.max) + this.max;
        this.axis = elem.getAttribute('data-axis') || this.options.axis;

        this.horizontal = this.axis === 'x';

        elem.className += this.horizontal ? ' w-resize' : ' n-resize';

        this.handleEvents();
    };


    DragValue.prototype.handleEvents = function () {
        var self = this;
        var dragging, last, val;

        on(self.elem, 'mousedown', function (e) {
            dragging = true;
            last = self.horizontal ? e.clientX : -e.clientY;
            val = (self.elem[self.getset] || self.min || self.max || 0) - 0;
        });

        on(document, 'mouseup', function () {
            dragging = false;
        });

        on(document, 'mousemove', function (e) {
            if (!dragging) return;
            var now = self.horizontal ? e.clientX : -e.clientY;
            var tmp = val + Math.floor((now - last) / self.ratio) * self.step;
            tmp = tmp < self.min ? self.min : tmp;
            tmp = tmp > self.max ? self.max : tmp;

            self.elem[self.getset] = (tmp - 0).toFixed(self.step.length - 2);
        });
    };


    if ($) $.fn.dragvalue = function (options) {
        return this.each(function () {
            new DragValue(this, options);
        });
    };

}(this.jQuery || this.Zepto));