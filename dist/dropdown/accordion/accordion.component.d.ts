import { OnDestroy } from '@angular/core';
export declare class Accordion {
    groups: Array<AccordionGroup>;
    addGroup(group: AccordionGroup): void;
    closeOthers(openGroup: AccordionGroup): void;
    removeGroup(group: AccordionGroup): void;
}
export declare class AccordionGroup implements OnDestroy {
    private accordion;
    _isOpen: boolean;
    group: any;
    toggleImage: any;
    isOpen: boolean;
    constructor(accordion: Accordion);
    ngOnDestroy(): void;
    ngOnInit(): void;
    toggleOpen(event: MouseEvent): void;
    isModified(): boolean;
    getToggleImage(): any;
}
