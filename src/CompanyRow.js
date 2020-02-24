import React from 'react';

export default function ({ company, sortKey }) {
    return (
        <tr>
            <td className={sortKey === 'id' ? 'highlighted' : ''}>{company.id}</td>
            <td className={sortKey === 'name' ? 'highlighted' : ''}>{company.name}</td>
            <td className={sortKey === 'city' ? 'highlighted' : ''}>{company.city}</td>
            <td className={(sortKey === 'totalIncome' ? 'highlighted' : '') + " numeric"}>{company.totalIncome.toFixed(2)}</td>
            <td className={(sortKey === 'averageIncome' ? 'highlighted' : '') + ' numeric'}>{company.averageIncome.toFixed(2)}</td>
            <td className={(sortKey === 'lastMonthIncome' ? 'highlighted' : '') + ' numeric'}>{company.lastMonthIncome.toFixed(2)}</td>
        </tr>
    )
}