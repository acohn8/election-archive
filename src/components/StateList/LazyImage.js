import React from 'react';
import { Image, Loader, Visibility } from 'semantic-ui-react';

export default class LazyImage extends React.Component {
  state = {
    show: false,
  };

  showImage = () => {
    this.setState({
      show: true,
    });
  };

  render() {
    const { size } = this.props;
    if (!this.state.show) {
      return (
        <Visibility as="span" fireOnMount onTopVisible={this.showImage}>
          <Loader active inline="centered" size={size} />
        </Visibility>
      );
    }
    return <Image {...this.props} />;
  }
}
