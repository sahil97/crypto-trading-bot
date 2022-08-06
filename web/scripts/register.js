const API_URI = 'http://127.0.0.1:5000'


const verifyEmail = (email) => {
    let regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

$(document).ready( () => {
    
    let currentName = '';
    let nameValidated = false;
    let currentValEmail = '';
    let emailValidated = false;
    let currentValPwd = '';
    let pwdValidated = false;

    $('#inputName').on('change', () => {
        currentName = $('#inputName').val();

        if(currentName.length < 1){
            $('#inputName').removeClass('is-valid');
            $('#inputName').addClass('is-invalid');
            nameValidated = false;
        }
        else {
            $('#inputName').removeClass('is-invalid');
            $('#inputName').addClass('is-valid');
            nameValidated = true;
        }
    });

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


    $('#loginBtn').on('click', (e) => {
        e.preventDefault();
        let targetUri = window.location.href;
        targetUri = targetUri.split('/').slice(0, -1).join('/');
        // console.log(targetUri);
        window.location.href = targetUri;
    })

    $('#registerBtn').on('click', (e) => {
        e.preventDefault();

        if(nameValidated && emailValidated && pwdValidated){
            
            $.ajax({
                type: "POST",
                url: API_URI + "/signup",
                data: JSON.stringify({ email: currentValEmail, password: currentValPwd }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){
                    console.log(data);
                    if(data.message  == 'User already exists'){
                        $('#inputPassword').val('');
                        window.alert("User already exists. Please try different email.")
                    } else if(data.message == 'User added'){
                        // Add user's jwt token
                        // traverse to the next page
                        let targetUri = window.location.href;
                        targetUri = targetUri.split('/').slice(0, -1).join('/');
                        // console.log(targetUri);
                        window.location.href = targetUri;
                    }
                },
                error: function(errMsg){
                    console.log(errMsg);
                }
            });
        }

    })


})