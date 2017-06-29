import { MultiselectDropdown } from './dropdown.component';
import { MultiSelectSearchFilter } from './search-filter.pipe';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Accordion, AccordionGroup } from './accordion/accordion.component';
var MultiselectDropdownModule = (function () {
    function MultiselectDropdownModule() {
    }
    return MultiselectDropdownModule;
}());
export { MultiselectDropdownModule };
MultiselectDropdownModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, FormsModule],
                exports: [MultiselectDropdown, MultiSelectSearchFilter, Accordion, AccordionGroup],
                declarations: [MultiselectDropdown, MultiSelectSearchFilter, Accordion, AccordionGroup],
            },] },
];
/** @nocollapse */
MultiselectDropdownModule.ctorParameters = function () { return []; };
//# sourceMappingURL=dropdown.module.js.map