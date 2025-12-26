import AppError from "./AppError.js";

class APIFeatures {
  query: any;
  queryString: any;

  constructor(query: any, queryString: any) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "search",
      "searchField",
    ];
    excludedFields.forEach((el) => delete queryObj[el]);

    if (this.queryString.search) {
      // escape special characters for regex
      const searchTerm = this.queryString.search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );
      const regex = new RegExp(searchTerm, "i");

      // determine which fields to search
      const searchField = this.queryString?.searchField;
      if (!searchField) {
        throw new AppError(
          "searchField query parameter is required when using search",
          400
        );
      }
      this.query = this.query.find({ [searchField]: { $regex: regex } });
    }

    this.query = this.query.find(queryObj);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;
