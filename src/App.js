import React, { Component } from 'react';
import CompanyRow from './CompanyRow'
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
    companies: []
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

  render() {
    return (
      <>
        <table>
          <thead>
            <th>Id</th>
            <th>Name</th>
            <th>City</th>
            <th>Total Income</th>
            <th>Average Income</th>
            <th>Last month income</th>
          </thead>
          <tbody>
            {this.state.companies.map(company =>
              <CompanyRow company={company} key={company.id} />
            )}
          </tbody>
        </table>
      </>
    );
  }
}

export default App;
