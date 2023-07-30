function getScore(scoreList) {
    let lastIndex = scoreList.length - 1 
    if (isNaN(scoreList[lastIndex])) {
        return "N/A"
    } else {
        return scoreList[lastIndex]
    }
}

function getNumStrikes(symbolsList) {
    let symbolsString = symbolsList.join("")
    let counter = 0
    for (let i=0;i<symbolsString.length;i++) {
        if (symbolsString[i] === "X") {
            counter++
        }
    }
    return counter
}
function getNumSpares(symbolsList) {
    let symbolsString = symbolsList.join("")
    let counter = 0
    for (let i=0;i<symbolsString.length;i++) {
        if (symbolsString[i] === "/") {
            counter++
        }
    }
    return counter
}

function getNumOpens(symbolsList) {
    let counter = 0
    for (let i=0;i<symbolsList.length;i++) {
        if (symbolsList[i] !== "" && !symbolsList[i].includes("X") && !symbolsList[i].includes("/")) {
            counter++
        }
    }
    return counter
}

function getAvgFirstBallPinfall(symbolsList) {
    let totalRacks = 9
    let totalPins = 0
    for (let i=0;i<symbolsList.length - 1;i++) {
        if (symbolsList[i][0] === "X") {
            totalPins = totalPins + 10
        } else {
            let firstThrow = symbolsList[i][0]
            if (firstThrow == "-") {
                totalPins = totalPins + 0
            } else {
                totalPins = totalPins + parseInt(firstThrow)
            }
        }
    }

    // Dealing with tenth frame seperately
    // Scenarios for tenth frame first ball
    // 1/X
    let tenthFrame = symbolsList[symbolsList.length - 1]
    // First ball is a strike
    if (tenthFrame[0] === "X") {
        totalRacks++
        totalPins = totalPins + 10
        if (tenthFrame[1] === "X") {
            totalRacks++
            totalPins = totalPins + 10
            totalRacks++
            if (tenthFrame[2] === "X") {
                totalPins = totalPins + 10
            } else if (tenthFrame[2] === "-") {
                totalPins = totalPins + 0
            } else {
                totalPins = totalPins + parseInt(tenthFrame[2])
            }
        } else {
            totalRacks++
            totalPins = totalPins + parseInt(tenthFrame[1])
        }
    } else {
        totalRacks++
        if (tenthFrame[0] === "-") {
            totalPins = totalPins + 0
        } else {
            totalPins = totalPins + parseInt(tenthFrame[0])
        }
        if (tenthFrame[1] === "/") {
            totalRacks++
            if (tenthFrame[2] === "X") {
                totalPins = totalPins + 10
            } else if (tenthFrame[2] === "-") {
                totalPins = totalPins + 0
            } else {
                totalPins = totalPins + parseInt(tenthFrame[2])
            }
        }
    }


    if (isNaN((totalPins / totalRacks).toFixed(1))) {
        return "N/A"
    } else {
        return (totalPins / totalRacks).toFixed(1)
    }
}

function getSpareConvertPercent(symbolsList) {
    let spareOpportunities = 0
    let conversions = 0

    for (let i=0;i<symbolsList.length - 1;i++) {
        if (symbolsList[i][0] !== "X") {
            spareOpportunities++
            if (symbolsList[i][1] === "/") {
                conversions++
            }
        }
    }

    let tenthFrame = symbolsList[symbolsList.length - 1]
    if (tenthFrame[0] === "X") {
        if (tenthFrame[1] !== "X") {
            spareOpportunities++
            if (tenthFrame[2] === "/") {
                conversions++
            }
        }
    } else {
        spareOpportunities++
        if (tenthFrame[1] === "/") {
            conversions++
        }
    }

    if (spareOpportunities === 0) {
        return null
    } else {
        return ((conversions / spareOpportunities) * 100).toFixed(0)
    }

    /*
    First ball is strike:
        Second ball is strike:
            Do nothing
        Second ball is not strike:
            add 1 to spareOpportunities
            if third ball is spare
                add 1 to conversions
    First ball is not strike:
        add 1 to spareOpportunities
        if second ball is spare
            add 1 to conversions
    */
}

function getOnePinConvertPercent(symbolsList) {
    let spareOpportunities = 0
    let conversions = 0

    for (let i=0;i<symbolsList.length - 1;i++) {
        if (symbolsList[i][0] === "9") {
            spareOpportunities++
            if (symbolsList[i][1] === "/") {
                conversions++
            }
        }
    }

    let tenthFrame = symbolsList[symbolsList.length - 1]
    if (tenthFrame[0] === "X") {
        if (tenthFrame[1] === "9") {
            spareOpportunities++
            if (tenthFrame[2] === "/") {
                conversions++
            }
        }
    } else {
        if (tenthFrame[0] === "9") {
            spareOpportunities++
            if (tenthFrame[1] === "/") {
                conversions++
            }
        }
    }

    if (spareOpportunities === 0) {
        return "N/A"
    } else {
        return ((conversions / spareOpportunities) * 100).toFixed(0)
    }

    /*
    First ball is strike:
        Second ball is strike:
            Do nothing
        Second ball is not strike:
            add 1 to spareOpportunities
            if third ball is spare
                add 1 to conversions
    First ball is not strike:
        add 1 to spareOpportunities
        if second ball is spare
            add 1 to conversions
    */
}

function getAvgScoreDifference(scores) {
    let total = 0

    for (let i=0;i<scores.length;i++) {
        if (i === 0) {
            total = total + scores[0]
        } else {
            total = total + (scores[i] - scores[i - 1])
        }
    }

    return (total / 10).toFixed(0)
}

function getWorstFrame(scores) {
    let worstFrame = 1
    let worstDifference = 30

    for (let i = 0; i < scores.length; i++) {
        if (i === 0) {
            if (scores[0] <= worstDifference) {
                worstFrame = 1
                worstDifference = scores[0]
            }
        } else {
            if ((scores[i] - scores[i - 1]) <= worstDifference) {
                worstFrame = i + 1
                worstDifference = scores[i] - scores[i - 1]
            }
        }
    }

    return worstFrame

}

function getBestFrame(scores) {
    let bestFrame = 1
    let bestDifference = 0

    for (let i = 0; i < scores.length; i++) {
        if (i === 0) {
            if (scores[0] >= bestDifference) {
                bestFrame = 1
                bestDifference = scores[0]
            }
        } else {
            if ((scores[i] - scores[i - 1]) >= bestDifference) {
                bestFrame = i + 1
                bestDifference = scores[i] - scores[i - 1]
            }
        }
    }

    return bestFrame
}

function calcAvgMetric(games, metric, numGames) {

    total = 0
    gameCount = 0

    if (games.length === 0) {
        return "N/A"
    }

    if (numGames === 'all') {
        numGames = games.length
    }

    for (let i = games.length - 1; i >= games.length - numGames; i--) {
        if (i < 0) {
            return (total / gameCount++).toFixed(1)
        }

        if (games[i][metric] !== null) {
            total = total + parseFloat(games[i][metric])
            gameCount++;
        }
    }

    return (total / gameCount).toFixed(1)
}

function findMedian(games, numGames) {
    let scoresList = []

    if (numGames === 'all') {
        numGames = games.length
    }

    for (let i = games.length - 1; i >= games.length - numGames; i--) {
        if (i >= 0) {
            scoresList.push(games[i]['score'])
        }
    }

    // Sort the list in ascending order
    const sortedList = scoresList.sort((a, b) => a - b);
  
    const length = sortedList.length;
    const middleIndex = Math.floor(length / 2);
  
    if (length % 2 === 0) {
      // Even number of elements
      const median = (sortedList[middleIndex - 1] + sortedList[middleIndex]) / 2;
      return median;
    } else {
      // Odd number of elements
      const median = sortedList[middleIndex];
      return median;
    }
  }

function findBest(games, numGames) {
    let max = -1

    if (numGames === 'all') {
        numGames = games.length
    }

    for (let i = games.length - 1; i >= games.length - numGames; i--) {
        if (i >= 0) {
            if (games[i]['score'] > max) {
                max = games[i]['score']
            }
        }
    }

    if (max === -1) {
        return "N/A"
    } else {
        return max
    }
}

function verifyTenthFrame(tenthFrame) {
    /*
    This function will be used to verify that the tenth frame is formatted correctly
    */

    for (let i = 0; i < tenthFrame.length; i++) {
        if (!['1','2','3','4','5','6','7','8','9','X','/','-'].includes(tenthFrame[i])) {
            return false
        } 
    }

    if (tenthFrame[0] === "X") {
        if (tenthFrame[1] !== "X") {
            return verifyFrame(tenthFrame.slice(1,3), false)
        } else {
            return ['1','2','3','4','5','6','7','8','9','X','-'].includes(tenthFrame[2])
        }
    
    } else {
        if (!verifyFrame(tenthFrame.slice(0,2), false)) {
            return false
        }

        if (tenthFrame[1] === "/") {
            return ['1','2','3','4','5','6','7','8','9','X','-'].includes(tenthFrame[2])
        } else {
            return tenthFrame.length === 2
        }
    }
}

const verifyFrame = (symbol, isTenth) => {
    if (!isTenth) {
      let total = 0
      if (symbol === "X") {
        return true
      } else {
        if (symbol.length !== 2) {
          return false
        }

        let rolls = ['-', '1', '2', '3', '4', '5', '6', '7', '8', '9']

        if (!rolls.includes(symbol[0])) {
          return false
        }

        if (symbol[0] !== "-") {
          total = total + parseInt(symbol[0])
        }

        if (symbol[1] === "/") {
          return true
        }

        if (symbol[1] === "-") {
          total = total + 0
        } else {
          total = total + parseInt(symbol[1])
        }

        if (total < 10) {
          return true
        } else {
          return false
        }

      }
    }

    return true
  }

module.exports = {
    getScore,
    getNumStrikes,
    getNumSpares,
    getNumOpens,
    getAvgFirstBallPinfall,
    getSpareConvertPercent,
    getOnePinConvertPercent,
    getAvgScoreDifference,
    getWorstFrame,
    getBestFrame,
    calcAvgMetric,
    findMedian,
    findBest,
    verifyTenthFrame
}

console.log(verifyTenthFrame("X"))