const API_URI = 'http://127.0.0.1:5000'


const verifyEmail = (email) => {
    let regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

$(document).ready( () => {
    
    let currentValEmail = '';
    let emailValidated = false;
    let currentValPwd = '';
    let pwdValidated = false;

    $('#inputEmail').on('change', () => {
        currentValEmail = $('#inputEmail').val(); 
        if(verifyEmail(currentValEmail)){
            $('#inputEmail').removeClass('is-invalid');
            $('#inputEmail').addClass('is-valid');
            emailValidated = true;
        } else {
            $('#inputEmail').removeClass('is-valid');
            $('#inputEmail').addClass('is-invalid');
            emailValidated = false;
        }
    });

    $("#inputPassword").on('change', (e) => {
        currentValPwd = $('#inputPassword').val();
        let messageSpace = $('#pwdHelp');


        if(currentValPwd.length < 8){
            $('#inputPassword').removeClass('is-valid');
            $('#inputPassword').addClass('is-invalid');
            pwdValidated = false;
            messageSpace.html('Password should be longer than 8 digits');
        }
        else {
            $('#inputPassword').removeClass('is-invalid');
            $('#inputPassword').addClass('is-valid');
            pwdValidated = true;
            messageSpace.html('Strong password');

        }
        // Add more validation
    })


    $('#submitBtn').on('click', (e) => {
        e.preventDefault();
        if(emailValidated && pwdValidated){
            
            $.ajax({
                type: "POST",
                url: API_URI + "/login",
                data: JSON.stringify({ email: currentValEmail, password: currentValPwd }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){
                    console.log(data);
                    if(data.message == 'Logged In'){
                        // Add user's jwt token
                        // traverse to the next page
                        localStorage.setItem('email', data.email);

                        let targetUri = window.location.href + 'bot.html';
                        window.location.href = targetUri;
                    }
                    else {
                        alert(data.message)
                    }
                },
                error: function(errMsg){
                    console.log(errMsg);
                }
            });
        }
    })

    $('#registerBtn').on('click', (e) => {
        e.preventDefault();

        let targetUri = window.location.href + 'register.html';
        window.location.href = targetUri;

    })


})