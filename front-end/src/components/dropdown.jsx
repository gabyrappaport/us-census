import React from 'react';
import 'react-widgets/dist/css/react-widgets.css';
import { DropdownList } from 'react-widgets';


export const Dropdown = props => (
  <DropdownList
    filter="contains"
    name="value"
    component={DropdownList}
    busy={props.loadingState}
    data={props.list}
    onChange={props.handleChange}
    placeholder="Variable"
  />
);
