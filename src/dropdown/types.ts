export enum Relation {
   INDEPENDENT = 1,
   CONTROLLER,
   INVERSE,
   EXCLUSIVE
}

export enum GUARDTYPE {
   ALLOW = 1,
   PREVENT,
   PARENT,
   COLLECTIVE
}

export interface IMultiSelectOptionGroup {

  id?: any;
  name?: any;
  type?: any;
  options?: any [];
  heading?: string;
  open?: boolean;
  content?: any [];
  changeCount?: number;
  lastModified?: Date;

}

export interface ISelectionModel {
  id?: any;
  on?: boolean;
  enabled?: boolean;
  selected?: boolean;
}

export interface IMultiSelectOption {
  id?: any;
  name?: any;
  type?: any;
  parentId?: any;
  params?: any;
  description?: any;
  value?: any;
  featureType?:string;
  image?:any;
  on?: boolean;
  enabled?: boolean;
  selected?: boolean;
  selector?:string;
  group?: IMultiSelectOption [];
  // guardGroup?: IMultiSelectOption [];
  guardType?: GUARDTYPE;
  guard?: boolean;
  dropDownGroup?: any;
  multiplier?:number;
  valueType?:any;
  option?: any;
}

export interface IMultiSelectSettings {
  pullRight?: boolean;
  enableSearch?: boolean;
  checkedStyle?: 'checkboxes' | 'glyphicon' | 'fontawesome';
  buttonClasses?: string;
  itemClasses?: string;
  containerClasses?: string;
  selectionLimit?: number;
  closeOnSelect?: boolean;
  autoUnselect?: boolean;
  showCheckAll?: boolean;
  showUncheckAll?: boolean;
  showResetAll?:boolean;
  fixedTitle?: boolean;
  dynamicTitleMaxItems?: number;
  maxHeight?: string;
  searchText?: string;
  displayAllSelectedText?: boolean;
  dropdownSettings?: IMultiSelectSettings;
  operators?:any[];
  operator?: string;
  exButtonId?: string;

}

export interface IMultiSelectTexts {
  checkAll?: string;
  uncheckAll?: string;
  resetAll?: string;
  checked?: string;
  checkedPlural?: string;
  searchPlaceholder?: string;
  defaultTitle?: string;
  allSelected?: string;
}
