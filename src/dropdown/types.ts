export interface IMultiSelectOption {
  id?: any;
  name?: any;
  type?: any;
  parentId?: any;
  params?: any;
  description?: any;
  value?: any;
  image?:any;
  enabled?: boolean;
  radioGroup?: any;
  dropDownGroup?: any;
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
  fixedTitle?: boolean;
  dynamicTitleMaxItems?: number;
  maxHeight?: string;
  displayAllSelectedText?: boolean;
  dropdownSettings?: IMultiSelectSettings;
}

export interface IMultiSelectTexts {
  checkAll?: string;
  uncheckAll?: string;
  checked?: string;
  checkedPlural?: string;
  searchPlaceholder?: string;
  defaultTitle?: string;
  allSelected?: string;
}
