import _ from 'underscore';
import React from 'react';
import {withOnyx} from 'react-native-onyx';
import {withCurrentUserPersonalDetailsPropTypes, withCurrentUserPersonalDetailsDefaultProps} from '../components/withCurrentUserPersonalDetails';
import ScreenWrapper from '../components/ScreenWrapper';
import HeaderWithCloseButton from '../components/HeaderWithCloseButton';
import withLocalize, {withLocalizePropTypes} from '../components/withLocalize';
import ROUTES from '../ROUTES';
import Text from '../components/Text';
import styles from '../styles/styles';
import Navigation from '../libs/Navigation/Navigation';
import compose from '../libs/compose';
import OptionsSelector from '../components/OptionsSelector';
import themeColors from '../styles/themes/default';
import * as Expensicons from '../components/Icon/Expensicons';
import ONYXKEYS from '../ONYXKEYS';

const greenCheckmark = {src: Expensicons.Checkmark, color: themeColors.success};

const propTypes = {
    ...withLocalizePropTypes,
    ...withCurrentUserPersonalDetailsPropTypes,
};

const defaultProps = {
    ...withCurrentUserPersonalDetailsDefaultProps,
};

class YearPickerPage extends React.Component {
    constructor(props) {
        super(props);

        const {params} = props.route;
        const {min, max, year} = params;
        const minYear = Number(min);
        const maxYear = Number(max);
        const currentYear = Number(year);

        this.yearList = _.map(Array.from({length: (maxYear - minYear) + 1}, (k, v) => v + minYear), (value, index) => ({
            text: value.toString(),
            value,
            keyForList: index.toString(),

            // Include the green checkmark icon to indicate the currently selected value
            customIcon: value === currentYear ? greenCheckmark : undefined,

            // This property will make the currently selected value have bold text
            boldStyle: value === currentYear,
        }));

        this.updateYearOfBirth = this.updateYearOfBirth.bind(this);
        this.filterYearList = this.filterYearList.bind(this);

        this.state = {
            inputText: '',
            yearOptions: this.yearList,
        };
    }

    /**
     * Function called on selection of the year, to take user back to the previous screen
     *
     * @param {String} selectedYear
     */
    updateYearOfBirth(selectedYear) {
        const {params} = this.props.route;
        const {backTo} = params;
        Navigation.navigate(`${backTo}?year=${selectedYear}`);
    }

    /**
     * Function filtering the list of the items when using search input
     * @param {String} text
     */
    filterYearList(text) {
        this.setState({
            inputText: text,
            yearOptions: _.filter(this.yearList, (year => year.text.includes(text.trim()))),
        });
    }

    render() {
        const {params} = this.props.route;
        const {backTo} = params;

        return (
            <ScreenWrapper includeSafeAreaPaddingBottom={false}>
                <HeaderWithCloseButton
                    title={this.props.translate('yearPickerPage.year')}
                    shouldShowBackButton
                    onBackButtonPress={() => Navigation.navigate(backTo || ROUTES.HOME)}
                    onCloseButtonPress={() => Navigation.dismissModal(true)}
                />
                <Text style={[styles.ph5, styles.mb6]}>
                    {this.props.translate('yearPickerPage.selectYear')}
                </Text>
                <OptionsSelector
                    textInputLabel={this.props.translate('common.search')}
                    onChangeText={this.filterYearList}
                    value={this.state.inputText}
                    sections={[{data: this.state.yearOptions}]}
                    onSelectRow={option => this.updateYearOfBirth(option.value)}
                    hideSectionHeaders
                    optionHoveredStyle={styles.hoveredComponentBG}
                    shouldHaveOptionSeparator
                    contentContainerStyles={[styles.ph5]}
                />
            </ScreenWrapper>
        );
    }
}

YearPickerPage.propTypes = propTypes;
YearPickerPage.defaultProps = defaultProps;

export default compose(
    withLocalize,
    withOnyx({
        privatePersonalDetails: {
            key: `${ONYXKEYS.FORMS.DATE_OF_BIRTH_FORM}Draft`,
        },
    }),
)(YearPickerPage);
