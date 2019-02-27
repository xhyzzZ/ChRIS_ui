import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ApplicationState } from "../../../store/root/applicationState";
import { setSidebarActive } from "../../../store/ui/actions";
import { getFeedDetailsRequest, getPluginInstanceListRequest, setSelectedPluginNode } from "../../../store/feed/actions";
import { IFeedState } from "../../../store/feed/types";
import { IPluginItem } from "../../../api/models/pluginInstance.model";
import { RouteComponentProps } from "react-router-dom";
import FeedDetails from "./FeedDetails";
import FeedTree from "./FeedTree";
import NodeDetails from "./NodeDetails";
import PluginDetailPanel from "./PluginDetailPanel";
import {
  PageSection,
  PageSectionVariants,
  Grid,
  GridItem
} from "@patternfly/react-core";
import { pf4UtilityStyles } from "../../../lib/pf4-styleguides";
import "./feed.scss";
import { IUserState } from "../../../store/user/types";

interface IPropsFromDispatch {
  setSidebarActive: typeof setSidebarActive;
  getFeedDetailsRequest: typeof getFeedDetailsRequest;
  getPluginInstanceListRequest: typeof getPluginInstanceListRequest;
  setSelectedPluginNode: typeof setSelectedPluginNode;
}

type AllProps = IUserState &
  IFeedState &
  IPropsFromDispatch &
  RouteComponentProps<{ id: string }>;

class FeedView extends React.Component<AllProps> {
  constructor(props: AllProps) {
    super(props);
    const { setSidebarActive, match } = this.props;
    const feedId = match.params.id;
    !!feedId && this.fetchFeedData(feedId);
    document.title = "My Feeds - ChRIS UI Demo site";
    setSidebarActive({
      activeGroup: "feeds_grp",
      activeItem: "my_feeds"
    });
    this.onNodeClick = this.onNodeClick.bind(this);
  }

  // Description: this will get the feed details then retrieve the plugin_instances object
  fetchFeedData(feedId: string) {
    const { getFeedDetailsRequest } = this.props;
    getFeedDetailsRequest(feedId);
  }

  render() {
    const { items, details, selected } = this.props;

    // NOTE: working - will separate into components ***** working
    return (
      <React.Fragment>
        {/* Top section with Feed information */}
        {!!details && !!items && (
          <PageSection variant={PageSectionVariants.darker}>
            <FeedDetails details={details} items={items} />
          </PageSection>
        )}
        {/* END Top section with Feed information */}

        {/* Mid section with Feed and node actions */}
        <PageSection
          className={pf4UtilityStyles.spacingStyles.p_0}
          variant={PageSectionVariants.light} >
          <Grid className="feed-view">
            <GridItem className="feed-block pf-u-p-md" sm={12} md={6}>
              {!!items ? (
                <FeedTree items={items} onNodeClick={this.onNodeClick} />
              ) : (
                <div>Empty tree message</div>
              )}
            </GridItem>
            <GridItem className="node-block pf-u-p-md" sm={12} md={6}>
              {!!selected ? (
                <NodeDetails selected={selected} />
              ) : (
                <div>Please click on a node to work on a plugin</div>
              )}
            </GridItem>
          </Grid>
        </PageSection>
        {/* END Mid section with Feed and node actions */}

        {/* Bottom section with information */}
        <PageSection>
          <div className="plugin-info pf-u-py-md">
            {!!selected ? (
              <PluginDetailPanel selected={selected} />
            ) : (
              <h1>Select plugin</h1>
            )}
          </div>
        </PageSection>
        {/* END OF Bottom section with information */}
      </React.Fragment>
    );
  }

  // Description: handle node clicks to load next node information
  onNodeClick(node: any) {
    const { setSelectedPluginNode } = this.props;
    // Node was clicked
    // console.log("Trigger the load of information on the panels", node);
    setSelectedPluginNode(node);
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getFeedDetailsRequest: (id: string) => dispatch(getFeedDetailsRequest(id)),
  getPluginInstanceListRequest: (id: string) =>
    dispatch(getPluginInstanceListRequest(id)),
  setSelectedPluginNode: (node: IPluginItem) => dispatch(setSelectedPluginNode(node)),
  setSidebarActive: (active: { activeItem: string; activeGroup: string }) =>
    dispatch(setSidebarActive(active))
});

const mapStateToProps = ({ ui, feed, user }: ApplicationState) => ({
  sidebarActiveGroup: ui.sidebarActiveGroup,
  sidebarActiveItem: ui.sidebarActiveItem,
  token: user.token,
  items: feed.items,
  details: feed.details,
  selected: feed.selected
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedView);