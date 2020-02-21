import React from 'react';

const ARROWS = { ascending: '▲', descending: '▼' }

export default function ({ onClick, columnKey, children, sortKey, sortOrder }) {
    const isSelected = sortKey === columnKey
    const arrow = isSelected ? ARROWS[sortOrder] : ''

    return (
        <th><span style={{ textDecoration: isSelected ? 'underline' : 'none' }}>{children}</span>  {arrow}</th>
    )
}