import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { createSelector } from 'reselect';
import connectSection from 'Store/connectSection';
import createClientSideCollectionSelector from 'Store/Selectors/createClientSideCollectionSelector';
import createCommandSelector from 'Store/Selectors/createCommandSelector';
import { setSeriesEditorSort, setSeriesEditorFilter, saveSeriesEditor } from 'Store/Actions/seriesEditorActions';
import { fetchRootFolders } from 'Store/Actions/rootFolderActions';
import { executeCommand } from 'Store/Actions/commandActions';
import * as commandNames from 'Commands/commandNames';
import SeriesEditor from './SeriesEditor';

function createMapStateToProps() {
  return createSelector(
    (state) => state.settings.languageProfiles,
    createClientSideCollectionSelector(),
    createCommandSelector(commandNames.RENAME_SERIES),
    (languageProfiles, series, isOrganizingSeries) => {
      return {
        isOrganizingSeries,
        showLanguageProfile: languageProfiles.items.length > 1,
        ...series
      };
    }
  );
}

const mapDispatchToProps = {
  dispatchSetSeriesEditorSort: setSeriesEditorSort,
  dispatchSetSeriesEditorFilter: setSeriesEditorFilter,
  dispatchSaveSeriesEditor: saveSeriesEditor,
  dispatchFetchRootFolders: fetchRootFolders,
  dispatchExecuteCommand: executeCommand
};

class SeriesEditorConnector extends Component {

  //
  // Lifecycle

  componentDidMount() {
    this.props.dispatchFetchRootFolders();
  }

  //
  // Listeners

  onSortPress = (sortKey) => {
    this.props.dispatchSetSeriesEditorSort({ sortKey });
  }

  onFilterSelect = (selectedFilterKey) => {
    this.props.dispatchSetSeriesEditorFilter({ selectedFilterKey });
  }

  onSaveSelected = (payload) => {
    this.props.dispatchSaveSeriesEditor(payload);
  }

  onMoveSelected = (payload) => {
    this.props.dispatchExecuteCommand({
      name: commandNames.MOVE_SERIES,
      ...payload
    });
  }

  //
  // Render

  render() {
    return (
      <SeriesEditor
        {...this.props}
        onSortPress={this.onSortPress}
        onFilterSelect={this.onFilterSelect}
        onSaveSelected={this.onSaveSelected}
      />
    );
  }
}

SeriesEditorConnector.propTypes = {
  dispatchSetSeriesEditorSort: PropTypes.func.isRequired,
  dispatchSetSeriesEditorFilter: PropTypes.func.isRequired,
  dispatchSaveSeriesEditor: PropTypes.func.isRequired,
  dispatchFetchRootFolders: PropTypes.func.isRequired,
  dispatchExecuteCommand: PropTypes.func.isRequired
};

export default connectSection(
  createMapStateToProps,
  mapDispatchToProps,
  undefined,
  undefined,
  { section: 'series', uiSection: 'seriesEditor' }
)(SeriesEditorConnector);
