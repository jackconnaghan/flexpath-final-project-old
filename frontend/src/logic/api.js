import keycloak from "../keycloak";

//cleaning up API calls so there's not a fucking million of them 
//(3 counts as a million)

//this is what Tanstack Query is.......anyway

//basic fetch wrapper that handles authentication and the actual fetch call
//works IN TANDEM with the useFetch hook(s)
//api.js -> makes call
//useFetch -> tracks state of call for React compatability

//this is a cool params thing:
//url is url,
//but {method, body} is a destructured object.
//method gets set to GET as default,
//and the destructured object itself gets a default value of [].
//Cool!
export async function apiFetch(url, { method = "GET", body } = []) {
    //set up headers object
    const headers = {};

    //if body has contents, set headers to JSON
    if (body !== undefined) headers["Content-Type"] = "application/json";

    if (keycloak.authenticated) {
        await keycloak.updateToken(3); //keeps token updated, doesn't log user out so quickly
        //couldn't do this with Content-Type as that has a hyphen, but it's the same operation
        headers.Authorization = `Bearer: ${keycloak.token}`;
    }

    //here goes
    const response = await fetch(url, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return response.status === 204 ? null : response.json();
}