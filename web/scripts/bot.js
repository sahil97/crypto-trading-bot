const API_URI = 'http://127.0.0.1:5000';
const START_AMT = 100;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

$(document).ready(() => {

    $('[type="date"]').prop('max', function(){
        return new Date().toJSON().split('T')[0];
    });

    let current_user_email = '';

    if(localStorage.getItem('email')){
        current_user_email = localStorage.getItem('email')
    } else {
        alert("Not logged in. Login first.")
        let targetUri = window.location.href;
        targetUri = targetUri.split('/').slice(0, -1).join('/');
        // console.log(targetUri);
        window.location.href = targetUri;
    }

    const endBalElement = $('#endBal');
    const plAmtElement = $('#plAmt');
    const plPercentElement = $('#plPercent');
    const numOfBuysElement = $('#numOfBuys');
    const numOfSellsElement = $('#numOfSells'); 
    const spinnerElement = $('#spinner');
    spinnerElement.hide();

    $('#logoutBtn').on('click', (e) => {
        localStorage.removeItem('email');
        let targetUri = window.location.href;
        targetUri = targetUri.split('/').slice(0, -1).join('/');
        // console.log(targetUri);
        window.location.href = targetUri;
    })


    $('#accDetails').on('click', (e) => {
        e.preventDefault();

        let targetUri = window.location.href;
        targetUri = targetUri.split('/').slice(0, -1).join('/') + '/account.html';
        // console.log(targetUri);
        window.location.href = targetUri;
    });

    $('#stats').on('click', (e) => {
        e.preventDefault();

        let targetUri = window.location.href;
        targetUri = targetUri.split('/').slice(0, -1).join('/') + '/stats.html';
        // console.log(targetUri);
        window.location.href = targetUri;
    });

    $('#fetchBtn').on('click', (e) => {
        e.preventDefault();

        spinnerElement.show();

        let coinSelected = $('#selectCoin').val();
        let startDate = $('#startDate').val();
        let endDate = $('#endDate').val();

        // Start Date
        sd_date_complete = new Date(startDate);
        sd_date = sd_date_complete.getDate();
        sd_month = MONTHS[sd_date_complete.getMonth()];
        sd_year = sd_date_complete.getFullYear();

        startDate = sd_month + ' ' + sd_date + ', ' + sd_year;

        // End Date
        ed_date_complete = new Date(endDate);
        ed_date = ed_date_complete.getDate();
        ed_month = MONTHS[ed_date_complete.getMonth()];
        ed_year = ed_date_complete.getFullYear();

        endDate = ed_month + ' ' + ed_date + ', ' + ed_year;


        console.log(coinSelected, startDate, endDate);


        $.ajax({
            type: "POST",
            url: API_URI + "/autobot",
            data: JSON.stringify({ coin: coinSelected, startDate: startDate, endDate: endDate }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data){
                console.log(data);

                spinnerElement.hide();
                
                try {
                    let endBal = data['balance_amount'];
                    endBalStr = Math.round(endBal, 2);
                    endBalStr = '$ ' + endBal; 
                    let numOfBuys = data['buys'].length;
                    let numOfSells = data['sells'].length;
                    
                    endBalElement.html(endBalStr);
                    numOfBuysElement.html(numOfBuys);
                    numOfSellsElement.html(numOfSells);

                    let plAmt = Math.round(endBal - START_AMT, 2);
                    plAmtElement.html(plAmt);

                    let plAmtPercent = Math.round((plAmt / START_AMT) * 100, 2);
                    plPercentElement.html(plAmtPercent + ' %');


                } catch (error) {
                    console.log(error);
                }



            },
            error: function(errMsg){
                console.log(errMsg);
            }
        });


    });
});