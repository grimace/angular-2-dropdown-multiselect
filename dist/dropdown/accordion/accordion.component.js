import { Component, Input } from '@angular/core';
var Accordion = (function () {
    function Accordion() {
        this.groups = [];
    }
    Accordion.prototype.addGroup = function (group) {
        this.groups.push(group);
    };
    Accordion.prototype.closeOthers = function (openGroup) {
        this.groups.forEach(function (group) {
            if (group !== openGroup) {
                group.isOpen = false;
            }
        });
    };
    Accordion.prototype.removeGroup = function (group) {
        var index = this.groups.indexOf(group);
        if (index !== -1) {
            this.groups.splice(index, 1);
        }
    };
    return Accordion;
}());
export { Accordion };
Accordion.decorators = [
    { type: Component, args: [{
                selector: 'accordion',
                template: "\n  <ng-content></ng-content>\n          ",
                host: {
                    'class': 'panel-group'
                }
            },] },
];
/** @nocollapse */
Accordion.ctorParameters = function () { return []; };
var AccordionGroup = (function () {
    function AccordionGroup(accordion) {
        this.accordion = accordion;
        this._isOpen = false;
        this.accordion.addGroup(this);
    }
    Object.defineProperty(AccordionGroup.prototype, "isOpen", {
        get: function () {
            return this._isOpen;
        },
        set: function (value) {
            this._isOpen = value;
            if (value) {
                this.accordion.closeOthers(this);
            }
        },
        enumerable: true,
        configurable: true
    });
    AccordionGroup.prototype.ngOnDestroy = function () {
        this.accordion.removeGroup(this);
    };
    AccordionGroup.prototype.toggleOpen = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.isOpen = !this.isOpen;
    };
    Object.defineProperty(AccordionGroup.prototype, "isModified", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    return AccordionGroup;
}());
export { AccordionGroup };
AccordionGroup.decorators = [
    { type: Component, args: [{
                selector: 'accordion-group',
                // templateUrl: './accordion.component.html',
                template: "<div class=\"panel panel-default\" [ngClass]=\"{'panel-open': isOpen}\">\n    <div class=\"panel-heading\" (click)=\"toggleOpen($event)\">\n      <h4 class=\"panel-title\">\n        <a href tabindex=\"0\">\n          <span class=\"mdropdown-item dropdown-header\">\n          <img *ngIf=\"_isOpen\" class=\"twistie\" src=\"assets/icons/twistie_on.png\">\n          <img *ngIf=\"!_isOpen\" class=\"twistie\" src=\"assets/icons/twistie_off.png\">\n          {{heading}}\n          </span>\n        </a>\n      </h4>\n    </div>\n    <div class=\"panel-collapse\" [hidden]=\"!isOpen\">\n      <div class=\"panel-body\">\n          <ng-content></ng-content>\n      </div>\n    </div>\n  </div>"
            },] },
];
/** @nocollapse */
AccordionGroup.ctorParameters = function () { return [
    { type: Accordion, },
]; };
AccordionGroup.propDecorators = {
    'heading': [{ type: Input },],
    'isOpen': [{ type: Input },],
};
//# sourceMappingURL=accordion.component.js.map