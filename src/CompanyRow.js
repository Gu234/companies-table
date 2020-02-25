import React from 'react';

const numericColumns = ['totalIncome', 'averageIncome', 'lastMonthIncome']

const classesForColumn = (colName, visibleColumns, sortKey) => {

    const classes = []

    if (colName === sortKey) classes.push('highlighted')
    if (!visibleColumns[colName]) classes.push('no-display')
    if (numericColumns.indexOf(colName) > -1) classes.push('numeric')
    return classes.join(' ')
}

export default function ({ visibleColumns, company, sortKey }) {


    return (
        <tr>
            <td className={classesForColumn('id', visibleColumns, sortKey)}>{company.id}</td>
            <td className={classesForColumn('name', visibleColumns, sortKey)}>{company.name}</td>
            <td className={classesForColumn('city', visibleColumns, sortKey)}>{company.city}</td>
            <td className={classesForColumn('totalIncome', visibleColumns, sortKey)}>{company.totalIncome.toFixed(2)}</td>
            <td className={classesForColumn('averageIncome', visibleColumns, sortKey)}>{company.averageIncome.toFixed(2)}</td>
            <td className={classesForColumn('lastMonthIncome', visibleColumns, sortKey)}>{company.lastMonthIncome.toFixed(2)}</td>
        </tr>
    )
}