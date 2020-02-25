import React from 'react';

const ARROWS = { '1': '▲', '-1': '▼' }

export default function ({ onClick, columnKey, children, sortKey, sortOrder, visible }) {
    const isSelected = sortKey === columnKey
    const arrow = isSelected ? ARROWS[sortOrder] : '▼'
    const shouldDisplay = visible ? '' : ' no-display'
    return (
        <th className={columnKey + shouldDisplay} onClick={() => onClick(columnKey)}>
            <div className='column-header'>
                <div>
                    {children}
                </div>
                <div className={isSelected ? '' : 'hidden'}>
                    {arrow}
                </div>
            </div>
        </th>
    )
}