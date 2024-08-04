import React, { useState, useEffect } from 'react';

const fetchData = async (page) => {
    const url = `https://suppi.pl/api/contributors/audytobywatelski/?page=${page}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch data from page ${page}`);
    }
    return response.json();
}

const App = () => {
    const [totalAmount, setTotalAmount] = useState(0);
    const [error, setError] = useState(null);
    const [biggestContribution, setBiggestContribution] = useState(0);
    const [resultsCount, setResultsCount] = useState(0);  

    useEffect(() => {
        const collectAllResults = async () => {
            let page = 1;
            let allResults = [];
            let hasNextPage = true;
            let accumulatedAmount = 0;
            let maxContribution = 0; 

            try {
                while (hasNextPage) {
                    const data = await fetchData(page);
                    allResults = allResults.concat(data.results);
                    
                   
                    const pageAmount = data.results.reduce((sum, contribution) => {
                        if (contribution.amount > maxContribution) {
                            maxContribution = contribution.amount;
                        }
                        return sum + contribution.amount;
                    }, 0);
                    
                    accumulatedAmount += pageAmount;
                    setTotalAmount(accumulatedAmount);  
                    setBiggestContribution(maxContribution);  

                    setResultsCount(allResults.length);  

                    if (data.next) {
                        page++;
                    } else {
                        hasNextPage = false;
                    }
                }
            } catch (error) {
                setError(error.message);
            }
        }

        collectAllResults();
    }, []);

    return (
        <div>
            <h1>Total Contributions: {resultsCount}</h1> 
            <h2>Total Amount: {totalAmount.toFixed(2)}zł</h2>
            <h3>Biggest Contribution: {biggestContribution.toFixed(2)}zł</h3>
            {error && <div>Error: {error}</div>}
        </div>
    );
}

export default App;
