/*
 * Angular 2 Dropdown Multiselect for Bootstrap
 *
 * Simon Lindh
 * https://github.com/softsimon/angular-2-dropdown-multiselect
 */
import { MultiSelectSearchFilter } from './search-filter.pipe';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts, IMultiSelectOptionGroup, GUARDTYPE } from './types';
import {
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  IterableDiffers,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';
import { Accordion, AccordionGroup } from './accordion/accordion.component';

const MULTISELECT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MultiselectDropdown),
  multi: true
};

@Component({
  selector: 'ss-multiselect-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css', './accordion/accordion.component.css'],
  providers: [MULTISELECT_VALUE_ACCESSOR]
})
export class MultiselectDropdown implements OnInit, OnChanges, DoCheck, ControlValueAccessor, Validator {
  @Input() options: Array<IMultiSelectOption>;
  @Input() groups: Array<IMultiSelectOptionGroup>;
  @Input() settings: IMultiSelectSettings;
  @Input() texts: IMultiSelectTexts;
  @Input() disabled: boolean = false;

  @Output() selectionLimitReached = new EventEmitter();
  @Output() dropdownClosed = new EventEmitter();
  @Output() dropdownOpened = new EventEmitter();
  @Output() onAdded = new EventEmitter();
  @Output() onRemoved = new EventEmitter();

  @Output() searchChanged = new EventEmitter();


  @HostListener('document: click', ['$event.target'])
  onClick(target: HTMLElement) {

    if (!this.isVisible) return;
    let parentFound = false;
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
  }

  model: any[];
  radioValue: any;
  parents: any[];
  title: string;
  differ: any;
  numSelected: number = 0;
  isVisible: boolean = false;
  searchFilterText: string = '';

  defaultSettings: IMultiSelectSettings = {
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
  defaultTexts: IMultiSelectTexts = {
    checkAll: 'Check all',
    uncheckAll: 'Uncheck all',
    resetAll: 'Reset all',
    checked: 'checked',
    checkedPlural: 'checked',
    searchPlaceholder: 'Search...',
    defaultTitle: 'Select',
    allSelected: 'All selected',
  };

  constructor(private element: ElementRef,
    differs: IterableDiffers) {
    this.differ = differs.find([]).create(null);
  }

  search(event) {
    console.log('search - event : '+event);
    this.searchFilterText = event;
    console.log('dropdown.component search - before : '+this.searchFilterText);
    this.searchChanged.emit(event);
    console.log('dropdown.component search - after :'+this.searchFilterText);
  }

  getItemStyle(option: IMultiSelectOption): any {
    if (option.type == "checkbox") {
      return { 'cursor': 'pointer' };
    }
  }

  ngOnInit() {
    this.settings = Object.assign(this.defaultSettings, this.settings);
    this.texts = Object.assign(this.defaultTexts, this.texts);
    this.title = this.texts.defaultTitle || '';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) {
      this.options = this.options || [];
      this.parents = this.options
        .filter(option => typeof option.parentId === 'number')
        .map(option => option.parentId);
    }

    if (changes['texts'] && !changes['texts'].isFirstChange()) {
      this.updateTitle();
    }
  }

  onModelChange: Function = (_: any) => { };
  onModelTouched: Function = () => { };

  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      this.model = value;
    } else {
      this.model = [];
    }
  }

  onRadioChange($event, item) {

  }

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  isDisabled(option:IMultiSelectOption) {
    return !option.enabled;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  ngDoCheck() {
    const changes = this.differ.diff(this.model);
    if (changes) {
      this.updateNumSelected();
      this.updateTitle();
    }
  }

  validate(_c: AbstractControl): { [key: string]: any; } {
    return (this.model && this.model.length) ? null : {
      required: {
        valid: false,
      },
    };
  }

  registerOnValidatorChange(_fn: () => void): void {
    throw new Error('Method not implemented.');
  }

  clearSearch(event: Event) {
    event.stopPropagation();
    this.searchFilterText = '';
  }

  toggleDropdown() {
    this.isVisible = !this.isVisible;
    this.isVisible ? this.dropdownOpened.emit() : this.dropdownClosed.emit();
    console.log('toggleDropdown - visible : '+this.isVisible);
  }

  isSelectedSave(option: IMultiSelectOption): boolean {
    return this.model && this.model.indexOf(option.id) > -1;
  }

  isSelected(option: IMultiSelectOption): boolean {
    return option.on;
    // return this.model && this.model.indexOf(option.id) > -1;
  }

  setSelectedSave(_event: Event, option: IMultiSelectOption) {
    _event.stopPropagation();
    if (!this.model) {
      this.model = [];
    }
    const index = this.model.indexOf(option.id);
    if (index > -1) {
      this.model.splice(index, 1);
      this.onRemoved.emit(option.id);
      const parentIndex = option.parentId && this.model.indexOf(option.parentId);
      if (parentIndex >= 0) {
        this.model.splice(parentIndex, 1);
        this.onRemoved.emit(option.parentId);
      } else if (this.parents.indexOf(option.id) > -1) {
        let childIds = this.options.filter(child => this.model.indexOf(child.id) > -1 && child.parentId == option.id).map(child => child.id);
        this.model = this.model.filter(id => childIds.indexOf(id) < 0);
        childIds.forEach(childId => this.onRemoved.emit(childId));
      }
    } else {
      if (this.settings.selectionLimit === 0 || (this.settings.selectionLimit && this.model.length < this.settings.selectionLimit)) {
        this.model.push(option.id);
        this.onAdded.emit(option.id);
        if (option.parentId) {
          let children = this.options.filter(child => child.id !== option.id && child.parentId == option.parentId);
          if (children.every(child => this.model.indexOf(child.id) > -1)) {
            this.model.push(option.parentId);
            this.onAdded.emit(option.parentId);
          }
        } else if (this.parents.indexOf(option.id) > -1) {
          let children = this.options.filter(child => this.model.indexOf(child.id) < 0 && child.parentId == option.id);
          children.forEach(child => {
            this.model.push(child.id);
            this.onAdded.emit(child.id);
          })
        }
      } else {
        if (this.settings.autoUnselect) {
          this.model.push(option.id);
          this.onAdded.emit(option.id);
          const removedOption = this.model.shift();
          this.onRemoved.emit(removedOption);
        } else {
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
  }


  setSelected(_event: Event, option: IMultiSelectOption) {
    _event.stopPropagation();
    option.on = true;
    // if (!this.model) {
    //   this.model = [];
    // }
    // const index = this.model.indexOf(option.id);
    // if (index > -1) {
    //   this.model.splice(index, 1);
    //   this.onRemoved.emit(option.id);
    //   const parentIndex = option.parentId && this.model.indexOf(option.parentId);
    //   if (parentIndex >= 0) {
    //     this.model.splice(parentIndex, 1);
    //     this.onRemoved.emit(option.parentId);
    //   } else if (this.parents.indexOf(option.id) > -1) {
    //     let childIds = this.options.filter(child => this.model.indexOf(child.id) > -1 && child.parentId == option.id).map(child => child.id);
    //     this.model = this.model.filter(id => childIds.indexOf(id) < 0);
    //     childIds.forEach(childId => this.onRemoved.emit(childId));
    //   }
    // } else {
    //   if (this.settings.selectionLimit === 0 || (this.settings.selectionLimit && this.model.length < this.settings.selectionLimit)) {
    //     this.model.push(option.id);
    //     this.onAdded.emit(option.id);
    //     if (option.parentId) {
    //       let children = this.options.filter(child => child.id !== option.id && child.parentId == option.parentId);
    //       if (children.every(child => this.model.indexOf(child.id) > -1)) {
    //         this.model.push(option.parentId);
    //         this.onAdded.emit(option.parentId);
    //       }
    //     } else if (this.parents.indexOf(option.id) > -1) {
    //       let children = this.options.filter(child => this.model.indexOf(child.id) < 0 && child.parentId == option.id);
    //       children.forEach(child => {
    //         this.model.push(child.id);
    //         this.onAdded.emit(child.id);
    //       })
    //     }
    //   } else {
    //     if (this.settings.autoUnselect) {
    //       this.model.push(option.id);
    //       this.onAdded.emit(option.id);
    //       const removedOption = this.model.shift();
    //       this.onRemoved.emit(removedOption);
    //     } else {
    //       this.selectionLimitReached.emit(this.model.length);
    //       return;
    //     }
    //   }
    // }
    // if (this.settings.closeOnSelect) {
    //   this.toggleDropdown();
    // }
    // this.model = this.model.slice();
    this.onModelChange(this.model);
    this.onModelTouched();
  }

  updateNumSelected() {
    this.numSelected = this.model && this.model.filter(id => this.parents.indexOf(id) < 0).length || 0;
  }

  updateTitle() {
    if (this.numSelected === 0 || this.settings.fixedTitle) {
      this.title = this.texts.defaultTitle || '';
    } else if (this.settings.displayAllSelectedText && this.model.length === this.options.length) {
      this.title = this.texts.allSelected || '';
    } else if (this.settings.dynamicTitleMaxItems && this.settings.dynamicTitleMaxItems >= this.numSelected) {
      this.title = this.options
        .filter((option: IMultiSelectOption) =>
          this.model && this.model.indexOf(option.id) > -1
        )
        .map((option: IMultiSelectOption) => option.name)
        .join(', ');
    } else {
      this.title = this.numSelected
        + ' '
        + (this.numSelected === 1 ? this.texts.checked : this.texts.checkedPlural);
    }
  }

  searchFilterApplied() {
    return this.settings.enableSearch && this.searchFilterText && this.searchFilterText.length > 0;
  }

  checkAll() {
    let checkedOptions = (!this.searchFilterApplied() ? this.options :
      (new MultiSelectSearchFilter()).transform(this.options, this.searchFilterText))
      .filter((option: IMultiSelectOption) => {
        if (this.model.indexOf(option.id) === -1) {
          this.onAdded.emit(option.id);
          return true;
        }
        return false;
      }).map((option: IMultiSelectOption) => option.id);
    this.model = this.model.concat(checkedOptions);
    this.onModelChange(this.model);
    this.onModelTouched();
  }

  uncheckAll() {
    let unCheckedOptions = (!this.searchFilterApplied() ? this.model
      : (new MultiSelectSearchFilter()).transform(this.options, this.searchFilterText).map((option: IMultiSelectOption) => option.id)
    );
    this.model = this.model.filter((id: number) => {
      if (unCheckedOptions.indexOf(id) < 0) {
        return true;
      } else {
        this.onRemoved.emit(id);
        return false;
      }
    });
    this.onModelChange(this.model);
    this.onModelTouched();
  }

  preventCheckboxCheck(event: Event, option: IMultiSelectOption) {
    if (this.settings.selectionLimit && !this.settings.autoUnselect &&
      this.model.length >= this.settings.selectionLimit &&
      this.model.indexOf(option.id) === -1
    ) {
      event.preventDefault();
    }
  }


  updateRadio( event, option, item ) {

    // event.stopPropagation();
    option.option = item.value;
    console.log('updateRadio : '+option.option+' , '+item.name);
    if (item.value == 0) {
        option.enabled = false;
    } else {
        option.enabled = true;
    }
    this.onModelChange(this.model);

  }

  updateAllowGuard(event, option, item:IMultiSelectOption ) {
    item.on = !item.on;
    console.log('updateGuard Allow : '+item.on);
    var group:IMultiSelectOption [] = option.group;
    if (item.guard) {
      for (var idx=0; idx < group.length; idx++) {
        var itm = group[idx];
        if (!itm.guard) {
           itm.enabled = item.on;
        }
      }
    }
    this.onModelChange(this.model);

  }

  updateParentGuard(event, option, item:IMultiSelectOption ) {

    item.on = !item.on;
    var group:IMultiSelectOption [] = option.group;
    var groupSize = group.length-1;
    if (!item.on) {
      // only children can be turned off
      for (var idx=0; idx < group.length; idx++) {
        var itm = group[idx];
        if (itm.guard) {
           itm.on = false;
           itm.enabled = true;
        }
      }
    } else {
      if (item.guard) {
        for (var idx=0; idx < group.length; idx++) {
          var itm = group[idx];
          if (!itm.guard) {
             itm.on = true;
            //  itm.enabled = false;
          }
        }
        item.enabled = false;
      } else {
        // var allon:boolean = true;
        var guard;
        var count = 0;
        for (var idx=0; idx < group.length; idx++) {
          var itm = group[idx];
          if (!itm.guard) {
            if (itm.on) {
               count ++;
            }
            //  allon = false;
            //  break;
          } else {
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
    console.log('updateGuard Parent : '+item.on);
    this.onModelChange(this.model);

  }

  allGuardItemsOn(option):boolean {
    var allon:boolean = true;
    var group:IMultiSelectOption [] = option.group;
    for (var idx=0; idx < group.length; idx++) {
      var itm = group[idx];
      if (!itm.guard) {
        if (!itm.on) {
          allon = false;
          break;
        }
      }
    }
    return allon;
  }

  allGuardItemsOff(option):boolean {
    var alloff:boolean = true;
    var group:IMultiSelectOption [] = option.group;
    for (var idx=0; idx < group.length; idx++) {
      var itm = group[idx];
      if (!itm.guard) {
        if (itm.on) {
          alloff = false;
          break;
        }
      }
    }
    return alloff;
  }

  toggleGuardOn(option) {
    setTimeout(()=>{
      console.log('clearing guard items for option');
      var group:IMultiSelectOption [] = option.group;
      var guard;
      for (var idx=0; idx < group.length; idx++) {
        var itm = group[idx];
        if (!itm.guard) {
          itm.on = false;
        } else {
          guard = itm;
        }
      }
      guard.on = true;
      // this.disableGuard(option);
      guard.enable = false;
      this.onModelChange(this.model);

    }, 0);
  }

  disableGuard(option) {
    setTimeout(()=>{
      console.log('disabling guard for option');
      var group:IMultiSelectOption [] = option.group;
      var guard;
      for (var idx=0; idx < group.length; idx++) {
        var itm:any = group[idx];
        if (itm.guard) {
          itm.enable = false;
        }
      }
    }, 0);
  }


  clearGuardItems(option) {
    setTimeout(()=>{
      console.log('clearing guard items for option');
      var group:IMultiSelectOption [] = option.group;
      for (var idx=0; idx < group.length; idx++) {
        var itm = group[idx];
        if (!itm.guard) {
          itm.on = false;
        }
      }
    }, 0);
  }
  // in this case, the guard checkbox is only an indicator of whether all are on
  // guard is never enabled
  updateCollectiveGuard(event, option, item:IMultiSelectOption ) {

    item.on = !item.on;
    console.log('updateGuard Parent : '+item.on);
    var group:IMultiSelectOption [] = option.group;
    if (!item.on) {
      // only children can be turned off
      for (var idx=0; idx < group.length; idx++) {
        var itm = group[idx];
        if (itm.guard) {
           itm.on = false;
           itm.enabled = false;
        }
      }
    } else {
      if (!item.guard) {
        var allon:boolean = true;
        var guard;
        for (var idx=0; idx < group.length; idx++) {
          var itm = group[idx];
          if (!itm.guard && !itm.on) {
             allon = false;
             break;
          } else {
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

  }


  updatePreventGuard(event, option, item:IMultiSelectOption ) {

    item.on = !item.on;
    console.log('updateGuard Prevent : '+item.on);
    var group:IMultiSelectOption [] = option.group;
    var groupSize = group.length-1;
    if (item.on) {
      if (item.guard) {
        item.enabled = false;
        for (var idx=0; idx < option.group.length; idx++) {
          var itm = group[idx];
          if (!itm.guard) {
            //  itm.enabled = false;
             itm.on = false;
          }
        }
      } else {
        if (this.allGuardItemsOn(option)) {
          this.toggleGuardOn(option);
        } else {
          for (var idx=0; idx < option.group.length; idx++) {
            var itm = group[idx];
            if (itm.guard) {
               itm.on = false;
               itm.enabled = true;
            }
          }
        }
      }
    } else {
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

  }

  updateGuard( event, option, item:IMultiSelectOption ) {

    switch(option.guardType) {
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
  }

}
