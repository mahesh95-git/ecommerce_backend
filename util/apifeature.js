class apiFeatures {
  constructor(query, querystr) {
    this.query = query;
    this.querystr = querystr;
  }
  search() {
    const keyword = this.querystr.keyword
      ? {
          name: {
            $regex: this.querystr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find(keyword);
    return this;
  }

  filter() {
    const category = { ...this.querystr };
    const field = ["keyword", "page", "limit", "order"];
    field.forEach((value) => delete category[value]);
    let stringvalue = JSON.stringify(category);
    stringvalue = stringvalue.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (key) => `$${key}`
    );
    this.query = this.query.find(JSON.parse(stringvalue));
    return this;
  }

  pagination(page) {
    const currentpage = parseInt(this.querystr.page) || 1;
    const skip = page * (currentpage - 1);
    this.query = this.query.limit(page).skip(skip);
    return this;
  }
  bypricesort() {
    const sortbyoder = parseInt(this.querystr.order || -1);
    this.query = this.query.sort({ price: sortbyoder });
    return this;
  }
}
module.exports = apiFeatures;
