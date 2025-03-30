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

document.addEventListener('templates-loaded',function(){
    function hideDropdown() {
        document.querySelectorAll('.dropdown-menu.show').forEach(function(el){
            el.classList.remove('show');
            document.querySelector('body').removeEventListener('click',hideDropdown)
        });
    }
    function handleDropdownToggle(e) {
        e.preventDefault();
        e.stopPropagation();
        hideDropdown();
        document.querySelectorAll('.dropdown-menu.show').forEach(function(el){
            el.classList.remove('show');
        });
        e.target.nextElementSibling.classList.toggle('show');
        document.querySelector('body').addEventListener('click',hideDropdown);
    }
    function handleLougout(e) {
        deleteCookie('user');
    }
    function hideModal(e) {
        document.querySelectorAll('.modal.show').forEach(function(el){
            if (!e.target.classList.contains('modal')&&!e.target.classList.contains('close')) return;
            el.classList.remove('show');
            document.querySelector('body').removeEventListener('click',hideModal)
        });
    }
    function handleModalToggle(e) {
        e.preventDefault();
        e.stopPropagation();
        document.querySelector(e.target.dataset.togglemodal).classList.add('show');
        document.querySelector('body').addEventListener('click',hideModal);
    }
    document.querySelector('body').addEventListener('click',function(e){
        if (e.target.classList.contains('dropdown-toggle')) return handleDropdownToggle(e);
        if (e.target.id==='logout') return handleLougout(e);
        if (e.target?.dataset?.togglemodal) return handleModalToggle(e);
    });
    function validatePassword() {
        let confirmPasswordInput = this;
        let passwordInput = document.querySelector(confirmPasswordInput.dataset.confirmtarget);
        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity("Passwords don't match.");
        } else {
            confirmPasswordInput.setCustomValidity('');
        }
    }
    function validateRegex() {
        let textInput = this
        let regex = new RegExp(textInput.dataset.validationregex);
        if (textInput.value.match(regex)===null) {
            textInput.setCustomValidity(textInput.dataset.validationhint);
            textInput.closest('form').reportValidity();
        } else {
            textInput.setCustomValidity('');
        }
    }
    function validateUnique() {
        let input = this;
        if(input.value.length === 0) return;
        let form = this.closest('form');
        let url = new URL(form.action);
        url.port = 3000;
        url.searchParams.set(`${input.name}`,input.value)
        input.setCustomValidity('...');
        fetch(url.toString()).then(function(data){
            data.json().then(function(data){
                console.log(data.length);
                if (data.length > 0) {
                    input.setCustomValidity('Input value already exists in the database.');
                } else {
                    input.setCustomValidity('');
                }
            });
        })
    }
    document.querySelectorAll('form').forEach(function(form){
        form.querySelectorAll('input[type=password][data-confirmtarget]').forEach(function(confirmPasswordInput){
            let passwordInput = form.querySelector(confirmPasswordInput.dataset.confirmtarget);
            confirmPasswordInput.addEventListener('change',validatePassword);
            passwordInput.addEventListener('change', () => confirmPasswordInput.dispatchEvent(new Event('change')));
        });
        form.querySelectorAll('input[type="text"][data-validationregex]').forEach(function(textInput){
            textInput.addEventListener('keyup',validateRegex);
        });
        form.querySelectorAll('input[unique]').forEach(function(input){
            input.addEventListener('change',validateUnique);
        });
        form.addEventListener('submit',function(e){
            e.preventDefault();
            e.stopPropagation();
            let url = new  URL(form.action);
            url.port = 3000;
            let config = {
                method: form.method
            };
            form.querySelectorAll('.fill-with-timestamp').forEach(el => {
                el.value = (new Date()).toISOString().split('T')[0];
            });
            if (config.method.toLowerCase()==='get') {
                (new FormData(form)).entries().forEach(([name,value]) => {
                    url.searchParams.set(name,value);
                })
            } else {
                config.body = JSON.stringify(Object.fromEntries(new FormData(form)));
            }
            fetch(url.toString(),config).then(function(data){
                let event = new Event('success');
                event.data = data;
                form.dispatchEvent(event);
            }).catch(function(data){
                console.log(data);
                let event = new Event('error');
                event.data = data;
                form.dispatchEvent(event);
            });
            return false;
        });
    });
    let username = getCookie('username');
    if (username.length > 0) {
        let auth = document.querySelector('#authentication');
        auth.setAttribute('xlu-include-file','templates/navbar/authenticated.html')
        auth.dataset.username = username;
    }
});

function setCookie(cname, cvalue, exdays) {
    if (cvalue===undefined) return deleteCookie(cname);
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function deleteCookie(cname) {
    const d = new Date();
    d.setTime(d.getTime() - 1);
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=;" + expires + ";path=/";
}
  
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function requiresAuthentication() {
    if(!getCookie('user')) window.location.replace('login.html');
}

async function xLuIncludeFile() {
    let z = document.getElementsByTagName("*");
    let user = getCookie('user');
    if (user) user = JSON.parse(user);
    for (let i = 0; i < z.length; i++) {
        if (z[i].getAttribute("xlu-include-file")||(user&&z[i].hasAttribute("auth:xlu-include-file"))) {
            let a = z[i].cloneNode(false);
            let file;
            if (user&&z[i].hasAttribute("auth:xlu-include-file")) {
                file = z[i].getAttribute("auth:xlu-include-file");
                z[i].dataset.username = user.username;
                z[i].dataset.email = user.email;
            } else {
                file = z[i].getAttribute("xlu-include-file");
            }

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
                            response = await fetch(dataValue.replace('{{hostname}}',window.location.hostname));
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
                    a.removeAttribute("auth:xlu-include-file");
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
    let event = new Event('templates-loaded');
    document.dispatchEvent(event);
}

