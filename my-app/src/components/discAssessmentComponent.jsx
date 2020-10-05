import { getNodeText } from "@testing-library/react";
import React, { Component } from "react";
import data from "./data/words.json";
import DiscResponses from "../discResponses";

class DiscAssessmentComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSetNum: 0,
      setLength: data.length,
      currentMostLike: "",
      currentLeastLike: "",
      assessmentEnd: false,
      resultsSubmitted: false,
      userDiscResponses: new DiscResponses(),
      testResultD: 0,
      testResultI: 0,
      testResultS: 0,
      testResultC: 0,
    };
    this.nextStateChange = this.nextStateChange.bind(this);
    this.prevStateChange = this.prevStateChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  prevStateChange() {
    this.setState((prevState) => {
      if (prevState.currentSetNum > 0) {
        let nextSetNum = prevState.currentSetNum - 1;
        let atAssessmentEnd = false;
        return {
          currentSetNum: nextSetNum,
          assessmentEnd: atAssessmentEnd,
          currentMostLike: prevState.userDiscResponses.discResponseArray[
            nextSetNum
          ].getMostLike(),
          currentLeastLike: prevState.userDiscResponses.discResponseArray[
            nextSetNum
          ].getLeastLike(),
        };
      }
    });
  }

  nextStateChange() {
    this.setState((prevState) => {
      if (prevState.currentSetNum < prevState.setLength - 1) {
        let nextSetNum = prevState.currentSetNum + 1;
        let atAssessmentEnd = false;
        if (nextSetNum === prevState.setLength - 1) {
          atAssessmentEnd = true;
        }
        console.log(
          "NextSetNum: " + nextSetNum + " AtAssessmentEnd: " + atAssessmentEnd
        );
        return {
          currentSetNum: nextSetNum,
          assessmentEnd: atAssessmentEnd,
          currentMostLike: prevState.userDiscResponses.discResponseArray[
            nextSetNum
          ].getMostLike(),
          currentLeastLike: prevState.userDiscResponses.discResponseArray[
            nextSetNum
          ].getLeastLike(),
        };
      }
    });
  }

  submit() {
    this.setState((prevState) => {
      this.setDiscScores();
      return { resultsSubmitted: true };
    });
  }

  setDiscScores() {
    const _this = this;
    let jsonBody = this.state.userDiscResponses.generateJsonResponse();
    let discEvaluationResults;
    console.log(jsonBody);
    fetch("https://test.cloverleaf.me/api/disc/evaluate", {
      method: "POST",
      withCredentials: true,
      credentials: "include",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUkVBQ1QgQ0hBTExFTkdFIiwiaWF0IjoxNTE2MjM5MDIyfQ.qUWrMWorgpR-_1TeVYhgZMHO_HITY0fLei73306S7rE",
        "Content-Type": "application/json",
      },
      body: jsonBody,
    })
      .then((response) => response.json())
      .then((testResults) => {
        console.log("Results: " + JSON.stringify(testResults));
        _this.setState({
          testResultD: testResults.scores.d.total,
          testResultI: testResults.scores.i.total,
          testResultS: testResults.scores.s.total,
          testResultC: testResults.scores.c.total,
        });
      });
    console.log("Test Result: " + this.state.testResultD);
  }

  buttonStateChange(wordNumber) {
    this.setState((prevState) => {
      // Check if "Least Like" Descriptor has already been selected for the current word set.
      let leastLikeNotSet = true;
      if (
        prevState.userDiscResponses.discResponseArray[prevState.currentSetNum]
          .getLeastLike()
          .trim() !== ""
      ) {
        leastLikeNotSet = false;
      }

      if (leastLikeNotSet) {
        // Check if "Most Like" Descriptor has already been selected for the current word set.
        let mostLikeNotSet = true;
        if (
          prevState.userDiscResponses.discResponseArray[prevState.currentSetNum]
            .getMostLike()
            .trim() !== ""
        ) {
          mostLikeNotSet = false;
        }

        if (mostLikeNotSet) {
          // Set current button word to most like.
          prevState.userDiscResponses.discResponseArray[
            prevState.currentSetNum
          ].setMostLike(data[prevState.currentSetNum][wordNumber]);
          console.log(
            "Most Like: " +
              prevState.userDiscResponses.discResponseArray[
                prevState.currentSetNum
              ].getMostLike()
          );
          return {
            userDiscResponses: prevState.userDiscResponses,
            currentMostLike: prevState.userDiscResponses.discResponseArray[
              prevState.currentSetNum
            ].getMostLike(),
          };
        } else {
          // Note: If "Most Like" is set...
          // If most like is current button word, then unset.
          if (
            data[prevState.currentSetNum][wordNumber] ===
            prevState.userDiscResponses.discResponseArray[
              prevState.currentSetNum
            ].getMostLike()
          ) {
            prevState.userDiscResponses.discResponseArray[
              prevState.currentSetNum
            ].unsetMostLike();
            console.log(
              "Most Like: " +
                prevState.userDiscResponses.discResponseArray[
                  prevState.currentSetNum
                ].getMostLike()
            );
            return {
              userDiscResponses: prevState.userDiscResponses,
              currentMostLike: prevState.userDiscResponses.discResponseArray[
                prevState.currentSetNum
              ].getMostLike(),
            };
          } else {
            // If most like is already set, and the current button word isn't set to anything, set it to least like.
            prevState.userDiscResponses.discResponseArray[
              prevState.currentSetNum
            ].setLeastLike(data[prevState.currentSetNum][wordNumber]);
            console.log(
              "Least Like: " +
                prevState.userDiscResponses.discResponseArray[
                  prevState.currentSetNum
                ].getLeastLike()
            );
            return {
              userDiscResponses: prevState.userDiscResponses,
              currentLeastLike: prevState.userDiscResponses.discResponseArray[
                prevState.currentSetNum
              ].getLeastLike(),
            };
          }
        }
      } else {
        // Note: If "Least Like" is set...
        // If least like is current button word, then unset.
        if (
          data[prevState.currentSetNum][wordNumber] ===
          prevState.userDiscResponses.discResponseArray[
            prevState.currentSetNum
          ].getLeastLike()
        ) {
          prevState.userDiscResponses.discResponseArray[
            prevState.currentSetNum
          ].unsetLeastLike();
          console.log(
            "Least Like: " +
              prevState.userDiscResponses.discResponseArray[
                prevState.currentSetNum
              ].getLeastLike()
          );
          return {
            userDiscResponses: prevState.userDiscResponses,
            currentLeastLike: prevState.userDiscResponses.discResponseArray[
              prevState.currentSetNum
            ].getLeastLike(),
          };
        } else {
          // If least like is already set, and the current button word isn't set to anything, there's nothing to do.
          return;
        }
      }
    });
  }

  render() {
    let submitButton;
    let discResults;

    if (this.state.assessmentEnd) {
      submitButton = (
        <button onClick={this.submit} className="btn btn-success btn-sm">
          SUBMIT
        </button>
      );
    }

    if (this.state.resultsSubmitted) {
      discResults = (
        <span>
          <div>Disc Results: </div>
          <div> Disc Total for D: {this.state.testResultD} </div>
          <div> Disc Total for I: {this.state.testResultI}</div>
          <div> Disc Total for S: {this.state.testResultS}</div>
          <div> Disc Total for C: {this.state.testResultC}</div>
        </span>
      );
    }

    return (
      <React.Fragment>
        <h1>DISC Assessment</h1>
        <span>
          <div>
            <button
              onClick={() => this.buttonStateChange(0)}
              className="btn btn-primary btn-lg"
            >
              {data[this.state.currentSetNum][0]}
            </button>
            <button
              onClick={() => this.buttonStateChange(1)}
              className="btn btn-primary btn-lg"
            >
              {data[this.state.currentSetNum][1]}
            </button>
            <button
              onClick={() => this.buttonStateChange(2)}
              className="btn btn-primary btn-lg"
            >
              {data[this.state.currentSetNum][2]}
            </button>
            <button
              onClick={() => this.buttonStateChange(3)}
              className="btn btn-primary btn-lg"
            >
              {data[this.state.currentSetNum][3]}
            </button>
          </div>
        </span>
        <div>
          <button
            onClick={this.prevStateChange}
            className="btn btn-outline-primary btn-sm"
          >
            Previous
          </button>
          <button
            onClick={this.nextStateChange}
            className="btn btn-outline-primary btn-sm"
          >
            Next
          </button>
        </div>

        <div>Most Like: {this.state.currentMostLike}</div>
        <div>Least Like: {this.state.currentLeastLike}</div>

        <span>{submitButton}</span>

        <span>{discResults}</span>
      </React.Fragment>
    );
  }
}

export default DiscAssessmentComponent;
