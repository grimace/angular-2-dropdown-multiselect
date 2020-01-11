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
        // @Input() heading: string;
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
    AccordionGroup.prototype.isModified = function () {
        var modified = false;
        if (this.group.changeCount && this.group.changeCount > 0) {
            modified = true;
        }
        return false;
    };
    AccordionGroup.prototype.getToggleImage = function () {
        var src;
        if (this.isModified()) {
            if (this.isOpen) {
                src = "assets/icons/twistie_on.png";
            }
            else {
                src = "assets/icons/twistie_off.png";
            }
        }
        else {
            if (this.isOpen) {
                src = "assets/icons/twistie_on_blue.png";
            }
            else {
                src = "assets/icons/twistie_off_blue.png";
            }
        }
    };
    return AccordionGroup;
}());
export { AccordionGroup };
AccordionGroup.decorators = [
    { type: Component, args: [{
                selector: 'accordion-group',
                templateUrl: 'accordion.component.html',
            },] },
];
/** @nocollapse */
AccordionGroup.ctorParameters = function () { return [
    { type: Accordion, },
]; };
AccordionGroup.propDecorators = {
    'group': [{ type: Input },],
    'isOpen': [{ type: Input },],
};
//# sourceMappingURL=accordion.component.js.map