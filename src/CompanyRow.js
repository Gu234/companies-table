import React from 'react';

export default function ({ company }) {
    return (
        <tr>
            <td>{company.id}</td>
            <td>{company.name}</td>
            <td>{company.city}</td>
            <td>{company.totalIncome.toFixed(2)}</td>
            <td>{company.averageIncome.toFixed(2)}</td>
            <td>{company.lastMonthIncome.toFixed(2)}</td>
        </tr>
    )
}