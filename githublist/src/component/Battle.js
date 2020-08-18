import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import "../css/Battle.css";
import BattleEnd from "../component/BattleEnd.js";
import { Router, Route } from "react-router-dom";

//初始页面
class BattleBegin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOne: false,
      isTwo: false,
      loadingOne: false,
      loadingTwo: false,
      notFoundPlayerOne: false,
      notFoundPlayerTwo: false,
    };
  }
  //查找Player One
  getPlayerOne = async () => {
    //得到Player One输入框的值
    const inputOne = this.refs.inputOne.value;
    //判断是否为空
    if (inputOne.match(/^[ ]*$/)) {
      alert("请确认Player One是否已输入");
      this.refs.inputOne.value = "";
      return;
    }
    //得到Player One的url
    const urlOne = `https://api.github.com/search/repositories?q=${inputOne} in:name&sort=stars&order=desc&type=Repositories&per_page=1`;
    //开始查找
    this.setState({ loadingOne: true });
    try {
      const res = await axios.get(urlOne);
      //判断返回值是否为空
      if (res.data.items.length == 0) {
        this.setState({
          notFoundPlayerOne: true,
        });
        this.refs.inputOne.value = "";
        return;
      }
      //返回值不为空，调用Battle里的setPlayerOne函数存值
      this.props.setPlayerOne(res.data.items[0]);
      //标识已找到
      this.setState({ isOne: true, notFoundPlayerOne: false });
    } catch (e) {}
    this.setState({ loadingOne: false });
  };
  //重新查找Player One
  findOneAgain = () => {
    this.props.setPlayerOne({});
    this.setState({ isOne: false });
  };
  //查找Player Two
  getPlayerTwo = async () => {
    const inputTwo = this.refs.inputTwo.value;
    if (inputTwo.match(/^[ ]*$/)) {
      alert("请确认Player Two是否已输入");
      this.refs.inputTwo.value = "";
      return;
    }
    const urlTwo = `https://api.github.com/search/repositories?q=${inputTwo} in:name&sort=stars&order=desc&type=Repositories&per_page=1`;
    this.setState({ loadingTwo: true });
    try {
      const res = await axios.get(urlTwo);
      if (res.data.items.length == 0) {
        this.setState({
          notFoundPlayerTwo: true,
        });
        this.refs.inputTwo.value = "";
        return;
      }
      this.props.setPlayerTwo(res.data.items[0]);
      this.setState({ isTwo: true, notFoundPlayerTwo: false });
    } catch (e) {}
    this.setState({ loadingTwo: false });
  };
  findTwoAgain = () => {
    this.props.setPlayerTwo({});
    this.setState({ isTwo: false });
  };
  //输入框里的值为空时Submit不可点击
  oneInputChange = () => {
    const inputOne = this.refs.inputOne.value;
    if (inputOne.match(/^[ ]*$/)) {
      this.refs.submitOne.className = "submit_btn disabled_btn";
      return;
    }
    this.refs.submitOne.className = "submit_btn";
  };
  twoInputChange = () => {
    const inputTwo = this.refs.inputTwo.value;
    if (inputTwo.match(/^[ ]*$/)) {
      this.refs.submitTwo.className = "submit_btn disabled_btn";
      return;
    }
    this.refs.submitTwo.className = "submit_btn";
  };
  //当焦点在Player One的输入框并按下enter键时
  oneEnter = (e) => {
    if (e.key == "Enter") {
      this.getPlayerOne();
    }
  };
  //当焦点在Player Two
  twoEnter = (e) => {
    if (e.key == "Enter") {
      this.getPlayerTwo();
    }
  };
  render() {
    const faIconStyle = {
      iFont: {
        fontSize: 200,
      },
      iFontDel: {
        fontSize: 20,
      },
      getImg: {
        width: "50px",
        height: "50px",
        margin: "5px",
      },
    };
    const divCenterStyle = {
      textAlign: "center",
      marginBottom: "20px",
    };
    const { battleBegin, playerOne, playerTwo } = this.props;
    const {
      isOne,
      isTwo,
      loadingOne,
      loadingTwo,
      notFoundPlayerOne,
      notFoundPlayerTwo,
    } = this.state;
    let renderInfoOne;
    let renderInfoTwo;
    if (notFoundPlayerOne) {
      renderInfoOne = (
        <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
          未找到该用户
        </p>
      );
    } else {
      renderInfoOne = <p></p>;
    }
    if (notFoundPlayerTwo) {
      renderInfoTwo = (
        <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
          未找到该用户
        </p>
      );
    } else {
      renderInfoTwo = <p></p>;
    }
    return (
      <div className="container">
        <div style={divCenterStyle}>
          <h1>Instructions</h1>
        </div>
        <div className="flex flex-wrap flex-space-around">
          <div style={divCenterStyle}>
            <div className="instruction_content" style={divCenterStyle}>
              Enter two Github users
            </div>
            <i
              className="fa fa-users "
              style={{ ...faIconStyle.iFont, color: "rgb(241, 149, 43)" }}
            ></i>
          </div>
          <div style={divCenterStyle}>
            <div className="instruction_content" style={divCenterStyle}>
              Battle
            </div>
            <i
              className="fa fa-fighter-jet"
              style={{ ...faIconStyle.iFont, color: "rgb(134, 129, 129)" }}
            ></i>
          </div>
          <div style={divCenterStyle}>
            <div className="instruction_content" style={divCenterStyle}>
              See the winner
            </div>
            <i
              className="fa fa-trophy"
              style={{ ...faIconStyle.iFont, color: "rgb(255, 223, 54)" }}
            ></i>
          </div>
        </div>
        <div style={divCenterStyle}>
          <h1 style={{ marginTop: "40px" }}>Players</h1>
        </div>
        <div className="flex flex-wrap flex-space-around">
          <div className="players_content">
            <div style={{ margin: "20px 0" }}>Player One</div>
            {loadingOne ? (
              <div>
                正在查找
                <i className="fa fa-spinner fa-spin"></i>
              </div>
            ) : isOne ? (
              <div className="showPlayer">
                <img
                  src={playerOne.owner.avatar_url}
                  alt={playerOne.name}
                  style={faIconStyle.getImg}
                />
                {playerOne.name}
                <button onClick={this.findOneAgain} className="delete_btn">
                  <i
                    className="fa fa-times-circle"
                    style={{
                      ...faIconStyle.iFontDel,
                      color: "rgb(194, 57, 42)",
                    }}
                  ></i>
                </button>
              </div>
            ) : (
              <div>
                <input
                  ref="inputOne"
                  placeholder="github username"
                  className="player_input"
                  onChange={this.oneInputChange}
                  onKeyDown={this.oneEnter}
                ></input>
                <button
                  onClick={this.getPlayerOne}
                  className="submit_btn disabled_btn"
                  ref="submitOne"
                >
                  S U B M I T
                </button>
                <div>{renderInfoOne}</div>
              </div>
            )}
          </div>

          <div className="players_content">
            <div style={{ margin: "20px 0" }}>Player Two</div>
            {loadingTwo ? (
              <div>
                正在查找
                <i className="fa fa-spinner fa-spin"></i>
              </div>
            ) : isTwo ? (
              <div className="showPlayer">
                <img
                  src={playerTwo.owner.avatar_url}
                  alt={playerTwo.name}
                  style={faIconStyle.getImg}
                />
                {playerTwo.name}
                <button onClick={this.findTwoAgain} className="delete_btn">
                  <i
                    className="fa fa-times-circle"
                    style={{
                      ...faIconStyle.iFontDel,
                      color: "rgb(194, 57, 42)",
                    }}
                  ></i>
                </button>
              </div>
            ) : (
              <div>
                <input
                  ref="inputTwo"
                  placeholder="github username"
                  className="player_input"
                  onChange={this.twoInputChange}
                  onKeyDown={this.twoEnter}
                ></input>
                <button
                  onClick={this.getPlayerTwo}
                  className="submit_btn disabled_btn"
                  ref="submitTwo"
                >
                  S U B M I T
                </button>
                <div>{renderInfoTwo}</div>
              </div>
            )}
          </div>
        </div>
        {isOne && isTwo && (
          <div style={divCenterStyle}>
            <button onClick={battleBegin} className="battle_btn">
              Battle
            </button>
          </div>
        )}
      </div>
    );
  }
}
//Battle
class Battle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerOne: {}, //存储第一个数据
      playerTwo: {}, //存储第二个数据
      battle: false, //判断是否已经比较，如果未比较，展示battleBegin面板，如果已经比较，展示battleEnd面板
      winner: "", //胜利者
    };
  }
  //通过参数设置存储第一个数据
  setPlayerOne = (oneData) => {
    this.setState({
      playerOne: oneData,
    });
  };
  setPlayerTwo = (twoData) => {
    this.setState({
      playerTwo: twoData,
    });
  };
  //开始比较两个项目
  battleBegin = () => {
    //从state中取出获取到的两个项目
    const { playerOne, playerTwo } = this.state;
    let winner = "";
    if (playerOne.stargazers_count > playerTwo.stargazers_count) {
      winner = playerOne.name;
      this.setState({
        battle: true,
        winner,
      });
    } else if (playerOne.stargazers_count == playerTwo.stargazers_count) {
      this.setState({
        battle: true,
        winner,
      });
    } else {
      winner = playerTwo.name;
      this.setState({
        battle: true,
        winner,
      });
    }
    localStorage.setItem("playerOne", JSON.stringify(playerOne));
    localStorage.setItem("playerTwo", JSON.stringify(playerTwo));
    localStorage.setItem("winner", winner);
    // this.props.history.push({
    //   pathname: "/BattleEnd",
    //   query: {
    //     playerOne: { playerOne },
    //     playerTwo: { playerTwo },
    //     winner: { winner },
    //   },
    // });
    this.props.history.push({ pathname: "/BattleEnd" });
  };
  render() {
    const { playerOne, playerTwo } = this.state;
    return (
      <div>
        <BattleBegin
          setPlayerOne={this.setPlayerOne}
          setPlayerTwo={this.setPlayerTwo}
          battleBegin={this.battleBegin}
          playerOne={playerOne}
          playerTwo={playerTwo}
        ></BattleBegin>
      </div>
    );
  }
}
export default Battle;
