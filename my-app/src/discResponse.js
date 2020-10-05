class DiscResponse {
  constructor() {
    this.mostlike = "";
    this.leastlike = "";
    this.mostlikeVal = 4;
    this.leastlikeVal = 1;
  }

  unsetMostLike() {
    this.mostlike = "";
  }

  setMostLike(descriptor) {
    this.mostlike = descriptor;
  }

  getMostLike() {
    return this.mostlike;
  }

  unsetLeastLike() {
    this.leastlike = "";
  }

  setLeastLike(descriptor) {
    this.leastlike = descriptor;
  }

  getLeastLike() {
    return this.leastlike;
  }

  getMostLikeVal() {
    return this.mostlikeVal;
  }

  getLeastLikeVal() {
    return this.leastlikeVal;
  }
}

export default DiscResponse;
