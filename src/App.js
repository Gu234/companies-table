import React, { Component } from 'react';
import CompanyRow from './CompanyRow'
import './App.css';

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
      const incomes = await Promise.all(incomesJsonsPromises)

      companies.forEach((company, index) => company.incomes = incomes[index].incomes)
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
            <th>Avarage Income</th>
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
