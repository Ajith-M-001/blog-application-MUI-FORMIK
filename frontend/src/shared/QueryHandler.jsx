import PropTypes from "prop-types";

const QueryHandler = ({ children, isLoading }) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return <div>{children}</div>;
};

QueryHandler.propTypes = {
  children: PropTypes.node.isRequired,
  isLoading: PropTypes.bool,
};

export default QueryHandler;
