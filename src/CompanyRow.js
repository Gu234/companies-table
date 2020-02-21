import React from 'react';

export default function ({ company }) {
    return (
        <tr>
            <td>{company.id}</td>
            <td>{company.name}</td>
            <td>{company.city}</td>
            <td>{company.totalIncome}</td>
            <td>{company.avarageIncome}</td>
            <td>{company.lastMontIncome}</td>
        </tr>
    )
}