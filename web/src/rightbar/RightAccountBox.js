// Copyright 2020 The casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from "react";
import * as Setting from "../Setting";
import Avatar from "../Avatar";
import * as FavoritesBackend from "../backend/FavoritesBackend";
import * as NotificationBackend from "../backend/NotificationBackend";
import "../node.css"
import i18next from "i18next";
import {goToLink} from "../Setting";

class RightAccountBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      topicFavoriteNum: 0,
      nodeFavoriteNum: 0,
      followingNum: 0,
      unreadNotificationNum: 0
    };
  }

  componentDidMount() {
    this.getFavoriteNum();
    this.getUnreadNotificationNum();
  }

  getUnreadNotificationNum() {
    NotificationBackend.getUnreadNotificationNum()
      .then((res) => {
        this.setState({
          unreadNotificationNum: res?.data
        });
      })
  }

  getFavoriteNum() {
    FavoritesBackend.getAccountFavoriteNum()
      .then((res) => {
        if (res.status === 'ok') {
          this.setState({
            topicFavoriteNum: res?.data[1],
            followingNum: res?.data[2],
            nodeFavoriteNum: res?.data[3],
          });
        }else {
          Setting.showMessage("error", res.msg)
        }
      });
  }

  render() {
    const username = this.props.account?.id;
    const avatar = this.props.account?.avatar;
    const tagline = this.props.account?.tagline;

    return (
      <div className={`box ${this.props.nodeId}`}>
        <div className={`cell ${this.props.nodeId}`}>
          <table cellPadding="0" cellSpacing="0" border="0" width="100%">
            <tbody>
            <tr>
              <td width="48" valign="top">
                <a href={`/member/${username}`}>
                  <Avatar username={username} avatar={avatar} />
                </a>
              </td>
              <td width="10" valign="top" />
              <td width="auto" align="left">
                <div className="fr">
                  <a href="/settings/night/toggle?once=93095" className="light-toggle">
                    <img src={Setting.getStatic("/static/img/toggle-light.png")} align="absmiddle" height="10" alt="Light" />
                  </a>
                </div>
                <span className="bigger">
                  <a href={`/member/${username}`} className={`${this.props.nodeId}`}>
                    {username}
                  </a>
                </span>
                <div className="sep5"></div>
                <span className="fade">{tagline}</span>
              </td>
            </tr>
            </tbody>
          </table>
          <div className="sep10" />
          <table cellPadding="0" cellSpacing="0" border="0" width="100%">
            <tbody>
            <tr>
              <td width="33%" align="center">
                <a href="/my/nodes" className="dark" style={{display: "block"}}>
                  <span className="bigger">
                    {this.state.nodeFavoriteNum}
                  </span>
                  <div className="sep3" />
                  <span className="fade">
                    {i18next.t("bar:Nodes")}
                  </span>
                </a>
              </td>
              <td width="34%"
                  style={{borderLeft: "1px solid rgba(100, 100, 100, 0.4)", borderRight: "1px solid rgba(100, 100, 100, 0.4)"}}
                  align="center">
                <a href="/my/topics" className="dark" style={{display: "block"}}>
                  <span className="bigger">
                    {this.state.topicFavoriteNum}
                  </span>
                <div className="sep3" />
                <span className="fade">
                  {i18next.t("bar:Topics")}
                </span>
                </a>
              </td>
              <td width="33%" align="center">
                <a href="/my/following" className="dark" style={{display: "block"}}>
                  <span className="bigger">
                    {this.state.followingNum}
                  </span>
                  <div className="sep3" />
                  <span className="fade">
                    {i18next.t("bar:Watch")}
                  </span>
                </a>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div className={`cell ${this.props.nodeId}`} id="member-activity">
          <div className="member-activity-bar">
            <div className="member-activity-start" style={{width: "80px"}} />
          </div>
        </div>
        <div className={`cell ${this.props.nodeId}`} style={{padding: "8px", lineHeight: "100%"}}>
          <table cellPadding="0" cellSpacing="0" border="0" width="100%">
            <tbody>
            <tr>
              <td width="28"><a href="/i"><img src={Setting.getStatic("/static/img/essentials/images.png")} width="28" border="0" style={{verticalAlign: "bottom"}}/></a></td>
              <td width="10"></td>
              <td width="auto" valign="middle" align="left"><a href="/i">{i18next.t("bar:File library")}</a></td>
            </tr>
            </tbody>
          </table>
        </div>
        <div className={`cell ${this.props.nodeId}`} style={{padding: "8px", lineHeight: "100%"}}>
          <table cellPadding="0" cellSpacing="0" border="0" width="100%">
            <tbody>
            <tr>
              <td width="28">
                <a href="/new">
                  <img src={Setting.getStatic("/static/img/essentials/compose.png")} width="28" border="0" style={{verticalAlign: "bottom"}} />
                </a>
              </td>
              <td width="10" />
              <td width="auto" valign="middle" align="left">
                <a href="/new" className={`${this.props.nodeId}`}>
                  {i18next.t("bar:Compose")}
                </a>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div className="inner">
          <div className="fr" id="money" style={{margin: "-3px 0px 0px 0px"}}>
            <a href="/balance" className="balance_area">
              {
                this.props.account?.goldCount !== 0 ?
                  <span>
                        {" "}{this.props.account?.goldCount}{" "}
                    <img src={Setting.getStatic("/static/img/gold@2x.png")} height="16" alt="G" border="0"/>
                      </span>
                  : null
              }
              {" "}{this.props.account?.silverCount}{" "}
              <img src={Setting.getStatic("/static/img/silver@2x.png")} height="16" alt="S" border="0" />
              {" "}{this.props.account?.bronzeCount}{" "}
              <img src={Setting.getStatic("/static/img/bronze@2x.png")} height="16" alt="B" border="0" />
            </a>
          </div>
          {
            this.state.unreadNotificationNum !== 0 ?
              <span>
                <img src={Setting.getStatic("/static/img/dot_orange.png")} align="absmiddle" />{" "}
              </span> : null
          }
          {
            this.state.unreadNotificationNum === 0 ?
              <a href="/notifications" className={`fade ${this.props.nodeId}`}>
                0{" "}{i18next.t("bar:unread")}
              </a> :
              <strong>
                <a href="/notifications" className={`fade ${this.props.nodeId}`}>
                  {this.state.unreadNotificationNum}{" "}{i18next.t("bar:unread")}
                </a>
              </strong>
          }
        </div>
      </div>
    );
  }

}

export default RightAccountBox;
