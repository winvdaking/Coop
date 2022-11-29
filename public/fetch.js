const api = (() => {
    const BASE = 'https://allweb.fun/coop/api/';
    const API_KEY = '3e058ec8fd902a466b4fe5bf487f1b07c996111e'
    function query(method, route, params) {
        const body = params?.body;

        const headers = new Headers();
        headers.append(
            "Authorization",
            API_KEY
        );

        const request = new Request(
            BASE + route,
            {
                body: JSON.stringify(body),
                method,
                headers
            }
        );

        return fetch(request).then(reponse => reponse.json())
    }
    return {
        get(route, params) {
            return query('GET', route, params)
        },
        post(route, params) {
            return query('POST', route, params)
        },
        put(route, params) {
            return query('PUT', route, params)
        },
        delete(route, params) {
            return query('DELETE', route, params)
        },
    }
})();