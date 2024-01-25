const api_url = "http://127.0.0.1:8000/api";

import axios from "axios";

export default {
    loginUser(obj) {
        console.log(obj);
        console.log("api url: ", api_url);

        return axios.post(`${api_url}/login`, obj)
            .then(function (response) {
                // handle success
                if (response.status === 200) {
                    return response;
                } else {
                    throw { message: 'Unexpected response status', response };
                }
            })
            .catch(function (error) {
                // handle error
                if (error.response && error.response.status === 401) {
                    // Unauthorized access, provide a more informative error message
                    throw { message: 'Authentication failed. Please check your credentials.', response: error.response };
                } else {
                    throw error;
                }
            })
            .finally(function () {
                // always executed
            });
    },
    register(obj) {
        console.log(obj);
        console.log("api url: ", api_url);

        return axios.post(`${api_url}/register`, obj)
            .then(function (response) {
                if (response.status === 200) {
                    return response;
                } else {
                    throw { message: 'Unexpected response status', response };
                }
            })
            .catch(function (error) {
                if (error.response && error.response.status === 401) {
                    throw { message: 'Authentication failed. Please check your credentials.', response: error.response };
                } else {
                    throw error;
                }
            })
    },
    addProduct(obj, token) {
        console.log("finsl dklfjksl",token)
        return axios.post(`${api_url}/products`, obj, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(function (response) {
            if (response.status === 200) {
                return response;
            } else {
                throw { message: 'Unexpected response status', response };
            }
        })
        .catch(function (error) {
            if (error.response && error.response.status === 401) {
                throw { message: 'Authentication failed. Please check your credentials.', response: error.response };
            } else {
                throw error;
            }
        });
    },
    getProducts(token) {
        return axios.get(`${api_url}/products`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(function (response) {
            if (response.status === 200) {
                return response;
            } else {
                throw { message: 'Unexpected response status', response };
            }
        })
        .catch(function (error) {
            if (error.response && error.response.status === 401) {
                throw { message: 'Authentication failed. Please check your credentials.', response: error.response };
            } else {
                throw error;
            }
        });
    },
    updateProduct(obj,id,token) {
        return axios.post(`${api_url}/products/${id}`,obj, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(function (response) {
            if (response.status === 200) {
                return response;
            } else {
                throw { message: 'Unexpected response status', response };
            }
        })
        .catch(function (error) {
            if (error.response && error.response.status === 401) {
                throw { message: 'Authentication failed. Please check your credentials.', response: error.response };
            } else {
                throw error;
            }
        });
    },
    deleteProduct(id,token) {
        return axios.delete(`${api_url}/products/${id}` ,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(function (response) {
            if (response.status === 200) {
                return response;
            } else {
                throw { message: 'Unexpected response status', response };
            }
        })
        .catch(function (error) {
            if (error.response && error.response.status === 401) {
                throw { message: 'Authentication failed. Please check your credentials.', response: error.response };
            } else {
                throw error;
            }
        });
    }
};
