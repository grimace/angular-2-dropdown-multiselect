/*
 * Angular 2 Dropdown Multiselect for Bootstrap
 *
 * Simon Lindh
 * https://github.com/softsimon/angular-2-dropdown-multiselect
 */
import { MultiSelectSearchFilter } from './search-filter.pipe';
import { GUARDTYPE } from './types';
import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, KeyValueDiffers, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as LD from 'lodash';
var MULTISELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return MultiselectDropdown; }),
    multi: true
};
var MultiselectDropdown = (function () {
    // debouncer:Subject<string> = new Subject<string>();
    // constructor(private element: ElementRef, private differs: IterableDiffers) {
    function MultiselectDropdown(element, differs) {
        this.element = element;
        this.differs = differs;
        this.disabled = false;
        // @Input() title:string;
        // defaultGroups: Array<IMultiSelectOptionGroup>;
        this.modifiedStates = [];
        this.selectionLimitReached = new EventEmitter();
        this.dropdownClosed = new EventEmitter();
        this.dropdownOpened = new EventEmitter();
        this.onAdded = new EventEmitter();
        this.onRemoved = new EventEmitter();
        // @Output() searchChanged = new EventEmitter();
        // @Output() operatorChanged = new EventEmitter();
        this.resetAll = new EventEmitter();
        this.numSelected = 0;
        this.isVisible = false;
        this.searchFilterText = '';
        // sliderMin: number = 0;
        // sliderMax: number = 10;
        // sliderStep: number = 1;
        // sliderValue: number;
        this.defaultSettings = {
            pullRight: false,
            enableSearch: false,
            checkedStyle: 'checkboxes',
            buttonClasses: 'btn btn-default btn-secondary',
            containerClasses: 'dropdown-inline',
            selectionLimit: 0,
            closeOnSelect: false,
            autoUnselect: false,
            showCheckAll: false,
            showUncheckAll: false,
            showResetAll: false,
            fixedTitle: false,
            dynamicTitleMaxItems: 3,
            maxHeight: '300px'
            // booleans: [ { name:'Any Selected', value:'Any' }, { name:'All Selected', value:'All' }, { name:'None Selected', value:'None' }],
            // boolean: 'Any'
        };
        this.defaultTexts = {
            checkAll: 'Check all',
            uncheckAll: 'Uncheck all',
            resetAll: 'Reset all',
            checked: 'checked',
            checkedPlural: 'checked',
            searchPlaceholder: 'Search...',
            defaultTitle: 'Filters',
            allSelected: 'All selected',
        };
        this.onModelChange = function (_) { };
        this.onModelTouched = function () { };
        console.log('a2 constructor()');
        // this.groups = new Array<ItemGroup>();
        // this.differ = this.differs.find(this.itemGroups).create();
    }
    MultiselectDropdown.prototype.onClick = function (target) {
        if (!this.isVisible)
            return;
        var parentFound = false;
        while (target != null && !parentFound) {
            if (target === this.element.nativeElement) {
                parentFound = true;
            }
            target = target.parentElement;
        }
        if (!parentFound) {
            this.isVisible = false;
            this.dropdownClosed.emit();
        }
    };
    // search(event) {
    //   this.searchChanged.emit(event);
    // }
    MultiselectDropdown.prototype.getItemStyle = function (option) {
        if (option.type == "checkbox") {
            return { 'cursor': 'pointer' };
        }
    };
    MultiselectDropdown.prototype.ngOnInit = function () {
        var _this = this;
        this.settings = Object.assign(this.defaultSettings, this.settings);
        // this.settings = LD.cloneDeep(this.defaultSettings);
        this.texts = Object.assign(this.defaultTexts, this.texts);
        // this.texts = LD.cloneDeep(this.defaultTexts);
        // this.defaultGroups = LD.cloneDeep(this.groups);
        this.title = this.texts.defaultTitle || '';
        // this.objDiffers = new Array<KeyValueDiffer<string, any>>();
        console.log('setting differs on groups : ', this.groups.length);
        this.defaultGroups = LD.cloneDeep(this.groups);
        this.groups.forEach(function (itemGroup, index) {
            _this.modifiedStates.push({ name: itemGroup.name, modified: false });
            // this.objDiffers[index] = this.differs.find([itemGroup]).create();
            // this.objDiffers[index] = this.differs.find(itemGroup.options).create();
            // console.log('adding differ for group : ',itemGroup.name, ' , differ : ', this.objDiffers[index]);
        });
        // this.differ = this.differs.find(this.groups).create(null);
    };
    MultiselectDropdown.prototype.ngDoCheck = function () {
        var _this = this;
        // const changes = this.differ.diff(this.model);
        var totalCount = 0;
        this.groups.forEach(function (itemGroup, index) {
            var count = _this.groupChanged(_this.defaultGroups[index], itemGroup);
            var modifiedState = _this.modifiedStates[index];
            if (count > 0) {
                modifiedState.modified = (count > 0) ? true : false;
                itemGroup.changeCount = count;
                console.log("setting modifiedState : ", modifiedState, count);
                // const objDiffer = this.objDiffers[index];
                // const objChanges = objDiffer.diff(itemGroup.options);
                // if (objChanges) {
                //   console.log('ngDoCheck objChanges : ',objChanges);
                //   objChanges.forEachChangedItem((changedItem) => {
                //     console.log(changedItem.key);
                //   });
                // }
                totalCount += count;
            }
            else {
                modifiedState.modified = false;
                itemGroup.changeCount = count;
            }
        });
        // gregm, maybe button title should be controlled by the parent
        if (totalCount) {
            this.numSelected = totalCount;
            this.updateTitle();
        }
        // const changes = this.differ.diff(this.groups);
        // if (changes) {
        //   console.log('dropdownComponent changed : ',changes);
        //   this.updateNumSelected();
        //   this.updateTitle();
        // }
    };
    MultiselectDropdown.prototype.ngOnChanges = function (changes) {
        if (changes['options']) {
            console.log('ngOnChanges - changes detected : ', changes);
            this.options = this.options || [];
            this.parents = this.options
                .filter(function (option) { return typeof option.parentId === 'number'; })
                .map(function (option) { return option.parentId; });
        }
        if (changes['texts'] && !changes['texts'].isFirstChange()) {
            this.updateTitle();
        }
    };
    MultiselectDropdown.prototype.writeValue = function (value) {
        if (value !== undefined && value !== null) {
            this.model = value;
        }
        else {
            this.model = [];
        }
    };
    MultiselectDropdown.prototype.onRadioChange = function ($event, item) {
    };
    MultiselectDropdown.prototype.registerOnChange = function (fn) {
        this.onModelChange = fn;
    };
    MultiselectDropdown.prototype.registerOnTouched = function (fn) {
        this.onModelTouched = fn;
    };
    MultiselectDropdown.prototype.isDisabled = function (option) {
        return !option.enabled;
    };
    MultiselectDropdown.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    MultiselectDropdown.prototype.validate = function (_c) {
        return (this.model && this.model.length) ? null : {
            required: {
                valid: false,
            },
        };
    };
    MultiselectDropdown.prototype.registerOnValidatorChange = function (_fn) {
        throw new Error('Method not implemented.');
    };
    MultiselectDropdown.prototype.clearSearch = function (event) {
        if (event)
            event.stopPropagation();
        this.searchFilterText = '';
    };
    MultiselectDropdown.prototype.toggleDropdown = function () {
        this.isVisible = !this.isVisible;
        this.isVisible ? this.dropdownOpened.emit() : this.dropdownClosed.emit();
        console.log('dropdownComponent - toggleDropdown() filterCount : ', this.getFilterCount());
        // console.log('toggleDropdown - visible : '+this.isVisible);
    };
    MultiselectDropdown.prototype.isSelectedSave = function (option) {
        return this.model && this.model.indexOf(option.id) > -1;
    };
    MultiselectDropdown.prototype.isSelected = function (option) {
        return option.on;
        // return this.model && this.model.indexOf(option.id) > -1;
    };
    MultiselectDropdown.prototype.setSelectedSave = function (_event, option) {
        var _this = this;
        _event.stopPropagation();
        if (!this.model) {
            this.model = [];
        }
        var index = this.model.indexOf(option.id);
        if (index > -1) {
            this.model.splice(index, 1);
            this.onRemoved.emit(option.id);
            var parentIndex = option.parentId && this.model.indexOf(option.parentId);
            if (parentIndex >= 0) {
                this.model.splice(parentIndex, 1);
                this.onRemoved.emit(option.parentId);
            }
            else if (this.parents.indexOf(option.id) > -1) {
                var childIds_1 = this.options.filter(function (child) { return _this.model.indexOf(child.id) > -1 && child.parentId == option.id; }).map(function (child) { return child.id; });
                this.model = this.model.filter(function (id) { return childIds_1.indexOf(id) < 0; });
                childIds_1.forEach(function (childId) { return _this.onRemoved.emit(childId); });
            }
        }
        else {
            if (this.settings.selectionLimit === 0 || (this.settings.selectionLimit && this.model.length < this.settings.selectionLimit)) {
                this.model.push(option.id);
                this.onAdded.emit(option.id);
                if (option.parentId) {
                    var children = this.options.filter(function (child) { return child.id !== option.id && child.parentId == option.parentId; });
                    if (children.every(function (child) { return _this.model.indexOf(child.id) > -1; })) {
                        this.model.push(option.parentId);
                        this.onAdded.emit(option.parentId);
                    }
                }
                else if (this.parents.indexOf(option.id) > -1) {
                    var children = this.options.filter(function (child) { return _this.model.indexOf(child.id) < 0 && child.parentId == option.id; });
                    children.forEach(function (child) {
                        _this.model.push(child.id);
                        _this.onAdded.emit(child.id);
                    });
                }
            }
            else {
                if (this.settings.autoUnselect) {
                    this.model.push(option.id);
                    this.onAdded.emit(option.id);
                    var removedOption = this.model.shift();
                    this.onRemoved.emit(removedOption);
                }
                else {
                    this.selectionLimitReached.emit(this.model.length);
                    return;
                }
            }
        }
        if (this.settings.closeOnSelect) {
            this.toggleDropdown();
        }
        this.model = this.model.slice();
        this.onModelChange(this.model);
        this.onModelTouched();
    };
    MultiselectDropdown.prototype.toggleSelected = function (_event, group, option) {
        _event.stopPropagation();
        option.on = !option.on;
        console.log('setting lastModified for group: ' + group.heading);
        group.lastModified = new Date();
        this.onModelChange(this.model);
        this.onModelTouched();
    };
    MultiselectDropdown.prototype.updateNumSelected = function () {
        var _this = this;
        this.numSelected = this.model && this.model.filter(function (id) { return _this.parents.indexOf(id) < 0; }).length || 0;
    };
    MultiselectDropdown.prototype.updateTitle = function () {
        if (this.numSelected === 0 || this.settings.fixedTitle) {
            this.title = this.texts.defaultTitle || '';
            // } else if (this.settings.displayAllSelectedText && this.model.length === this.options.length) {
            //   this.title = this.texts.allSelected || '';
            // } else if (this.settings.dynamicTitleMaxItems && this.settings.dynamicTitleMaxItems >= this.numSelected) {
            //   this.title = this.options
            //     .filter((option: IMultiSelectOption) =>
            //       this.model && this.model.indexOf(option.id) > -1
            //     )
            //     .map((option: IMultiSelectOption) => option.name)
            //     .join(', ');
        }
        else {
            this.title = this.numSelected
                + ' '
                + (this.numSelected === 1 ? this.texts.checked : this.texts.checkedPlural);
        }
    };
    MultiselectDropdown.prototype.setTitle = function (t) {
        this.title = t;
    };
    MultiselectDropdown.prototype.searchFilterApplied = function () {
        return this.settings.enableSearch && this.searchFilterText && this.searchFilterText.length > 0;
    };
    MultiselectDropdown.prototype.checkAll = function () {
        var _this = this;
        var checkedOptions = (!this.searchFilterApplied() ? this.options :
            (new MultiSelectSearchFilter()).transform(this.options, this.searchFilterText))
            .filter(function (option) {
            if (_this.model.indexOf(option.id) === -1) {
                _this.onAdded.emit(option.id);
                return true;
            }
            return false;
        }).map(function (option) { return option.id; });
        this.model = this.model.concat(checkedOptions);
        this.onModelChange(this.model);
        this.onModelTouched();
    };
    MultiselectDropdown.prototype.uncheckAll = function () {
        var _this = this;
        var unCheckedOptions = (!this.searchFilterApplied() ? this.model
            : (new MultiSelectSearchFilter()).transform(this.options, this.searchFilterText).map(function (option) { return option.id; }));
        this.model = this.model.filter(function (id) {
            if (unCheckedOptions.indexOf(id) < 0) {
                return true;
            }
            else {
                _this.onRemoved.emit(id);
                return false;
            }
        });
        this.onModelChange(this.model);
        this.onModelTouched();
    };
    MultiselectDropdown.prototype.reset = function () {
        console.log('a2 emitting resetAll');
        this.resetAll.emit();
    };
    MultiselectDropdown.prototype.preventCheckboxCheck = function (event, option) {
        if (this.settings.selectionLimit && !this.settings.autoUnselect &&
            this.model.length >= this.settings.selectionLimit &&
            this.model.indexOf(option.id) === -1) {
            event.preventDefault();
        }
    };
    MultiselectDropdown.prototype.updateRadio = function (event, group, option, item) {
        // event.stopPropagation();
        option.option = item.value;
        console.log('updateRadio : ' + option.option + ' , ' + item.name);
        if (item.value == 0) {
            option.enabled = false;
        }
        else {
            option.enabled = true;
        }
        group.lastModified = new Date();
        this.onModelChange(this.model);
    };
    MultiselectDropdown.prototype.updateAllowGuard = function (event, option, item) {
        item.on = !item.on;
        console.log('updateGuard Allow : ' + item.on);
        var group = option.group;
        if (item.guard) {
            for (var idx = 0; idx < group.length; idx++) {
                var itm = group[idx];
                if (!itm.guard) {
                    itm.enabled = item.on;
                }
            }
        }
        this.onModelChange(this.model);
    };
    MultiselectDropdown.prototype.updateParentGuard = function (event, option, item) {
        item.on = !item.on;
        var group = option.group;
        var groupSize = group.length - 1;
        if (!item.on) {
            // only children can be turned off
            for (var idx = 0; idx < group.length; idx++) {
                var itm = group[idx];
                if (itm.guard) {
                    itm.on = false;
                    itm.enabled = true;
                }
            }
        }
        else {
            if (item.guard) {
                for (var idx = 0; idx < group.length; idx++) {
                    var itm = group[idx];
                    if (!itm.guard) {
                        itm.on = true;
                        //  itm.enabled = false;
                    }
                }
                item.enabled = false;
            }
            else {
                // var allon:boolean = true;
                var guard;
                var count = 0;
                for (var idx = 0; idx < group.length; idx++) {
                    var itm = group[idx];
                    if (!itm.guard) {
                        if (itm.on) {
                            count++;
                        }
                        //  allon = false;
                        //  break;
                    }
                    else {
                        guard = itm;
                    }
                }
                if (groupSize == count) {
                    guard.on = true;
                    guard.enabled = false;
                    // this.clearGuardItems(option);
                    // item.on = false;
                }
            }
        }
        console.log('updateGuard Parent : ' + item.on);
        this.onModelChange(this.model);
    };
    MultiselectDropdown.prototype.allGuardItemsOn = function (option) {
        var allon = true;
        var group = option.group;
        for (var idx = 0; idx < group.length; idx++) {
            var itm = group[idx];
            if (!itm.guard) {
                if (!itm.on) {
                    allon = false;
                    break;
                }
            }
        }
        return allon;
    };
    MultiselectDropdown.prototype.allGuardItemsOff = function (option) {
        var alloff = true;
        var group = option.group;
        for (var idx = 0; idx < group.length; idx++) {
            var itm = group[idx];
            if (!itm.guard) {
                if (itm.on) {
                    alloff = false;
                    break;
                }
            }
        }
        return alloff;
    };
    MultiselectDropdown.prototype.toggleGuardOn = function (option) {
        var _this = this;
        setTimeout(function () {
            console.log('clearing guard items for option');
            var group = option.group;
            var guard;
            for (var idx = 0; idx < group.length; idx++) {
                var itm = group[idx];
                if (!itm.guard) {
                    itm.on = false;
                }
                else {
                    guard = itm;
                }
            }
            guard.on = true;
            // this.disableGuard(option);
            guard.enable = false;
            _this.onModelChange(_this.model);
        }, 0);
    };
    MultiselectDropdown.prototype.disableGuard = function (option) {
        setTimeout(function () {
            console.log('disabling guard for option');
            var group = option.group;
            var guard;
            for (var idx = 0; idx < group.length; idx++) {
                var itm = group[idx];
                if (itm.guard) {
                    itm.enable = false;
                }
            }
        }, 0);
    };
    MultiselectDropdown.prototype.clearGuardItems = function (option) {
        setTimeout(function () {
            console.log('clearing guard items for option');
            var group = option.group;
            for (var idx = 0; idx < group.length; idx++) {
                var itm = group[idx];
                if (!itm.guard) {
                    itm.on = false;
                }
            }
        }, 0);
    };
    // in this case, the guard checkbox is only an indicator of whether all are on
    // guard is never enabled
    MultiselectDropdown.prototype.updateCollectiveGuard = function (event, option, item) {
        item.on = !item.on;
        console.log('updateGuard Parent : ' + item.on);
        var group = option.group;
        if (!item.on) {
            // only children can be turned off
            for (var idx = 0; idx < group.length; idx++) {
                var itm = group[idx];
                if (itm.guard) {
                    itm.on = false;
                    itm.enabled = false;
                }
            }
        }
        else {
            if (!item.guard) {
                var allon = true;
                var guard;
                for (var idx = 0; idx < group.length; idx++) {
                    var itm = group[idx];
                    if (!itm.guard && !itm.on) {
                        allon = false;
                        break;
                    }
                    else {
                        guard = itm;
                    }
                }
                if (allon) {
                    guard.on = true;
                    guard.enabled = false;
                }
            }
        }
        this.onModelChange(this.model);
    };
    MultiselectDropdown.prototype.updatePreventGuard = function (event, option, item) {
        item.on = !item.on;
        console.log('updateGuard Prevent : ' + item.on);
        var group = option.group;
        var groupSize = group.length - 1;
        if (item.on) {
            if (item.guard) {
                item.enabled = false;
                for (var idx = 0; idx < option.group.length; idx++) {
                    var itm = group[idx];
                    if (!itm.guard) {
                        //  itm.enabled = false;
                        itm.on = false;
                    }
                }
            }
            else {
                if (this.allGuardItemsOn(option)) {
                    this.toggleGuardOn(option);
                }
                else {
                    for (var idx = 0; idx < option.group.length; idx++) {
                        var itm = group[idx];
                        if (itm.guard) {
                            itm.on = false;
                            itm.enabled = true;
                        }
                    }
                }
            }
        }
        else {
            if (!item.guard) {
                if (this.allGuardItemsOff(option)) {
                    this.toggleGuardOn(option);
                }
                // var guard;
                // var count = 0;
                // for (var idx=0; idx < group.length; idx++) {
                //   var itm = group[idx];
                //   if (!itm.guard) {
                //     if (!itm.on) {
                //        count ++;
                //     }
                //   } else {
                //     guard = itm;
                //   }
                // }
                // if (groupSize == count) {
                //     guard.on = true;
                //     guard.enabled = false;
                //     this.clearGuardItems(option);
                //     // item.on = false;
                // }
                // var anyOn: boolean = false;
                // var guard;
                // for (var idx=0; idx < option.group.length; idx++) {
                //   var itm = group[idx];
                //   if (!itm.guard) {
                //      if (itm.on) {
                //        anyOn = true;
                //      }
                //   } else {
                //     guard = itm;
                //   }
                // }
                // if (!anyOn) {
                //   guard.on = true;
                //   guard.enabled = false;
                // }
            }
        }
        this.onModelChange(this.model);
    };
    // updateOperator(value) {
    //     console.log('a2 setting operator to : '+value);
    //     this.settings.operator = value;
    //     this.operatorChanged.emit(value);
    // }
    MultiselectDropdown.prototype.updateGuard = function (event, group, option, item) {
        group.lastModified = new Date();
        switch (option.guardType) {
            case GUARDTYPE.ALLOW:
                this.updateAllowGuard(event, option, item);
                break;
            case GUARDTYPE.PARENT:
                this.updateParentGuard(event, option, item);
                break;
            case GUARDTYPE.PREVENT:
                this.updatePreventGuard(event, option, item);
                break;
            case GUARDTYPE.COLLECTIVE:
                this.updateCollectiveGuard(event, option, item);
                break;
        }
    };
    MultiselectDropdown.prototype.groupChanged = function (references, group) {
        var diffCount = 0;
        references.options.forEach(function (reference, index) {
            var option = group.options[index];
            if (reference.on != option.on) {
                diffCount++;
            }
            if (reference.group) {
                // check any subgroups
                var subGroup = reference.group;
                subGroup.forEach(function (subReference, subIndex) {
                    var subOption = option.group[subIndex];
                    if (subReference.on != subOption.on) {
                        diffCount++;
                    }
                });
            }
        });
        group.changeCount = diffCount;
        return diffCount;
    };
    // sliderChange( event ) {
    //   console.log(event);
    // }
    MultiselectDropdown.prototype.getFilterCount = function () {
        var filterCount = 0;
        for (var _i = 0, _a = this.groups; _i < _a.length; _i++) {
            var group = _a[_i];
            if (group.changeCount) {
                filterCount += group.changeCount;
            }
        }
        return filterCount;
    };
    return MultiselectDropdown;
}());
export { MultiselectDropdown };
MultiselectDropdown.decorators = [
    { type: Component, args: [{
                selector: 'ss-multiselect-dropdown',
                template: '<div class="dropdown" [ngClass]="settings.containerClasses" [class.open]="isVisible"><button *ngIf="!settings.exButtonId" type="button" class="dropdown-toggle" [ngClass]="settings.buttonClasses" (click)="toggleDropdown()" [disabled]="disabled"><span class="caret">{{ title }}</span></button><accordion *ngIf="isVisible" class="dropdown-menu" class="wrapper left container"><ul [class.pull-right]="settings.pullRight" [class.dropdown-menu-right]="settings.pullRight" [style.max-height]="settings.maxHeight" class="sublist"><!-- <li class="mdropdown-item search"> --><!-- <div class="input-group"> --><!-- <span class="input-group-addon" id="sizing-addon2"><i class="fa fa-search"></i></span> --><!-- <input id="searchText" type="text" class="form-control" placeholder="{{ texts.searchPlaceholder }}" aria-describedby="sizing-addon2" (ngModelChange)="search($event)" [ngModelOptions]="{ standalone: true, debounce: 3000 }" [(ngModel)]="searchFilterText" autofocus> --><!-- </div> --><!-- </li> --><!-- <span class="boolean-check" *ngIf="settings.operators"> --><!-- <label class="radioLabel" *ngFor="let item of settings.operators"> --><!-- <input class="radioButton" type="radio" name="booleans" (click)="updateOperator(item.value)" [checked]="settings.operator === item.value"> --><!-- {{item.name}} --><!-- </label> --><!-- </span> --><li class="mdropdown-item check-control check-control-check" *ngIf="settings.showResetAll"><a href="javascript:;" role="menuitem" tabindex="-1" (click)="reset()"><span style="width: 16px" [ngClass]="{\'glyphicon glyphicon-ok\': settings.checkedStyle !== \'fontawesome\',\'fa fa-check\': settings.checkedStyle === \'fontawesome\'}"></span> {{ texts.resetAll }}</a></li><li class="mdropdown-item check-control check-control-check" *ngIf="settings.showCheckAll"><a href="javascript:;" role="menuitem" tabindex="-1" (click)="checkAll()"><span style="width: 16px" [ngClass]="{\'glyphicon glyphicon-ok\': settings.checkedStyle !== \'fontawesome\',\'fa fa-check\': settings.checkedStyle === \'fontawesome\'}"></span> {{ texts.checkAll }}</a></li><li class="mdropdown-item check-control check-control-uncheck" *ngIf="settings.showUncheckAll"><a href="javascript:;" role="menuitem" tabindex="-1" (click)="uncheckAll()"><span style="width: 16px" [ngClass]="{\'glyphicon glyphicon-remove\': settings.checkedStyle !== \'fontawesome\',\'fa fa-times\': settings.checkedStyle === \'fontawesome\'}"></span> {{ texts.uncheckAll }}</a></li><li *ngIf="settings.showCheckAll || settings.showUncheckAll" class="dropdown-divider divider"></li></ul><accordion-group class="navGroup" *ngFor="let group of groups" [group]="group" [isOpen]="group.open"><ul [class.pull-right]="settings.pullRight" [class.dropdown-menu-right]="settings.pullRight" [style.max-height]="settings.maxHeight" class="sublist"><li class="mdropdown-item" [ngStyle]="getItemStyle(option)" *ngFor="let option of group.options" [class.dropdown-header]=\'option.type == "label"\'><ng-template [ngIf]=\'option.type == "label"\'>{{ option.name }}</ng-template><a *ngIf=\'option.type == "checkbox"\' (click)="toggleSelected($event, group, option)" role="menuitem" tabindex="-1" [style.padding-left]="this.parents.length>0&&this.parents.indexOf(option.id)<0&&\'30px\'"><input *ngIf="settings.checkedStyle === \'checkboxes\'" type="checkbox" [checked]="option.on" (click)="preventCheckboxCheck($event, option)" [disabled]="isDisabled(option)"> <span *ngIf="settings.checkedStyle === \'glyphicon\'" style="width: 16px" class="glyphicon" [class.glyphicon-ok]="isSelected(option)"></span> <span *ngIf="settings.checkedStyle === \'fontawesome\'" style="width: 16px;display: inline-block"><i *ngIf="isSelected(option)" class="fa fa-check" aria-hidden="true"></i> </span><span [ngClass]="settings.itemClasses" [style.font-weight]="this.parents.indexOf(option.id)>=0?\'bold\':\'normal\'">{{ option.name }} </span><img *ngIf="option.image" class="dropdown-image" src="{{option.image}}"> </a><span *ngIf=\'option.type == "guardgroup"\' class="guardGroup"><a *ngFor="let item of option.group" (click)="updateGuard($event, group, option, item)" role="menuitem" tabindex="-1" [style.padding-left]="this.parents.length>0&&this.parents.indexOf(option.id)<0&&\'30px\'"><input *ngIf="settings.checkedStyle === \'checkboxes\'" type="checkbox" [checked]="item.on"  (click)="preventCheckboxCheck($event, option)" [disabled]="isDisabled(item)"> <span *ngIf="settings.checkedStyle === \'glyphicon\'" style="width: 16px" class="glyphicon" [class.glyphicon-ok]="isSelected(option)"></span> <span *ngIf="settings.checkedStyle === \'fontawesome\'" style="width: 16px;display: inline-block"><i *ngIf="isSelected(item)" class="fa fa-check" aria-hidden="true"></i> </span><span [ngClass]="settings.itemClasses" [style.font-weight]="this.parents.indexOf(option.id)>=0?\'bold\':\'normal\'">{{ item.name }} </span><img *ngIf="item.image" class="dropdown-image" src="{{item.image}}"> </a></span><span class="radioGroup" *ngIf=\'option.type == "group"\'><label class="radioLabel" *ngFor="let item of option.radioGroup" (click)="updateRadio($event, group, option, item)"><input class="radioButton" type="radio" name="{{option.name}}" (click)="updateRadio($event, group, option, item)" [checked]="item.on"> {{ item.name }}</label></span><span class="slider" *ngIf=\'option.type == "slider"\'>{{ option.name }} is a slider.</span></li></ul></accordion-group></accordion></div>',
                styles: ['a {  outline: none !important;}.boolean-check {  display: inline-block;  color: #0275d8;  border: #2196F3;  border-style: solid;  border-width: thin;  border-radius: 4px;  margin-left: 1vh;}.dropdown-inline {  display: inline-block;  background-color: transparent;  width: fit-content;}.panel-group {  background-color: #f0f8ff;  border: rgb(170,170,170) 1px solid;  border-radius: 4px;  display: inherit;  width: 100%;  height: 100%;  margin-left: 0px;  margin-top: 2px;  padding: 0px;  padding-top: 4px;  padding-bottom: 6px;}.dropdown-toggle {  display: inline-flex;  align-items: flex-start;  text-align: center;  justify-content: center;  /* background-color: #c1e2ed; */  border-radius: 4px;  border-color: transparent;  border-width: 1px;  /* width: 100px;  height: 40px; */  font-size: 16px;}.sublist {  /* display: block; */  height: auto;  overflow-y: auto;  max-width: 90%;  box-sizing: border-box;  /* padding-left: 40px;  padding-top: 10px; */}.mdropdown-item {  box-sizing: border-box;  list-style-type: none;}.radioLabel {  display: inline-block;  padding-left: 10px;  padding-right: 10px;}.radioGroup {  max-width: 200px;  white-space: nowrap;  display: inline-block;  padding-left: 14px;}.radioButton {  position: relative;  padding-left: 2px;  padding-right: 2px;  /*margin-left: 4px;  padding-left: 10px;*/  white-space: nowrap;  display: inline-block;}.check-control {  margin-left: 1vh;  /* margin-right: 10px; */}#searchText {  min-height: 20px;  /* margin-top: 11px; */}.input-group-addon {    margin-left: 20px;    margin-top: 10px;}.dropdown-header {  font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;  font-size: 28px;  font-weight: normal;  display: inherit;  float: left;  color: #777;  background-color: #d3d3d3;  margin: 0px;  margin-top: 3px !important;  margin-bottom: 3px;  padding: 4px;  padding-left: 20px;  padding-right: 24px;  text-align: left;  width: 100%;  box-sizing: border-box;}.panel-title {  margin: 1px;}.panel-default {  width: 100%;}.twistie {  width: 24px;  height: 24px;}'],
                providers: [MULTISELECT_VALUE_ACCESSOR]
            },] },
];
/** @nocollapse */
MultiselectDropdown.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: KeyValueDiffers, },
]; };
MultiselectDropdown.propDecorators = {
    'options': [{ type: Input },],
    'groups': [{ type: Input, args: ['groups',] },],
    'settings': [{ type: Input },],
    'texts': [{ type: Input },],
    'disabled': [{ type: Input },],
    'selectionLimitReached': [{ type: Output },],
    'dropdownClosed': [{ type: Output },],
    'dropdownOpened': [{ type: Output },],
    'onAdded': [{ type: Output },],
    'onRemoved': [{ type: Output },],
    'resetAll': [{ type: Output },],
    'onClick': [{ type: HostListener, args: ['document: click', ['$event.target'],] },],
};
//# sourceMappingURL=dropdown.component.js.map