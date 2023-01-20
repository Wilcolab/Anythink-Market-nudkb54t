import { Profile, mapStateToProps } from "./Profile";
import React from "react";
import { Link } from "react-router-dom";
import agent from "../agent";
import { connect } from "react-redux";
import {
  FOLLOW_USER,
  UNFOLLOW_USER,
  PROFILE_PAGE_LOADED,
  PROFILE_PAGE_UNLOADED,
} from "../constants/actionTypes";

const mapDispatchToProps = (dispatch) => ({
  onFollow: (username) =>
  dispatch({
    type: FOLLOW_USER,
    payload: agent.Profile.follow(username),
  }),
  onLoad: (pager, payload) =>
    dispatch({ type: PROFILE_PAGE_LOADED, pager, payload }),
    onUnfollow: (username) =>
    dispatch({
      type: UNFOLLOW_USER,
      payload: agent.Profile.unfollow(username),
    }),
  onUnload: () => dispatch({ type: PROFILE_PAGE_UNLOADED }),
});

class ProfileFavorites extends Profile {
  componentWillMount() {
    this.props.onLoad(
      (page) => agent.Items.favoritedBy(this.props.match.params.username, page),
      Promise.all([
        agent.Profile.get(this.props.match.params.username),
        agent.Items.favoritedBy(this.props.match.params.username),
      ])
    );
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  renderTabs() {
    return (
      <ul className="nav nav-tabs outline-active">
        <li className="nav-item">
          <Link className="nav-link" to={`/@${this.props.profile.username}`}>
            My Items
          </Link>
        </li>

        <li className="nav-item">
          <Link
            className="nav-link active"
            to={`/@${this.props.profile.username}/favorites`}
          >
            Favorited Items
          </Link>
        </li>
      </ul>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileFavorites);
