import React, { Component } from 'react';
import CompanyRow from './CompanyRow'
import ColumnHeader from './ColumnHeader'
import Pagination from './Pagination'

import './App.css';

function calculateTotalIncome(incomes) {
  return incomes.reduce(((sum, income) => sum + Number(income.value)), 0)
}

function selectLastMonthIncomes(incomes) {
  return incomes.filter(income => isDateFromLastMonth(new Date(income.date)))
}

function isDateFromLastMonth(date) {
  const
    today = new Date(),
    currentMonth = today.getMonth(),
    currentYear = today.getFullYear(),
    dateMonth = date.getMonth(),
    dateYear = date.getFullYear(),
    sameYear = currentYear === dateYear,
    previousYear = dateYear === currentYear - 1

  if (sameYear) {
    return dateMonth === currentMonth - 1
  }
  if (previousYear) {
    return currentMonth === 0 && dateMonth === 11
  }
  return false
}

class App extends Component {
  state = {
    dataFetched: false,
    searchTerm: '',
    companies: [],
    rowsPerPage: 20,
    currentPage: 0,
    sortKey: 'id',
    // sort order 1 = ascending , -1 = descending
    sortOrder: 1
  }

  async componentDidMount() {
    if (!this.state.dataFetched) {
      const response = await fetch('https://recruitment.hal.skygate.io/companies')

      const companies = await response.json()

      const incomesPromises = companies.map(company => fetch(`https://recruitment.hal.skygate.io/incomes/${company.id}`))
      const incomesResponses = await Promise.all(incomesPromises)
      const incomesJsonsPromises = incomesResponses.map(response => response.json())
      const allIncomes = await Promise.all(incomesJsonsPromises)

      companies.forEach((company, index) => {
        const companyIncomes = allIncomes[index].incomes

        company.totalIncome = calculateTotalIncome(companyIncomes)

        company.averageIncome = company.totalIncome / companyIncomes.length

        const lastMonthIncomes = selectLastMonthIncomes(companyIncomes)
        company.lastMonthIncome = calculateTotalIncome(lastMonthIncomes)
      })
      console.log('companies = ', companies)
      this.setState({ companies, dataFetched: true })
    }
  }

  getSortingFunction() {
    const { sortKey, sortOrder } = this.state

    if (sortKey === 'city' || sortKey === 'name') {
      return (companyA, companyB) => {
        if (companyA[sortKey] < companyB[sortKey]
        )
          return -sortOrder
        else
          return sortOrder
      }
    }

    else
      return (companyA, companyB) => (companyA[sortKey] - companyB[sortKey]) * sortOrder
  }

  sortedCompanies() {
    const companies = [...this.state.companies]
    return companies.sort(this.getSortingFunction())
  }

  changeSorting = (columnKey) => {
    this.setState({ currentPage: 0 })

    if (this.state.sortKey === columnKey)
      this.setState({ sortOrder: -this.state.sortOrder })
    else
      this.setState({ sortKey: columnKey, sortOrder: 1 })
  }

  handleSearchTerm = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      currentPage: 0
    })
  }

  isCompanyMatchingSearchTerm = (company) => {
    const { searchTerm } = this.state
    const trimmedSearchTerm = searchTerm.trim()
    const regex = new RegExp(trimmedSearchTerm, "i");
    if (!trimmedSearchTerm) return true

    for (let key in company) {
      let testKeyValue = company[key]
      if (typeof company[key] === 'number')
        testKeyValue = company[key].toFixed(2)

      if (regex.test(testKeyValue))
        return true
    }
    return false
  }

  changeRowsPerPage = (e) => {
    this.setState({ rowsPerPage: Number(e.target.value), currentPage: 0 })
  }

  goToPage = (index, numberOfPages) => {
    if (index < 0 || index > numberOfPages - 1) return
    this.setState({ currentPage: index })
  }

  render() {
    const { sortKey, sortOrder, currentPage, rowsPerPage } = this.state

    const sortedAndFilteredCompanies = this.sortedCompanies()
      .filter(this.isCompanyMatchingSearchTerm)

    const numberOfPages = Math.ceil(sortedAndFilteredCompanies.length / this.state.rowsPerPage)

    return (
      <>
        <label htmlFor="rowsPerPage">Results per page:</label>

        <select defaultValue={20} onChange={this.changeRowsPerPage} id="rowsPerPage">
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <input placeholder='&#x1F50E;' name='searchTerm' value={this.state.searchTerm} onChange={this.handleSearchTerm} type="text" />
        <table>
          <thead>
            <tr>

              <ColumnHeader
                columnKey='id'
                onClick={this.changeSorting}
                sortKey={sortKey}
                sortOrder={sortOrder}>Id</ColumnHeader>
              <ColumnHeader
                columnKey='name'
                onClick={this.changeSorting}
                sortKey={sortKey}
                sortOrder={sortOrder}>Name</ColumnHeader>
              <ColumnHeader
                columnKey='city'
                onClick={this.changeSorting}
                sortKey={sortKey}
                sortOrder={sortOrder}>City</ColumnHeader>
              <ColumnHeader
                columnKey='totalIncome'
                onClick={this.changeSorting}
                sortKey={sortKey}
                sortOrder={sortOrder}>Total Income</ColumnHeader>
              <ColumnHeader
                columnKey='averageIncome'
                onClick={this.changeSorting}
                sortKey={sortKey}
                sortOrder={sortOrder}>Average Income</ColumnHeader>
              <ColumnHeader
                columnKey='lastMonthIncome'
                onClick={this.changeSorting}
                sortKey={sortKey}
                sortOrder={sortOrder}>Last month income</ColumnHeader>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredCompanies
              .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
              .map(company =>
                <CompanyRow company={company} key={company.id} />
              )}
          </tbody>
        </table>
        <Pagination
          goToPage={this.goToPage}
          currentPage={currentPage}
          numberOfPages={numberOfPages} />

      </>
    );
  }
}

export default App;
