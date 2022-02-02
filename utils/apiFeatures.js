class ApiFeatures {
  constructor(queryData, queryStr) {
    this.queryData = queryData;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.queryData = this.queryData.find({ ...keyword });

    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((field) => {
      delete queryCopy[field];
    });

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace("/\b(gt|gte|lt|lte)\b/g", (key) => `$${key}`);

    this.queryData = this.queryData.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resultsPerPage) {
    const currentPage = Number(this.queryStr.page);
    const skip = resultsPerPage * (currentPage - 1);

    this.queryData = this.queryData.limit(resultsPerPage).skip(skip);

    return this;
  }
}

module.exports = ApiFeatures;
