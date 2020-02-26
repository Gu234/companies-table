import React, { Component } from 'react';
import CompanyRow from './CompanyRow'
import ColumnHeader from './ColumnHeader'
import Pagination from './Pagination'
import fetchCompaniesWithIncomes from './helpersjs/fetchCompaniesData'
import './App.scss';


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

      const companies = await fetchCompaniesWithIncomes()

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

    if (!this.state.dataFetched) {
      return <img className='loadingGif' src={require('./assets/loading.gif')} alt="animated" />
    }
    return (
      <>
        <div className="container">
          <div className="inputs">
            <div className="inputs-searchBox">
              <input placeholder='Search...' name='searchTerm' value={this.state.searchTerm} onChange={this.handleSearchTerm} type="text" />
            </div>
            <div className="inputs-rowsPerPage">
              <label htmlFor="rowsPerPage">Results per page</label>

              <select defaultValue={20} onChange={this.changeRowsPerPage} id="rowsPerPage">
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <table className='table'>
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
                  sortOrder={sortOrder}>Last month Income</ColumnHeader>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredCompanies
                .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
                .map(company =>
                  <CompanyRow
                    sortKey={sortKey}
                    company={company}
                    key={company.id} />
                )}
            </tbody>
          </table>
          <Pagination
            goToPage={this.goToPage}
            currentPage={currentPage}
            numberOfPages={numberOfPages} />

        </div>
      </>
    );
  }
}

export default App;
