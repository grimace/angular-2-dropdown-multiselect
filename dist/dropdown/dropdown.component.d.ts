import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts, IMultiSelectOptionGroup } from './types';
import { DoCheck, ElementRef, EventEmitter, KeyValueDiffers, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, ControlValueAccessor, Validator } from '@angular/forms';
export declare class MultiselectDropdown implements OnInit, OnChanges, DoCheck, ControlValueAccessor, Validator {
    private element;
    private differs;
    options: Array<IMultiSelectOption>;
    groups: Array<IMultiSelectOptionGroup>;
    settings: IMultiSelectSettings;
    texts: IMultiSelectTexts;
    disabled: boolean;
    modifiedStates: any[];
    defaultGroups: Array<IMultiSelectOptionGroup>;
    private objDiffers;
    selectionLimitReached: EventEmitter<{}>;
    dropdownClosed: EventEmitter<{}>;
    dropdownOpened: EventEmitter<{}>;
    onAdded: EventEmitter<{}>;
    onRemoved: EventEmitter<{}>;
    resetAll: EventEmitter<{}>;
    onClick(target: HTMLElement): void;
    model: any[];
    radioValue: any;
    parents: any[];
    title: string;
    differ: any;
    numSelected: number;
    isVisible: boolean;
    searchFilterText: string;
    defaultSettings: IMultiSelectSettings;
    defaultTexts: IMultiSelectTexts;
    constructor(element: ElementRef, differs: KeyValueDiffers);
    getItemStyle(option: IMultiSelectOption): any;
    ngOnInit(): void;
    ngDoCheck(): void;
    ngOnChanges(changes: SimpleChanges): void;
    onModelChange: Function;
    onModelTouched: Function;
    writeValue(value: any): void;
    onRadioChange($event: any, item: any): void;
    registerOnChange(fn: Function): void;
    registerOnTouched(fn: Function): void;
    isDisabled(option: IMultiSelectOption): boolean;
    setDisabledState(isDisabled: boolean): void;
    validate(_c: AbstractControl): {
        [key: string]: any;
    };
    registerOnValidatorChange(_fn: () => void): void;
    clearSearch(event: Event): void;
    toggleDropdown(): void;
    isSelectedSave(option: IMultiSelectOption): boolean;
    isSelected(option: IMultiSelectOption): boolean;
    setSelectedSave(_event: Event, option: IMultiSelectOption): void;
    toggleSelected(_event: Event, group: IMultiSelectOptionGroup, option: IMultiSelectOption): void;
    updateNumSelected(): void;
    updateTitle(): void;
    searchFilterApplied(): boolean;
    checkAll(): void;
    uncheckAll(): void;
    reset(): void;
    preventCheckboxCheck(event: Event, option: IMultiSelectOption): void;
    updateRadio(event: any, group: IMultiSelectOptionGroup, option: any, item: any): void;
    updateAllowGuard(event: any, option: any, item: IMultiSelectOption): void;
    updateParentGuard(event: any, option: any, item: IMultiSelectOption): void;
    allGuardItemsOn(option: any): boolean;
    allGuardItemsOff(option: any): boolean;
    toggleGuardOn(option: any): void;
    disableGuard(option: any): void;
    clearGuardItems(option: any): void;
    updateCollectiveGuard(event: any, option: any, item: IMultiSelectOption): void;
    updatePreventGuard(event: any, option: any, item: IMultiSelectOption): void;
    updateGuard(event: any, group: IMultiSelectOptionGroup, option: any, item: IMultiSelectOption): void;
    groupChanged(references: IMultiSelectOptionGroup, group: IMultiSelectOptionGroup): number;
}
