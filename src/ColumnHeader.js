import React from 'react';

const ARROWS = { '1': '▲', '-1': '▼' }

export default function ({ onClick, columnKey, children, sortKey, sortOrder }) {
    const isSelected = sortKey === columnKey
    const arrow = isSelected ? ARROWS[sortOrder] : ''

    return (
        <th onClick={() => onClick(columnKey)}>
            <div className='column-header'>
                <div>
                    {children}
                </div>
                <div>
                    {arrow}
                </div>
            </div>
        </th>
    )
}