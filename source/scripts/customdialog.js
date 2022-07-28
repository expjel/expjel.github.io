import '../node_modules/dompurify/dist/purify.js'

document.getElementById('alert-btn').addEventListener('click', () => {
    document.getElementById('alert-dialog').showModal();
});
document.getElementById('confirm-btn').addEventListener('click', () => {
    document.getElementById('confirm-dialog').showModal();
});
document.getElementById('prompt-btn').addEventListener('click', () => {
    document.getElementById('prompt-dialog').showModal();
});

let okBtns = document.getElementsByClassName('ok-btn');
for (let btn of okBtns) {
    btn.addEventListener('click', okBtnHandler);
}

let cancelBtns = document.getElementsByClassName('cancel-btn');
for (let btn of cancelBtns) {
    btn.addEventListener('click', cancelBtnHandler);
}

function okBtnHandler(event) {
    let dialog = event.target.parentElement;
    let output =  document.getElementsByTagName('output')[0];
    if (dialog.id == 'alert-dialog') {
        dialog.close();
    } 
    else if (dialog.id == 'prompt-dialog') {
        let value = document.getElementById('name').value;
        let clean = DOMPurify.sanitize(value);
        if (value.length != 0) {
            output.innerHTML = `Prompt result: ${clean}`;
        } else {
            output.innerHTML = `User didn't enter anything`;
        }
        document.getElementById('name').value = ''; //clear input field
        dialog.close();
    }
    else if (dialog.id == 'confirm-dialog') {
        output.innerHTML = `The value returned by the confirm method is: true`;
        dialog.close();
    }
}

function cancelBtnHandler(event) {
    let dialog = event.target.parentElement;
    let output =  document.getElementsByTagName('output')[0];
    if (dialog.id == 'confirm-dialog') {
        output.innerHTML = `The value returned by the confirm method is: false`;
    }
    else if (dialog.id == 'prompt-dialog') {
        output.innerHTML = '';
    }
    dialog.close();
}