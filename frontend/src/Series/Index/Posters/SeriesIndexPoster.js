import PropTypes from 'prop-types';
import React, { Component } from 'react';
import getRelativeDate from 'Utilities/Date/getRelativeDate';
import { icons } from 'Helpers/Props';
import IconButton from 'Components/Link/IconButton';
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';
import Label from 'Components/Label';
import Link from 'Components/Link/Link';
import SeriesPoster from 'Series/SeriesPoster';
import EditSeriesModalConnector from 'Series/Edit/EditSeriesModalConnector';
import DeleteSeriesModal from 'Series/Delete/DeleteSeriesModal';
import SeriesIndexProgressBar from 'Series/Index/ProgressBar/SeriesIndexProgressBar';
import SeriesIndexPosterInfo from './SeriesIndexPosterInfo';
import styles from './SeriesIndexPoster.css';

class SeriesIndexPoster extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isEditSeriesModalOpen: false,
      isDeleteSeriesModalOpen: false
    };
  }

  //
  // Listeners

  onEditSeriesPress = () => {
    this.setState({ isEditSeriesModalOpen: true });
  }

  onEditSeriesModalClose = () => {
    this.setState({ isEditSeriesModalOpen: false });
  }

  onDeleteSeriesPress = () => {
    this.setState({
      isEditSeriesModalOpen: false,
      isDeleteSeriesModalOpen: true
    });
  }

  onDeleteSeriesModalClose = () => {
    this.setState({ isDeleteSeriesModalOpen: false });
  }

  //
  // Render

  render() {
    const {
      style,
      id,
      title,
      monitored,
      status,
      titleSlug,
      nextAiring,
      statistics,
      images,
      posterWidth,
      posterHeight,
      detailedProgressBar,
      showTitle,
      showMonitored,
      showQualityProfile,
      qualityProfile,
      showRelativeDates,
      shortDateFormat,
      timeFormat,
      isRefreshingSeries,
      onRefreshSeriesPress,
      ...otherProps
    } = this.props;

    const {
      seasonCount,
      episodeCount,
      episodeFileCount,
      totalEpisodeCount
    } = statistics;

    const {
      isEditSeriesModalOpen,
      isDeleteSeriesModalOpen
    } = this.state;

    const link = `/series/${titleSlug}`;

    const elementStyle = {
      width: `${posterWidth}px`,
      height: `${posterHeight}px`
    };

    return (
      <div className={styles.container} style={style}>
        <div className={styles.content}>
          <div className={styles.posterContainer}>
            <Label className={styles.controls}>
              <SpinnerIconButton
                className={styles.action}
                name={icons.REFRESH}
                title="Refresh series"
                isSpinning={isRefreshingSeries}
                onPress={onRefreshSeriesPress}
              />

              <IconButton
                className={styles.action}
                name={icons.EDIT}
                title="Edit Series"
                onPress={this.onEditSeriesPress}
              />
            </Label>

            {
              status === 'ended' &&
                <div
                  className={styles.ended}
                  title="Ended"
                />
            }

            <Link
              className={styles.link}
              style={elementStyle}
              to={link}
            >
              <SeriesPoster
                className={styles.poster}
                style={elementStyle}
                images={images}
                size={250}
                lazy={false}
                overflow={true}
              />
            </Link>
          </div>

          <SeriesIndexProgressBar
            monitored={monitored}
            status={status}
            episodeCount={episodeCount}
            episodeFileCount={episodeFileCount}
            totalEpisodeCount={totalEpisodeCount}
            posterWidth={posterWidth}
            detailedProgressBar={detailedProgressBar}
          />

          {
            showTitle &&
              <div className={styles.title}>
                {title}
              </div>
          }

          {
            showMonitored &&
              <div className={styles.title}>
                {monitored ? 'Monitored' : 'Unmonitored'}
              </div>
          }

          {
            showQualityProfile &&
              <div className={styles.title}>
                {qualityProfile.name}
              </div>
          }

          {
            nextAiring &&
              <div className={styles.nextAiring}>
                {
                  getRelativeDate(
                    nextAiring,
                    shortDateFormat,
                    showRelativeDates,
                    {
                      timeFormat,
                      timeForToday: true
                    }
                  )
                }
              </div>
          }

          <SeriesIndexPosterInfo
            seasonCount={seasonCount}
            qualityProfile={qualityProfile}
            showQualityProfile={showQualityProfile}
            showRelativeDates={showRelativeDates}
            shortDateFormat={shortDateFormat}
            timeFormat={timeFormat}
            {...otherProps}
          />

          <EditSeriesModalConnector
            isOpen={isEditSeriesModalOpen}
            seriesId={id}
            onModalClose={this.onEditSeriesModalClose}
            onDeleteSeriesPress={this.onDeleteSeriesPress}
          />

          <DeleteSeriesModal
            isOpen={isDeleteSeriesModalOpen}
            seriesId={id}
            onModalClose={this.onDeleteSeriesModalClose}
          />
        </div>
      </div>
    );
  }
}

SeriesIndexPoster.propTypes = {
  style: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  monitored: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
  titleSlug: PropTypes.string.isRequired,
  nextAiring: PropTypes.string,
  statistics: PropTypes.object.isRequired,
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  posterWidth: PropTypes.number.isRequired,
  posterHeight: PropTypes.number.isRequired,
  detailedProgressBar: PropTypes.bool.isRequired,
  showTitle: PropTypes.bool.isRequired,
  showMonitored: PropTypes.bool.isRequired,
  showQualityProfile: PropTypes.bool.isRequired,
  qualityProfile: PropTypes.object.isRequired,
  showRelativeDates: PropTypes.bool.isRequired,
  shortDateFormat: PropTypes.string.isRequired,
  timeFormat: PropTypes.string.isRequired,
  isRefreshingSeries: PropTypes.bool.isRequired,
  onRefreshSeriesPress: PropTypes.func.isRequired
};

SeriesIndexPoster.defaultProps = {
  episodeCount: 0,
  episodeFileCount: 0
};

export default SeriesIndexPoster;
