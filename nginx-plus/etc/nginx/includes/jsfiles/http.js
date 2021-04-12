function hello(r) {
    if(r.method == "POST"){
        r.return(200,r.requestBuffer);
    }
        
    else
        r.return(403, `Unsupported method: ${r.method}`);
}

export default {hello};