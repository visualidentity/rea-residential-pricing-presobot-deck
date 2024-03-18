import _ from 'lodash';

export default class SearchCache {
  static add(url, items) {
    if (!Array.isArray(items)) {
      items = [items];
    }
    SearchCache._cache[url] = _.unionWith(
      SearchCache._cache[url],
      items,
      _.isEqual
    );
  }

  static find(url, searchObj) {
    return _.find(SearchCache._cache[url], searchObj);
  }

  static get(url) {
    return SearchCache._cache[url];
  }
}

SearchCache._cache = {};
