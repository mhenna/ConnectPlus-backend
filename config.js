module.exports = {
    secret: 'techdev',
    resetSecret: 'TechD3V',
    hostUrl: 'http://localhost:3300',
    publicRoutes: [
        '/user/register', '/user/login', /^\/user\/verify\/.*/
    ]
};