import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import DropdownList from "./component";
import { stateType } from "../../../store";

const mapStateToProps = (state: stateType) => {
  return {
    currentEpub: state.book.currentEpub,
    renderFunc: state.book.renderFunc,
  };
};
const actionCreator = {};
export default connect(
  mapStateToProps,
  actionCreator
)(withTranslation()(DropdownList as any));
