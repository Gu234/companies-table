import React, { Component } from 'react';
import './App.css';

// fetch('https://recruitment.hal.skygate.io/companies')
//   .then((response) => {
//     return response.json();
//   })
//   .then((myJson) => {
//     console.log(myJson);
//   });

// fetch('https://recruitment.hal.skygate.io/incomes/1')
//   .then((response) => {
//     return response.json();
//   })
//   .then((myJson) => {
//     console.log(myJson);
//   });
class App extends Component {

  state = {
    dataFetched: false,
    companies: [],
    incomes: []
  }

  async componentDidMount() {
    if (!this.state.dataFetched) {
      console.log('before companies fetch')

      const response = await fetch('https://recruitment.hal.skygate.io/companies')
      console.log('before response.json()')

      const companies = await response.json()

      console.log('before fetching incomes');
      const incomesPromises = companies.map(company => fetch(`https://recruitment.hal.skygate.io/incomes/${company.id}`))
      const incomesResponses = await Promise.all(incomesPromises)
      const incomesJsonsPromises = incomesResponses.map(response => response.json())
      const incomesForCompanies = await Promise.all(incomesJsonsPromises)
      console.log('after fetching incomes', incomesForCompanies);


      this.setState({ companies, incomesForCompanies, dataFetched: true })
      console.log('after set state');
    }
  }

  companiesWithIncomes() {
    return this.state.companies
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
            {this.companiesWithIncomes().map(company =>
              <tr key={company.id}>
                <td>{company.id}</td>
                <td>{company.name}</td>
                <td>{company.city}</td>
                <td>{company.totalIncome}</td>
                <td>{company.avarageIncome}</td>
                <td>{company.lastMontIncome}</td>
              </tr>
            )}
          </tbody>
        </table>
      </>
    );
  }
}

export default App;
