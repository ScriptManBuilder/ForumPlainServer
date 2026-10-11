function parseCookies(req){
    const header = req.headers.cookie || '';

    return Object.fromEntries(
        header
            .split(';')
            .map(part => part.trim())
            .filter(part => part.includes('='))
            .map(part => {
                const index = part.indexOf('=');
                return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
            })
    );
}

module.exports = { parseCookies };
