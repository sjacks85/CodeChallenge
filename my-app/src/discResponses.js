import data from "./components/data/words.json";
import DiscResponse from "./discResponse";
import DescriptionAndRank from "./descriptionAndRank";

class DiscResponses {
  constructor() {
    this.discResponseArray = new Array(data.length);
    for (var i = 0; i < data.length; i++) {
      this.discResponseArray[i] = new DiscResponse();
    }
  }

  generateJsonResponse() {
    let answers = new Array();
    for (var i = 0; i < data.length; i++) {
      let mostLikeDescriptionRank = {
        description: this.discResponseArray[i].getMostLike(),
        rank: this.discResponseArray[i].getMostLikeVal(),
      };
      let leastLikeDescriptionRank = {
        description: this.discResponseArray[i].getLeastLike(),
        rank: this.discResponseArray[i].getLeastLikeVal(),
      };
      answers.push(mostLikeDescriptionRank);
      answers.push(leastLikeDescriptionRank);
    }
    let response = '{ "answers":' + JSON.stringify(answers) + "}";
    return response;
  }
}

export default DiscResponses;
