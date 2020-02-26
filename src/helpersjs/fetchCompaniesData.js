



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

async function fetchCompaniesWithIncomes() {


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

    return companies
}

export default fetchCompaniesWithIncomes