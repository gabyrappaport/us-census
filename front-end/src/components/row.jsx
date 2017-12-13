import React from 'react';

export const Row = props => (
    <tr>
      <td>{props.data.value}</td>
      <td>{props.data.count}</td>
      <td>{props.data.averageAge}</td>
    </tr>
);
