import ls from 'local-storage';

export function fetchApiPost(endpoint, request) {
    return fetch(endpoint, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(request),
    }).then(response => {
        // console.log('jwt : ',response.headers.get('x-access-token'));
        // for(const header of response.headers){
        //     console.log(header);
        // }
        //
        if (response.headers.get('x-access-token')) {
            let jwt = response.headers.get('x-access-token');
            ls.set('accessToken', jwt);
        }
        return response.json()
    }).then((data) => {
        console.log("resp JSON is:");
        console.log(data);
        return data;
    });
}

export function fetchApiGet(endpoint) {
    return fetch(endpoint, {
        method: 'GET',
        headers: getHeaders(),
    }).then(response => {
        return response.json()
    }).then((data) => {
        console.log("resp JSON is:");
        console.log(data);
        return data;
    });
}

export function fetchImageGet(endpoint) {
    return fetch(endpoint, {
        method: 'GET',
        headers: getHeaders(),
    }).then( response => {
        const contentType = response.headers.get("content-type");
        if(contentType==="text/plain"){
            return response.text();
        }
        return response.arrayBuffer();
    }).then( async (buffer) => {
        if(buffer==="No media file found."){
            return null;
        }
        let base64Flag = 'data:image/jpeg;base64,';
        let imageStr = await arrayBufferToBase64(buffer);
        let imgData =  base64Flag + imageStr;
        return imgData;
    });
}

export function fetchImagePost(endpoint, formData) {
    return fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: getHeaders(true),
    }).then( response => {
        return response;
    });
}

export function fetchApiPut(endpoint, request) {
    return fetch(endpoint, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(request),
    }).then(response => {
        return response.json()
    }).then((data) => {
        console.log("resp JSON is:");
        console.log(data);
        return data;
    });
}


function getHeaders(isImage) {
    let headers = new Headers();
    if (!isImage) {
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
    }
    if (ls.get('accessToken')) {
        headers.append('Authorization', 'Bearer ' +ls.get('accessToken'));
    }
    return headers;
}

function arrayBufferToBase64(buffer) {
    return new Promise(resolve => {
        let binary = '';
        let bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));

        resolve(window.btoa(binary));
    });
}
