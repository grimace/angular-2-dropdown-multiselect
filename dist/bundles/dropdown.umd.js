(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/forms'), require('@angular/common')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/forms', '@angular/common'], factory) :
	(factory((global.dropdown = global.dropdown || {}),global.ng.core,global.ng.forms,global.ng.common));
}(this, (function (exports,_angular_core,_angular_forms,_angular_common) { 'use strict';

(function (Relation) {
    Relation[Relation["INDEPENDENT"] = 1] = "INDEPENDENT";
    Relation[Relation["CONTROLLER"] = 2] = "CONTROLLER";
    Relation[Relation["INVERSE"] = 3] = "INVERSE";
    Relation[Relation["EXCLUSIVE"] = 4] = "EXCLUSIVE";
})(exports.Relation || (exports.Relation = {}));

(function (GUARDTYPE) {
    GUARDTYPE[GUARDTYPE["ALLOW"] = 1] = "ALLOW";
    GUARDTYPE[GUARDTYPE["PREVENT"] = 2] = "PREVENT";
    GUARDTYPE[GUARDTYPE["PARENT"] = 3] = "PARENT";
    GUARDTYPE[GUARDTYPE["COLLECTIVE"] = 4] = "COLLECTIVE";
})(exports.GUARDTYPE || (exports.GUARDTYPE = {}));

var MultiSelectSearchFilter = (function () {
    function MultiSelectSearchFilter() {
    }
    MultiSelectSearchFilter.prototype.transform = function (options, args) {
        var matchPredicate = function (option) { return option.name.toLowerCase().indexOf((args || '').toLowerCase()) > -1; }, getChildren = function (option) { return options.filter(function (child) { return child.parentId === option.id; }); }, getParent = function (option) { return options.find(function (parent) { return option.parentId === parent.id; }); };
        return options.filter(function (option) {
            return matchPredicate(option) ||
                (typeof (option.parentId) === 'undefined' && getChildren(option).some(matchPredicate)) ||
                (typeof (option.parentId) !== 'undefined' && matchPredicate(getParent(option)));
        });
    };
    return MultiSelectSearchFilter;
}());
MultiSelectSearchFilter.decorators = [
    { type: _angular_core.Pipe, args: [{
                name: 'searchFilter'
            },] },
];
/** @nocollapse */
MultiSelectSearchFilter.ctorParameters = function () { return []; };

/*
 * Angular 2 Dropdown Multiselect for Bootstrap
 *
 * Simon Lindh
 * https://github.com/softsimon/angular-2-dropdown-multiselect
 */
var MULTISELECT_VALUE_ACCESSOR = {
    provide: _angular_forms.NG_VALUE_ACCESSOR,
    useExisting: _angular_core.forwardRef(function () { return MultiselectDropdown; }),
    multi: true
};
var MultiselectDropdown = (function () {
    // debouncer:Subject<string> = new Subject<string>();
    function MultiselectDropdown(element, differs) {
        this.element = element;
        this.disabled = false;
        this.selectionLimitReached = new _angular_core.EventEmitter();
        this.dropdownClosed = new _angular_core.EventEmitter();
        this.dropdownOpened = new _angular_core.EventEmitter();
        this.onAdded = new _angular_core.EventEmitter();
        this.onRemoved = new _angular_core.EventEmitter();
        this.searchChanged = new _angular_core.EventEmitter();
        this.operatorChanged = new _angular_core.EventEmitter();
        this.resetAll = new _angular_core.EventEmitter();
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
            defaultTitle: 'Select',
            allSelected: 'All selected',
        };
        this.onModelChange = function (_) { };
        this.onModelTouched = function () { };
        console.log('a2 constructor()');
        this.differ = differs.find([]).create(null);
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
    MultiselectDropdown.prototype.search = function (event) {
        this.searchChanged.emit(event);
    };
    MultiselectDropdown.prototype.getItemStyle = function (option) {
        if (option.type == "checkbox") {
            return { 'cursor': 'pointer' };
        }
    };
    MultiselectDropdown.prototype.ngOnInit = function () {
        this.settings = Object.assign(this.defaultSettings, this.settings);
        this.texts = Object.assign(this.defaultTexts, this.texts);
        this.title = this.texts.defaultTitle || '';
    };
    MultiselectDropdown.prototype.ngOnChanges = function (changes) {
        if (changes['options']) {
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
    MultiselectDropdown.prototype.ngDoCheck = function () {
        var changes = this.differ.diff(this.model);
        if (changes) {
            this.updateNumSelected();
            this.updateTitle();
        }
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
        event.stopPropagation();
        this.searchFilterText = '';
    };
    MultiselectDropdown.prototype.toggleDropdown = function () {
        this.isVisible = !this.isVisible;
        this.isVisible ? this.dropdownOpened.emit() : this.dropdownClosed.emit();
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
        var _this = this;
        if (this.numSelected === 0 || this.settings.fixedTitle) {
            this.title = this.texts.defaultTitle || '';
        }
        else if (this.settings.displayAllSelectedText && this.model.length === this.options.length) {
            this.title = this.texts.allSelected || '';
        }
        else if (this.settings.dynamicTitleMaxItems && this.settings.dynamicTitleMaxItems >= this.numSelected) {
            this.title = this.options
                .filter(function (option) {
                return _this.model && _this.model.indexOf(option.id) > -1;
            })
                .map(function (option) { return option.name; })
                .join(', ');
        }
        else {
            this.title = this.numSelected
                + ' '
                + (this.numSelected === 1 ? this.texts.checked : this.texts.checkedPlural);
        }
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
    MultiselectDropdown.prototype.updateOperator = function (value) {
        console.log('a2 setting operator to : ' + value);
        this.settings.operator = value;
        this.operatorChanged.emit(value);
        // this.onModelChange(this.model);
    };
    MultiselectDropdown.prototype.updateGuard = function (event, group, option, item) {
        group.lastModified = new Date();
        switch (option.guardType) {
            case exports.GUARDTYPE.ALLOW:
                this.updateAllowGuard(event, option, item);
                break;
            case exports.GUARDTYPE.PARENT:
                this.updateParentGuard(event, option, item);
                break;
            case exports.GUARDTYPE.PREVENT:
                this.updatePreventGuard(event, option, item);
                break;
            case exports.GUARDTYPE.COLLECTIVE:
                this.updateCollectiveGuard(event, option, item);
                break;
        }
    };
    return MultiselectDropdown;
}());
// sliderChange( event ) {
//   console.log(event);
// }
MultiselectDropdown.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ss-multiselect-dropdown',
                template: '<div class="dropdown" [ngClass]="settings.containerClasses" [class.open]="isVisible"><button type="button" class="dropdown-toggle" [ngClass]="settings.buttonClasses" (click)="toggleDropdown()" [disabled]="disabled">{{ title }}<span class="caret"></span></button><accordion *ngIf="isVisible" class="dropdown-menu" class="wrapper left container"><ul [class.pull-right]="settings.pullRight" [class.dropdown-menu-right]="settings.pullRight" [style.max-height]="settings.maxHeight" class="sublist"><li class="mdropdown-item search"><div class="input-group"><span class="input-group-addon" id="sizing-addon2"><i class="fa fa-search"></i></span> <input id="searchText" type="text" class="form-control" placeholder="{{ texts.searchPlaceholder }}" aria-describedby="sizing-addon2" (ngModelChange)="search($event)" [ngModelOptions]="{ standalone: true, debounce: 3000 }" [(ngModel)]="searchFilterText" autofocus></div></li><!-- <li class="dropdown-divider divider"></li> --> <span class="boolean-check" *ngIf="settings.operators"><label class="radioLabel" *ngFor="let item of settings.operators"><input class="radioButton" type="radio" name="booleans" (click)="updateOperator(item.value)" [checked]="settings.operator === item.value"> {{item.name}}</label></span><li class="mdropdown-item check-control check-control-check" *ngIf="settings.showResetAll"><a href="javascript:;" role="menuitem" tabindex="-1" (click)="reset()"><span style="width: 16px" [ngClass]="{\'glyphicon glyphicon-ok\': settings.checkedStyle !== \'fontawesome\',\'fa fa-check\': settings.checkedStyle === \'fontawesome\'}"></span> {{ texts.resetAll }}</a></li><li class="mdropdown-item check-control check-control-check" *ngIf="settings.showCheckAll"><a href="javascript:;" role="menuitem" tabindex="-1" (click)="checkAll()"><span style="width: 16px" [ngClass]="{\'glyphicon glyphicon-ok\': settings.checkedStyle !== \'fontawesome\',\'fa fa-check\': settings.checkedStyle === \'fontawesome\'}"></span> {{ texts.checkAll }}</a></li><li class="mdropdown-item check-control check-control-uncheck" *ngIf="settings.showUncheckAll"><a href="javascript:;" role="menuitem" tabindex="-1" (click)="uncheckAll()"><span style="width: 16px" [ngClass]="{\'glyphicon glyphicon-remove\': settings.checkedStyle !== \'fontawesome\',\'fa fa-times\': settings.checkedStyle === \'fontawesome\'}"></span> {{ texts.uncheckAll }}</a></li><li *ngIf="settings.showCheckAll || settings.showUncheckAll" class="dropdown-divider divider"></li></ul><accordion-group class="navGroup" *ngFor="let group of groups" [heading]="group.heading" [isOpen]="group.open"><ul [class.pull-right]="settings.pullRight" [class.dropdown-menu-right]="settings.pullRight" [style.max-height]="settings.maxHeight" class="sublist"><li class="mdropdown-item" [ngStyle]="getItemStyle(option)" *ngFor="let option of group.options" [class.dropdown-header]=\'option.type == "label"\'><ng-template [ngIf]=\'option.type == "label"\'>{{ option.name }}</ng-template><a *ngIf=\'option.type == "checkbox"\' (click)="toggleSelected($event, group, option)" role="menuitem" tabindex="-1" [style.padding-left]="this.parents.length>0&&this.parents.indexOf(option.id)<0&&\'30px\'"><input *ngIf="settings.checkedStyle === \'checkboxes\'" type="checkbox" [checked]="option.on" (click)="preventCheckboxCheck($event, option)" [disabled]="isDisabled(option)"> <span *ngIf="settings.checkedStyle === \'glyphicon\'" style="width: 16px" class="glyphicon" [class.glyphicon-ok]="isSelected(option)"></span> <span *ngIf="settings.checkedStyle === \'fontawesome\'" style="width: 16px;display: inline-block"><i *ngIf="isSelected(option)" class="fa fa-check" aria-hidden="true"></i> </span><span [ngClass]="settings.itemClasses" [style.font-weight]="this.parents.indexOf(option.id)>=0?\'bold\':\'normal\'">{{ option.name }} </span><img *ngIf="option.image" class="dropdown-image" src="{{option.image}}"> </a><span *ngIf=\'option.type == "guardgroup"\' class="guardGroup"><a *ngFor="let item of option.group" (click)="updateGuard($event, group, option, item)" role="menuitem" tabindex="-1" [style.padding-left]="this.parents.length>0&&this.parents.indexOf(option.id)<0&&\'30px\'"><input *ngIf="settings.checkedStyle === \'checkboxes\'" type="checkbox" [checked]="item.on"  (click)="preventCheckboxCheck($event, option)" [disabled]="isDisabled(item)"> <span *ngIf="settings.checkedStyle === \'glyphicon\'" style="width: 16px" class="glyphicon" [class.glyphicon-ok]="isSelected(option)"></span> <span *ngIf="settings.checkedStyle === \'fontawesome\'" style="width: 16px;display: inline-block"><i *ngIf="isSelected(item)" class="fa fa-check" aria-hidden="true"></i> </span><span [ngClass]="settings.itemClasses" [style.font-weight]="this.parents.indexOf(option.id)>=0?\'bold\':\'normal\'">{{ item.name }} </span><img *ngIf="item.image" class="dropdown-image" src="{{item.image}}"> </a></span><span class="radioGroup" *ngIf=\'option.type == "group"\'><label class="radioLabel" *ngFor="let item of option.radioGroup" (click)="updateRadio($event, group, option, item)"><input class="radioButton" type="radio" name="{{option.name}}" (click)="updateRadio($event, group, option, item)" [checked]="item.on"> {{ item.name }}</label></span><span class="slider" *ngIf=\'option.type == "slider"\'>{{ option.name }} is a slider.</span></li></ul></accordion-group></accordion></div>',
                styles: ['a {  outline: none !important;}.boolean-check {  display: inline-block;  color: #0275d8;  border: #2196F3;  border-style: solid;  border-width: thin;  border-radius: 4px;  margin-left: 40px;}.dropdown-inline {  display: inline-block;  background-color: transparent;  width: fit-content;}.panel-group {  background-color: #f0f8ff;  border: rgb(170,170,170) 1px solid;  border-radius: 4px;  display: inherit;  width: 100%;  height: 100%;  margin-left: 0px;  margin-top: 2px;  padding: 0px;  padding-top: 4px;  padding-bottom: 6px;}.dropdown-toggle {  align-items: flex-start;  text-align: center;  justify-content: center;  /* background-color: #c1e2ed; */  border-radius: 4px;  border-color: transparent;  border-width: 1px;  /* width: 100px;  height: 40px; */  font-size: 16px;}.sublist {  display: block;  height: auto;  overflow-y: auto;  max-width: 90%;  box-sizing: border-box;  padding-left: 40px;  padding-top: 10px;}.mdropdown-item {  box-sizing: border-box;  list-style-type: none;}.radioLabel {  display: inline-block;  padding-left: 10px;  padding-right: 10px;}.radioGroup {  max-width: 200px;  white-space: nowrap;  display: inline-block;  padding-left: 14px;}.radioButton {  position: relative;  padding-left: 2px;  padding-right: 2px;  /*margin-left: 4px;  padding-left: 10px;*/  white-space: nowrap;  display: inline-block;}.check-control {  margin-left: 10px;  margin-right: 10px;}#searchText {  min-height: 34px;  margin-top: 11px;}.input-group-addon {    margin-left: 20px;    margin-top: 10px;}.dropdown-header {  font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;  font-size: 28px;  font-weight: normal;  display: inherit;  float: left;  color: #777;  background-color: #d3d3d3;  margin: 0px;  margin-top: 3px !important;  margin-bottom: 3px;  padding: 4px;  padding-left: 20px;  padding-right: 24px;  text-align: left;  width: 100%;  box-sizing: border-box;}.panel-title {  margin: 1px;}.panel-default {  width: 100%;}.twistie {  width: 24px;  height: 24px;}'],
                providers: [MULTISELECT_VALUE_ACCESSOR]
            },] },
];
/** @nocollapse */
MultiselectDropdown.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
    { type: _angular_core.IterableDiffers, },
]; };
MultiselectDropdown.propDecorators = {
    'options': [{ type: _angular_core.Input },],
    'groups': [{ type: _angular_core.Input },],
    'settings': [{ type: _angular_core.Input },],
    'texts': [{ type: _angular_core.Input },],
    'disabled': [{ type: _angular_core.Input },],
    'selectionLimitReached': [{ type: _angular_core.Output },],
    'dropdownClosed': [{ type: _angular_core.Output },],
    'dropdownOpened': [{ type: _angular_core.Output },],
    'onAdded': [{ type: _angular_core.Output },],
    'onRemoved': [{ type: _angular_core.Output },],
    'searchChanged': [{ type: _angular_core.Output },],
    'operatorChanged': [{ type: _angular_core.Output },],
    'resetAll': [{ type: _angular_core.Output },],
    'onClick': [{ type: _angular_core.HostListener, args: ['document: click', ['$event.target'],] },],
};

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
Accordion.decorators = [
    { type: _angular_core.Component, args: [{
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
AccordionGroup.decorators = [
    { type: _angular_core.Component, args: [{
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
    'heading': [{ type: _angular_core.Input },],
    'isOpen': [{ type: _angular_core.Input },],
};

var MultiselectDropdownModule = (function () {
    function MultiselectDropdownModule() {
    }
    return MultiselectDropdownModule;
}());
MultiselectDropdownModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [_angular_common.CommonModule, _angular_forms.FormsModule],
                exports: [MultiselectDropdown, MultiSelectSearchFilter, Accordion, AccordionGroup],
                declarations: [MultiselectDropdown, MultiSelectSearchFilter, Accordion, AccordionGroup],
            },] },
];
/** @nocollapse */
MultiselectDropdownModule.ctorParameters = function () { return []; };

exports.MultiSelectSearchFilter = MultiSelectSearchFilter;
exports.MultiselectDropdownModule = MultiselectDropdownModule;
exports.MultiselectDropdown = MultiselectDropdown;
exports.Accordion = Accordion;
exports.AccordionGroup = AccordionGroup;

Object.defineProperty(exports, '__esModule', { value: true });

})));
