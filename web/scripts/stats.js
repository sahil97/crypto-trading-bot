const COINS_API_URI = "https://api.nomics.com/v1/currencies/ticker?" + 
"key=e0289675c60ef64cc786b120a2eff2c01e0ae8f2" + 
"&ids=BTC,ETH,XRP" + 
"&interval=1h,1d,30d" + 
"&convert=EUR&per-page=100&page=1";

$(document).ready(() => {
    $.ajax({
        type: "GET",
        url: COINS_API_URI,
        success: function(data){
            displayData(data);
            diplayGraphs();
        }
    })
});

const displayData = (data) => {

    let table = $('#mainTable');

    data.forEach(curr => {
        console.log(curr);

        let currName = curr.name;
        let currSymbol = curr.symbol;
        let currPrice = curr.price;
        let currLogo = curr.logo_url;
        let currVolume = curr.circulating_supply;
        let curr1hChangePct = curr['1h'].price_change_pct;
        let curr24hChangePct = curr['1d'].price_change_pct;
        let curr30dChangePct = curr['30d'].price_change_pct; 

        const currRow = "<tr><td><img src='" + currLogo + "' width='40'/></td>" +
        "<th scope='row'>" + currName + "&nbsp<span class='symbol'>" + currSymbol + "</th>" + 
        "<td>" + currPrice + "</td>" + 
        "<td>" + curr1hChangePct + "</td>" + 
        "<td>" + curr24hChangePct + "</td>" + 
        "<td>" + curr30dChangePct + "</td>" + 
        "<td>" + currVolume + "</td>" +
        "</tr>";

        table.append(currRow);
    });
}

const diplayGraphs = () => {
    ///  Calling API and modeling data for each chart ///
    const btcData = async () => {
        const response = await fetch('https://min-api.cryptocompare.com/data/v2/histominute?fsym=BTC&tsym=USD&limit=119&api_key=0646cc7b8a4d4b54926c74e0b20253b57fd4ee406df79b3d57d5439874960146');
        const json = await response.json();
        const data = json.Data.Data
        const times = data.map(obj => obj.time)
        const prices = data.map(obj => obj.high)
        return {
        times,
        prices
        }
    }
  
  
  
  const ethereumData = async () => {
    const response = await fetch('https://min-api.cryptocompare.com/data/v2/histominute?fsym=ETH&tsym=USD&limit=119&api_key=0646cc7b8a4d4b54926c74e0b20253b57fd4ee406df79b3d57d5439874960146');
    const json = await response.json();
    const data = json.Data.Data
    const times = data.map(obj => obj.time)
    const prices = data.map(obj => obj.high)
    return {
      times,
      prices
    }
  }

  const xrpData = async () => {
    const response = await fetch('https://min-api.cryptocompare.com/data/v2/histominute?fsym=XRP&tsym=USD&limit=119&api_key=0646cc7b8a4d4b54926c74e0b20253b57fd4ee406df79b3d57d5439874960146');
    const json = await response.json();
    const data = json.Data.Data
    const times = data.map(obj => obj.time)
    const prices = data.map(obj => obj.high)
    return {
    times,
    prices
    }
}
  
  
  /// Error handling ///
  function checkStatus(response) {
    if (response.ok) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }
  
  
  
  /// Charts ///
  let createBtcChart;
  let createXrpChart;
  let createEthereumChart;
  
  async function printBtcChart() {
    let { times, prices } = await btcData()
  
    let btcChart = document.getElementById('btcChart').getContext('2d');
  
    let gradient = btcChart.createLinearGradient(0, 0, 0, 400);
  
    gradient.addColorStop(0, 'rgba(247,147,26,.5)');
    gradient.addColorStop(.425, 'rgba(255,193,119,0)');
  
    Chart.defaults.global.defaultFontFamily = 'Red Hat Text';
    Chart.defaults.global.defaultFontSize = 12;
  
    createBtcChart = new Chart(btcChart, {
      type: 'line',
      data: {
        labels: times,
        datasets: [{
          label: '$',
          data: prices,
          backgroundColor: gradient,
          borderColor: 'rgba(247,147,26,1)',
          borderJoinStyle: 'round',
          borderCapStyle: 'round',
          borderWidth: 3,
          pointRadius: 0,
          pointHitRadius: 10,
          lineTension: .2,
        }]
      },
  
      options: {
        title: {
          display: false,
          text: 'Heckin Chart!',
          fontSize: 35
        },
  
        legend: {
          display: false
        },
  
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        },
  
        scales: {
          xAxes: [{
            display: false,
            gridLines: {}
          }],
          yAxes: [{
            display: false,
            gridLines: {}
          }]
        },
  
        tooltips: {
          callbacks: {
            //This removes the tooltip title
            title: function() {}
         },
          //this removes legend color
          displayColors: false,
          yPadding: 10,
          xPadding: 10,
          position: 'nearest',
          caretSize: 10,
          backgroundColor: 'rgba(255,255,255,.9)',
          bodyFontSize: 15,
          bodyFontColor: '#303030' 
        }
      }
    });
  }
  
  async function printEthereumChart() {
    let { times, prices } = await ethereumData()
  
    let ethereumChart = document.getElementById('ethereumChart').getContext('2d');
  
    let gradient = ethereumChart.createLinearGradient(0, 0, 0, 400);
  
    gradient.addColorStop(0, 'rgba(78,56,216,.5)');
    gradient.addColorStop(.425, 'rgba(118,106,192,0)');
  
    Chart.defaults.global.defaultFontFamily = 'Red Hat Text';
    Chart.defaults.global.defaultFontSize = 12;
  
    createEthereumChart = new Chart(ethereumChart, {
      type: 'line',
      data: {
        labels: times,
        datasets: [{
          label: '$',
          data: prices,
          backgroundColor: gradient,
          borderColor: 'rgba(118,106,192,1)',
          borderJoinStyle: 'round',
          borderCapStyle: 'round',
          borderWidth: 3,
          pointRadius: 0,
          pointHitRadius: 10,
          lineTension: .2,
        }]
      },
  
      options: {
        title: {
          display: false,
          text: 'Heckin Chart!',
          fontSize: 35
        },
  
        legend: {
          display: false
        },
  
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        },
  
        scales: {
          xAxes: [{
            display: false,
            gridLines: {}
          }],
          yAxes: [{
            display: false,
            gridLines: {}
          }]
        },
  
        tooltips: {
          callbacks: {
            //This removes the tooltip title
            title: function() {}
         },
          //this removes legend color
          displayColors: false,
          yPadding: 10,
          xPadding: 10,
          position: 'nearest',
          caretSize: 10,
          backgroundColor: 'rgba(255,255,255,.9)',
          bodyFontSize: 15,
          bodyFontColor: '#303030' 
        }
      }
    });
  }
  
  // async function printXrpChart() {
  //   let { times, prices } = await ethereumData()
  
  //   let xrpChart = document.getElementById('xrpChart').getContext('2d');
  
  //   let gradient = xrpChart.createLinearGradient(0, 0, 0, 400);
  
  //   gradient.addColorStop(0, 'rgba(78,56,216,.5)');
  //   gradient.addColorStop(.425, 'rgba(118,106,192,0)');
  
  //   Chart.defaults.global.defaultFontFamily = 'Red Hat Text';
  //   Chart.defaults.global.defaultFontSize = 12;
  
  //   createXrpChart = new Chart(xrpChart, {
  //     type: 'line',
  //     data: {
  //       labels: times,
  //       datasets: [{
  //         label: '$',
  //         data: prices,
  //         backgroundColor: gradient,
  //         borderColor: 'rgba(118,106,192,1)',
  //         borderJoinStyle: 'round',
  //         borderCapStyle: 'round',
  //         borderWidth: 3,
  //         pointRadius: 0,
  //         pointHitRadius: 10,
  //         lineTension: .2,
  //       }]
  //     },
  
  //     options: {
  //       title: {
  //         display: false,
  //         text: 'Heckin Chart!',
  //         fontSize: 35
  //       },
  
  //       legend: {
  //         display: false
  //       },
  
  //       layout: {
  //         padding: {
  //           left: 0,
  //           right: 0,
  //           top: 0,
  //           bottom: 0
  //         }
  //       },
  
  //       scales: {
  //         xAxes: [{
  //           display: false,
  //           gridLines: {}
  //         }],
  //         yAxes: [{
  //           display: false,
  //           gridLines: {}
  //         }]
  //       },
  
  //       tooltips: {
  //         callbacks: {
  //           //This removes the tooltip title
  //           title: function() {}
  //        },
  //         //this removes legend color
  //         displayColors: false,
  //         yPadding: 10,
  //         xPadding: 10,
  //         position: 'nearest',
  //         caretSize: 10,
  //         backgroundColor: 'rgba(255,255,255,.9)',
  //         bodyFontSize: 15,
  //         bodyFontColor: '#303030' 
  //       }
  //     }
  //   });
  // }

  async function printXrpChart() {
    let { times, prices } = await xrpData()
  
    let xrpChart = document.getElementById('xrpChart').getContext('2d');
    
    let gradient = xrpChart.createLinearGradient(0, 0, 0, 400);
  
    gradient.addColorStop(0, 'rgba(27,30,54,.5)');
    gradient.addColorStop(.425, 'rgba(46,49,72,0)');
  
    Chart.defaults.global.defaultFontFamily = 'Red Hat Text';
    Chart.defaults.global.defaultFontSize = 12;
  
    createXrpChart = new Chart(xrpChart, {
      type: 'line',
      data: {
        labels: times,
        datasets: [{
          label: "",
          data: prices,
          backgroundColor: gradient,
          borderColor: 'rgba(46,49,72,1)',
          borderJoinStyle: 'round',
          borderCapStyle: 'round',
          borderWidth: 3,
          pointRadius: 0,
          pointHitRadius: 10,
          lineTension: .2,
        }]
      },
  
      options: {
        title: {
          display: false,
          text: 'Heckin Chart!',
          fontSize: 35
        },
  
        legend: {
          display: false
        },
  
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        },
  
        scales: {
          xAxes: [{
            display: false,
            gridLines: {}
          }],
          yAxes: [{
            display: false,
            gridLines: {}
          }]
        },
  
        tooltips: {
          callbacks: {
            //This removes the tooltip title
            title: function() {}
         },
          //this removes legend color
          displayColors: false,
          yPadding: 10,
          xPadding: 10,
          position: 'nearest',
          caretSize: 10,
          backgroundColor: 'rgba(255,255,255,.9)',
          bodyFontSize: 15,
          bodyFontColor: '#303030' 
        }
      }
    });
  }
  
  
  /// Update current price ///
  async function updateEthereumPrice() {
    let { times, prices } = await ethereumData()
    let currentPrice = prices[prices.length-1].toFixed(2);
  
    document.getElementById("ethPrice").innerHTML = "$" + currentPrice;
  }
  
  async function updateBitcoinPrice() {
    let { times, prices } = await btcData()
    let currentPrice = prices[prices.length-1].toFixed(2);
  
    document.getElementById("btcPrice").innerHTML = "$" + currentPrice;
  }

  async function updateXrpPrice() {
    let { times, prices } = await xrpData()
    let currentPrice = prices[prices.length-1].toFixed(2);
  
    document.getElementById("xrpPrice").innerHTML = "$" + currentPrice;
  }
  
  updateEthereumPrice()
  updateBitcoinPrice()
  updateXrpPrice()
  
  printBtcChart()
  printEthereumChart()
  printXrpChart()
}