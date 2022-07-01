// var xhr = new XMLHttpRequest();
function resolveData(data) {
    var arr = [];
    for (let k in data) {
        var str = k + '=' + data[k]
        arr.push(str);
    }
    return arr.join('&');
}

function ajax(options) {
    var xhr = new XMLHttpRequest();
    var str = resolveData(options.data);
    if (options.method.toUpperCase() == 'GET'){
        xhr.open(options.method, options.url + '?' + str)
        xhr.send()
    } else if (options.method.toUpperCase()== "POST") {
        xhr.open(options.method, options.url)
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(str);
    }

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var result = JSON.parse(xhr.responseText);
            options.success(result)
        }
    }

}