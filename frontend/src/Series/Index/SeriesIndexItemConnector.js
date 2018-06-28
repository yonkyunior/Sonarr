import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createSeriesSelector from 'Store/Selectors/createSeriesSelector';
import createCommandsSelector from 'Store/Selectors/createCommandsSelector';
import createQualityProfileSelector from 'Store/Selectors/createQualityProfileSelector';
import createLanguageProfileSelector from 'Store/Selectors/createLanguageProfileSelector';
import { executeCommand } from 'Store/Actions/commandActions';
import * as commandNames from 'Commands/commandNames';

function createMapStateToProps() {
  return createSelector(
    createSeriesSelector(),
    createQualityProfileSelector(),
    createLanguageProfileSelector(),
    createCommandsSelector(),
    (series, qualityProfile, languageProfile, commands) => {
      const isRefreshingSeries = _.some(commands, (command) => {
        return command.name === commandNames.REFRESH_SERIES &&
          command.body.seriesId === series.id;
      });

      const latestSeason = _.maxBy(series.seasons, (season) => season.seasonNumber);

      return {
        ...series,
        qualityProfile,
        languageProfile,
        latestSeason,
        isRefreshingSeries
      };
    }
  );
}

const mapDispatchToProps = {
  executeCommand
};

class SeriesIndexItemConnector extends Component {

  //
  // Listeners

  onRefreshSeriesPress = () => {
    this.props.executeCommand({
      name: commandNames.REFRESH_SERIES,
      seriesId: this.props.id
    });
  }

  //
  // Render

  render() {
    const {
      component: ItemComponent,
      ...otherProps
    } = this.props;

    return (
      <ItemComponent
        {...otherProps}
        onRefreshSeriesPress={this.onRefreshSeriesPress}
      />
    );
  }
}

SeriesIndexItemConnector.propTypes = {
  id: PropTypes.number.isRequired,
  component: PropTypes.func.isRequired,
  executeCommand: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(SeriesIndexItemConnector);
