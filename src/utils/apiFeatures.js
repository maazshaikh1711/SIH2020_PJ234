class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {

        //FILTERING
        const queryObj = { ...this.queryString }
        const excludeFields = ['page', 'limit', 'sort', 'fields']
        excludeFields.forEach(ele => delete queryObj[ele])

        //console.log(req.query)        cant use coz if we specify page no. or sort or limit or fields.. this will fail
        //const query = Tour.find().where('duration').equals(5).where('difficulty').equals('easy')

        //ADVANCED FILTERING
        // console.log(queryObj)
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
        queryStr = JSON.parse(queryStr)
        // console.log(queryStr)

        this.query = this.query.find(queryStr)
        return this;
    }

    sort() {

        //SORTING
        if (this.queryString.sort) {

            const a = this.queryString.sort.split(',').join(' ')
            //console.log(a)
            this.query = this.query.sort(a)
        }
        else {
            this.query = this.query.sort('-createdAt')
        }

        //can sort by -createdAt , if we want to see the latest updated one first. 
        return this;
    }

    limitFields() {

        //FIELD LIMITING
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields)
        }
        //else removes one thing from object that is internally used by mongoose that is __v , butdont know why this done for..
        else {
            this.query = this.query.select('-__v')
        }

        return this;
    }

    paginate() {

        //PAGINATION

        const page = this.queryString.page * 1 || 1        //        || 1 is for the deafult value
        const limit = this.queryString.limit * 1 || 100

        const skip = (page - 1) * limit             // skip : if we want to see the doc from 11 then skip val will be 10
        // suppose, page=3&limit=10         1-10  page 1,   11-20  page 2,  21-30  page 3 and so on 

        this.query = this.query.skip(skip).limit(limit)

        return this;
    }


}

module.exports = APIFeatures;