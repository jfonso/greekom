// https://stackoverflow.com/questions/40162907/w3includehtml-sometimes-includes-twice
/*
function xLuIncludeFile() {
    let z, i, a, file, xhttp;

    z = document.getElementsByTagName("*");

    for (i = 0; i < z.length; i++) {
        if (z[i].getAttribute("xlu-include-file")) {
            a = z[i].cloneNode(false);
            file = z[i].getAttribute("xlu-include-file");
            xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (xhttp.readyState === 4 && xhttp.status === 200) {
                    a.removeAttribute("xlu-include-file");
                    a.innerHTML = xhttp.responseText;
                    z[i].parentNode.replaceChild(a, z[i]);
                    xLuIncludeFile();
                }
            }

            // false makes the send operation synchronous, which solves a problem
            // when using this function in short pages with Chrome. But it is
            // deprecated on the main thread due to its impact on responsiveness.
            // This call may end up throwing an exception someday.

            xhttp.open("GET", file, false);
            xhttp.send();

            return;
        }
    }
}
*/

window.addEventListener('load',function(){
    function hideDropdown() {
        document.querySelectorAll('.dropdown-menu.show').forEach(function(el){
            el.classList.remove('show');
            document.querySelector('body').removeEventListener('click',hideDropdown)
        });
    }
    document.querySelector('body').addEventListener('click',function(e){
        if (!e.target.classList.contains('dropdown-toggle')) return;
        e.preventDefault();
        e.stopPropagation();
        hideDropdown();
        document.querySelectorAll('.dropdown-menu.show').forEach(function(el){
            el.classList.remove('show');
        });
        e.target.nextElementSibling.classList.toggle('show');
        document.querySelector('body').addEventListener('click',hideDropdown)
    });
    function validatePassword() {
        let confirmPasswordInput = this;
        let passwordInput = document.querySelector(confirmPasswordInput.dataset['confirmtarget']);
        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity("Passwords don't match.");
        } else {
            confirmPasswordInput.setCustomValidity('');
        }
    }
    function validateRegex() {
        let textInput = this
        let regex = new RegExp(textInput.dataset['validationregex']);
        if (!textInput.value.match(regex)) {
            textInput.setCustomValidity(textInput.dataset['validationhint']);
            textInput.closest('form').reportValidity();
            textInput.onkeyup = validateRegex;
        } else {
            textInput.setCustomValidity('');
            textInput.onkeyup = undefined;
        }
    }
    document.querySelectorAll('form').forEach(function(form){
        form.querySelectorAll('input[type=password][data-confirmtarget]').forEach(function(confirmPasswordInput){
            let passwordInput = form.querySelector(confirmPasswordInput.dataset['confirmtarget']);
            confirmPasswordInput.onchange = validatePassword;
            passwordInput.onchange = () => confirmPasswordInput.dispatchEvent(new Event('change'));
        });
        form.querySelectorAll('input[type="text"][data-validationregex]').forEach(function(textInput){
            textInput.onchange = validateRegex;
        });
        form.onsubmit = function (e) {
            let url = new  URL(form.action);
            url.port = 3000;
            console.log(Object.fromEntries(new FormData(form)));
            fetch(url.toString(),{
                method: form.method,
                body: JSON.stringify(Object.fromEntries(new FormData(form))),
            }).then(function(){
                form.querySelector('.successToast').classList.add('show');
            });
            return false;
        }
    });
});

async function xLuIncludeFile() {
    let z = document.getElementsByTagName("*");

    for (let i = 0; i < z.length; i++) {
        if (z[i].getAttribute("xlu-include-file")) {
            let a = z[i].cloneNode(false);
            let file = z[i].getAttribute("xlu-include-file");

            try {
                let response = await fetch(file);
                if (response.ok) {

                    let content = await response.text();

                    let dataKeys = Object.keys(z[i].dataset);
                    for (j = 0; j < dataKeys.length; j++) {
                        let dataKey = dataKeys[j];
                        let dataValue = z[i].dataset[dataKey];
                        if (dataKey==='json') {
                            dataKey = 'array';
                            response = await fetch(dataValue);
                            if (response.ok) {
                                dataValue = await response.text();
                            }
                        }
                        if (dataKey==='array') {
                            let template = content
                            content = '';
                            if (dataValue.startsWith('[')) {
                                dataValue = JSON.parse(dataValue);
                                dataValue.forEach(function(obj){
                                    let childContent = template;
                                    for (const key in obj) {
                                        childContent = childContent.replace(new RegExp(`{{${key}}}`,'gi'),obj[key])
                                    }
                                    content += childContent;
                                });
                            }
                        } else {
                            content = content.replace(new RegExp(`{{${dataKey}}}`,'gi'),dataValue);
                        }
                    }


                    a.removeAttribute("xlu-include-file");
                    //a.innerHTML = await response.text();
                    a.innerHTML = content;
                    z[i].parentNode.replaceChild(a, z[i]);
                    xLuIncludeFile();
                }
            } catch (error) {
                console.error("Error fetching file:", error);
            }

            return;
        }
    }
}

