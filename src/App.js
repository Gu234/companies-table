import React, { Component } from 'react';
import CompanyRow from './CompanyRow'
import ColumnHeader from './ColumnHeader'
import './App.css';

function calculateTotalIncome(incomes) {
  return incomes.reduce(((sum, income) => sum + Number(income.value)), 0)
}

function selectLastMonthIncomes(incomes) {
  return incomes.filter(income => isDateFromLastMonth(new Date(income.date)))
}

function isDateFromLastMonth(date) {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const dateMonth = date.getMonth()
  const dateYear = date.getFullYear()
  const sameYear = currentYear === dateYear
  const previousYear = dateYear === currentYear - 1

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
    searchBox: '',
    companies: [],
    rowsPerPage: 20,
    currentPage: 0,
    sortKey: 'id',
    sortOrder: 'ascending'
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

    const newSortOrder = {
      'ascending': 1,
      'descending': -1
    }

    if (sortKey === 'city' || sortKey === 'name') {
      return (companyA, companyB) => {
        if (companyA[sortKey] < companyB[sortKey]
        )
          return -1 * newSortOrder[sortOrder]
        else
          return 1 * newSortOrder[sortOrder]
      }
    }

    else
      return (companyA, companyB) => (companyA[sortKey] - companyB[sortKey]) * newSortOrder[sortOrder]
  }

  sortedCompanies() {
    const companies = [...this.state.companies]
    return companies.sort(this.getSortingFunction())
  }

  changeSorting = (columnKey) => {
    this.setState({ currentPage: 0 })
    // const newSortOrder = {
    //   'ascending':'descending',
    //   'descending':'ascending',
    // }

    if (this.state.sortKey === columnKey)
      this.setState({ sortOrder: this.state.sortOrder === 'ascending' ? 'descending' : 'ascending' })
    else
      this.setState({ sortKey: columnKey })
  }

  changePage = (e) => {
    this.setState({ currentPage: Number(e.target.dataset.indexNumber) })
  }

  isCompanyForCurrentPage = (_, index) => {

    const { currentPage, rowsPerPage } = this.state
    if (index >= currentPage * rowsPerPage && index < currentPage * rowsPerPage + rowsPerPage)
      return true
    else
      return false
  }

  goToNextPage = () => {
    const { currentPage } = this.state
    const lastPage = Math.ceil(this.state.companies.length / this.state.rowsPerPage) - 1

    if (currentPage === lastPage) return
    this.setState({ currentPage: currentPage + 1 })
  }

  goToPreviousPage = () => {
    const { currentPage } = this.state
    if (currentPage === 0) return
    this.setState({ currentPage: currentPage - 1 })
  }

  handleSearchBox = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      currentPage: 0
    })
  }

  isCompanyContainingInput = (company) => {
    const { searchBox } = this.state
    const trimmedSearchBox = searchBox.trim()
    const regex = new RegExp(trimmedSearchBox, "i");
    if (!trimmedSearchBox) return true

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
    this.setState({ rowsPerPage: e.target.value })
  }

  goToPage(number) {
    this.setState({ currentPage: number })
  }


  buildPaginationArray = (numberOfPaginationButtons) => {
    const { currentPage } = this.state
    const buttonsArr = []
    const firstPage = <div onClick={() => this.goToPage(0)}>{'|<'}</div>
    const lastPage = <div onClick={() => this.goToPage(numberOfPaginationButtons)}>>|</div>
    const previousPage = <div onClick={this.goToPreviousPage}>&laquo;</div>
    const nextPage = <div onClick={this.goToNextPage}>&raquo;</div>
    const ellipsis = <div>...</div>

    if (numberOfPaginationButtons < 2) return buttonsArr

    buttonsArr.push(firstPage, previousPage)

    for (let i = 0; i < numberOfPaginationButtons; i++) {
      const button = <div className={`pagination-button ${currentPage === i ? 'selected' : ''}`}
        onClick={this.changePage}
        data-index-number={i}
        key={i}>{i + 1}</div>

      if (numberOfPaginationButtons < 8) {
        buttonsArr.push(button)
      }
      else if (i === 0 || i === numberOfPaginationButtons - 1) {
        buttonsArr.push(button)
      }
      else if (currentPage < 4) {
        if (i < 5) buttonsArr.push(button)
        else if (i === 5) buttonsArr.push(ellipsis)
      }
      else if (currentPage > numberOfPaginationButtons - 4) {
        if (i > numberOfPaginationButtons - 6) buttonsArr.push(button)
        else if (i === numberOfPaginationButtons - 6) buttonsArr.push(ellipsis)
      }
      else if (i > currentPage - 2 && i < currentPage + 2) {
        buttonsArr.push(button)
      }
      else if (i === currentPage - 2 || i === currentPage + 2)
        buttonsArr.push(ellipsis)


    }

    buttonsArr.push(nextPage, lastPage)
    return buttonsArr
  }

  render() {
    const { sortKey, sortOrder } = this.state

    const sortedAndFilteredCompanies = this.sortedCompanies()
      .filter(this.isCompanyContainingInput)

    const numberOfPaginationButtons = Math.ceil(sortedAndFilteredCompanies.length / this.state.rowsPerPage)
    const paginationsButtons = new Array(numberOfPaginationButtons).fill(true)
    console.log(sortedAndFilteredCompanies.length);


    return (
      <>
        <label for="rowsPerPage">Results per page:</label>

        <select onChange={this.changeRowsPerPage} id="rowsPerPage">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <input placeholder='&#x1F50E;' name='searchBox' value={this.state.searchBox} onChange={this.handleSearchBox} type="text" />
        <table>
          {/* <thead> */}
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
          {/* </thead> */}
          <tbody>
            {sortedAndFilteredCompanies
              .filter(this.isCompanyForCurrentPage)
              .map(company =>
                <CompanyRow company={company} key={company.id} />
              )}
          </tbody>
        </table>
        <div className="pagination">
          {this.buildPaginationArray(numberOfPaginationButtons)}
        </div>
      </>
    );
  }
}

export default App;
