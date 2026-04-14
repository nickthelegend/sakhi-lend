async function checkLoans() {
  const res = await fetch('http://localhost:3003/api/loans')
  const data = await res.json()
  console.log('--- Current Loans in DB ---')
  data.forEach((l: any) => {
    console.log(`Loan ID: ${l.loanId} | Borrower: ${l.borrowerName} | Business: ${l.businessName} | Status: ${l.status} | Amount: ${l.loanAmount} USDC`)
  })
}

checkLoans()
