const paginatedResults = function(model, conditions, projection, sortOptions) {
    const defLimit = 6;
    return async (req, res, next) => {
        const search = req.query.s ? req.query.s.trim() : "";
        const l = req.query.l ? (parseInt(req.query.l.trim()) < 1 ? "" : req.query.l.trim()) : "";
        const searchParams = new RegExp(search, "i");
        const query = [];
        for(const i in conditions) { //conditions is array eg: ["bio", "username"]
            const obj = {};
            obj[conditions[i]] = searchParams //bio:val | username:val
            query.push(obj); //eg: query[0].bio | query[1].username
            //query = [{bio:val}, {username:val}]
        }

        const searchQuery = {$or:query};
        let currentPage = parseInt(req.query.p) || 1;
        let limit = parseInt(l) || 6;
        if(limit < 1) limit = defLimit;
        const count = await model.countDocuments(searchQuery);

        let maxPages = Math.ceil(count / limit);
        if(maxPages < 1) maxPages = 1;
        if(currentPage < 1) currentPage = 1;
        if(currentPage > maxPages) currentPage = maxPages;

        const startIndex = (currentPage - 1) * limit;
        const endIndex = currentPage * limit;

        const pagResults = {maxPages: maxPages, currentPage: currentPage, search: search};

        if(endIndex < count) {
            pagResults.next = {
                p: currentPage + 1,
                l: l,
                s: search
            }
        }

        if(startIndex > 0) {
            pagResults.previous = {
                p: currentPage - 1,
                l: l,
                s: search
            }
        }

        //projection is string of all things wanted returned in model results
        //sortOptions is object of sort stuff and all that
        try {
            pagResults.list = await model.find(searchQuery, projection,  {sort: sortOptions,  skip: startIndex, limit: limit});
            res.paginatedResults = pagResults;
            next();
        } catch(e) {
            return res.redirect('/');
        }
    }
}

module.exports = paginatedResults;